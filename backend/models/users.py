from config.db import db

class Users(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String[100], unique=False)
    email = db.Column(db.String[125], unique=True)
    password = db.Column(db.String(255), nullable=False)
    permissao = db.Column(db.String[30], default="user")