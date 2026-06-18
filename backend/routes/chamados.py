from flask import request, jsonify
from flask import Blueprint
from datetime import datetime, timezone
from config.db import db
from models.users import Users
from models.chamados import Chamados, MensagensChamado
from sqlalchemy import or_, and_

chamados_bp = Blueprint("chamados",__name__)

def converter_data_parametro(valor, fim_do_dia=False):
    if not valor:
        return None

    try:
        data = datetime.strptime(valor, "%Y-%m-%d").replace(tzinfo=timezone.utc)

        if fim_do_dia:
            return data.replace(hour=23, minute=59, second=59, microsecond=999999)

        return data

    except ValueError:
        return None

def formatar_data(data):
    return data.isoformat() if data else None

def serializar_respostas_chamado(chamado):
    return [
        serializar_chamado_respostas(resposta)
        for resposta in sorted(chamado.mensagens, key=lambda item: item.criado_em)
    ]

def serializar_chamado_admin(chamado):
    return {
        "id": chamado.id,
        "titulo": chamado.titulo,
        "corpo": chamado.corpo,
        "urgencia": chamado.urgencia,
        "status": chamado.status,
        "fechado_em": formatar_data(chamado.fechado_em),
        "reaberto_em": formatar_data(chamado.reaberto_em),
        "quantidade_reaberturas": chamado.quantidade_reaberturas,
        "usuario_id": chamado.usuario_id,
        "admin_id": chamado.admin_id,
        "resposta": chamado.resposta,
        "atualizado_em": formatar_data(chamado.atualizado_em),
        "criado_em": formatar_data(chamado.criado_em),
        "usuario_nome": chamado.usuario.nome if chamado.usuario else None,
        "usuario_email": chamado.usuario.email if chamado.usuario else None,
        "respostas": serializar_respostas_chamado(chamado),
    }

def serializar_chamado_respostas(resposta):
    return {
        "id": resposta.id,
        "chamado_id": resposta.chamado_id,
        "usuario_id": resposta.usuario_id,
        "mensagem": resposta.mensagem,
        "tipo_autor": resposta.tipo_autor,
        "criado_em": formatar_data(resposta.criado_em),
        "usuario_nome": resposta.usuario.nome if resposta.usuario else None,
        "usuario_email": resposta.usuario.email if resposta.usuario else None,
    }

def serializar_chamado_usuario(chamado):
    return {
        "id": chamado.id,
        "titulo": chamado.titulo,
        "corpo": chamado.corpo,
        "urgencia": chamado.urgencia,
        "status": chamado.status,
        "criado_em": formatar_data(chamado.criado_em),
        "respostas": serializar_respostas_chamado(chamado),
    }

@chamados_bp.route("/menu/chamados/abrir-chamados/<int:id>", methods=["POST"])
def AbrirChamado(id):
    usuario = db.session.get(Users,id)
    dados = request.json

    if not usuario:
        return jsonify({
            "mensagem" : "Usuário não encontrado.",
            "type" : "error"
        }), 404

    if not dados:
        return jsonify({
            "mensagem" : "Erro ao abrir chamado.",
            "type" : "error"
        }), 400

    chamado = Chamados(
        titulo = dados.get("titulo"),
        corpo = dados.get("corpo"),
        urgencia = dados.get("urgencia"),
        status = "aberto",
        usuario_id = id
    )

    if not chamado.titulo or not chamado.corpo or not chamado.urgencia:
        return jsonify({
            "mensagem" : "Preencha todos os campos.",
            "type" : "error"
        }), 400

    db.session.add(chamado)
    db.session.commit()

    return jsonify({
        "mensagem" : "Chamado aberto.",
        "type": "success"
    }), 200

@chamados_bp.route("/menu/chamados/atualizar/<int:user_id>",methods=["GET"])
def atualizarChamados(user_id):
    chamados = Chamados.query.filter_by(usuario_id=user_id).all()
    if not chamados:
        return jsonify({
            "mensagem": "Não há chamados registrados",
            "type": "success",
        }),200
    else:
        return jsonify({
            "chamados": [
                serializar_chamado_usuario(chamado)
                for chamado in chamados
            ]
        }), 200

