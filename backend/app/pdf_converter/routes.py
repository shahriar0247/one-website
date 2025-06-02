import os
from flask import request, jsonify, send_file
from werkzeug.utils import secure_filename
from pdf2docx import Converter
import magic
import tempfile
from . import pdf_converter_bp

ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@pdf_converter_bp.route('/api/pdf-converter/convert', methods=['POST'])
def convert_pdf():
    if 'file' not in request.files:
        return jsonify({
            'success': False,
            'error': 'No file provided'
        }), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({
            'success': False,
            'error': 'No file selected'
        }), 400

    if not allowed_file(file.filename):
        return jsonify({
            'success': False,
            'error': 'Invalid file type. Only PDF files are allowed.'
        }), 400

    try:
        # Create temporary directory
        with tempfile.TemporaryDirectory() as temp_dir:
            # Save uploaded PDF
            pdf_path = os.path.join(temp_dir, secure_filename(file.filename))
            file.save(pdf_path)

            # Check if file is actually a PDF
            mime = magic.Magic(mime=True)
            file_type = mime.from_file(pdf_path)
            if not file_type.startswith('application/pdf'):
                return jsonify({
                    'success': False,
                    'error': 'Invalid file content. File must be a valid PDF.'
                }), 400

            # Convert to DOCX
            docx_filename = os.path.splitext(secure_filename(file.filename))[0] + '.docx'
            docx_path = os.path.join(temp_dir, docx_filename)
            
            cv = Converter(pdf_path)
            cv.convert(docx_path)
            cv.close()

            # Send the converted file
            return send_file(
                docx_path,
                as_attachment=True,
                download_name=docx_filename,
                mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            )

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Conversion failed: {str(e)}'
        }), 500 