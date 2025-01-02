# from flask import Flask
# from flask_socketio import SocketIO, emit
# import numpy as np
# import os
# from pathlib import Path
# import torch

# # Initialize Flask app and Flask-SocketIO
# app = Flask(__name__)
# socketio = SocketIO(app, cors_allowed_origins="*")

# # Utility function to load a point cloud
# def load_point_cloud(file_path):
#     """
#     Load a point cloud file from the given file_path.
#     This is a placeholder function, depending on your point cloud file format (e.g., .ply, .pcd, etc.)
#     """
#     # Here you can use a library such as open3d or pyntcloud to load the point cloud
#     # Example for .npy (assuming point cloud is stored as numpy array):
#     point_cloud = np.load(file_path)
#     return torch.tensor(point_cloud, dtype=torch.float32).cuda()

# # Function to read point clouds
# def read_point_clouds(pc_dir):
#     point_clouds, pc_names = [], []

#     for fname in os.listdir(pc_dir):
#         file_path = pc_dir / fname
#         point_cloud = load_point_cloud(file_path)
#         point_clouds.append(point_cloud)
#         pc_names.append(fname)

#     return point_clouds, pc_names

# # Handle evaluation request from client
# @socketio.on('start_point_cloud_stream')
# def evaluate(data):
#     model_paths = data['model_paths']  # Expecting a list of paths to point cloud directories

#     with torch.no_grad():
#         # Loop through each provided point cloud directory
#         for scene_dir in model_paths:
#             point_cloud_dir = Path(scene_dir) / "test/ours_3000/pcd"
            
#             # Read all point clouds in the directory
#             point_clouds, pc_names = read_point_clouds(point_cloud_dir)

#             # Loop through each point cloud and emit results
#             for idx in range(len(point_clouds)):
#                 point_cloud = point_clouds[idx]
#                 pc_name = pc_names[idx]

#                 # Placeholder for any evaluation/processing you want to do
#                 # Example: Calculate some metrics (replace with actual computation)
#                 num_points = point_cloud.shape[0]

#                 # Emit the point cloud and some mock metric (e.g., number of points) to the client
#                 emit('point_cloud_data', {
#                     'scene': scene_dir,
#                     'point_cloud_name': pc_name,
#                     'num_points': num_points,
#                     'point_cloud': point_cloud.cpu().numpy().tolist()  # Convert to list to emit over socket
#                 })

# # Start the Flask app with WebSocket support
# if __name__ == "__main__":
#     socketio.run(app, host='0.0.0.0', port=5000)


# WORKS PERFECT TO SEND PC DATA ONLY ONE PC TO CLIENT
# import os
# import json
# from flask import Flask
# from flask_socketio import SocketIO, emit

# app = Flask(__name__)
# socketio = SocketIO(app, cors_allowed_origins="*", transports=['websocket'], logger=True, engineio_logger=True)

# # Point cloud JSON file paths (list of files)
# point_cloud_files = [
#     '/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/frame_1.json', '/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/frame_2.json'
#     # Add more files as needed
# ]

# CHUNK_SIZE = 100000000  # Number of points to send in each chunk (adjustable)

# def load_point_cloud_chunks(index):
#     """ Load point cloud data from a JSON file and yield chunks of points. """
#     try:
#         # Check if the index is valid
#         if index < 0 or index >= len(point_cloud_files):
#             print(f"Invalid index: {index}. Must be between 0 and {len(point_cloud_files) - 1}.")
#             yield None
        
#         # Read the point cloud data from the file
#         with open(point_cloud_files[index], 'r') as f:
#             data = json.load(f)  # Load the JSON file
#             if not isinstance(data, list):
#                 print(f"Invalid data format in file: {point_cloud_files[index]}. Expected a list of points.")
#                 yield None
            
#             # Yield the points in chunks
#             for i in range(0, len(data), CHUNK_SIZE):
#                 yield data[i:i + CHUNK_SIZE]  # Yield chunks of points