@chamados_bp.route("/menu/chamados/admin/atualizar",methods=["GET"])
def atualizarChamadosAdmin():
    data_inicio_param = request.args.get("data_inicio")
    data_fim_param = request.args.get("data_fim")
    filtro = request.args.get("filtro")

    data_inicio = converter_data_parametro(data_inicio_param)
    data_fim = converter_data_parametro(data_fim_param, fim_do_dia=True)

    query = Chamados.query

    filtros = []

    if data_inicio and data_fim:
        filtros.append(
            or_(
                Chamados.status == "aberto",
                and_(
                    Chamados.status.in_(["resolvido", "encerrado"]),
                    Chamados.atualizado_em >= data_inicio,
                    Chamados.atualizado_em <= data_fim
                )
            )
        )

    if filtro and filtro != "todos":
        filtros.append(Chamados.urgencia == filtro)

    if filtros:
        query = query.filter(and_(*filtros))

    chamados = query.order_by(Chamados.criado_em.desc()).all()

    return jsonify({
        "chamados": [
            serializar_chamado_admin(chamado)
            for chamado in chamados
        ]
    }), 200

@chamados_bp.route("/menu/chamados/admin/responder/<int:chamado_id>", methods=["POST"])
def responderChamadoAdmin(chamado_id):
    dados = request.json
    chamado = db.session.get(Chamados, chamado_id)

    if not chamado:
        return jsonify({
            "mensagem": "Chamado não encontrado.",
            "type": "error"
        }), 404

    if not dados:
        return jsonify({
            "mensagem": "Dados da resposta não enviados.",
            "type": "error"
        }), 400

    admin_id = dados.get("admin_id")
    admin = db.session.get(Users, admin_id)

    if not admin or admin.permissao != "admin":
        return jsonify({
            "mensagem": "Administrador não encontrado.",
            "type": "error"
        }), 404

    mensagem = (dados.get("mensagem") or "").strip()
    status = dados.get("status")
    status_permitidos = ["aberto", "encerrado", "resolvido"]

    if status not in status_permitidos:
        return jsonify({
            "mensagem": "Status inválido.",
            "type": "error"
        }), 400

    if not mensagem and status == chamado.status:
        return jsonify({
            "mensagem": "Escreva uma resposta ou altere o status.",
            "type": "error"
        }), 400

    agora = datetime.now(timezone.utc)
    status_anterior = chamado.status

    if mensagem:
        resposta = MensagensChamado(
            chamado_id=chamado.id,
            usuario_id=admin.id,
            mensagem=mensagem,
            tipo_autor="admin"
        )
        db.session.add(resposta)
        chamado.resposta = mensagem

    chamado.status = status
    chamado.admin_id = admin.id
    chamado.atualizado_em = agora

    if status in ["encerrado", "resolvido"]:
        chamado.fechado_em = agora

    if status == "aberto" and status_anterior != "aberto":
        chamado.reaberto_em = agora
        chamado.fechado_em = None
        chamado.quantidade_reaberturas += 1

    db.session.commit()

    return jsonify({
        "mensagem": "Chamado atualizado.",
        "type": "success",
        "chamado": serializar_chamado_admin(chamado)
    }), 200

@chamados_bp.route("/menu/chamados/responder/<int:chamado_id>", methods=["POST"])
def responderChamadoUsuario(chamado_id):
    dados = request.json
    chamado = db.session.get(Chamados, chamado_id)

    if not chamado:
        return jsonify({
            "mensagem": "Chamado não encontrado.",
            "type": "error"
        }), 404

    if not dados:
        return jsonify({
            "mensagem": "Dados da resposta não enviados.",
            "type": "error"
        }), 400

    usuario_id = dados.get("usuario_id")
    usuario = db.session.get(Users, usuario_id)

    if not usuario or chamado.usuario_id != usuario.id:
        return jsonify({
            "mensagem": "Usuário não autorizado para este chamado.",
            "type": "error"
        }), 403

    mensagem = (dados.get("mensagem") or "").strip()

    if not mensagem:
        return jsonify({
            "mensagem": "Escreva uma mensagem para responder.",
            "type": "error"
        }), 400

    respostas_admin = [
        resposta
        for resposta in chamado.mensagens
        if resposta.tipo_autor == "admin"
    ]

    if not respostas_admin:
        return jsonify({
            "mensagem": "Aguarde uma resposta do atendimento antes de responder.",
            "type": "error"
        }), 400

    agora = datetime.now(timezone.utc)
    status_anterior = chamado.status

    resposta = MensagensChamado(
        chamado_id=chamado.id,
        usuario_id=usuario.id,
        mensagem=mensagem,
        tipo_autor="usuario"
    )
    db.session.add(resposta)

    if status_anterior in ["encerrado", "resolvido"]:
        chamado.status = "aberto"
        chamado.reaberto_em = agora
        chamado.fechado_em = None
        chamado.quantidade_reaberturas += 1

    chamado.atualizado_em = agora
    db.session.commit()

    mensagem_retorno = "Chamado reaberto e resposta enviada." if status_anterior in ["encerrado", "resolvido"] else "Resposta enviada."

    return jsonify({
        "mensagem": mensagem_retorno,
        "type": "success",
        "chamado": serializar_chamado_usuario(chamado)
    }), 200
