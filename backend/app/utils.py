import requests
import json

OLLAMA_BASE_URL = "http://localhost:11434/api"

def generate_ollama_response(prompt, model="deepseek-r1:1.5b", system="", format=""):
    """
    Generate a response using Ollama API
    
    Args:
        prompt (str): The user prompt
        model (str): The model to use (default: llama2)
        system (str): System prompt to set context
        format (str): Expected format of the response
    """
    try:
        if format:
            prompt = f"{prompt}\n\nPlease provide the response in this format: {format}"
            
        data = {
            "model": model,
            "prompt": prompt,
            "system": system,
            "stream": False
        }
        
        response = requests.post(f"{OLLAMA_BASE_URL}/generate", json=data)
        response.raise_for_status()
        
        return {
            "success": True,
            "response": response.json()["response"]
        }
        
    except requests.exceptions.RequestException as e:
        return {
            "success": False,
            "error": f"Failed to communicate with Ollama: {str(e)}"
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"An error occurred: {str(e)}"
        } 