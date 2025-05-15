import os
import sys
import locale
import numpy as np
import tensorflow as tf
import cv2
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from ultralytics import YOLO

# Encoding and locale setup
sys.stdout.reconfigure(encoding="utf-8")
os.environ["PYTHONIOENCODING"] = "utf-8"
locale.setlocale(category=locale.LC_ALL, locale="en_GB.UTF-8")

# Paths
IMAGE_PATH = "python/image.jpg"
CLASSIFICATION_MODEL_PATH = "python/models/tumor_classification_maskrcnn.h5"
YOLO_MODEL_PATH = "python/models/best.pt"
OUTPUT_PATH = "public/image.jpg"

# Load models
classification_model = load_model(CLASSIFICATION_MODEL_PATH)
yolo_model = YOLO(YOLO_MODEL_PATH)

# Preprocessing function
def preprocess_image(img_path, target_size=(224, 224)):
    img = image.load_img(img_path, target_size=target_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0
    return img_array

# Detect white regions (for deepfake only)
def detect_white_regions(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        if w > 10 and h > 10:
            cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)

    return img

# Tumor detection using YOLOv8
def detect_tumor_regions(img_path):
    img = cv2.imread(img_path)
    img = cv2.resize(img, (512, 512))
    results = yolo_model(img_path)
    
    for result in results:
        if result.boxes is not None:
            boxes = result.boxes.xyxy
            confidences = result.boxes.conf
            class_ids = result.boxes.cls
            
            for box, conf, cls_id in zip(boxes, confidences, class_ids):
                x1, y1, x2, y2 = map(int, box)
                confidence = float(conf)
                class_name = result.names[int(cls_id)]

                if confidence > 0.5:
                    cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.putText(img, f"{class_name}: {confidence:.2f}",
                                (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX,
                                0.5, (0, 255, 0), 2)

    return img

# Final decision pipeline
def detect():
    img_array = preprocess_image(IMAGE_PATH)
    prediction = classification_model.predict(img_array)
    label_idx = np.argmax(prediction)
    labels = ["Deepfake No Tumor", "Deepfake Tumor", "No Tumor", "Real Tumor"]
    label = labels[label_idx]

    # Load and resize base image
    final_image = cv2.imread(IMAGE_PATH)
    final_image = cv2.resize(final_image, (512, 512))

    # Overlay 1: If Deepfake -> draw white region rectangles directly
    if "Deepfake" in label:
        final_image = detect_white_regions(final_image)

    # Overlay 2: If Tumor -> draw YOLO boxes directly
    if "Tumor" in label:
        final_image = detect_tumor_regions(IMAGE_PATH)

    cv2.imwrite(OUTPUT_PATH, final_image)
    return label

if __name__ == "__main__":
    label = detect()
    print(label)
