from datetime import datetime, timezone
from config.db import db

class Chamados(db.Model):
    __tablename__ = "chamados"

    id = db.Column(db.Integer, primary_key=True)

    titulo = db.Column(db.String(150), nullable=False)
    corpo = db.Column(db.Text, nullable=False)
    urgencia = db.Column(db.String(30), nullable=False)

    status = db.Column(db.String(30), default="aberto", nullable=False)

    fechado_em = db.Column(db.DateTime, nullable=True)
    reaberto_em = db.Column(db.DateTime, nullable=True)
    quantidade_reaberturas = db.Column(db.Integer, default=0, nullable=False)

    usuario_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    usuario = db.relationship(
        "Users",
        foreign_keys=[usuario_id],
        backref=db.backref("chamados_abertos", lazy=True)
    )

    admin_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    admin = db.relationship(
        "Users",
        foreign_keys=[admin_id],
        backref=db.backref("chamados_atendidos", lazy=True)
    )
    resposta = db.Column(db.Text, nullable=True)
    atualizado_em = db.Column(db.DateTime, nullable=True)

    criado_em = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

class MensagensChamado(db.Model):
    __tablename__ = "mensagens_chamado"

    id = db.Column(db.Integer, primary_key=True)

    chamado_id = db.Column(db.Integer, db.ForeignKey("chamados.id"), nullable=False)
    chamado = db.relationship(
        "Chamados",
        foreign_keys=[chamado_id],
        backref=db.backref("mensagens", lazy=True)
    )

    usuario_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    usuario = db.relationship(
        "Users",
        foreign_keys=[usuario_id],
        backref=db.backref("mensagens_chamado", lazy=True)
    )

    mensagem = db.Column(db.Text, nullable=False)
    tipo_autor = db.Column(db.String(30), nullable=False)

    criado_em = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
