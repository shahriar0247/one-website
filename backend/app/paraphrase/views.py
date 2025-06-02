from flask import Blueprint, request, jsonify
import requests

paraphrase_bp = Blueprint('paraphrase', __name__)

@paraphrase_bp.route('/api/paraphrase', methods=['POST'])
def paraphrase():
    data = request.get_json()
    text = data.get('text', '')
    if not text.strip():
        return jsonify({'error': 'No text provided.'}), 400
    try:
        ollama_url = 'http://localhost:11434/api/generate'
        model = 'deepseek-r1:1.5b'  # You can change this to another model if desired
        prompt = f"Paraphrase the following text. Only return the paraphrased text.\n\n{text}"
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
        result = resp.json().get('response', '(No paraphrase returned)').strip()
        return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500 