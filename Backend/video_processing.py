# from flask import Flask, jsonify
# import os
# import time
# import threading
# import cv2
# import numpy as np
# from ultralytics import YOLO
# import torch
# from flask import Flask, send_from_directory, jsonify
# from flask_socketio import SocketIO, emit
# from flask_cors import CORS


# app = Flask(__name__)
# # Enable CORS for all domains (use a specific domain if needed)
# CORS(app, resources={r"/*": {"origins": "*"}})

# socketio = SocketIO(app, cors_allowed_origins="*", transports=['websocket'], logger=True, engineio_logger=True)


# # Fixed Data (Use your fixed paths and parameters)
# input_video = 'path/to/your/video.mp4'
# output_frames_folder = 'path/to/frames/folder'
# output_masks_folder = 'path/to/masks/folder'
# frame_interval = 1
# new_width = 640
# specified_classes = [1, 2, 3]  # Update as needed

# # Function 1: Convert video to frames and resize
# def video_to_frames_and_resize(input_loc, output_loc, frame_interval, new_width):
#     """Extract frames from input video file, resize them, and save as PNG files."""
#     try:
#         os.makedirs(output_loc, exist_ok=True)
#     except OSError as e:
#         print(f"Error creating directory: {e}")
#         return jsonify({"error": f"Error creating directory: {e}"}), 500

#     time_start = time.time()
#     cap = cv2.VideoCapture(input_loc)

#     if not cap.isOpened():
#         return jsonify({"error": "Error: Could not open video file."}), 400

#     video_length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) - 1
#     print("Number of frames: ", video_length)
    
#     count = 0
#     print("Converting and resizing video frames...")

#     while cap.isOpened():
#         ret, frame = cap.read()
#         if not ret:
#             continue

#         if count % frame_interval == 0:
#             # Resize frame
#             aspect_ratio = frame.shape[0] / frame.shape[1]
#             new_height = int(new_width * aspect_ratio)
#             resized_frame = cv2.resize(frame, (new_width, new_height), interpolation=cv2.INTER_LANCZOS4)

#             # Save resized frame
#             frame_file = os.path.join(output_loc, f"{count+1:05d}.png")
#             cv2.imwrite(frame_file, resized_frame)

#         count += 1

#         if count > (video_length - 1):
#             time_end = time.time()
#             cap.release()
#             print(f"Done extracting and resizing frames.\n{count} frames processed.")
#             print(f"Time taken for frame extraction: {time_end - time_start} seconds.")
#             break

# # Function 2: YOLO inference to create grayscale masks and resize
# def process_video_and_generate_resized_grayscale_masks(video_path, output_mask_folder, specified_classes, new_width, frame_interval):
#     """Run YOLO inference on video frames, create grayscale masks, resize them, and save."""
#     # Load YOLOv8 model
#     model = YOLO('Yolomodel.pt')
#     device = torch.device('cpu')
#     model.to(device)

#     # Open video file
#     cap = cv2.VideoCapture(video_path)

#     # Create output directory if it doesn't exist
#     os.makedirs(output_mask_folder, exist_ok=True)

#     frame_count = 0
#     print("Running YOLO inference and resizing masks...")

#     time_start = time.time()  # Start time for mask generation process

#     while cap.isOpened():
#         success, frame = cap.read()

#         if success:
#             if frame_count % frame_interval == 0:
#                 # Run YOLOv8 inference on the frame
#                 results = model(frame)

#                 # Create grayscale mask for specified classes
#                 grayscale_mask = np.zeros(frame.shape[:2], dtype=np.uint8)  # Initialize a grayscale mask
#                 if results[0].masks is not None:
#                     for mask_idx, mask_xy in enumerate(results[0].masks.xy):
#                         class_id = int(results[0].boxes.cls[mask_idx])
#                         if class_id in specified_classes:
#                             points = np.array(mask_xy, dtype=np.int32).reshape((-1, 1, 2))
#                             cv2.fillPoly(grayscale_mask, [points], 255)

#                 # Resize the grayscale mask to match the resized frames
#                 aspect_ratio = frame.shape[0] / frame.shape[1]
#                 new_height = int(new_width * aspect_ratio)
#                 resized_mask = cv2.resize(grayscale_mask, (new_width, new_height), interpolation=cv2.INTER_LANCZOS4)

#                 # Save resized mask as PNG
#                 mask_filename = os.path.join(output_mask_folder, f"{frame_count:05d}.png")
#                 cv2.imwrite(mask_filename, resized_mask)

