import warnings

warnings.filterwarnings("ignore")

import json
import os
import random
import os.path as osp

import numpy as np
from PIL import Image
from tqdm import tqdm
from scene.utils import Camera
from typing import NamedTuple
from torch.utils.data import Dataset
from utils.general_utils import PILtoTorch
from utils.graphics_utils import getWorld2View2, focal2fov, fov2focal
import glob
from torchvision import transforms as T
import open3d as o3d
from tqdm import trange
import imageio.v2 as iio
# import onnxruntime as ort
from scene.pre_train_pc import get_pointcloud, get_pc_only
import cv2
import copy
import torch
import torch.nn.functional as F



class CameraInfo(NamedTuple):
    uid: int
    R: np.array
    T: np.array
    FovY: np.array
    FovX: np.array
    image: np.array
    depth: np.array
    image_path: str
    image_name: str
    width: int
    height: int
    time : float
    mask: np.array
    Zfar: float
    Znear: float
    pc: np.array

def normalize(v):
    """Normalize a vector."""
    return v / np.linalg.norm(v)

def normalize_img(img, mean, std):
    img = (img - mean) / std
    return img

def average_poses(poses):
    """
    Calculate the average pose, which is then used to center all poses
    using @center_poses. Its computation is as follows:
    1. Compute the center: the average of pose centers.
    2. Compute the z axis: the normalized average z axis.
    3. Compute axis y': the average y axis.
    4. Compute x' = y' cross product z, then normalize it as the x axis.
    5. Compute the y axis: z cross product x.

    Note that at step 3, we cannot directly use y' as y axis since it's
    not necessarily orthogonal to z axis. We need to pass from x to y.
    Inputs:
        poses: (N_images, 3, 4)
    Outputs:
        pose_avg: (3, 4) the average pose
    """
    # 1. Compute the center
    center = poses[..., 3].mean(0)  # (3)
    # 2. Compute the z axis
    z = normalize(poses[..., 2].mean(0))  # (3)
    # 3. Compute axis y' (no need to normalize as it's not the final output)
    y_ = poses[..., 1].mean(0)  # (3)
    # 4. Compute the x axis
    x = normalize(np.cross(z, y_))  # (3)
    # 5. Compute the y axis (as z and x are normalized, y is already of norm 1)
    y = np.cross(x, z)  # (3)
    pose_avg = np.stack([x, y, z, center], 1)  # (3, 4)
    return pose_avg

def center_poses(poses, blender2opencv=None):
    """
    Center the poses so that we can use NDC.
    See https://github.com/bmild/nerf/issues/34
    Inputs:
        poses: (N_images, 3, 4)
    Outputs:
        poses_centered: (N_images, 3, 4) the centered poses
        pose_avg: (3, 4) the average pose
    """
    if blender2opencv is not None:
        poses = poses @ blender2opencv
    pose_avg = average_poses(poses)  # (3, 4)
    pose_avg_homo = np.eye(4)
    pose_avg_homo[:3] = pose_avg  # convert to homogeneous coordinate for faster computation
    pose_avg_homo = pose_avg_homo
    # by simply adding 0, 0, 0, 1 as the last row
    last_row = np.tile(np.array([0, 0, 0, 1]), (len(poses), 1, 1))  # (N_images, 1, 4)
    poses_homo = np.concatenate([poses, last_row], 1)  # (N_images, 4, 4) homogeneous coordinate
    poses_centered = np.linalg.inv(pose_avg_homo) @ poses_homo  # (N_images, 4, 4)
    poses_centered = poses_centered[:, :3]  # (N_images, 3, 4)

    return poses_centered, pose_avg_homo

def recenter_poses(poses):

    poses_ = poses+0
    bottom = np.reshape([0,0,0,1.], [1,4])
    c2w = np.mean(poses, axis=0)
    c2w = np.concatenate([c2w[:3,:4], bottom], -2)
    bottom = np.tile(np.reshape(bottom, [1,1,4]), [poses.shape[0],1,1])
    poses = np.concatenate([poses[:,:3,:4], bottom], -2)

    poses = np.linalg.inv(c2w) @ poses
    poses_[:,:3,:4] = poses[:,:3,:4]
    poses = poses_
    return poses

