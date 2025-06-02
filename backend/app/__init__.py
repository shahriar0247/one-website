from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Import and register blueprints
    from .grammar import grammar_bp
    from .paraphrase import paraphrase_bp
    from .case_converter import case_converter_bp
    from .line_breaks import line_breaks_bp
    from .pdf_converter import pdf_converter_bp
    from .qr_generator import qr_generator_bp
    from .unit_converter import unit_converter_bp
    from .image_compressor import image_compressor_bp
    from .image_converter import image_converter_bp
    from .image_resizer import image_resizer_bp
    from .image_to_text import image_to_text_bp

    app.register_blueprint(grammar_bp)
    app.register_blueprint(paraphrase_bp)
    app.register_blueprint(case_converter_bp)
    app.register_blueprint(line_breaks_bp)
    app.register_blueprint(pdf_converter_bp)
    app.register_blueprint(qr_generator_bp)
    app.register_blueprint(unit_converter_bp)
    app.register_blueprint(image_compressor_bp)
    app.register_blueprint(image_converter_bp)
    app.register_blueprint(image_resizer_bp)
    app.register_blueprint(image_to_text_bp)

    @app.route("/")
    def hello_world():
        return "<p>Hello, World!</p>"

    return app
