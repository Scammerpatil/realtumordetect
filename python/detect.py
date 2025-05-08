import os
import sys
import locale
import numpy as np
import tensorflow as tf
import cv2
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

sys.stdout.reconfigure(encoding="utf-8")
os.environ["PYTHONIOENCODING"] = "utf-8"
locale.setlocale(category=locale.LC_ALL, locale="en_GB.UTF-8")

IMAGE_PATH = "python/image.jpg"
MODEL_PATH = "python/tumor_classification_maskrcnn.h5"
OUTPUT_PATH = "public/image.jpg"

model = load_model(MODEL_PATH)

def preprocess_image(img_path, target_size=(224, 224)):
    img = image.load_img(img_path, target_size=target_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0
    return img_array

def detect_white_regions(image_path, threshold=200):
    """Detects white regions in an image and draws bounding boxes."""
    img = cv2.imread(image_path)
    img = cv2.resize(img, (512, 512))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    _, thresh = cv2.threshold(gray, threshold, 255, cv2.THRESH_BINARY)
    
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        if w > 10 and h > 10: 
            cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)

    cv2.imwrite(OUTPUT_PATH, img)

def detect():
    img_array = preprocess_image(IMAGE_PATH)
    prediction = model.predict(img_array)
    label_idx = np.argmax(prediction)
    labels = ["Deepfake No Tumor", "Deepfake Tumor", "No Tumor", "Real Tumor"]
    label = labels[label_idx]

    print(label)

    if "Deepfake" in label:
        detect_white_regions(IMAGE_PATH)
    else: 
        img = cv2.imread(IMAGE_PATH)
        cv2.imwrite(OUTPUT_PATH, img)

if __name__ == "__main__":
    detect()
