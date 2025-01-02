# #!/bin/bash

# # Check for maximum batch number argument
# if [ $# -ne 1 ]; then
#     echo "Usage: $0 <max_batch_number>"
#     exit 1
# fi

# # Base variables
# BASE_DIR="/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/data/endonerf/Patient_144_Run_2_Frames"
# PORT=6017
# CONFIGS="arguments/endonerf.py"

# # Maximum batch number from command-line argument
# MAX_BATCH_NUMBER=$1

# # Loop over batch numbers
# for BATCH_NUMBER in $(seq 0 "$MAX_BATCH_NUMBER"); do
#     # Set experiment name based on the batch number
#     EXP_NAME="Patient_144_Run_2_incremental_batch_v6_${BATCH_NUMBER}"

#     # Check if it's the first batch
#     if [ "$BATCH_NUMBER" -eq 0 ]; then
#         CHECKPOINT=""
#     else
#         # Use the previous batch's expname as the checkpoint
#         #CHECKPOINT="--start_checkpoint ${PREV_EXP_NAME}"
#         CHECKPOINT=""
#     fi

#     # Run the training command in the background
#     CUDA_LAUNCH_BLOCKING=1 PYTHONPATH='.' python train_new.py \
#         -s "$BASE_DIR" \
#         --port "$PORT" \
#         --expname "$EXP_NAME" \
#         --configs "$CONFIGS" \
#         --batch_number "$BATCH_NUMBER" \
#         $CHECKPOINT &

#     # Store the current expname for the next iteration
#     PREV_EXP_NAME="$EXP_NAME"

#     # Wait for the current training process to finish
#     wait $!
# done


# #!/bin/bash

# # Check for maximum and starting batch number arguments
# if [ $# -ne 2 ]; then
#     echo "Usage: $0 <max_batch_number> <start_batch_number>"
#     exit 1
# fi

# # Base variables
# BASE_DIR="/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/data/endonerf/Patient_144_Run_2_Frames"
# PORT=6017
# CONFIGS="arguments/endonerf.py"

# # Maximum and starting batch numbers from command-line arguments
# MAX_BATCH_NUMBER=$1
# START_BATCH_NUMBER=$2

# # Loop over batch numbers starting from START_BATCH_NUMBER
# for BATCH_NUMBER in $(seq "$START_BATCH_NUMBER" "$MAX_BATCH_NUMBER"); do
#     # Set experiment name based on the batch number
#     EXP_NAME="Patient_144_Run_2_incremental_batch_v5_${BATCH_NUMBER}"

#     # Check if it's the first batch
#     if [ "$BATCH_NUMBER" -eq 0 ]; then
#         CHECKPOINT=""
#     else
#         # Use the previous batch's expname as the checkpoint
#         #CHECKPOINT="--start_checkpoint ${PREV_EXP_NAME}"
#         CHECKPOINT=""
#     fi

#     # Run the training command
#     CUDA_LAUNCH_BLOCKING=1 PYTHONPATH='.' python train_new.py \
#         -s "$BASE_DIR" \
#         --port "$PORT" \
#         --expname "$EXP_NAME" \
#         --configs "$CONFIGS" \
#         --batch_number "$BATCH_NUMBER" \
#         $CHECKPOINT &

#     # Store the current expname for the next iteration
#     PREV_EXP_NAME="$EXP_NAME"

#     # Wait for the current training process to finish
#     wait $!
# done



# #!/bin/bash

# # Check for maximum batch number argument
# if [ $# -ne 1 ]; then
#     echo "Usage: $0 <max_batch_number>"
#     exit 1
# fi

# # Base variables
# BASE_DIR="/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/data/endonerf/Patient_144_Run_2_Frames_pipeline"
# PORT=6017
# CONFIGS="arguments/endonerf.py"

# # Maximum batch number from command-line argument
# MAX_BATCH_NUMBER=$1

# # Initialize the previous experiment name variable
# PREV_EXP_NAME=""

# # Loop over batch numbers
# for BATCH_NUMBER in $(seq 0 "$MAX_BATCH_NUMBER"); do
#     # Set experiment name based on the batch number
#     EXP_NAME="Patient_144_Run_2_Frames_incremental_pipeline_2222_${BATCH_NUMBER}"