def farthest_point_sample(xyz, npoint): 

    """
    Input:
        xyz: pointcloud data, [B, N, 3]
        npoint: number of samples
    Return:
        centroids: sampled pointcloud index, [B, npoint]
    """
    B, N, C = xyz.shape
    centroids = np.zeros((B, npoint))
    distance = np.ones((B, N)) * 1e10
    batch_indices = np.arange(B)
    barycenter = np.sum((xyz), 1)
    barycenter = barycenter/xyz.shape[1]
    barycenter = barycenter.reshape(B, 1, C)
    dist = np.sum((xyz - barycenter) ** 2, -1)
    farthest = np.argmax(dist,1)
    
    for i in range(npoint):
        centroids[:, i] = farthest
        centroid = xyz[batch_indices, farthest, :].reshape(B, 1, C)
        dist = np.sum((xyz - centroid) ** 2, -1)
        mask = dist < distance
        distance[mask] = dist[mask]
        farthest = np.argmax(distance, -1)

    return centroids.astype(np.int32)

# class EndoNeRF_Dataset(object):
#     def __init__(
#         self,
#         datadir,
#         downsample=1.0,
#         test_every=10,
#         stereomis=False
#     ):
#         self.img_wh = (
#             int(640 / downsample),
#             int(512 / downsample),
#         )
#         self.root_dir = datadir
#         self.downsample = downsample 
#         self.blender2opencv = np.eye(4)
#         self.transform = T.ToTensor()
#         self.white_bg = False
#         self.stereomis = stereomis

#         self.load_meta()
#         print(f"meta data loaded, total image:{len(self.image_paths)}")
        
#         n_frames = len(self.image_paths)
        
#         # # Calculate the starting and ending indices for the current batch
#         # start_idx = batch_number * train_batch_size
#         # end_idx = min(start_idx + train_batch_size, n_frames)  # Ensure end_idx does not exceed the number of frames

#         # # Generate the indices for training and testing sets based on the batch
#         # self.train_idxs = [i for i in range(n_frames) if start_idx <= i < end_idx and (i - 1) % test_every != 0]
#         # self.test_idxs = [i for i in range(n_frames) if start_idx <= i < end_idx and (i - 1) % test_every == 0]

#         # # Indices for video frames (this might include all frames in the batch for video creation)
#         # self.video_idxs = [i for i in range(start_idx, end_idx)]

#         # print(f"Training indices for batch {batch_number}: {self.train_idxs}")
#         # print(f"Testing indices for batch {batch_number}: {self.test_idxs}")
        
#         #/////////////////////////////////////////////////////////////////////
        
#         # self.train_idxs = [i for i in range(n_frames) if (i-1) % test_every != 0]
#         # self.test_idxs = [i for i in range(n_frames) if (i-1) % test_every == 0]

#         # self.train_idxs = [0,1,2,3,4,5,6,7,8,9] 
#         # self.test_idxs = [0,9]
        
#         # # self.train_idxs = [5,6,7,8,9,10] #,11,12,13,14,15,16,17,18,19]#,21,22,23,24,25,26,27,28,29,30,31,32,33]
#         # # self.test_idxs =  [20] #,21,22,23,24,25] #[34,35,36,37,38,39]#1,9, 17, 25]

#         # #[0,1,2,3,4] 
        
#         self.video_idxs = [i for i in range(n_frames)]
        
        
#         self.mean = [0.485, 0.456, 0.406]
#         self.std = [0.229, 0.224, 0.225]
        
#         self.maxtime = 1.0
#         # self.session = ort.InferenceSession(
#         #     'submodules/depth_anything/weights/depth_anything_vits14.onnx', 
#         #     providers=["CUDAExecutionProvider", "CPUExecutionProvider"]
#         # )
            
            
import numpy as np
import random
import torchvision.transforms as T

