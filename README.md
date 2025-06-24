# YOLOv8 Logo Detection for Robocon 2025

This repository contains an end-to-end computer vision pipeline for detecting the official **Robocon 2025 logo** using the **YOLOv8** object detection model. The project is designed to provide a robust visual recognition system for a competition robot, enabling it to identify the target logo in various environments.

The entire workflow, from data preparation to model training and inference, is implemented in a Google Colab notebook, leveraging GPU acceleration for efficiency.

[![Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/Garvit-Pahwa-03/Logo-Detection/blob/main/Logodetection.ipynb)
[![Framework](https://img.shields.io/badge/YOLO-v8-blueviolet)](https://github.com/ultralytics/ultralytics)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 1. Problem Statement

**Can we build a real-time, accurate model to detect the Robocon 2025 logo in images and video streams?**

This project addresses a critical challenge in robotics competitions: enabling a robot to visually identify key objects. An effective logo detector can be used for navigation, task validation, and interaction with competition elements.

---

## 2. Dataset

The dataset used for this project is custom-built and curated to simulate real-world conditions.

-   **Source**: The dataset was created by capturing images of a workspace and digitally augmenting them with the Robocon 2025 logo. This approach allows for a diverse set of backgrounds, lighting conditions, and logo positions.
-   **Annotations**: Each image is paired with a `.txt` label file in YOLO format, containing the class ID and bounding box coordinates for each logo instance.
-   **Structure**: The dataset is provided as two separate zip files:
    -   `images.zip`: Contains all image files (`.jpg`).
    -   `labels.zip`: Contains the corresponding annotation files (`.txt`).

---

## 3. Project Pipeline

This project follows a standard computer vision workflow, structured for clarity and reproducibility:

1.  **Environment Setup**: Installing `ultralytics` and other dependencies in a GPU-enabled environment.
2.  **Data Preparation**:
    -   Unzipping the raw image and label files.
    -   Splitting the data automatically into training (80%) and testing (20%) sets.
3.  **Configuration**: Creating a `data.yaml` file to define dataset paths and class names for YOLOv8.
4.  **Model Training**:
    -   Using transfer learning by starting with the pre-trained `yolov8s.pt` weights.
    -   Training the model on the custom logo dataset for 150 epochs.
5.  **Inference and Evaluation**:
    -   Running the trained model on the unseen test images to evaluate its performance.
    -   Visualizing the detection results with bounding boxes.

---

## 4. Key Features & Results

-   **State-of-the-Art Model**: Leverages the speed and accuracy of **YOLOv8s** from Ultralytics.
-   **Custom Training Pipeline**: A complete, end-to-end script for training on any custom object detection dataset.
-   **Reproducible Environment**: The `Logodetection.ipynb` notebook is fully configured to run on Google Colab, ensuring easy reproduction of results.
-   **High Performance**: The model is trained to be robust and can be deployed for real-time detection tasks on a competition robot.

#### Example Detection:
![Robocon Logo Detection Example](Logo%20detection%20example.jpg)

---

## 5. Tech Stack

-   **Python**
-   **Jupyter Notebook** (Google Colab)
-   **PyTorch**
-   **Ultralytics YOLOv8**
-   **CUDA** (for GPU acceleration)
-   Standard libraries: `pathlib`, `os`, `shutil`, `glob`

---

## 6. How to Run

The easiest way to get started is by using the Google Colab notebook.

1.  **Open in Colab**:
    <a href="https://colab.research.google.com/github/Garvit-Pahwa-03/Logo-Detection/blob/main/Logodetection.ipynb" target="_parent"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/></a>

2.  **Prepare Your Data**:
    -   Create two zip files: `images.zip` and `labels.zip`.
    -   Upload both files to the `/content/` directory in your Colab session.

3.  **Configure Runtime**:
    -   In the Colab menu, navigate to `Runtime` -> `Change runtime type`.
    -   Select **T4 GPU** as the hardware accelerator.

4.  **Execute the Notebook**:
    -   Run the cells in the `Logodetection.ipynb` notebook from top to bottom.
    -   The notebook will handle all installations, data splitting, training, and prediction.

The final trained model weights (`best.pt`) and prediction images will be saved in the `/ultralytics/runs/` directory.

---

## Feedback & Collaboration

I’m always open to feedback, suggestions, and collaboration—especially from those interested in robotics and computer vision. Feel free to connect, open an issue, or fork the repository!

## Credits
-   **Ultralytics**: For the powerful and easy-to-use [YOLOv8 framework](https://github.com/ultralytics/ultralytics).
-   **Robocon**: For creating an exciting platform that drives innovation in robotics.