#     except FileNotFoundError:
#         print(f"File not found: {point_cloud_files[index]}")
#         yield None
#     except json.JSONDecodeError as e:
#         print(f"Error decoding JSON from {point_cloud_files[index]}: {e}")
#         yield None
#     except Exception as e:
#         print(f"An error occurred: {e}")
#         yield None


# @app.route('/')
# def index():
#     return "Point Cloud WebSocket Server is running"


# @socketio.on('connect')
# def handle_connect():
#     print('Client connected')


# @socketio.on('disconnect')
# def handle_disconnect():
#     print('Client disconnected')


# @socketio.on('get_point_cloud')
# def handle_get_point_cloud(data):
#     index = data.get('index', 0)
#     chunk_index = data.get('chunk_index', 0)

#     print(f'Sending chunk {chunk_index} of point cloud for index: {index}')
    
#     # Get all point cloud chunks as a list
#     point_cloud_chunks = list(load_point_cloud_chunks(index))
    
#     # Check if the chunk index is valid
#     if chunk_index < len(point_cloud_chunks):
#         if point_cloud_chunks[chunk_index] is not None:  # Ensure chunk is not None
#             emit('point_cloud_chunk', {
#                 'chunk': point_cloud_chunks[chunk_index],
#                 'chunk_index': chunk_index,
#                 'total_chunks': len(point_cloud_chunks)
#             })
#         else:
#             emit('error', {'message': 'Failed to retrieve chunk data.'})
#     else:
#         emit('error', {'message': 'Point cloud chunk not found'})


# if __name__ == '__main__':
#     socketio.run(app, host='0.0.0.0', port=5000)



# WORKS PERFECT SENDS ALL PC DATA BUT ONLY ON SCROLLING WE WANT ALL DATA WHENEVER CLEINT CONNECTS
# import os
# import json
# import time
# from flask import Flask
# from flask_socketio import SocketIO, emit

# app = Flask(__name__)
# socketio = SocketIO(app, cors_allowed_origins="*", transports=['websocket'], logger=True, engineio_logger=True)

# # Directory containing point cloud JSON files
# POINT_CLOUD_DIR = '/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/pc_json/'
# CHUNK_SIZE = 1000000000000000 # Number of points to send in each chunk (adjustable)

# def get_point_cloud_files():
#     """ Get a sorted list of JSON files in the point cloud directory. """
#     files = [f for f in os.listdir(POINT_CLOUD_DIR) if f.endswith('.json')]
#     # Sort files by creation time (or modify this as needed)
#     files.sort(key=lambda x: os.path.getctime(os.path.join(POINT_CLOUD_DIR, x)))
#     return [os.path.join(POINT_CLOUD_DIR, f) for f in files]

# def load_point_cloud_chunks(file_path):
#     """ Load point cloud data from a JSON file and yield chunks of points. """
#     try:
#         with open(file_path, 'r') as f:
#             data = json.load(f)  # Load the JSON file
#             if not isinstance(data, list):
#                 print(f"Invalid data format in file: {file_path}. Expected a list of points.")
#                 yield None
            
#             # Yield the points in chunks
#             for i in range(0, len(data), CHUNK_SIZE):
#                 yield data[i:i + CHUNK_SIZE]  # Yield chunks of points

#     except FileNotFoundError:
#         print(f"File not found: {file_path}")
#         yield None
#     except json.JSONDecodeError as e:
#         print(f"Error decoding JSON from {file_path}: {e}")
#         yield None
#     except Exception as e:
#         print(f"An error occurred: {e}")
#         yield None

# @app.route('/')
# def index():
#     return "Point Cloud WebSocket Server is running"

# @socketio.on('connect')
# def handle_connect():
#     print('Client connected')

# @socketio.on('disconnect')
# def handle_disconnect():
#     print('Client disconnected')

