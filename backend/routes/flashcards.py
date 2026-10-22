from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.flashcard import Flashcard
from models.progresso import Progresso

flashcards_bp = Blueprint("flashcards", __name__)


@flashcards_bp.route("/materias/<int:materia_id>/flashcards", methods=["GET"])
@jwt_required()
def listar_flashcards_por_materia(materia_id):
    usuario_id = int(get_jwt_identity())

    flashcards = (
        Flashcard.query
        .filter_by(materia_id=materia_id)
        .order_by(Flashcard.dificuldade)
        .all()
    )

    progressos = (
        Progresso.query
        .join(Flashcard, Progresso.flashcard_id == Flashcard.id)
        .filter(
            Progresso.usuario_id == usuario_id,
            Flashcard.materia_id == materia_id
        )
        .all()
    )

    progresso_por_flashcard = {p.flashcard_id: p for p in progressos}

    disponiveis = []
    for f in flashcards:
        progresso = progresso_por_flashcard.get(f.id)

        if not progresso:
            disponiveis.append(f)
            continue

        if progresso.dominado:
            continue

        if progresso.flashcards_restantes > 0:
            continue

        disponiveis.append(f)

    resultado = [
        {
            "id": f.id,
            "pergunta": f.pergunta,
            "alternativas": [f.alt_a, f.alt_b, f.alt_c, f.alt_d],
            "dificuldade": f.dificuldade,
        }
        for f in disponiveis
    ]

    return jsonify(resultado)