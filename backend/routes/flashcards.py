from flask import Blueprint, jsonify, request
from models.flashcard import Flashcard
from models.progresso import Progresso

flashcards_bp = Blueprint("flashcards", __name__)


@flashcards_bp.route("/materias/<int:materia_id>/flashcards", methods=["GET"])
def listar_flashcards_por_materia(materia_id):
    usuario_id = request.args.get("usuario_id")

    if not usuario_id:
        return jsonify({"erro": "usuario_id é obrigatório."}), 400

    # Todos os flashcards da matéria, ordenados por dificuldade
    flashcards = (
        Flashcard.query
        .filter_by(materia_id=materia_id)
        .order_by(Flashcard.dificuldade)
        .all()
    )

    # Progresso do usuário nessa matéria
    progressos = (
        Progresso.query
        .join(Flashcard, Progresso.flashcard_id == Flashcard.id)
        .filter(
            Progresso.usuario_id == usuario_id,
            Flashcard.materia_id == materia_id
        )
        .all()
    )

    # Mapeia: flashcard_id -> progresso
    progresso_por_flashcard = {p.flashcard_id: p for p in progressos}

    disponiveis = []
    for f in flashcards:
        progresso = progresso_por_flashcard.get(f.id)

        # Nunca visto
        if not progresso:
            disponiveis.append(f)
            continue

        # Já dominado: não aparece
        if progresso.dominado:
            continue

        # Ainda em espera: não aparece
        if progresso.flashcards_restantes > 0:
            continue

        # Pronto para voltar
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