#             frame_count += 1
#         else:
#             break

#     # Release resources
#     cap.release()
#     time_end = time.time()  # End time for mask generation process
#     print(f"Grayscale masks saved and resized in {output_mask_folder}")
#     print(f"Time taken for mask generation: {time_end - time_start} seconds")

# # Flask route to process video (trigger without any input from the frontend)
# @app.route('/process_video', methods=['POST'])
# def process_video():
#     # Create two threads for parallel processing
#     thread1 = threading.Thread(target=video_to_frames_and_resize, args=(input_video, output_frames_folder, frame_interval, new_width))
#     thread2 = threading.Thread(target=process_video_and_generate_resized_grayscale_masks, args=(input_video, output_masks_folder, specified_classes, new_width, frame_interval))

#     # Start both threads
#     thread1.start()
#     thread2.start()

#     # Wait for both threads to finish
#     thread1.join()
#     thread2.join()

#     return jsonify({"message": "Video processing and YOLO mask generation completed."}), 200

# if __name__ == "__main__":
#     socketio.run(app, host='0.0.0.0', port=5001)



# from flask import Flask, jsonify
# import os
# import time
# import threading
# import cv2
# import numpy as np
# from ultralytics import YOLO
# import torch
# import subprocess
# from flask_socketio import SocketIO, emit
# from flask_cors import CORS


# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "*"}})

# socketio = SocketIO(app, cors_allowed_origins="*", transports=['websocket'], logger=True, engineio_logger=True)

# # Fixed Data (Use your fixed paths and parameters)
# input_video = 'Patient_144_Run_2.avi'
# output_frames_folder = 'data/endonerf/Patient_144_Run_2_Frames_pipeline_2/images'
# output_masks_folder = 'data/endonerf/Patient_144_Run_2_Frames_pipeline_2/masks'
# frame_interval = 50
# new_width = 640
# specified_classes = [1, 2, 3]  # Update as needed
# max_batch_number = 1  # Set your max batch number for training

# # Flag to control training state
# training_active = False

# # Function to start batch training
# def start_batch_training(max_batch_number):
#     try:
#         # Ensure the shell script has execute permissions
#         subprocess.run("chmod +x incremental_batchwise_train.sh", shell=True, check=True)
        
#         # Run the batchwise training script
#         bash_command = f"./incremental_batchwise_train.sh {max_batch_number}"
#         subprocess.run(bash_command, shell=True, check=True)

#     except subprocess.CalledProcessError as e:
#         print(f"Error during batch training: {e}")


# # Function to stop batch training (will be implemented as a placeholder)
# def stop_batch_training():
#     # Here, you can add logic to stop training, such as terminating the subprocess.
#     print("Training stopped")

# # Function 1: Convert video to frames and resize
# def video_to_frames_and_resize(input_loc, output_loc, frame_interval, new_width):
#     """Extract frames from input video file, resize them, and save as PNG files."""
#     try:
#         os.makedirs(output_loc, exist_ok=True)
#     except OSError as e:
#         print(f"Error creating directory: {e}")
#         return jsonify({"error": f"Error creating directory: {e}"}), 500

#     time_start = time.time()
#     cap = cv2.VideoCapture(input_loc)

#     if not cap.isOpened():
#         return jsonify({"error": "Error: Could not open video file."}), 400

#     video_length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) - 1
#     print("Number of frames: ", video_length)
    
#     count = 0
#     print("Converting and resizing video frames...")

#     while cap.isOpened() and training_active:
#         ret, frame = cap.read()
#         if not ret:
#             continue

#         if count % frame_interval == 0:
#             # Resize frame
#             aspect_ratio = frame.shape[0] / frame.shape[1]
#             new_height = int(new_width * aspect_ratio)
#             resized_frame = cv2.resize(frame, (new_width, new_height), interpolation=cv2.INTER_LANCZOS4)

#             # Save resized frame
#             frame_file = os.path.join(output_loc, f"{count+1:05d}.png")
#             cv2.imwrite(frame_file, resized_frame)

#         count += 1

#         if count > (video_length - 1):
#             time_end = time.time()
#             cap.release()
#             print(f"Done extracting and resizing frames.\n{count} frames processed.")
#             print(f"Time taken for frame extraction: {time_end - time_start} seconds.")
#             break

# # Function 2: YOLO inference to create grayscale masks and resize
# def process_video_and_generate_resized_grayscale_masks(video_path, output_mask_folder, specified_classes, new_width, frame_interval):
#     """Run YOLO inference on video frames, create grayscale masks, resize them, and save."""
#     model = YOLO('Yolomodel.pt')
#     device = torch.device('cpu')
#     model.to(device)