# class EndoNeRF_Dataset(object):
#     def __init__(
#         self,
#         datadir,
#         downsample=1.0,
#         test_every=10,
#         stereomis=False,
#         sampling_strategy='random',  # 'random', 'interval', 'initial'
#         num_train_frames=50,  # Target number of frames for training
#         interval_step=12  # Step for interval sampling
#     ):
#         self.img_wh = (
#             int(640 / downsample),
#             int(512 / downsample),
#         )
#         self.root_dir = datadir
#         self.downsample = downsample 
#         self.blender2opencv = np.eye(4)
#         self.transform = T.ToTensor()
#         self.white_bg = False
#         self.stereomis = stereomis

#         self.load_meta()
#         print(f"Meta data loaded, total images: {len(self.image_paths)}")

#         n_frames = len(self.image_paths)
#         num_train_frames = min(num_train_frames, n_frames)  # Adjust training frames if less than 30

#         # Determine the training indices based on the sampling strategy
#         if sampling_strategy == 'random':
#             # Randomly sample 'num_train_frames' frames for training
#             self.train_idxs = np.random.choice(range(n_frames), size=num_train_frames, replace=False).tolist()

#         elif sampling_strategy == 'interval':
#             # Sample every 'interval_step' frame up to 'num_train_frames' frames
#             self.train_idxs = [i for i in range(0, n_frames, interval_step)][:num_train_frames]

#         elif sampling_strategy == 'initial':
#             # Take the first 'num_train_frames' frames
#             self.train_idxs = [i for i in range(num_train_frames)]

#         # Test indices are all the frames not used in training
#         self.test_idxs = [i for i in range(n_frames) if i not in self.train_idxs]

#         # All indices for video (optional)
#         self.video_idxs = [i for i in range(n_frames)]

#         print(f"Training indices: {self.train_idxs}")
#         print(f"Testing indices: {self.test_idxs}")

#         self.mean = [0.485, 0.456, 0.406]
#         self.std = [0.229, 0.224, 0.225]

#         self.maxtime = 1.0
#         # self.session = ort.InferenceSession(
#         #     'submodules/depth_anything/weights/depth_anything_vits14.onnx', 
#         #     providers=["CUDAExecutionProvider", "CPUExecutionProvider"]
#         # )
            
class EndoNeRF_Dataset(object):
    def __init__(
        self,
        datadir,
        downsample=1.0,
        test_every=10,
        stereomis=False,
        batch=0  # Batch number for batch-based indexing
    ):
        self.img_wh = (
            int(640 / downsample),
            int(512 / downsample),
        )
        self.root_dir = datadir
        self.downsample = downsample
        self.blender2opencv = np.eye(4)
        self.transform = T.ToTensor()
        self.white_bg = False
        self.stereomis = stereomis

        self.load_meta()
        print(f"Meta data loaded, total images: {len(self.image_paths)}")

        n_frames = len(self.image_paths)

        # Determine train and test indices based on batch number
        self.train_idxs = list(range(batch * 10, batch * 10 + 9))  # Train on first 10 frames of the batch
        self.test_idxs = list(range(batch * 10 + 9, (batch + 1) * 10))  # Test on the remaining 40 frames

        print(f"Training indices: {self.train_idxs}")
        print(f"Testing indices: {self.test_idxs}")

        # All indices for video (optional)
        self.video_idxs = [i for i in range(n_frames)]

        self.mean = [0.485, 0.456, 0.406]
        self.std = [0.229, 0.224, 0.225]

        self.maxtime = 1.0
        # self.session = ort.InferenceSession(
        #     'submodules/depth_anything/weights/depth_anything_vits14.onnx', 
        #     providers=["CUDAExecutionProvider", "CPUExecutionProvider"]
        # )

# class EndoNeRF_Dataset(object):
#     def __init__(
#         self,
#         datadir,
#         downsample=1.0,
#         test_every=10,
#         stereomis=False,
#         batch=0,  # Batch number for batch-based indexing
#         train_interval=3  # Interval for selecting training indices
#     ):
#         self.img_wh = (
#             int(640 / downsample),
#             int(512 / downsample),
#         )
#         self.root_dir = datadir
#         self.downsample = downsample
#         self.blender2opencv = np.eye(4)
#         self.transform = T.ToTensor()
#         self.white_bg = False
#         self.stereomis = stereomis

