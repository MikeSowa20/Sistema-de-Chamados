from flask import request, jsonify
from flask import Blueprint
import os
import jwt
from models.users import Users
from config.db import db

SECRET_KEY = os.getenv("SECRET_KEY")

auth_bp = Blueprint ("auth",__name__)

@auth_bp.route("/auth", methods=["GET"])
def auth():
    token = request.cookies.get("token")

    if not token:
        return jsonify({"logged":False}), 401
    
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=["HS256"]
        )

        usuario = db.session.get(Users, payload["user_id"])

        if not usuario:
            return jsonify({"logged": False, "erro": "Usuário não encontrado"}), 401

        return jsonify({
            "logged":True,
            "user_id":payload["user_id"],
            "email":payload["email"],
            "permissao":usuario.permissao,
            "nome":usuario.nome
        }),200
    
    except jwt.ExpiredSignatureError:
        return jsonify({"logged": False, "erro": "Token expirado"}), 401

    except jwt.InvalidTokenError:
        return jsonify({"logged": False, "erro": "Token inválido"}), 401



@auth_bp.route("/logout", methods=["POST"])
def logout():

    response = jsonify({
        "mensagem": "Logout realizado"
    })

    response.delete_cookie("token")

    return response, 200
