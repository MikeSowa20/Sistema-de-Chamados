from flask import request, jsonify
from flask import Blueprint
import os
import jwt

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

        return jsonify({
            "logged":True,
            "user_id":payload["user_id"],
            "email":payload["email"]
        }),200
    
    except jwt.ExpiredSignatureError:
        return jsonify({"logged": False, "erro": "Token expirado"}), 401

    except jwt.InvalidTokenError:
        return jsonify({"logged": False, "erro": "Token inválido"}), 401