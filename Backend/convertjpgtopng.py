import os
from PIL import Image

def convert_jpg_to_png(folder_path):
    # Ensure the folder path exists
    if not os.path.exists(folder_path):
        print("The provided folder path does not exist.")
        return

    # List all files in the directory
    files = os.listdir(folder_path)

    # Filter for JPG files
    jpg_files = [file for file in files if file.lower().endswith('.jpg')]

    if not jpg_files:
        print("No JPG files found in the provided folder.")
        return

    # Convert each JPG file to PNG
    for jpg_file in jpg_files:
        # Construct full file path
        jpg_path = os.path.join(folder_path, jpg_file)
        
        # Open the image
        img = Image.open(jpg_path)

        # Remove the '.jpg' extension and add '.png'
        png_file = os.path.splitext(jpg_file)[0] + '.png'
        png_path = os.path.join(folder_path, png_file)

        # Save the image in PNG format
        img.save(png_path, 'PNG')

        print(f"Converted {jpg_file} to {png_file}")

    print("Conversion completed.")

# Specify the folder containing JPG files
folder_path = "E:/Vid/Videoprocessing&Segmentation/Annotation/Inference/Frames_dataset/Patient_144_Run_2_Frames/images"

# Call the function
convert_jpg_to_png(folder_path)
