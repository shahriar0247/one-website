from flask import Blueprint

case_converter_bp = Blueprint('case_converter', __name__)

from . import routes 