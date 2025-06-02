from flask import Blueprint

image_compressor_bp = Blueprint('image_compressor', __name__, url_prefix='/api/image-compressor')

from . import routes 