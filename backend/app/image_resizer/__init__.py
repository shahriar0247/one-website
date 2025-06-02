from flask import Blueprint

image_resizer_bp = Blueprint('image_resizer', __name__, url_prefix='/api/image-resizer')

from . import routes 