import os
import numpy as np
from PIL import Image

# Function to generate the numpy array
def generate_numpy_array(image_folder_path):
    # Get all image files in the directory (you can filter by file extension if needed)
    image_files = [f for f in os.listdir(image_folder_path) if f.endswith(('.jpg', '.png', '.jpeg'))]

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

# Example usage
image_folder_path = '/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/data/endonerf/Patient_144_Run_2_Frames_pipeline_2/images'  # Set your image folder path here
print(f"Image folder path: {image_folder_path}")
numpy_array = generate_numpy_array(image_folder_path)

# Define the output path to save the numpy array one directory above the images folder
parent_directory = os.path.dirname(image_folder_path)  # This gets the immediate parent directory of the images folder
output_path = os.path.join(parent_directory, 'poses_bounds.npy')

print(f"Saving numpy array to: {output_path}")

# Save the numpy array to a file
np.save(output_path, numpy_array)

# Print a message confirming the file has been saved
print(f'NumPy array saved to {output_path}')
