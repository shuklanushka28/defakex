# utils.py
import cv2
import numpy as np
from PIL import Image
from io import BytesIO

def preprocess_image(file):
    # Load image from file bytes
    image_bytes = file.read()
    pil_image = Image.open(BytesIO(image_bytes)).convert("RGB")
    
    # Resize to 224x224 (EfficientNetB0 input size)
    pil_image = pil_image.resize((224, 224))
    
    # Convert to numpy array
    img_array = np.array(pil_image)

    return img_array
