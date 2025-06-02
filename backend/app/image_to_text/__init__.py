from flask import Blueprint

image_to_text_bp = Blueprint('image_to_text', __name__, url_prefix='/api/image-to-text')

from . import routes 