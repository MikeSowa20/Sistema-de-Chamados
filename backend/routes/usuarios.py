from flask import request, jsonify
from flask import Blueprint
from models.users import Users
from config.db import db

usuarios_bp = Blueprint ("usuarios",__name__)

@usuarios_bp.route("/menu/usuarios",methods=["GET"])
def usuarios():
    
    usuarios = Users.query.all()

    if not usuarios:
        return jsonify({
            "mensagem":"falha ao carregar os usuarios",
            "type":"error"
        })
    else:
        return jsonify([{
            "id": usuarios.id,
            "nome": usuarios.nome,
            "email": usuarios.email,
            "permissao": usuarios.permissao
        }
        for usuarios in usuarios
        ])
@usuarios_bp.route("/menu/usuarios/<int:id>", methods=["PUT"])
def atualizar(id):

    usuario = db.session.get(Users, id)

    if not usuario:
        return jsonify({
            "mensagem": "Usuário não encontrado",
            "type": "error"
        }), 404

    usuario.permissao = (
        "admin"
        if usuario.permissao == "user"
        else "user"
    )

    db.session.commit()

    return jsonify({
        "mensagem": "Usuário alterado com sucesso",
        "type": "success",
        "id": usuario.id,
        "permissao": usuario.permissao
    }), 200