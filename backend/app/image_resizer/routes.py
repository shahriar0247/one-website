from flask import request, send_file
from . import image_resizer_bp
from PIL import Image
import io
import os

@image_resizer_bp.route('/resize', methods=['POST'])
def resize():
    try:
        if 'file' not in request.files:
            return {'error': 'No file provided'}, 400

        file = request.files['file']
        if not file.filename:
            return {'error': 'No file selected'}, 400

        # Get parameters
        resize_mode = request.form.get('resize_mode', 'dimensions')
        maintain_aspect_ratio = request.form.get('maintain_aspect_ratio', 'true').lower() == 'true'

        # Open the image
        img = Image.open(file)
        original_width, original_height = img.size

        if resize_mode == 'dimensions':
            # Get target dimensions
            width = request.form.get('width')
            height = request.form.get('height')

            if not width and not height:
                return {'error': 'Width or height must be provided'}, 400

            # Convert to integers, use original dimension if not provided
            width = int(width) if width else original_width
            height = int(height) if height else original_height

            if maintain_aspect_ratio:
                # Calculate aspect ratio
                ratio = min(width/original_width, height/original_height)
                width = int(original_width * ratio)
                height = int(original_height * ratio)

        else:  # percentage mode
            percentage = float(request.form.get('percentage', 100)) / 100
            width = int(original_width * percentage)
            height = int(original_height * percentage)

        # Perform the resize
        resized_img = img.resize((width, height), Image.Resampling.LANCZOS)

        # Save to BytesIO
        output = io.BytesIO()
        
        # Determine format
        save_format = img.format if img.format else 'JPEG'
        
        # Save the image
        if save_format == 'JPEG':
            resized_img.save(output, format=save_format, quality=95)
        else:
            resized_img.save(output, format=save_format)
            
        output.seek(0)

        # Generate output filename
        filename = os.path.splitext(file.filename)[0]
        extension = os.path.splitext(file.filename)[1] or '.jpg'
        output_filename = f"{filename}_resized{extension}"

        return send_file(
            output,
            mimetype=f'image/{save_format.lower()}',
            as_attachment=True,
            download_name=output_filename
        )

    except Exception as e:
        return {'error': str(e)}, 500 