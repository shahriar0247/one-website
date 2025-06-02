from flask import Blueprint

qr_generator_bp = Blueprint('qr_generator', __name__, url_prefix='/api/qr-generator')

from . import routes 