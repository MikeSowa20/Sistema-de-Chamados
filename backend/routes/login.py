from flask import request,jsonify
from flask import Blueprint
from models.users import Users
from config.db import db
from flask_bcrypt import Bcrypt
import os
import jwt
from datetime import datetime, timedelta, timezone

login_bp = Blueprint ("login",__name__)

@login_bp.route("/login", methods=["POST"])
def login():
    bcrypt = Bcrypt()
    dados = request.json
    email = (dados.get("email") or "").strip().lower() if dados else ""
    password = dados.get("password") if dados else ""

    if not email or not password:
        return jsonify({
            "mensagem": "Informe e-mail e senha",
            "type": "error"
        }), 400

    usuario = Users.query.filter(
        db.func.lower(Users.email) == email,
    ).first()
    if not usuario:
        return jsonify({
            "mensagem": "Senha ou usuário inválidos",
            "type": "error"
        }), 401

    if bcrypt.check_password_hash(
        usuario.password,
        password
    ):
        SECRET_KEY = os.getenv("SECRET_KEY")
        token = jwt.encode(
            {
                "user_id":usuario.id,
                "email":usuario.email,
                "exp": datetime.now(timezone.utc) + timedelta(hours=2),
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        response = jsonify({
                "mensagem": "Login realizado com sucesso!!",
                "type": "success"})
        

        response.set_cookie(
            "token",
            token,
            httponly=True,
            secure=False, #em localhost
            samesite="Lax"
        )

        return response, 200
    else:
        return jsonify({
            "mensagem": "Senha ou usuario inválidos",
            "type": "error"
        }),401
        
