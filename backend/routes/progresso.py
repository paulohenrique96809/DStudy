from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.flashcard import Flashcard
from models.progresso import Progresso
from models.materia import Materia
from database.connection import db

progresso_bp = Blueprint("progresso", __name__)


@progresso_bp.route("/responder", methods=["POST"])
@jwt_required()
def responder():
    usuario_id = int(get_jwt_identity())
    dados = request.get_json()

    flashcard_id = dados.get("flashcard_id")
    resposta = dados.get("resposta")

    if not flashcard_id or not resposta:
        return jsonify({"erro": "flashcard_id e resposta são obrigatórios."}), 400

    flashcard = Flashcard.query.get(flashcard_id)
    if not flashcard:
        return jsonify({"erro": "Flashcard não encontrado."}), 404

    acertou = resposta.lower() == flashcard.correta.lower()

    progresso = Progresso.query.filter_by(
        usuario_id=usuario_id,
        flashcard_id=flashcard_id
    ).first()

    if not progresso:
        progresso = Progresso(
            usuario_id=usuario_id,
            flashcard_id=flashcard_id,
            acertos_consecutivos=0,
            total_acertos=0,
            total_erros=0,
            dominado=False,
            flashcards_restantes=0
        )
        db.session.add(progresso)

    if acertou:
        progresso.acertos_consecutivos += 1
        progresso.total_acertos += 1
        progresso.ultima_resposta = "acertou"

        if progresso.acertos_consecutivos >= 3:
            progresso.dominado = True
            progresso.flashcards_restantes = 0
        elif progresso.acertos_consecutivos == 2:
            progresso.flashcards_restantes = 3
        else:
            progresso.flashcards_restantes = 5
    else:
        progresso.acertos_consecutivos = 0
        progresso.total_erros += 1
        progresso.ultima_resposta = "errou"
        progresso.flashcards_restantes = 7

    outros = Progresso.query.filter(
        Progresso.usuario_id == usuario_id,
        Progresso.flashcard_id != flashcard_id,
        Progresso.dominado == False,
        Progresso.flashcards_restantes > 0
    ).all()

    for p in outros:
        p.flashcards_restantes -= 1

    db.session.commit()

    return jsonify({
        "acertou": acertou,
        "dominado": progresso.dominado,
        "acertos_consecutivos": progresso.acertos_consecutivos,
        "flashcards_restantes": progresso.flashcards_restantes
    }), 200


@progresso_bp.route("/materias/<int:materia_id>/progresso", methods=["GET"])
@jwt_required()
def progresso_materia(materia_id):
    usuario_id = int(get_jwt_identity())

    materia = Materia.query.get(materia_id)
    if not materia:
        return jsonify({"erro": "Matéria não encontrada."}), 404

    total_flashcards = Flashcard.query.filter_by(materia_id=materia_id).count()

    dominados = (
        Progresso.query
        .join(Flashcard, Progresso.flashcard_id == Flashcard.id)
        .filter(
            Progresso.usuario_id == usuario_id,
            Progresso.dominado == True,
            Flashcard.materia_id == materia_id
        )
        .count()
    )

    if total_flashcards == 0:
        percentual = 0
    else:
        percentual = round((dominados / total_flashcards) * 100)

    return jsonify({
        "materia": materia.nome,
        "total_flashcards": total_flashcards,
        "dominados": dominados,
        "percentual": percentual
    }), 200                                                                                                                                                 