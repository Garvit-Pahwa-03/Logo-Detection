from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import numpy as np
import cv2
import base64
from ultralytics import YOLO
from PIL import Image
import io

app = FastAPI(title="Robocon Logo Detector")

# Allow requests from GitHub Pages frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten this to your GitHub Pages URL in production
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# Load model once at startup
model = YOLO("best.pt")

@app.get("/")
def root():
    return {"status": "Robocon Logo Detector is running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    # Read image bytes
    contents = await file.read()
    np_arr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img is None:
        return JSONResponse({"error": "Invalid image"}, status_code=400)

    # Run YOLOv8 inference
    results = model(img, conf=0.25)[0]

    # Draw bounding boxes
    annotated = results.plot()

    # Encode annotated image to base64
    _, buffer = cv2.imencode(".jpg", annotated)
    encoded = base64.b64encode(buffer).decode("utf-8")

    # Extract detections
    detections = []
    for box in results.boxes:
        detections.append({
            "class": results.names[int(box.cls)],
            "confidence": round(float(box.conf), 3),
            "bbox": [round(float(x), 1) for x in box.xyxy[0].tolist()]
        })

    return {
        "annotated_image": f"data:image/jpeg;base64,{encoded}",
        "detections": detections,
        "count": len(detections)
    }