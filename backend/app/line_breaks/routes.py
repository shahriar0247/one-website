from flask import Blueprint, request, jsonify
import re

line_breaks_bp = Blueprint('line_breaks', __name__, url_prefix='/api/line-breaks')

@line_breaks_bp.route('/remove', methods=['POST'])
def remove_line_breaks():
    try:
        data = request.get_json()
        text = data.get('text', '')
        mode = data.get('mode', 'all')  # 'all', 'breaks', 'tabs', 'spaces'
        
        if not text:
            return jsonify({
                'success': False,
                'error': 'No text provided'
            }), 400

        original_text = text
        processed_text = text

        if mode in ['all', 'breaks']:
            # Replace line breaks with spaces
            processed_text = re.sub(r'\n+', ' ', processed_text)
            
        if mode in ['all', 'tabs']:
            # Replace tabs with spaces
            processed_text = re.sub(r'\t+', ' ', processed_text)
            
        if mode in ['all', 'spaces']:
            # Replace multiple spaces with single space
            processed_text = re.sub(r' +', ' ', processed_text)
            
        # Trim leading/trailing whitespace
        processed_text = processed_text.strip()

        return jsonify({
            'success': True,
            'result': {
                'original_text': original_text,
                'processed_text': processed_text,
                'mode': mode
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500 