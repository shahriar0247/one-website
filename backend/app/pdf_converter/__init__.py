from flask import Blueprint

pdf_converter_bp = Blueprint('pdf_converter', __name__)

from . import routes 