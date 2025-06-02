from flask import Blueprint

image_converter_bp = Blueprint('image_converter', __name__, url_prefix='/api/image-converter')

from . import routes 