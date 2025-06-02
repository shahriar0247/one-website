from flask import request, jsonify
from . import image_to_text_bp
import pytesseract
from PIL import Image
import cv2
import numpy as np
import io

@image_to_text_bp.route('/extract', methods=['POST'])
def extract():
    try:
        if 'file' not in request.files:
            return {'error': 'No file provided'}, 400

        file = request.files['file']
        if not file.filename:
            return {'error': 'No file selected'}, 400

        # Read image file
        image_stream = io.BytesIO(file.read())
        image = Image.open(image_stream)
        
        # Convert PIL Image to OpenCV format
        cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Image preprocessing
        # Convert to grayscale
        gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
        
        # Apply thresholding to preprocess the image
        gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
        
        # Apply dilation to connect text components
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3,3))
        gray = cv2.dilate(gray, kernel, iterations=1)
        
        # Write the grayscale image to a temporary buffer
        result_buf = io.BytesIO()
        result_img = Image.fromarray(gray)
        result_img.save(result_buf, format='PNG')
        
        # Perform OCR on the processed image
        text = pytesseract.image_to_string(result_img)
        
        return jsonify({
            'success': True,
            'text': text.strip()
        })

    except Exception as e:
        return {'error': str(e)}, 500 