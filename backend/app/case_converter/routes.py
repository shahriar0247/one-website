from flask import request, jsonify
import re
from . import case_converter_bp

def to_camel_case(text):
    words = text.split()
    return words[0].lower() + ''.join(word.capitalize() for word in words[1:])

def to_snake_case(text):
    # First convert camelCase to space-separated
    text = re.sub('([a-z0-9])([A-Z])', r'\1 \2', text)
    # Convert any remaining spaces or special chars to underscores
    return re.sub('[^a-zA-Z0-9]+', '_', text.lower()).strip('_')

@case_converter_bp.route('/api/case-converter/convert', methods=['POST'])
def convert_case():
    try:
        data = request.get_json()
        text = data.get('text', '')
        case_type = data.get('case_type', 'upper')
        
        if not text:
            return jsonify({
                'success': False,
                'error': 'No text provided'
            }), 400

        result = {
            'success': True,
            'result': {
                'converted_text': '',
                'case_type': case_type
            }
        }

        if case_type == 'upper':
            result['result']['converted_text'] = text.upper()
        elif case_type == 'lower':
            result['result']['converted_text'] = text.lower()
        elif case_type == 'title':
            result['result']['converted_text'] = text.title()
        elif case_type == 'camel':
            result['result']['converted_text'] = to_camel_case(text)
        elif case_type == 'snake':
            result['result']['converted_text'] = to_snake_case(text)
        else:
            return jsonify({
                'success': False,
                'error': 'Invalid case type'
            }), 400

        return jsonify(result)

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500 