#     cap = cv2.VideoCapture(video_path)
#     os.makedirs(output_mask_folder, exist_ok=True)

#     frame_count = 0
#     print("Running YOLO inference and resizing masks...")

#     time_start = time.time()

#     while cap.isOpened() and training_active:
#         success, frame = cap.read()
#         if success:
#             if frame_count % frame_interval == 0:
#                 # Run YOLOv8 inference on the frame
#                 results = model(frame)

#                 # Create grayscale mask for specified classes
#                 grayscale_mask = np.zeros(frame.shape[:2], dtype=np.uint8)
#                 if results[0].masks is not None:
#                     for mask_idx, mask_xy in enumerate(results[0].masks.xy):
#                         class_id = int(results[0].boxes.cls[mask_idx])
#                         if class_id in specified_classes:
#                             points = np.array(mask_xy, dtype=np.int32).reshape((-1, 1, 2))
#                             cv2.fillPoly(grayscale_mask, [points], 255)

#                 # Resize the grayscale mask
#                 aspect_ratio = frame.shape[0] / frame.shape[1]
#                 new_height = int(new_width * aspect_ratio)
#                 resized_mask = cv2.resize(grayscale_mask, (new_width, new_height), interpolation=cv2.INTER_LANCZOS4)

#                 # Save resized mask
#                 mask_filename = os.path.join(output_mask_folder, f"{frame_count:05d}.png")
#                 cv2.imwrite(mask_filename, resized_mask)

#             frame_count += 1
#         else:
#             break

#     cap.release()
#     time_end = time.time()
#     print(f"Grayscale masks saved and resized in {output_mask_folder}")
#     print(f"Time taken for mask generation: {time_end - time_start} seconds")

# # Flask route to start training
# @app.route('/start_training', methods=['POST'])
# def start_training():
#     global training_active
#     if training_active:
#         return jsonify({"message": "Training is already running."}), 400

#     # Set training_active to True
#     training_active = True

#     # Start video processing in a new thread
#     thread1 = threading.Thread(target=video_to_frames_and_resize, args=(input_video, output_frames_folder, frame_interval, new_width))
#     thread2 = threading.Thread(target=process_video_and_generate_resized_grayscale_masks, args=(input_video, output_masks_folder, specified_classes, new_width, frame_interval))

#     # Start both threads
#     thread1.start()
#     thread2.start()

#     # Wait for both threads to finish
#     thread1.join()
#     thread2.join()

#     # Run the Python script directly without activating or deactivating conda environment
#     try:
#         python_command = (
#         "cd /opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/Depth-Anything && "
#         "python run.py "
#         "--encoder vitl --img-path '/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/data/endonerf/Patient_144_Run_2_Frames_pipeline_2/images' "
#         "--outdir '/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/data/endonerf/Patient_144_Run_2_Frames_pipeline_2/depth' "
#         "--pred-only --grayscale && cd .."
#     )

#         # Run the command
#         subprocess.run(python_command, shell=True, check=True)

#     except subprocess.CalledProcessError as e:
#         print(f"Error during script execution: {e}")
#         return jsonify({"error": f"Script execution failed: {e}"}), 500

#     # Run preparation command before starting batch training
#     try:
#             # Define the command to run the Python script instead of the shell script
#         prep_command = (
#             "python scripts/pre_dam_dep.py "
#             "--dataset_root data/endonerf/Patient_144_Run_2_Frames_pipeline_2"
#         )
        
#         # Execute the Python command using subprocess
#         prep_process = subprocess.run(prep_command, shell=True, check=True)
        
#         # Check if the preparation process returned an error
#         if prep_process.returncode != 0:
#             print("Error in preparation step.")
#             return jsonify({"error": "Preparation step failed."}), 500

#         # Wait for 3 seconds after the preparation step
#         time.sleep(2)
    
#     except subprocess.CalledProcessError as e:
#         print(f"Error during preparation: {e}")
#         return jsonify({"error": f"Preparation failed: {e}"}), 500

#     # After both threads finish, start batch training
#     start_batch_training(max_batch_number)

#     return jsonify({"message": "Video processing, YOLO mask generation, and batch training started."}), 200


# # Flask route to stop training
# @app.route('/stop_training', methods=['POST'])
# def stop_training():
#     global training_active
#     if not training_active:
#         return jsonify({"message": "Training is not running."}), 400

