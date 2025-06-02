from flask import Blueprint, request, jsonify
import requests
import json

grammar_bp = Blueprint('grammar', __name__)

@grammar_bp.route('/api/grammar/check', methods=['POST'])
def grammar_check():
    data = request.get_json()
    text = data.get('text', '')
    if not text.strip():
        return jsonify({'success': False, 'error': 'No text provided.'}), 400
    
    try:
        ollama_url = 'http://localhost:11434/api/generate'
        model = 'deepseek-r1:1.5b'
        
        prompt = f"""You are a professional grammar and writing assistant. Analyze the following text for grammar, spelling, and style improvements.

IMPORTANT: You must ONLY return a valid JSON object with these exact fields:
- corrections: array of strings for grammar corrections
- suggestions: array of strings for style improvements
- spelling: array of strings for spelling errors
- improved_text: string containing the fully corrected text

Text to analyze: {text}

Return ONLY the JSON object without ANY additional text, thoughts, or explanations."""

        resp = requests.post(
            ollama_url,
            json={
                'model': model,
                'prompt': prompt,
                'stream': False
            },
            timeout=60
        )
        resp.raise_for_status()
        
        # Parse the AI response as JSON
        try:
            result = resp.json().get('response', '').strip()
            # Remove any potential non-JSON content
            result = result[result.find('{'):result.rfind('}')+1]
            parsed_result = json.loads(result)
            
            # Ensure all required fields exist
            required_fields = ['corrections', 'suggestions', 'spelling', 'improved_text']
            for field in required_fields:
                if field not in parsed_result:
                    parsed_result[field] = [] if field != 'improved_text' else ''
                    
            return jsonify({'success': True, 'result': parsed_result})
        except json.JSONDecodeError:
            # Fallback if AI doesn't return valid JSON
            return jsonify({
                'success': True,
                'result': {
                    'improved_text': resp.json().get('response', '').strip(),
                    'corrections': [],
                    'suggestions': [],
                    'spelling': []
                }
            })
            
    except requests.exceptions.RequestException as e:
        return jsonify({'success': False, 'error': 'Failed to connect to AI service. Please ensure Ollama is running.'}), 500
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500 