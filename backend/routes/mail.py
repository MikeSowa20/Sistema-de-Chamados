from flask_mail import Message
from flask import render_template
from config.mail import mail
from models.chamados import Chamados, MensagensChamado
from models.users import Users
from config.db import db

def enviar_email(chamado_id):
    chamado = db.session.get(Chamados,chamado_id)
    user = Users.query.filter_by(id = chamado.usuario_id).first()
    resposta = MensagensChamado.query.filter_by(chamado_id=chamado_id).order_by(MensagensChamado.id.desc()).first()

    msg = Message(
        subject="Chamado respondido!",
        recipients=[user.email]
    )

    msg.html = render_template(
        "resposta_email.html",
        nome=user.nome,
        titulo=chamado.titulo,
        resposta=resposta.mensagem,
        corpo=chamado.corpo,
        link="http://localhost:5173/login"
    )

    mail.send(msg)