#     # Set training_active to False to stop training
#     training_active = False
#     stop_batch_training()  # Optionally stop any training in progress

#     return jsonify({"message": "Training stopped."}), 200

# if __name__ == "__main__":
#     socketio.run(app, host='0.0.0.0', port=5001)




from flask import Flask, jsonify
import os
import time
import threading
import cv2
import numpy as np
from ultralytics import YOLO
import torch
import subprocess
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(app, cors_allowed_origins="*", transports=['websocket'], logger=True, engineio_logger=True)

# Fixed Data (Use your fixed paths and parameters)
base_folder = 'data/endonerf/Patient_144_Run_2_Frames_pipeline_3'
input_video = 'Patient_144_Run_2.avi'
output_frames_folder = os.path.join(base_folder, 'images')
output_masks_folder = os.path.join(base_folder, 'masks')
frame_interval = 50
new_width = 640
specified_classes = [1, 2, 3]  # Update as needed
max_batch_number = 0  # Set your max batch number for training

# Flag to control training state
training_active = False

# Function to start batch training
def start_batch_training(max_batch_number):
    try:
        # Ensure the shell script has execute permissions
        subprocess.run("chmod +x incremental_batchwise_train.sh", shell=True, check=True)
        
        # Run the batchwise training script
        bash_command = f"./incremental_batchwise_train.sh {max_batch_number}"
        subprocess.run(bash_command, shell=True, check=True)

    except subprocess.CalledProcessError as e:
        print(f"Error during batch training: {e}")


# Function to stop batch training (will be implemented as a placeholder)
def stop_batch_training():
    # Here, you can add logic to stop training, such as terminating the subprocess.
    print("Training stopped")

# Function 1: Convert video to frames and resize
def video_to_frames_and_resize(input_loc, output_loc, frame_interval, new_width):
    """Extract frames from input video file, resize them, and save as PNG files."""
    try:
        os.makedirs(output_loc, exist_ok=True)
    except OSError as e:
        print(f"Error creating directory: {e}")
        return jsonify({"error": f"Error creating directory: {e}"}), 500

    time_start = time.time()
    cap = cv2.VideoCapture(input_loc)

    if not cap.isOpened():
        return jsonify({"error": "Error: Could not open video file."}), 400

    video_length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) - 1
    print("Number of frames: ", video_length)
    
    count = 0
    print("Converting and resizing video frames...")

    while cap.isOpened() and training_active:
        ret, frame = cap.read()
        if not ret:
            continue

        if count % frame_interval == 0:
            # Resize frame
            aspect_ratio = frame.shape[0] / frame.shape[1]
            new_height = int(new_width * aspect_ratio)
            resized_frame = cv2.resize(frame, (new_width, new_height), interpolation=cv2.INTER_LANCZOS4)

            # Save resized frame
            frame_file = os.path.join(output_loc, f"{count+1:05d}.png")
            cv2.imwrite(frame_file, resized_frame)

        count += 1

        if count > (video_length - 1):
            time_end = time.time()
            cap.release()
            print(f"Done extracting and resizing frames.\n{count} frames processed.")
            print(f"Time taken for frame extraction: {time_end - time_start} seconds.")
            break

# Function 2: YOLO inference to create grayscale masks and resize
def process_video_and_generate_resized_grayscale_masks(video_path, output_mask_folder, specified_classes, new_width, frame_interval):
    """Run YOLO inference on video frames, create grayscale masks, resize them, and save."""
    model = YOLO('Yolomodel.pt')
    device = torch.device('cpu')
    model.to(device)

    cap = cv2.VideoCapture(video_path)
    os.makedirs(output_mask_folder, exist_ok=True)

    frame_count = 0
    print("Running YOLO inference and resizing masks...")

    time_start = time.time()

    while cap.isOpened() and training_active:
        success, frame = cap.read()
        if success:
            if frame_count % frame_interval == 0:
                # Run YOLOv8 inference on the frame
                results = model(frame)

                # Create grayscale mask for specified classes
                grayscale_mask = np.zeros(frame.shape[:2], dtype=np.uint8)
                if results[0].masks is not None:
                    for mask_idx, mask_xy in enumerate(results[0].masks.xy):
                        class_id = int(results[0].boxes.cls[mask_idx])
                        if class_id in specified_classes:
                            points = np.array(mask_xy, dtype=np.int32).reshape((-1, 1, 2))
                            cv2.fillPoly(grayscale_mask, [points], 255)

                # Resize the grayscale mask
                aspect_ratio = frame.shape[0] / frame.shape[1]
                new_height = int(new_width * aspect_ratio)
                resized_mask = cv2.resize(grayscale_mask, (new_width, new_height), interpolation=cv2.INTER_LANCZOS4)

                # Save resized mask
                mask_filename = os.path.join(output_mask_folder, f"{frame_count:05d}.png")
                cv2.imwrite(mask_filename, resized_mask)

            frame_count += 1
        else:
            break

    cap.release()
    time_end = time.time()
    print(f"Grayscale masks saved and resized in {output_mask_folder}")
    print(f"Time taken for mask generation: {time_end - time_start} seconds")

