from flask import Flask
from routes.main import main_bp
from database import db
from config import Config


def create_app():
    app = Flask(__name__, template_folder="templates", static_folder="static")
    app.config.from_object(Config)

    db.init_app(app)

    app.register_blueprint(main_bp)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000)
