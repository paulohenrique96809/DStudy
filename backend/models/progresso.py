from database.connection import db


class Progresso(db.Model):
    __tablename__ = "progresso_flashcard"
    __table_args__ = (
        db.UniqueConstraint("usuario_id", "flashcard_id", name="uq_usuario_flashcard"),
    )

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)
    flashcard_id = db.Column(db.Integer, db.ForeignKey("flashcards.id"), nullable=False)
    acertos_consecutivos = db.Column(db.Integer, default=0, nullable=False)
    total_acertos = db.Column(db.Integer, default=0, nullable=False)
    total_erros = db.Column(db.Integer, default=0, nullable=False)
    dominado = db.Column(db.Boolean, default=False, nullable=False)
    ultima_resposta = db.Column(db.String(10), nullable=True)
    flashcards_restantes = db.Column(db.Integer, nullable=False, default=0)