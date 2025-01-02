#!/bin/bash

# Set the parent path to monitor for new folders
PARENT_PATH="/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/data/endonerf/Realtimedata/data"
EXPERIMENT_NAME="Patient_136_Run_2_final_results_for_paper_11_10"
CONFIGS_PATH="arguments/endonerf.py"
PYTHON_PATH="."
SCRIPT="train_new.py"
PORT="6017"

# Initialize the start checkpoint variable (empty at the start)
START_CHECKPOINT=""
# Initialize a list to keep track of completed folders
COMPLETED_FOLDERS=()
# Initialize the data number
DATA_NUMBER=1

# Function to handle graceful shutdown when the user presses Ctrl+C
handle_shutdown() {
    echo -e "\n*** Script interrupted. Exiting gracefully... ***"
    exit 0
}

# Trap the SIGINT (Ctrl+C) signal and call the handle_shutdown function
trap handle_shutdown SIGINT

# Function to train on the specified folder
train_on_folder() {
    local folder_name="$1"
    local base_path="$PARENT_PATH/$folder_name"

    # Construct the absolute output directory path
    local output_dir="/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${EXPERIMENT_NAME}_2/data_${folder_name}"

    echo "--------------------------------------------------"
    echo "Starting training on dataset folder: $folder_name"
    echo "Dataset path: $base_path"
    echo "Output directory: $output_dir"
    echo "Using checkpoint: $START_CHECKPOINT"
    echo "--------------------------------------------------"

    # Construct the command with or without the checkpoint argument
    if [ -z "$START_CHECKPOINT" ]; then
        CMD="PYTHONPATH='$PYTHON_PATH' python $SCRIPT -s $base_path --port $PORT --expname $output_dir --configs $CONFIGS_PATH"
    else
        CMD="PYTHONPATH='$PYTHON_PATH' python $SCRIPT -s $base_path --port $PORT --expname $output_dir --configs $CONFIGS_PATH --start_checkpoint $START_CHECKPOINT"
    fi

    echo "Running command: $CMD"
    eval $CMD

    # Update the checkpoint directory to use the output directory of the current run
    START_CHECKPOINT="$output_dir"  # Update to point to the last completed output
    COMPLETED_FOLDERS+=("$folder_name")  # Mark this folder as completed

    echo "Training on dataset folder $folder_name completed."
    echo "Checkpoint saved to: $START_CHECKPOINT"
    echo "--------------------------------------------------"

    # Start the rendering and evaluation in the background after training completes
    run_render_eval "$START_CHECKPOINT" "$DATA_NUMBER" &  # Ensure to pass the correct checkpoint path
}

# Function to handle the rendering and evaluation process
run_render_eval() {
    local model_path="$1"
    local data_number="$2"
    local json_destination="/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/pc_json"  # Specify your JSON destination here
    local results_destination="/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/resultsjson"  # Specify your results destination here

    echo "--------------------------------------------------"
    echo "Starting the render and evaluation phase for model: $model_path"
    echo "--------------------------------------------------"

    # Run the render and eval script, passing the necessary arguments
    sh render_eval.sh "$model_path" "$json_destination" "$results_destination" "$data_number"

    if [ $? -eq 0 ]; then
        echo "Render and evaluation phase for model $model_path completed successfully!"
    else
        echo "Render and evaluation phase for model $model_path failed."
    fi

    echo "--------------------------------------------------"
}

# Wait for the first folder to appear if no data folders are initially present
echo "Checking for initial datasets in: $PARENT_PATH"
while true; do
    FOLDERS=($(ls -d ${PARENT_PATH}/[0-9]*/ 2>/dev/null | sort -V))  # Look for folders named 1, 2, 3, ...

    if [ ${#FOLDERS[@]} -eq 0 ]; then
        echo "No dataset folders found yet. Waiting for new datasets to be added... Press Ctrl+C to stop the script."
        sleep 5  # Wait before checking again
        continue  # Restart the loop to keep checking
    else
        echo "Found initial dataset folders. Starting training..."
        break  # Exit the loop and proceed to training
    fi
done

# Process each folder in the order they are found
for FOLDER_PATH in "${FOLDERS[@]}"; do
    FOLDER_NAME=$(basename "$FOLDER_PATH")

    # Check if the folder has already been processed
    if [[ ! " ${COMPLETED_FOLDERS[@]} " =~ " ${FOLDER_NAME} " ]]; then
        echo "Starting training process on dataset $FOLDER_NAME..."

        # Train on the new folder
        train_on_folder "$FOLDER_NAME"
    fi
done

# Monitor for new folders indefinitely after initial datasets are processed
while true; do
    echo "Checking for new datasets in: $PARENT_PATH"
    
    # Find all subdirectories in the parent path and sort them numerically
    FOLDERS=($(ls -d ${PARENT_PATH}/[0-9]*/ | sort -V))  # Only folders named 1, 2, 3, ...

    for FOLDER_PATH in "${FOLDERS[@]}"; do
        FOLDER_NAME=$(basename "$FOLDER_PATH")

        # Check if the folder has already been processed
        if [[ ! " ${COMPLETED_FOLDERS[@]} " =~ " ${FOLDER_NAME} " ]]; then
            echo "New dataset detected: $FOLDER_NAME"
            echo "Starting training process on dataset $FOLDER_NAME..."
            
            # Increment DATA_NUMBER for each new folder
            DATA_NUMBER=$((DATA_NUMBER + 1))

            # Train on the new folder
            train_on_folder "$FOLDER_NAME"
        fi
    done

    # Wait for a short period before checking for new folders (e.g., 1 minute)
    echo "Waiting for new datasets to be added... Press Ctrl+C to stop the script."
    sleep 5
done