#     # Check if it's the first batch
#     if [ "$BATCH_NUMBER" -eq 0 ]; then
#         CHECKPOINT=""
#     else
#         # Use the previous batch's expname as the checkpoint
#         CHECKPOINT="--start_checkpoint ${PREV_EXP_NAME}"
#     fi

#     # Run the training command in the background
#     CUDA_LAUNCH_BLOCKING=1 PYTHONPATH='.' python train_new.py \
#         --source_path "$BASE_DIR" \
#         --port "$PORT" \
#         --expname "$EXP_NAME" \
#         --configs "$CONFIGS" \
#         --batch_number "$BATCH_NUMBER" \
#         $CHECKPOINT

#     # Wait for the training process to finish
#     wait $!

#     # Run render.py after training is complete
#     python render.py --model_path "/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${EXP_NAME}" \
#     --skip_video --configs "$CONFIGS" --batch_number "$BATCH_NUMBER"

#     # Wait for render.py to complete
#     wait $!

#     # Run metrics.py after rendering is complete
#     python metrics.py --model_path "/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${EXP_NAME}"

#     # Wait for metrics.py to complete
#     wait $!

#     # Store the current expname for the next iteration
#     PREV_EXP_NAME="$EXP_NAME"
# done


# #!/bin/bash

# # Check for maximum batch number argument
# if [ $# -ne 1 ]; then
#     echo "Usage: $0 <max_batch_number>"
#     exit 1
# fi

# # Base variables
# BASE_DIR="/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/data/endonerf/Patient_144_Run_2_Frames_pipeline"
# PORT=6017
# INITIAL_CONFIGS="arguments/endonerf.py"
# INCREMENTAL_CONFIGS="arguments/endonerf2.py"  # New config for non-initial batches

# # Maximum batch number from command-line argument
# MAX_BATCH_NUMBER=$1

# # Initialize the previous experiment name variable
# PREV_EXP_NAME=""

# # Loop over batch numbers
# for BATCH_NUMBER in $(seq 0 "$MAX_BATCH_NUMBER"); do
#     # Set experiment name based on the batch number
#     EXP_NAME="Patient_144_Run_2_Frames_incremental_pipeline_2222_${BATCH_NUMBER}"

#     # Choose the config file based on the batch number
#     if [ "$BATCH_NUMBER" -eq 0 ]; then
#         CONFIGS="$INITIAL_CONFIGS"  # Use the initial config for the first batch
#         CHECKPOINT=""
#     else
#         CONFIGS="$INCREMENTAL_CONFIGS"  # Use the incremental config for subsequent batches
#         CHECKPOINT="--start_checkpoint ${PREV_EXP_NAME}"

#         # Step 1: Render and evaluate using the previous checkpoint
#         echo "Rendering and evaluating using checkpoint from ${PREV_EXP_NAME}"
#         python render.py --model_path "/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${PREV_EXP_NAME}" \
#         --skip_video --configs "$CONFIGS" --batch_number "$BATCH_NUMBER"
        
#         wait $!
        
#         python metrics.py --model_path "/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${PREV_EXP_NAME}"
        
#         wait $!
#     fi

#     # Step 2: Train the current batch
#     echo "Starting training for batch ${BATCH_NUMBER}"
#     CUDA_LAUNCH_BLOCKING=1 PYTHONPATH='.' python train_new.py \
#         --source_path "$BASE_DIR" \
#         --port "$PORT" \
#         --expname "$EXP_NAME" \
#         --configs "$CONFIGS" \
#         --batch_number "$BATCH_NUMBER" \
#         $CHECKPOINT

#     wait $!

#     # Step 3: Render and evaluate after training is complete
#     echo "Rendering and evaluating for trained model: ${EXP_NAME}"
#     python render.py --model_path "/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${EXP_NAME}" \
#     --skip_video --configs "$CONFIGS" --batch_number "$BATCH_NUMBER"

#     wait $!

#     python metrics.py --model_path "/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${EXP_NAME}"

#     wait $!

#     # Store the current expname for the next iteration
#     PREV_EXP_NAME="$EXP_NAME"
# done



# #!/bin/bash

