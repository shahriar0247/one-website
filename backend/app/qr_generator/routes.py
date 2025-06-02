from flask import request, send_file
from . import qr_generator_bp
import qrcode
from io import BytesIO
from PIL import Image

@qr_generator_bp.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.get_json()
        text = data.get('text')
        format = data.get('format', 'png')
        size = data.get('size', 300)
        foreground_color = f"#{data.get('foreground_color', '000000')}"
        background_color = f"#{data.get('background_color', 'FFFFFF')}"
        include_margin = data.get('include_margin', True)

        if not text:
            return {'error': 'Text is required'}, 400

        # Calculate box size based on desired image size
        # A typical QR code is 25x25 modules for version 1
        # Add 8 for margin if include_margin is True
        module_count = 25 + (8 if include_margin else 0)
        box_size = size // module_count

        # Ensure minimum box size
        box_size = max(1, box_size)

        # Create QR code instance
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=box_size,
            border=4 if include_margin else 0,
        )

        # Add data
        qr.add_data(text)
        qr.make(fit=True)

        # Create image
        img = qr.make_image(fill_color=foreground_color, back_color=background_color)

        # Save to BytesIO
        img_io = BytesIO()
        img.save(img_io, format=format.upper())
        img_io.seek(0)

        return send_file(
            img_io,
            mimetype=f'image/{format.lower()}',
            as_attachment=False
        )

    except Exception as e:
        return {'error': str(e)}, 500 