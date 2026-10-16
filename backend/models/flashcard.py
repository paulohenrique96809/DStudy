from database.connection import db


class Flashcard(db.Model):
    __tablename__ = "flashcards"

    id = db.Column(db.Integer, primary_key=True)
    materia_id = db.Column(db.Integer, db.ForeignKey("materias.id"), nullable=False)
    pergunta = db.Column(db.Text, nullable=False)
    alt_a = db.Column(db.String(255), nullable=False)
    alt_b = db.Column(db.String(255), nullable=False)
    alt_c = db.Column(db.String(255), nullable=False)
    alt_d = db.Column(db.String(255), nullable=False)
    correta = db.Column(db.String(1), nullable=False)
    dificuldade = db.Column(db.Integer, nullable=False, default=1)