#         self.load_meta()
#         print(f"Meta data loaded, total images: {len(self.image_paths)}")

#         n_frames = len(self.image_paths)
        
#         # self.train_idxs = [300, 305, 310, 315, 320, 325, 330, 335, 340, 345]
#         # self.test_idxs = [301, 302, 303, 304, 306, 307, 308, 309, 311, 312, 313, 314, 316, 317, 318, 319, 321, 322, 323, 324, 326, 327, 328, 329, 331, 332, 333, 334, 336, 337, 338, 339, 341, 342, 343, 344, 346, 347, 348, 349]
        
#         # Determine the range of indices for the current batch
#         batch_start_idx = batch * 50
#         batch_end_idx = (batch + 1) * 50

#         # Pick training indices at the specified interval
#         self.train_idxs = list(range(batch_start_idx, batch_end_idx, train_interval))[:49]  # Limit to 10 images

#         # The remaining indices are used for testing
#         self.test_idxs = [i for i in range(batch_start_idx, batch_end_idx) if i not in self.train_idxs]

#         print(f"Training indices {self.train_idxs}")
#         print(f"Testing indices: {self.test_idxs}")

#         # All indices for video (optional)
#         self.video_idxs = [i for i in range(n_frames)]

#         self.mean = [0.485, 0.456, 0.406]
#         self.std = [0.229, 0.224, 0.225]

