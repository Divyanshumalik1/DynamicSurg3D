# #!/bin/bash

# # Check if the model path argument is provided
# if [ -z "$1" ]; then
#     echo "Error: No model path provided. Please provide the model path as an argument."
#     echo "Usage: sh render_eval.sh /path/to/model"
#     exit 1
# fi

# # Assign the model path from the command-line argument
# MODEL_PATH="$1"

# # Step 1: Execute the render phase
# echo "Starting the render phase with model path: $MODEL_PATH"
# python render.py --model_path "$MODEL_PATH" --skip_train --skip_test --pc --configs arguments/endonerf.py

# # Check if render completed successfully
# if [ $? -ne 0 ]; then
#     echo "Render phase failed. Exiting..."
#     exit 1
# fi

# # Step 2: Ensure that the necessary outputs from the render phase are present
# RENDER_OUTPUT_DIR="$MODEL_PATH/point_cloud"
# if [ ! -d "$RENDER_OUTPUT_DIR" ]; then
#     echo "Render output directory not found at $RENDER_OUTPUT_DIR. Make sure the render phase generated the required data."
#     exit 1
# fi

# # Step 3: Proceed to the evaluation phase
# echo "Render phase completed successfully. Starting the evaluation phase with model path: $MODEL_PATH"
# python metrics.py --model_path "$MODEL_PATH" 

# # Check if eval completed successfully
# if [ $? -ne 0 ]; then
#     echo "Evaluation phase failed."
#     exit 1
# fi

# echo "Evaluation phase completed successfully!"

#!/bin/bash

# Check if the model path argument is provided
if [ -z "$1" ]; then
    echo "Error: No model path provided. Please provide the model path as an argument."
    echo "Usage: sh render_eval.sh /path/to/model /path/to/json_destination /path/to/results_destination /path/to/data_number"
    exit 1
fi

# Check if the JSON destination directory argument is provided
if [ -z "$2" ]; then
    echo "Error: No JSON destination directory provided. Please provide the JSON destination directory as an argument."
    echo "Usage: sh render_eval.sh /path/to/model /path/to/json_destination /path/to/results_destination /path/to/data_number"
    exit 1
fi

# Check if the results destination directory argument is provided
if [ -z "$3" ]; then
    echo "Error: No results destination directory provided. Please provide the results destination directory as an argument."
    echo "Usage: sh render_eval.sh /path/to/model /path/to/json_destination /path/to/results_destination /path/to/data_number"
    exit 1
fi

# Check if the data number argument is provided
if [ -z "$4" ]; then
    echo "Error: No data number provided. Please provide the data number as an argument."
    echo "Usage: sh render_eval.sh /path/to/model /path/to/json_destination /path/to/results_destination /path/to/data_number"
    exit 1
fi

# Assign the model path, destination directories, and data number from the command-line arguments
MODEL_PATH="$1"
JSON_DESTINATION_DIR="$2"
RESULTS_DESTINATION_DIR="$3"
DATA_NUMBER="$4"

# Step 1: Execute the render phase
echo "Starting the render phase with model path: $MODEL_PATH"
python render.py --model_path "$MODEL_PATH" --pc --configs arguments/endonerf.py

# Check if render completed successfully
if [ $? -ne 0 ]; then
    echo "Render phase failed. Exiting..."
    exit 1
fi

# Step 2: Ensure that the necessary outputs from the render phase are present
RENDER_OUTPUT_DIR="$MODEL_PATH/video/ours_3000/pcd"
if [ ! -d "$RENDER_OUTPUT_DIR" ]; then
    echo "Render output directory not found at $RENDER_OUTPUT_DIR. Make sure the render phase generated the required data."
    exit 1
fi

# Step 3: Convert each PLY file to JSON format with a data number
echo "Converting PLY files to JSON format..."
for ply_file in "$RENDER_OUTPUT_DIR"/*.ply; do
    if [ -f "$ply_file" ]; then
        # Generate the JSON filename with the data number
        base_name=$(basename "$ply_file" .ply)  # Get the base filename without the extension
        json_file="${base_name}_data${DATA_NUMBER}.json"  # Add the data number to the filename
        python plytojson.py "$ply_file" "$json_file"
        
        if [ $? -ne 0 ]; then
            echo "Conversion of $ply_file to JSON failed. Exiting..."
            exit 1
        fi
        
        # Move JSON to the specified destination with the data number in the filename
        mv "$json_file" "$JSON_DESTINATION_DIR"
    fi
done

# Step 4: Proceed to the evaluation phase
echo "Render phase and conversion completed successfully. Starting the evaluation phase with model path: $MODEL_PATH"
python metrics.py --model_path "$MODEL_PATH"

# Check if eval completed successfully
if [ $? -ne 0 ]; then
    echo "Evaluation phase failed."
    exit 1
fi

# Step 5: Move the metrics file to the results destination directory
echo "Moving metrics file to results destination directory: $RESULTS_DESTINATION_DIR"
METRICS_FILE="$MODEL_PATH/results.json"
if [ -f "$METRICS_FILE" ]; then
    # Generate a unique filename for the results.json
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    cp "$METRICS_FILE" "$RESULTS_DESTINATION_DIR/results_${TIMESTAMP}.json"
else
    echo "Metrics file not found at $METRICS_FILE. Skipping metrics move."
fi

echo "Files successfully moved to $JSON_DESTINATION_DIR and $RESULTS_DESTINATION_DIR."
echo "Evaluation phase completed successfully!"
