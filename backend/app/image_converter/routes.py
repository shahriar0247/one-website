from flask import request, send_file
from . import image_converter_bp
from PIL import Image
import io
import os

SUPPORTED_FORMATS = {
    'jpeg': {'mime': 'image/jpeg', 'ext': '.jpg', 'pil_format': 'JPEG', 'quality': True},
    'png': {'mime': 'image/png', 'ext': '.png', 'pil_format': 'PNG', 'quality': False},
    'webp': {'mime': 'image/webp', 'ext': '.webp', 'pil_format': 'WebP', 'quality': True},
    'gif': {'mime': 'image/gif', 'ext': '.gif', 'pil_format': 'GIF', 'quality': False},
    'bmp': {'mime': 'image/bmp', 'ext': '.bmp', 'pil_format': 'BMP', 'quality': False},
}

@image_converter_bp.route('/convert', methods=['POST'])
def convert():
    try:
        if 'file' not in request.files:
            return {'error': 'No file provided'}, 400

        file = request.files['file']
        if not file.filename:
            return {'error': 'No file selected'}, 400

        # Get parameters
        format = request.form.get('format', 'jpeg').lower()
        quality = int(request.form.get('quality', 90))

        if format not in SUPPORTED_FORMATS:
            return {'error': f'Unsupported format. Supported formats are: {", ".join(SUPPORTED_FORMATS.keys())}'}, 400

        # Open and process the image
        img = Image.open(file)

        # Convert RGBA to RGB if necessary and target format doesn't support alpha
        if img.mode in ('RGBA', 'LA') and format in ['jpeg']:
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[-1])
            img = background

        # Save to BytesIO
        output = io.BytesIO()
        
        format_info = SUPPORTED_FORMATS[format]
        save_args = {
            'format': format_info['pil_format'],
        }
        
        # Add quality parameter for formats that support it
        if format_info['quality']:
            save_args['quality'] = quality
            
        if format == 'png':
            save_args['optimize'] = True
        
        img.save(output, **save_args)
        output.seek(0)

        # Generate output filename
        filename = os.path.splitext(file.filename)[0]
        output_filename = f"{filename}_converted{format_info['ext']}"

        return send_file(
            output,
            mimetype=format_info['mime'],
            as_attachment=True,
            download_name=output_filename
        )

    except Exception as e:
        return {'error': str(e)}, 500 