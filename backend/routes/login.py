from flask import request,jsonify
from flask import Blueprint
from models.users import Users
from config.db import db
from flask_bcrypt import Bcrypt

login_bp = Blueprint ("login",__name__)

@login_bp.route("/login", methods=["POST"])
def login():
    bcrypt = Bcrypt()
    dados = request.json

    usuario = Users.query.filter_by(
        email=dados["email"],
    ).first()
    if not usuario:
        return jsonify({
            "mensagem": "Senha ou usuário inválidos",
            "type": "error"
        }), 401

    if bcrypt.check_password_hash(
        usuario.password,
        dados["password"]
    ):
        return jsonify({
            "mensagem": "Login realizado com sucesso!!",
            "type": "success"
            }), 200
    else:
        return jsonify({
            "mensagem": "Senha ou usuario inválidos",
            "type": "error"
        }),401

        