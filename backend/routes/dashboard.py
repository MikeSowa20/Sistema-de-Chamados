from flask import request,jsonify
from config.db import db
from flask import Blueprint
from models.chamados import Chamados
from models.users import Users
from datetime import datetime,timedelta,timezone

dashboard_bp = Blueprint("dashboard",__name__)

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

@dashboard_bp.route("/dashboard/chamados", methods=["GET"])
def dashboard_chamados():
    data_inicio_param = request.args.get("data_inicio")
    data_fim_param = request.args.get("data_fim")
    inicio_dias = request.args.get("inicio_dias_atras", type=int)
    fim_dias = request.args.get("fim_dias_atras", type=int)

    agora = datetime.now(timezone.utc)

    query = Chamados.query

    data_inicio = converter_data_parametro(data_inicio_param)
    data_fim = converter_data_parametro(data_fim_param, fim_do_dia=True)

    if data_inicio and data_fim:
        if data_inicio > data_fim:
            data_inicio, data_fim = data_fim.replace(hour=0, minute=0, second=0, microsecond=0), data_inicio.replace(hour=23, minute=59, second=59, microsecond=999999)

        query = query.filter(
            Chamados.criado_em >= data_inicio,
            Chamados.criado_em <= data_fim
        )

    elif inicio_dias is not None and fim_dias is not None:
        maior = max(inicio_dias, fim_dias)
        menor = min(inicio_dias, fim_dias)

        data_inicio = agora - timedelta(days=maior)
        data_fim = agora - timedelta(days=menor)

        query = query.filter(
            Chamados.criado_em >= data_inicio,
            Chamados.criado_em <= data_fim
        )

    chamados = query.all()

    abertos = [c for c in chamados if c.status =="aberto"]
    resolvidos = [c for c  in chamados if c.status=="resolvido"]
    encerrados = [c for c in chamados if c.status =="encerrado"]
    reabertos = [c for c in chamados if c.quantidade_reaberturas > 0]
    altos = [c for c in chamados if c.urgencia == "alta"]
    baixas = [c for c in chamados if c.urgencia == "baixa"]
    medias = [c for c in chamados if c.urgencia =="media"]
    urgentes = [c for c in chamados if c.urgencia =="urgente"]

    return jsonify({
        "total": len(chamados),

        "status": {
            "abertos": len(abertos),
            "resolvidos": len(resolvidos),
            "encerrados": len(encerrados),
            "reabertos": len(reabertos),
        },

        "urgencia": {
            "alta": len(altos),
            "media": len(medias),
            "baixa": len(baixas),
            "urgente": len(urgentes),
        }
    }), 200

    
