from PIL import Image
import os

def resize_images(folder_path, output_folder, new_width):
    # Ensure the folder path exists
    if not os.path.exists(folder_path):
        print("The provided folder path does not exist.")
        return

    # Create output directory if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # List all files in the directory
    files = os.listdir(folder_path)

    # Filter for image files
    image_files = [file for file in files if file.lower().endswith(('jpg', 'jpeg', 'png', 'bmp', 'gif'))]

    if not image_files:
        print("No image files found in the provided folder.")
        return

    for image_file in image_files:
        # Construct full file path
        img_path = os.path.join(folder_path, image_file)
        
        # Open the image
        with Image.open(img_path) as img:
            # Calculate new height to maintain aspect ratio
            aspect_ratio = img.height / img.width
            new_height = int(new_width * aspect_ratio)
            
            # Resize the image
            resized_img = img.resize((new_width, new_height), Image.LANCZOS)

            # Construct output file path
            output_path = os.path.join(output_folder, image_file)

            # Save the resized image
            resized_img.save(output_path)

            print(f"Resized {image_file} to {new_width}x{new_height} pixels.")

    print("Image resizing completed.")

# Example usage
folder_path = "E:/Vid/Videoprocessing&Segmentation/Annotation/Inference/Frames_dataset/Patient_144_Run_2_Frames/masks"
output_folder = "E:/Vid/Videoprocessing&Segmentation/Annotation/Inference/Frames_dataset/Patient_144_Run_2_Frames/masks2"
new_width = 640 # Change this to your desired width

# Call the function
resize_images(folder_path, output_folder, new_width)
