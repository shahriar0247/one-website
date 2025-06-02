from flask import Blueprint

line_breaks_bp = Blueprint('line_breaks', __name__)

from . import routes 