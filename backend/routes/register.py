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
    nome = (dados.get("nome") or "").strip() if dados else ""
    email = (dados.get("email") or "").strip().lower() if dados else ""
    password = dados.get("password") if dados else ""

    if not nome or not email or not password:
        return jsonify({
            "mensagem": "Preencha nome, e-mail e senha",
            "type": "error"
        }), 400

    usuario_existente = Users.query.filter(
        db.func.lower(Users.email) == email,
    ).first()
    if usuario_existente:
        return jsonify({
            "mensagem": "E-mail já cadastrado",
            "type": "error"
        }), 409

    senha_hash = bcrypt.generate_password_hash(
        password
    ).decode("utf-8")

    usuario = Users(
        email=email,
        password=senha_hash,    
        nome=nome
    )

    db.session.add(usuario)
    db.session.commit()

    return jsonify({"mensagem": "Usuário criado"}), 201