# # Check for maximum batch number argument
# if [ $# -ne 1 ]; then
#     echo "Usage: $0 <max_batch_number>"
#     exit 1
# fi

# # Base variables
# BASE_DIR="/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/data/endonerf/Patient_144_Run_2_Frames_pipeline"
# PORT=6017
# INITIAL_CONFIGS="arguments/endonerf.py"
# INCREMENTAL_CONFIGS="arguments/endonerf2.py"
# RESULTS_DIR="/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/resultsjson"  # Folder to store sequential results.json files

# # Ensure the results directory exists
# mkdir -p "$RESULTS_DIR"

# # Maximum batch number from command-line argument
# MAX_BATCH_NUMBER=$1

# # Initialize the previous experiment name variable
# PREV_EXP_NAME=""

# # Loop over batch numbers
# for BATCH_NUMBER in $(seq 0 "$MAX_BATCH_NUMBER"); do
#     # Set experiment name based on the batch number
#     EXP_NAME="Patient_144_Run_2_Frames_incremental_pipeline_${BATCH_NUMBER}"

#     # Choose the config file based on the batch number
#     if [ "$BATCH_NUMBER" -eq 0 ]; then
#         CONFIGS="$INITIAL_CONFIGS"  # Use the initial config for the first batch
#         CHECKPOINT=""
#     else
#         CONFIGS="$INCREMENTAL_CONFIGS"  # Use the incremental config for subsequent batches
#         CHECKPOINT="--start_checkpoint ${PREV_EXP_NAME}"

#         # Step 1: Render and evaluate using the previous checkpoint
#         echo "Rendering and evaluating using checkpoint from ${PREV_EXP_NAME}"
#         python render.py --model_path "/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${PREV_EXP_NAME}" \
#         --skip_video --configs "$CONFIGS" --batch_number "$BATCH_NUMBER"

#         wait $!

#         python metrics.py --model_path "/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${PREV_EXP_NAME}"

#         # Move the results.json file from the output directory to the results folder
#         if [ -f "/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${PREV_EXP_NAME}/results.json" ]; then
#             mv "/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${PREV_EXP_NAME}/results.json" \
#                "${RESULTS_DIR}/results_batch_${BATCH_NUMBER}_apre.json"
#         fi

#         wait $!
#     fi

#     # Step 2: Train the current batch
#     echo "Starting training for batch ${BATCH_NUMBER}"
#     CUDA_LAUNCH_BLOCKING=1 PYTHONPATH='.' python train_new.py \
#         --source_path "$BASE_DIR" \
#         --port "$PORT" \
#         --expname "$EXP_NAME" \
#         --configs "$CONFIGS" \
#         --batch_number "$BATCH_NUMBER" \
#         $CHECKPOINT

#     wait $!

#     # Step 3: Render and evaluate after training is complete
#     echo "Rendering and evaluating for trained model: ${EXP_NAME}"
#     python render.py --model_path "/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${EXP_NAME}" \
#     --skip_video --configs "$CONFIGS" --batch_number "$BATCH_NUMBER"

#     wait $!

#     python metrics.py --model_path "/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${EXP_NAME}"

#     # Move the results.json file from the output directory to the results folder
#     if [ -f "/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${EXP_NAME}/results.json" ]; then
#         mv "/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${EXP_NAME}/results.json" \
#            "${RESULTS_DIR}/results_batch_${BATCH_NUMBER}_post.json"
#     fi

#     wait $!

#     # Store the current expname for the next iteration
#     PREV_EXP_NAME="$EXP_NAME"
# done



#!/bin/bash

