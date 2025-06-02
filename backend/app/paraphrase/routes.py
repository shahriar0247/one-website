from flask import Blueprint, request, jsonify
from ..utils import generate_ollama_response
import json

paraphrase_bp = Blueprint('paraphrase', __name__, url_prefix='/api/paraphrase')

PARAPHRASE_SYSTEM_PROMPT = """You are a professional writing assistant specialized in paraphrasing text. 
Your task is to rewrite the given text in different styles while maintaining the original meaning.
IMPORTANT: You must ONLY return a valid JSON object with these exact fields:
{
    "casual": "casual version here",
    "formal": "formal version here",
    "creative": "creative version here"
}
Return ONLY the JSON object without ANY additional text, thoughts, or explanations."""

@paraphrase_bp.route('/rewrite', methods=['POST'])
def paraphrase_text():
    try:
        data = request.get_json()
        text = data.get('text', '')
        style = data.get('style', 'all')  # 'casual', 'formal', 'creative', or 'all'
        
        if not text:
            return jsonify({
                'success': False,
                'error': 'No text provided'
            }), 400
            
        prompt = f"Paraphrase this text in JSON format: {text}"
            
        response = generate_ollama_response(
            prompt=prompt,
            system=PARAPHRASE_SYSTEM_PROMPT,
            format="JSON"
        )
        
        if not response['success']:
            return jsonify({
                'success': False,
                'error': response['error']
            }), 500
            
        try:
            # Try to parse the response as JSON
            result = response['response'].strip()
            # Remove any potential non-JSON content
            result = result[result.find('{'):result.rfind('}')+1]
            parsed_result = json.loads(result)
            
            # If specific style requested, return only that style
            if style != 'all' and style in parsed_result:
                return jsonify({
                    'success': True,
                    'result': {style: parsed_result[style]}
                })
            
            return jsonify({
                'success': True,
                'result': parsed_result
            })
            
        except json.JSONDecodeError:
            # Fallback if AI doesn't return valid JSON
            return jsonify({
                'success': False,
                'error': 'Failed to parse AI response as JSON'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500 