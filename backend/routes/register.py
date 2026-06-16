from flask import request,jsonify
from flask import Blueprint
from models.users import Users
from config.db import db
from flask_bcrypt import Bcrypt

register_bp = Blueprint ("register",__name__)
bcrypt = Bcrypt()

@register_bp.route("/register", methods=["POST"])
def register():
    dados = request.json

    senha_hash = bcrypt.generate_password_hash(
        dados["password"]
    ).decode("utf-8")

    usuario = Users(
        email=dados["email"],
        password=senha_hash,    
        nome=dados["nome"]
    )

    db.session.add(usuario)
    db.session.commit()

    return jsonify({"mensagem": "Usuário criado"}), 201