# Check for maximum batch number argument
if [ $# -ne 1 ]; then
    echo "Usage: $0 <max_batch_number>"
    exit 1
fi

# Base variables
BASE_DIR="/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/data/endonerf/Patient_144_Run_2_Frames_pipeline_3"
PORT=6017
INITIAL_CONFIGS="arguments/endonerf.py"
INCREMENTAL_CONFIGS="arguments/endonerf.py"
RESULTS_DIR="/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/resultsjson"  # Folder to store sequential results.json files
JSON_DESTINATION_DIR="/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/pc_json"  # Folder to store converted JSON files
DATA_NUMBER=1  # Initialize data number for JSON naming

# Ensure the results and JSON destination directories exist
mkdir -p "$RESULTS_DIR"
mkdir -p "$JSON_DESTINATION_DIR"

# Maximum batch number from command-line argument
MAX_BATCH_NUMBER=$1

# Initialize the previous experiment name variable
PREV_EXP_NAME=""

# Loop over batch numbers
for BATCH_NUMBER in $(seq 0 "$MAX_BATCH_NUMBER"); do
    # Set experiment name based on the batch number
    EXP_NAME="Patient_144_Run_2_Frames_incremental_pipeline_4444_${BATCH_NUMBER}"

    # Choose the config file based on the batch number
    if [ "$BATCH_NUMBER" -eq 0 ]; then
        CONFIGS="$INITIAL_CONFIGS"  # Use the initial config for the first batch
        CHECKPOINT=""
    else
        CONFIGS="$INCREMENTAL_CONFIGS"  # Use the incremental config for subsequent batches
        CHECKPOINT="--start_checkpoint ${PREV_EXP_NAME}"

        # Step 1: Render and evaluate using the previous checkpoint
        echo "Rendering and evaluating using checkpoint from ${PREV_EXP_NAME}"
        python render.py --model_path "/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${PREV_EXP_NAME}" \
        --skip_video --configs "$CONFIGS" --batch_number "$BATCH_NUMBER" 

        wait $!

        python metrics.py --model_path "/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${PREV_EXP_NAME}"

        wait $!
        
        # Debugging check: See if results.json exists after metrics
        TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
        if [ -f "/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${PREV_EXP_NAME}/results.json" ]; then
            echo "results.json found. Moving to ${RESULTS_DIR}/results_${TIMESTAMP}_pre.json"
            if mv "/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${PREV_EXP_NAME}/results.json" \
                   "${RESULTS_DIR}/results_${TIMESTAMP}_pre.json"; then
                echo "results.json moved successfully."
            else
                echo "Failed to move results.json."
            fi
        else
            echo "Error: results.json not found in /opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${PREV_EXP_NAME}"
        fi

        wait $!
    fi

    # Step 4: Train the current batch
    echo "Starting training for batch ${BATCH_NUMBER}"
    CUDA_LAUNCH_BLOCKING=1 PYTHONPATH='.' python train_new.py \
        --source_path "$BASE_DIR" \
        --port "$PORT" \
        --expname "$EXP_NAME" \
        --configs "$CONFIGS" \
        --batch_number "$BATCH_NUMBER" \
        $CHECKPOINT

    wait $!

    # Step 5: Render and evaluate after training is complete
    echo "Rendering and evaluating for trained model: ${EXP_NAME}"
    python render.py --model_path "/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${EXP_NAME}" \
    --skip_video --configs "$CONFIGS" --batch_number "$BATCH_NUMBER" --pc

    wait $!

    python metrics.py --model_path "/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${EXP_NAME}"

    # Move the results.json file from the output directory to the results folder with timestamp naming
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    if [ -f "/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${EXP_NAME}/results.json" ]; then
        echo "results.json found. Moving to ${RESULTS_DIR}/results_${TIMESTAMP}_post.json"
        if mv "/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${EXP_NAME}/results.json" \
               "${RESULTS_DIR}/results_${TIMESTAMP}_post.json"; then
            echo "results.json moved successfully."
        else
            echo "Failed to move results.json."
        fi
    else
        echo "Error: results.json not found in /opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${EXP_NAME}"
    fi

    wait $!

    # Step 6: Ensure the necessary outputs from the render phase are present
    RENDER_OUTPUT_DIR_3000="/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/${EXP_NAME}/train/ours_3000/pcd"

    # Check if the render output directory exists
    if [ -d "$RENDER_OUTPUT_DIR_3000" ]; then
        RENDER_OUTPUT_DIR="$RENDER_OUTPUT_DIR_3000"
    else
        echo "Render output directory not found at $RENDER_OUTPUT_DIR_3000."
        exit 1
    fi

    # Step 7: Convert each PLY file to JSON format with a data number
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

    # Increment the data number for the next set of files
    DATA_NUMBER=$((DATA_NUMBER + 1))

    # Store the current expname for the next iteration
    PREV_EXP_NAME="$EXP_NAME"

done
