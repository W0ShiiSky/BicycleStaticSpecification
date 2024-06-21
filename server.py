from flask import Flask, request, jsonify
import torch
from PIL import Image
import io

app = Flask(__name__)

# Load the model
model = torch.hub.load('C:/Users/ewanh/java2/BicycleStaticSpecification/runs/train/yolov5s_results/weights/best.pt', 'custom', path='C:/Users/ewanh/java2/BicycleStaticSpecification/runs/train/yolov5s_results/weights/best.pt', source='local')

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file'}), 400
    
    image = request.files['image']
    img = Image.open(io.BytesIO(image.read()))
    
    # Perform inference
    results = model(img)
    predictions = results.pandas().xyxy[0].to_dict(orient='records')
    
    return jsonify(predictions)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
