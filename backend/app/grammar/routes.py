from flask import Blueprint, request, jsonify
from ..utils import generate_ollama_response

grammar_bp = Blueprint('grammar', __name__, url_prefix='/api/grammar')

GRAMMAR_SYSTEM_PROMPT = """You are a professional grammar and writing assistant. Your task is to:
1. Identify and correct any grammar mistakes
2. Suggest improvements for clarity and style
3. Check spelling
4. Format the response as a JSON with these keys:
   - corrections: list of grammar corrections
   - suggestions: list of style improvements
   - spelling: list of spelling errors
   - improved_text: the corrected version of the text
"""

@grammar_bp.route('/check', methods=['POST'])
def check_grammar():
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({
                'success': False,
                'error': 'No text provided'
            }), 400
            
        response = generate_ollama_response(
            prompt=f"Please check and correct this text: {text}",
            system=GRAMMAR_SYSTEM_PROMPT,
            format="JSON"
        )
        
        if not response['success']:
            return jsonify({
                'success': False,
                'error': response['error']
            }), 500
            
        return jsonify({
            'success': True,
            'result': response['response']
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500 