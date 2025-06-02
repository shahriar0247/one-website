from flask import Blueprint

unit_converter_bp = Blueprint('unit_converter', __name__, url_prefix='/api/unit-converter')

from . import routes 