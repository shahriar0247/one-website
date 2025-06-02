from flask import request, send_file
from . import image_compressor_bp
from PIL import Image
import io
import os

@image_compressor_bp.route('/compress', methods=['POST'])
def compress():
    try:
        if 'file' not in request.files:
            return {'error': 'No file provided'}, 400

        file = request.files['file']
        if not file.filename:
            return {'error': 'No file selected'}, 400

        # Get parameters
        quality = int(request.form.get('quality', 80))
        resize_image = request.form.get('resize_image', 'false').lower() == 'true'
        max_width = int(request.form.get('max_width', 1920))
        max_height = int(request.form.get('max_height', 1080))

        # Open and process the image
        img = Image.open(file)

        # Convert RGBA to RGB if necessary
        if img.mode in ('RGBA', 'LA'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[-1])
            img = background

        # Resize if requested and if image is larger than max dimensions
        if resize_image and (img.width > max_width or img.height > max_height):
            # Calculate aspect ratio
            ratio = min(max_width/img.width, max_height/img.height)
            new_size = (int(img.width * ratio), int(img.height * ratio))
            img = img.resize(new_size, Image.Resampling.LANCZOS)

        # Save to BytesIO with compression
        output = io.BytesIO()
        
        # Determine format
        save_format = img.format if img.format in ['JPEG', 'PNG'] else 'JPEG'
        
        # Save with quality parameter for JPEG
        if save_format == 'JPEG':
            img.save(output, format=save_format, quality=quality, optimize=True)
        else:
            img.save(output, format=save_format, optimize=True)
        
        output.seek(0)

        # Generate output filename
        filename = os.path.splitext(file.filename)[0]
        extension = '.jpg' if save_format == 'JPEG' else '.png'
        output_filename = f"{filename}_compressed{extension}"

        return send_file(
            output,
            mimetype=f'image/{save_format.lower()}',
            as_attachment=True,
            download_name=output_filename
        )

    except Exception as e:
        return {'error': str(e)}, 500 