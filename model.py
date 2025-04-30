# model.py
import numpy as np
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.applications.efficientnet import preprocess_input
from tensorflow.keras.preprocessing import image

# Load the EfficientNetB0 model
model = EfficientNetB0(weights="imagenet", include_top=True)

def predict(img_array):
    img_resized = np.expand_dims(img_array, axis=0)
    img_preprocessed = preprocess_input(img_resized)
    
    preds = model.predict(img_preprocessed)[0]
    confidence = float(np.max(preds))

    # For now, simulate a fake detection based on prediction
    # You will later replace this with your deepfake-trained model
    label = "fake" if confidence > 0.5 else "real"
    
    return label, confidence
