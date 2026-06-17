from flask import requesq,jsonify
from config.db import db
from flask import Blueprint
from models.chamados import Chamados
from models.users import Users

dashboard_db = Blueprint("dashboard",__name__)

@dashboard_db.route("/menu/dashboard/informações", methods=["GET"])
def informações():
    chamados = Chamados.query.all()
    
    