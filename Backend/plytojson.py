import json
import sys
from plyfile import PlyData
import numpy as np


def ply_to_json(ply_file_path, json_file_path):
    # Load the PLY file
    ply_data = PlyData.read(ply_file_path)

    # Access the 'vertex' element directly
    vertices = ply_data['vertex'].data

    # Print available attributes for debugging
    print("Available vertex properties:", vertices.dtype.names)

    points = []

    # Extract vertex data
    for vertex in vertices:
        point = {
            'x': float(vertex['x']),
            'y': float(vertex['y']),
            'z': float(vertex['z'])
        }

        # Check for color attributes (red, green, blue)
        if 'red' in vertices.dtype.names and 'green' in vertices.dtype.names and 'blue' in vertices.dtype.names:
            point['color'] = {
                'r': int(vertex['red']),  # Cast to Python int
                'g': int(vertex['green']),  # Cast to Python int
                'b': int(vertex['blue'])  # Cast to Python int
            }

        points.append(point)

    # Write to a JSON file
    with open(json_file_path, 'w') as json_file:
        json.dump(points, json_file, indent=4)

    print(f"PLY file converted to JSON and saved at {json_file_path}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python convert_ply_to_json.py <input_ply_file> <output_json_file>")
        sys.exit(1)

    input_ply_file = sys.argv[1]
    output_json_file = sys.argv[2]

    ply_to_json(input_ply_file, output_json_file)
