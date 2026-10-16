from database.connection import db


class Materia(db.Model):
    __tablename__ = "materias"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    descricao = db.Column(db.Text, nullable=True)