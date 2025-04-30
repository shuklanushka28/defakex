# app.py
from flask import Flask, request, jsonify
from model import predict
from utils import preprocess_image

app = Flask(__name__)

@app.route("/")
def home():
    return "Deepfake Detection API is running!"

@app.route("/predict-image", methods=["POST"])
def predict_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        img_array = preprocess_image(file)
        label, confidence = predict(img_array)
        return jsonify({
            "label": label,
            "confidence": round(confidence, 4)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