#         self.maxtime = 1.0
#         # self.session = ort.InferenceSession(
#         #     'submodules/depth_anything/weights/depth_anything_vits14.onnx', 
#         #     providers=["CUDAExecutionProvider", "CPUExecutionProvider"]
#         # )


    # def load_meta(self):
    #     """
    #     Load meta data from the dataset.
    #     """
    #     # load poses
    #     poses_arr = np.load(os.path.join(self.root_dir, "poses_bounds.npy"))
    #     poses = poses_arr[:, :-2].reshape([-1, 3, 5])  # (N_cams, 3, 5)
    #     # coordinate transformation OpenGL->Colmap, center poses
    #     self.H, self.W, focal = poses[0, :, -1]
    #     focal = focal / self.downsample
    #     self.focal = (focal, focal)
    #     self.K = np.array([[focal, 0 , self.W//2],
    #                         [0, focal, self.H//2],
    #                         [0, 0, 1]]).astype(np.float32)
    #     if self.stereomis:
    #         # poses = np.concatenate([poses[..., 1:2], -poses[..., :1], -poses[..., 2:3], poses[..., 3:4]], -1)
    #         poses = np.concatenate([poses[..., :1], -poses[..., 1:2], -poses[..., 2:3], poses[..., 3:4]], -1)
            
    #         # poses = recenter_poses(poses)
    #     else:
    #         poses = np.concatenate([poses[..., :1], -poses[..., 1:2], -poses[..., 2:3], poses[..., 3:4]], -1)
    #     # poses, _ = center_poses(poses)  # Re-center poses so that the average is near the center.
    #     # prepare poses
    #     self.image_poses = []
    #     self.image_times = []
    #     for idx in range(poses.shape[0]):
    #         pose = poses[idx]
    #         c2w = np.concatenate((pose, np.array([[0, 0, 0, 1]])), axis=0) # 4x4
    #         w2c = np.linalg.inv(c2w)
    #         R = w2c[:3, :3]
    #         T = w2c[:3, -1]
    #         R = np.transpose(R)
    #         self.image_poses.append((R, T))
    #         self.image_times.append(idx / poses.shape[0])
        
    #     # get paths of images, depths, masks, etc.
    #     agg_fn = lambda filetype: sorted(glob.glob(os.path.join(self.root_dir, filetype, "*.png")))
    #     self.image_paths = agg_fn("images")
    #     if self.stereomis:
    #         self.depth_paths = agg_fn('dep_png')
    #     else:
    #         self.depth_paths = agg_fn("depth")
    #     self.masks_paths = agg_fn("masks")


    #     assert len(self.image_paths) == poses.shape[0], "the number of images should equal to the number of poses"
    #     assert len(self.depth_paths) == poses.shape[0], "the number of depth images should equal to number of poses"
    #     assert len(self.masks_paths) == poses.shape[0], "the number of masks should equal to the number of poses"
        
        
        
    def load_meta(self):
        """
        Load meta data from the dataset and generate pose_bounds dynamically based on the number of frames.
        """
        # Get paths of images to determine the number of frames
        image_paths = sorted(glob.glob(os.path.join(self.root_dir, "images", "*.png")))
        num_frames = len(image_paths)

        # Constants (you can adjust these values as needed)
        height = 512   # Image height
        width = 640    # Image width
        focal_length = 1211  # Some constant focal length

        # Generate the pose_bounds array based on the number of frames
        pose_bounds = np.zeros((num_frames, 17))
        
        for i in range(num_frames):
            pose_bounds[i, :4] = [1, 0, 0, 0]  # Camera rotation or translation parameters (can be modified)
            pose_bounds[i, 4] = height
            pose_bounds[i, 5:9] = [0, 1, 0, 0]
            pose_bounds[i, 9] = width
            pose_bounds[i, 10:14] = [0, 0, 1, 0]
            pose_bounds[i, 14] = focal_length
            pose_bounds[i, 15] = 0  # Bound value (you can replace this with something more meaningful)
            pose_bounds[i, 16] = np.random.randint(50, 100)  # Random or calculated bound value

        # Reshape poses
        poses = pose_bounds[:, :-2].reshape([-1, 3, 5])  # (N_cams, 3, 5)

        # Coordinate transformation OpenGL -> Colmap, center poses
        self.H, self.W, focal = poses[0, :, -1]
        focal = focal / self.downsample
        self.focal = (focal, focal)
        self.K = np.array([[focal, 0 , self.W//2],
                           [0, focal, self.H//2],
                           [0, 0, 1]]).astype(np.float32)

        if self.stereomis:
            poses = np.concatenate([poses[..., :1], -poses[..., 1:2], -poses[..., 2:3], poses[..., 3:4]], -1)
        else:
            poses = np.concatenate([poses[..., :1], -poses[..., 1:2], -poses[..., 2:3], poses[..., 3:4]], -1)

        # Prepare poses and times for each image
        self.image_poses = []
        self.image_times = []
        for idx in range(poses.shape[0]):
            pose = poses[idx]
            c2w = np.concatenate((pose, np.array([[0, 0, 0, 1]])), axis=0)  # 4x4
            w2c = np.linalg.inv(c2w)
            R = w2c[:3, :3]
            T = w2c[:3, -1]
            R = np.transpose(R)
            self.image_poses.append((R, T))
            self.image_times.append(idx / poses.shape[0])

        # Get paths of images, depths, masks, etc.
        agg_fn = lambda filetype: sorted(glob.glob(os.path.join(self.root_dir, filetype, "*.png")))
        self.image_paths = agg_fn("images")
        if self.stereomis:
            self.depth_paths = agg_fn('dep_png')
        else:
            self.depth_paths = agg_fn("depth")
        self.masks_paths = agg_fn("masks")

        # Ensure consistency in the number of images, depths, and masks
        assert len(self.image_paths) == poses.shape[0], "The number of images should equal the number of poses"
        assert len(self.depth_paths) == poses.shape[0], "The number of depth images should equal the number of poses"
        assert len(self.masks_paths) == poses.shape[0], "The number of masks should equal the number of poses"

        # Optionally, save the generated pose_bounds as a .npy file if you need to
        # np.save(os.path.join(self.root_dir, "generated_pose_bounds.npy"), pose_bounds)
        
    def format_infos(self, split):
        cameras = []
        
        if split == 'train': idxs = self.train_idxs
        elif split == 'test': idxs = self.test_idxs
        else:
            idxs = self.video_idxs
        
        for idx in tqdm(idxs):
            # mask
            mask_path = self.masks_paths[idx]
            mask = Image.open(mask_path)
            if self.stereomis:
                mask = np.array(mask)/255
                mask = mask[..., 0]
            else:
                mask = 1 - np.array(mask) / 255.0
                
            # color
            color = (np.array(Image.open(self.image_paths[idx]))/255.0).astype(np.float32)
            # depth
            # depth_es = 1 / depth_es * 1000
            depth_es = np.load(self.image_paths[idx].replace('images', 'depth_dam').replace('png', 'npy'))
            pc = None
            if idx == 0:
                self.init_depth = depth_es
                self.init_img = color
                self.init_mask = mask
                            
            depth_es = torch.from_numpy(np.ascontiguousarray(depth_es))
            mask = torch.from_numpy(np.ascontiguousarray(mask)).bool()
            image = self.transform(np.ascontiguousarray(color))
            # times           
            time = self.image_times[idx]
            # poses
            R, T = self.image_poses[idx]
            # fov
            FovX = focal2fov(self.focal[0], self.img_wh[0])
            FovY = focal2fov(self.focal[1], self.img_wh[1])
            
            cameras.append(CameraInfo(uid=idx, R=R, T=T, FovY=FovY, FovX=FovX, image=image, depth=depth_es, mask=mask,
                                image_path=self.image_paths[idx], image_name=self.image_paths[idx], width=image.shape[2], height=image.shape[1],
                                time=time, Znear=None, Zfar=None, pc=pc))
    
        return cameras

    def get_pretrain_pcd(self):
        color = self.init_img.transpose((2,0,1))
        _, h, w = color.shape
        depth = self.init_depth
        mask = self.init_mask[None].astype(np.uint8)
        
        intrinsics = [self.focal[0], self.focal[1], w/2, h/2]
        R, T = self.image_poses[0]
        R = np.transpose(R)
        w2c = np.concatenate((R, T[...,None]), axis=-1)
        w2c = np.concatenate((w2c, np.array([[0, 0, 0, 1]])), axis=0)
        init_pt_cld, cols= get_pointcloud(color, depth, intrinsics, w2c, 
                                                mask=mask)
        normals = np.zeros((init_pt_cld.shape[0], 3))
        return init_pt_cld, cols, normals
    
    def get_pretrain_pcd_old(self):
        i, j = np.meshgrid(np.linspace(0, self.img_wh[0]-1, self.img_wh[0]), 
                           np.linspace(0, self.img_wh[1]-1, self.img_wh[1]))
        X_Z = (i-self.img_wh[0]/2) / self.focal[0]
        Y_Z = (j-self.img_wh[1]/2) / self.focal[1]
        Z = self.init_depth
        X, Y = X_Z * Z, Y_Z * Z
        # Z = -Z
        # X = -X
        mask = self.init_mask.reshape(-1, 1)
        pts_cam = np.stack((X, Y, Z), axis=-1).reshape(-1, 3)*mask
        color = self.init_img.reshape(-1, 3)*mask
        normals = np.zeros((pts_cam.shape[0], 3))
        R, T = self.image_poses[0]
        c2w = self.get_camera_poses((R, T))
        pts = self.transform_cam2cam(pts_cam, c2w)

        return pts, color, normals
         
    def get_camera_poses(self, pose_tuple):
        R, T = pose_tuple
        R = np.transpose(R)
        w2c = np.concatenate((R, T[...,None]), axis=-1)
        w2c = np.concatenate((w2c, np.array([[0, 0, 0, 1]])), axis=0)
        c2w = np.linalg.inv(w2c)
        return c2w
        
    def get_maxtime(self):
        return self.maxtime
    
    def transform_cam2cam(self, pts_cam, pose):
        pts_cam_homo = np.concatenate((pts_cam, np.ones((pts_cam.shape[0], 1))), axis=-1)
        pts_wld = np.transpose(pose @ np.transpose(pts_cam_homo))
        xyz = pts_wld[:, :3]
        return xyz
    

class SCARED_Dataset(object):
    def __init__(
        self,
        datadir,
        downsample=1.0,
        skip_every=2,
        test_every=8
    ):
        if "dataset_1" in datadir:
            skip_every = 2
        elif "dataset_2" in datadir:
            skip_every = 1
        elif "dataset_3" in datadir:
            skip_every = 4
        elif "dataset_6" in datadir:
            skip_every = 8
        elif "dataset_7" in datadir:
            skip_every = 8
            
        self.img_wh = (
            int(1280 / downsample),
            int(1024 / downsample),
        )
        self.root_dir = datadir
        self.downsample = downsample
        self.skip_every = skip_every
        self.transform = T.ToTensor()
        self.white_bg = False
        self.depth_far_thresh = 300.0
        self.depth_near_thresh = 0.03

        self.load_meta()
        n_frames = len(self.rgbs)
        print(f"meta data loaded, total image:{n_frames}")
        
        self.train_idxs = [i for i in range(n_frames) if (i-1) % test_every!=0]
        self.test_idxs = [i for i in range(n_frames) if (i-1) % test_every==0]

        self.maxtime = 1.0
        
    def load_meta(self):
        """
        Load meta data from the dataset.
        """
        # prepare paths
        calibs_dir = osp.join(self.root_dir, "data", "frame_data")
        rgbs_dir = osp.join(self.root_dir, "data", "left_finalpass")
        disps_dir = osp.join(self.root_dir, "data", "disparity")
        reproj_dir = osp.join(self.root_dir, "data", "reprojection_data")
        frame_ids = sorted([id[:-5] for id in os.listdir(calibs_dir)])
        frame_ids = frame_ids[::self.skip_every]
        n_frames = len(frame_ids)
        
        rgbs = []
        bds = []
        masks = []
        depths = []
        pose_mat = []
        camera_mat = []
        
        for i_frame in trange(n_frames, desc="Process frames"):
            frame_id = frame_ids[i_frame]
            
            # intrinsics and poses
            with open(osp.join(calibs_dir, f"{frame_id}.json"), "r") as f:
                calib_dict = json.load(f)
            K = np.eye(4)
            K[:3, :3] = np.array(calib_dict["camera-calibration"]["KL"])
            camera_mat.append(K)
            c2w = np.linalg.inv(np.array(calib_dict["camera-pose"]))
            if i_frame == 0:
                c2w0 = c2w
            c2w = np.linalg.inv(c2w0) @ c2w
            pose_mat.append(c2w)
            
            # rgbs and depths
            rgb_dir = osp.join(rgbs_dir, f"{frame_id}.png")
            rgb = iio.imread(rgb_dir)
            rgbs.append(rgb)
            disp_dir = osp.join(disps_dir, f"{frame_id}.tiff")
            disp = iio.imread(disp_dir).astype(np.float32)
            h, w = disp.shape
            with open(osp.join(reproj_dir, f"{frame_id}.json"), "r") as json_file:
                Q = np.array(json.load(json_file)["reprojection-matrix"])
            fl = Q[2,3]
            bl =  1 / Q[3,2]
            disp_const = fl * bl
            mask_valid = (disp != 0)    
            depth = np.zeros_like(disp)
            depth[mask_valid] = disp_const / disp[mask_valid]
            depth[depth>self.depth_far_thresh] = 0
            depth[depth<self.depth_near_thresh] = 0
            depths.append(depth)
            
            # masks
            depth_mask = (depth != 0).astype(float)
            kernel = np.ones((int(w/128), int(w/128)),np.uint8)
            mask = cv2.morphologyEx(depth_mask, cv2.MORPH_CLOSE, kernel)
            masks.append(mask)
            
            # bounds
            bound = np.array([depth[depth!=0].min(), depth[depth!=0].max()])
            bds.append(bound)

        self.rgbs = np.stack(rgbs, axis=0).astype(np.float32) / 255.0
        self.pose_mat = np.stack(pose_mat, axis=0).astype(np.float32)
        self.camera_mat = np.stack(camera_mat, axis=0).astype(np.float32)
        self.depths = np.stack(depths, axis=0).astype(np.float32)
        self.masks = np.stack(masks, axis=0).astype(np.float32)
        self.bds = np.stack(bds, axis=0).astype(np.float32)
        self.times = np.linspace(0, 1, num=len(rgbs)).astype(np.float32)
        self.frame_ids = frame_ids
        
    def format_infos(self, split):
        cameras = []
        if split == 'train':
            idxs = self.train_idxs
        elif split == 'test':
            idxs = self.test_idxs
        else:
            self.generate_cameras(mode='fixidentity')
        
        for idx in idxs:
            image = self.rgbs[idx]
            image = self.transform(image)
            mask = self.masks[idx]
            mask = self.transform(mask).bool()
            depth = self.depths[idx]
            depth = torch.from_numpy(depth)
            time = self.times[idx]
            c2w = self.pose_mat[idx]
            w2c = np.linalg.inv(c2w)
            R, T = w2c[:3, :3], w2c[:3, -1]
            R = np.transpose(R)
            camera_mat = self.camera_mat[idx]
            focal_x, focal_y = camera_mat[0, 0], camera_mat[1, 1]
            FovX = focal2fov(focal_x, self.img_wh[0])
            FovY = focal2fov(focal_y, self.img_wh[1])
            cameras.append(CameraInfo(uid=idx, R=R, T=T, FovY=FovY, FovX=FovX, image=image, depth=depth, mask=mask,
                                image_path=None, image_name=None, width=self.img_wh[0], height=self.img_wh[1],
                                time=time, Znear=self.depth_near_thresh, Zfar=self.depth_far_thresh))
        return cameras
            
    def generate_cameras(self, mode='fixidentity'):
        cameras = []
        image = self.rgbs[0]
        image = self.transform(image)
        c2w = self.pose_mat[0]
        w2c = np.linalg.inv(c2w)
        R, T = w2c[:3, :3], w2c[:3, -1]
        R = np.transpose(R)
        camera_mat = self.camera_mat[0]
        focal_x, focal_y = camera_mat[0, 0], camera_mat[1, 1]
        FovX = focal2fov(focal_x, self.img_wh[0])
        FovY = focal2fov(focal_y, self.img_wh[1])
        
        if mode == 'fixidentity':
            render_times = self.times
            for idx, time in enumerate(render_times):
                FovX = focal2fov(focal_x, self.img_wh[0])
                FovY = focal2fov(focal_y, self.img_wh[1])
                cameras.append(CameraInfo(uid=idx, R=R, T=T, FovY=FovY, FovX=FovX,
                                          image=image, image_path=None, image_name=None, depth=None, mask=None,
                                          width=self.img_wh[0], height=self.img_wh[1], time=time, 
                                          Znear=self.depth_near_thresh, Zfar=self.depth_far_thresh))
            return cameras
        else:
            raise ValueError(f'{mode} not implemented yet')
    
    def get_pts(self, mode='o3d'):
        if mode == 'o3d':
            pose = self.pose_mat[0]
            K = self.camera_mat[0][:3, :3]
            rgb = self.rgbs[0]
            rgb_im = o3d.geometry.Image((rgb*255.0).astype(np.uint8))
            depth_im = o3d.geometry.Image(self.depths[0])
            rgbd_image = o3d.geometry.RGBDImage.create_from_color_and_depth(rgb_im, depth_im,
                                                                            depth_scale=1.,
                                                                            depth_trunc=self.bds.max(),
                                                                            convert_rgb_to_intensity=False)
            pcd = o3d.geometry.PointCloud.create_from_rgbd_image(
                rgbd_image, 
                o3d.camera.PinholeCameraIntrinsic(self.img_wh[0], self.img_wh[1], K),
                np.linalg.inv(pose),
                project_valid_depth_only=True,
            )
            pcd = pcd.random_down_sample(0.01)
            pcd, _ = pcd.remove_radius_outlier(nb_points=5,
                                        radius=np.asarray(pcd.compute_nearest_neighbor_distance()).mean() * 10.)
            xyz, rgb = np.asarray(pcd.points).astype(np.float32), np.asarray(pcd.colors).astype(np.float32)
            normals = np.zeros((xyz.shape[0], 3))
            return xyz, rgb, normals
        elif mode == 'naive':
            pass
        else:
            raise ValueError(f'Mode {mode} has not been implemented yet')
    
    def get_maxtime(self):
        return self.maxtime
        
def save_pcd(xyz, color, name):
    pcd = o3d.geometry.PointCloud()
    pcd.points = o3d.utility.Vector3dVector(np.array(xyz))
    pcd.colors = o3d.utility.Vector3dVector(np.array(color))
    o3d.io.write_point_cloud(f"{name}", pcd)