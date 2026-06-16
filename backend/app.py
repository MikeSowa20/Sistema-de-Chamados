from flask import Flask
from config.db import db, DATABASE_URL
from flask_cors import CORS

from routes.login import login_bp
from routes.register import register_bp
from routes.auth import auth_bp

app = Flask(__name__)

CORS(app, supports_credentials=True, origins=["http://localhost:5173"])


app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

app.register_blueprint(login_bp)
app.register_blueprint(register_bp)
app.register_blueprint(auth_bp)

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)