# @socketio.on('get_point_cloud')
# def handle_get_point_cloud(data):
#     index = data.get('index', 0)
#     chunk_index = data.get('chunk_index', 0)

#     print(f'Sending chunk {chunk_index} of point cloud for index: {index}')
    
#     point_cloud_files = get_point_cloud_files()  # Get updated list of point cloud files

#     if index < len(point_cloud_files):
#         point_cloud_chunks = list(load_point_cloud_chunks(point_cloud_files[index]))  # Load all chunks
#         # Check if the chunk index is valid
#         if chunk_index < len(point_cloud_chunks):
#             if point_cloud_chunks[chunk_index] is not None:  # Ensure chunk is not None
#                 emit('point_cloud_chunk', {
#                     'chunk': point_cloud_chunks[chunk_index],
#                     'chunk_index': chunk_index,
#                     'total_chunks': len(point_cloud_chunks)
#                 })
#             else:
#                 emit('error', {'message': 'Failed to retrieve chunk data.'})
#         else:
#             emit('error', {'message': 'Point cloud chunk not found'})
#     else:
#         emit('error', {'message': 'Invalid point cloud file index'})

# @socketio.on('get_available_files')
# def handle_get_available_files():
#     """ Send the list of available point cloud files to the client. """
#     point_cloud_files = get_point_cloud_files()
#     emit('available_files', {'files': point_cloud_files})

# if __name__ == '__main__':
#     socketio.run(app, host='0.0.0.0', port=5000)



import os
import json
import time
import base64
from flask import Flask, send_from_directory, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", transports=['websocket'], logger=True, engineio_logger=True)

# Directory containing point cloud JSON files and frames
POINT_CLOUD_DIR = '/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/pc_json/'
FRAME_DIR = '/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/resultimages/'  # Directory where PNG frames are stored

#FRAME_DIR = '/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/Patient_136_Run_2_incremental_batch_v1_working_interval_ALL/Patient_136_Run_2_incremental_batch_v1_working_interval_0/train/ours_3000/gt/'  # Directory where PNG frames are stored
CHUNK_SIZE = 1000000000000000

def get_point_cloud_files():
    files = [f for f in os.listdir(POINT_CLOUD_DIR) if f.endswith('.json')]
    files.sort(key=lambda x: os.path.getctime(os.path.join(POINT_CLOUD_DIR, x)))
    return [os.path.join(POINT_CLOUD_DIR, f) for f in files]

def load_point_cloud_chunks(file_path):
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
            if not isinstance(data, list):
                yield None
            for i in range(0, len(data), CHUNK_SIZE):
                yield data[i:i + CHUNK_SIZE]
    except Exception as e:
        yield None

@app.route('/frames/<filename>')
def serve_frame(filename):
    """Serve frame image from the directory."""
    return send_from_directory(FRAME_DIR, filename)

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('get_point_cloud')
def handle_get_point_cloud(data):
    index = data.get('index', 0)
    chunk_index = data.get('chunk_index', 0)
    point_cloud_files = get_point_cloud_files()

    if index < len(point_cloud_files):
        point_cloud_chunks = list(load_point_cloud_chunks(point_cloud_files[index]))
        if chunk_index < len(point_cloud_chunks):
            if point_cloud_chunks[chunk_index] is not None:
                emit('point_cloud_chunk', {
                    'chunk': point_cloud_chunks[chunk_index],
                    'chunk_index': chunk_index,
                    'total_chunks': len(point_cloud_chunks)
                })
            else:
                emit('error', {'message': 'Failed to retrieve chunk data.'})
        else:
            emit('error', {'message': 'Point cloud chunk not found'})
    else:
        emit('error', {'message': 'Invalid point cloud file index'})

@socketio.on('get_available_files')
def handle_get_available_files():
    point_cloud_files = get_point_cloud_files()
    emit('available_files', {'files': point_cloud_files})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
