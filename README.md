# Real-Time 3D Scene Reconstruction for Minimally Invasive Surgeries

## Project Overview

**Description:**  
This project focuses on developing a real-time 3D scene reconstruction system tailored for minimally invasive surgeries. The goal is to provide enhanced visualization that assists surgeons during complex procedures, overcoming the limitations of current methods, which lack interactivity and real-time capabilities.

Traditional 3D reconstruction methods are typically computationally intensive and require offline post-surgical analysis. These methods also struggle with dynamic camera movements and surgical manipulations common in endoscopic surgeries. To address these limitations, we developed a prototype framework that enables near-real-time reconstruction with surgeon interaction during the procedure.

---

## System Components

1. **Interactive Front-End Interface:**  
   This interface allows surgeons to interact with the 3D reconstruction during surgery, providing real-time feedback and enabling them to monitor the ongoing process.

2. **Incremental Back-End Model Training:**  
   A machine learning model processes incoming data incrementally, continuously refining the 3D reconstruction as new frames or data points become available. This reduces the need for extensive pre-surgery training while maintaining model accuracy.

3. **Periodic Monitoring Unit:**  
   A dedicated monitoring unit periodically synchronizes the front-end and back-end, ensuring the surgeon's interactions and feedback are incorporated into the reconstruction process without delay.

---

## Challenges Solved

- Real-time interaction with 3D scene reconstruction during surgery.
- Handling dynamic endoscopic views caused by camera movements and surgical manipulations.
- Managing the computational demands of real-time processing with incremental model updates.

---

## Future Work

- Extend the prototype into a production-ready system optimized for use in actual surgical environments.
- Improve the system’s robustness and real-time performance, particularly for large-scale surgeries.
- Explore further integration with robotic surgery systems to enhance interactive capabilities.

---

## Key Technologies

- **Machine Learning:** Incremental model training for 3D scene reconstruction.
- **Computer Vision:** Real-time video processing and multimodal image integration.
- **Front-End:** Interactive user interface for surgeons (React, Flask, or other frameworks).
- **Back-End:** Python-based machine learning pipeline (PyTorch, OpenCV, etc.).

---

## 🚀 Installation and Setup Guide

This guide will help you set up the **Real-Time 3D Scene Reconstruction for Minimally Invasive Surgeries** project on your local machine, covering both the back-end (Python) and front-end (React) components.

### Prerequisites

Ensure the following software is installed on your system:

- **Python 3.8+**
- **Node.js 16+**
- **Conda** (if you are using Anaconda for environment management)
- **Git** (to clone the repository)
- **CUDA 11.8+** (for GPU support, if needed)

---

### Clone the Repository

```bash
git clone https://github.com/your-username/3d-scene-reconstruction.git
cd 3d-scene-reconstruction
```

---

## Backend Setup (Python)

### Step 1: Set up a Conda Environment

Create and activate a new Conda environment:

```bash
conda env create -f environment.yml
conda activate your_environment_name
```

This will install all the necessary Python packages and dependencies for the project.

### Step 2: Install Additional Python Dependencies

If there’s a `requirements.txt` file, install any additional dependencies:

```bash
pip install -r requirements.txt
```

### Step 3: Verify CUDA for GPU (Optional)

To ensure PyTorch is utilizing CUDA, verify that your setup detects your GPU:

```python
import torch
print(torch.cuda.is_available())  # Should return True if CUDA is enabled
```

---

## Frontend Setup (React)

The front-end is built using React. You need to install the required Node.js packages.

### Step 1: Navigate to the Frontend Directory

Move into the `frontend` folder (or whichever directory contains the React app):

```bash
cd frontend
```

### Step 2: Install Node.js Dependencies

Install the required dependencies from `package.json`:

```bash
npm install
```

### Step 3: Run the Development Server

To start the React development server:

```bash
npm start
```

This will start the development server, and you can access the app by navigating to [http://localhost:3000](http://localhost:3000) in your browser.

---

## Running the Application

Once both the back-end and front-end are set up:

1. Start the back-end by running the Python script (e.g., `main.py`):

    ```bash
    python main.py --input path/to/input_video.mp4 --output path/to/output_folder --batch-size 32
    ```

2. Run the front-end using `npm start` in the `/frontend` directory:

    ```bash
    npm start
    ```

The front-end should open in your default browser at `http://localhost:3000`, and the back-end will process your input video for 3D reconstruction.

---

## Key Technologies

- **Machine Learning:** Incremental model training for 3D scene reconstruction.
- **Computer Vision:** Real-time video processing and multimodal image integration.
- **Front-End:** Interactive user interface for surgeons (React/Flask/Other Frameworks).
- **Back-End:** Python-based machine learning pipeline (PyTorch, OpenCV, etc.).

---

## Keywords

- Endoscopic surgery
- 3D scene reconstruction
- Real-time processing
- Incremental learning
- Multimodal image data
- Interactive visualization

