from flask import Blueprint, jsonify
from models.materia import Materia

materias_bp = Blueprint("materias", __name__)


@materias_bp.route("/materias", methods=["GET"])
def listar_materias():
    materias = Materia.query.all()
    resultado = [
        {
            "id": m.id,
            "nome": m.nome,
            "descricao": m.descricao,
        }
        for m in materias
    ]
    return jsonify(resultado)