# Function to generate the numpy array
def generate_numpy_array(image_folder_path):
    # Get all image files in the directory (you can filter by file extension if needed)
    image_files = [f for f in os.listdir(image_folder_path) if f.endswith((".jpg", ".png", ".jpeg"))]

    # Print the list of image files to verify if it's empty
    print(f"Found image files: {image_files}")

    # Initialize an empty list to hold rows for the numpy array
    rows = []

    # Loop through each image in the folder
    for i, image_file in enumerate(image_files):
        # Load the image (using PIL to get size of image)
        image_path = os.path.join(image_folder_path, image_file)
        with Image.open(image_path) as img:
            # Get the image size (width, height)
            width, height = img.size

            # Generate a row with 17 elements
            row = np.array([1, 0, 0, 0, height, 0, 1, 0, 0, width, 0, 0, 1, 0, 1211, 0, 52])

            # Append the row to the list
            rows.append(row)

    # Convert the list of rows into a numpy array
    return np.array(rows)

# Flask route to start training
@app.route('/start_training', methods=['POST'])
def start_training():
    global training_active
    if training_active:
        return jsonify({"message": "Training is already running."}), 400

    # Set training_active to True
    training_active = True

    # Start video processing in a new thread
    thread1 = threading.Thread(target=video_to_frames_and_resize, args=(input_video, output_frames_folder, frame_interval, new_width))
    thread2 = threading.Thread(target=process_video_and_generate_resized_grayscale_masks, args=(input_video, output_masks_folder, specified_classes, new_width, frame_interval))

    # Start both threads
    thread1.start()
    thread2.start()

    # Wait for both threads to finish
    thread1.join()
    thread2.join()

    # Save the pose_bounds.npy after threads complete
    numpy_array = generate_numpy_array(output_frames_folder)
    parent_directory = os.path.dirname(output_frames_folder)
    output_path = os.path.join(parent_directory, 'poses_bounds.npy')
    np.save(output_path, numpy_array)
    print(f'NumPy array saved to {output_path}')

    # Run the Python script directly without activating or deactivating conda environment
    try:
        python_command = (
        "cd /opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/Depth-Anything && "
        "python run.py "
        "--encoder vitl --img-path '/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/data/endonerf/Patient_144_Run_2_Frames_pipeline_3/images' "
        "--outdir '/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/data/endonerf/Patient_144_Run_2_Frames_pipeline_3/depth' "
        "--pred-only --grayscale && cd .."
    )

        # Run the command
        subprocess.run(python_command, shell=True, check=True)

    except subprocess.CalledProcessError as e:
        print(f"Error during script execution: {e}")
        return jsonify({"error": f"Script execution failed: {e}"}), 500

    # Run preparation command before starting batch training
    try:
            # Define the command to run the Python script instead of the shell script
        prep_command = (
            f"python scripts/pre_dam_dep.py --dataset_root {base_folder}"
        )
        
        # Execute the Python command using subprocess
        prep_process = subprocess.run(prep_command, shell=True, check=True)
        
        # Check if the preparation process returned an error
        if prep_process.returncode != 0:
            print("Error in preparation step.")
            return jsonify({"error": "Preparation step failed."}), 500

        # Wait for 3 seconds after the preparation step
        time.sleep(2)
    
    except subprocess.CalledProcessError as e:
        print(f"Error during preparation: {e}")
        return jsonify({"error": f"Preparation failed: {e}"}), 500

    # After both threads finish, start batch training
    start_batch_training(max_batch_number)

    return jsonify({"message": "Video processing, YOLO mask generation, and batch training started."}), 200


# Flask route to stop training
@app.route('/stop_training', methods=['POST'])
def stop_training():
    global training_active
    if not training_active:
        return jsonify({"message": "Training is not running."}), 400

    # Set training_active to False to stop training
    training_active = False
    stop_batch_training()  # Optionally stop any training in progress

    return jsonify({"message": "Training stopped."}), 200

if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5001)
