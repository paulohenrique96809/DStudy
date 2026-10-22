import os
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from database.connection import db, init_app
from models.usuario import Usuario
from models.materia import Materia
from models.flashcard import Flashcard
from models.progresso import Progresso
from routes.materias import materias_bp
from routes.flashcards import flashcards_bp
from routes.auth import auth_bp
from routes.progresso import progresso_bp

app = Flask(__name__)
init_app(app)

# Configuração do JWT
app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")
jwt = JWTManager(app)

# Configuração do CORS
CORS(app, origins=["http://localhost:5500", "http://127.0.0.1:5500", "http://localhost:3000", "http://127.0.0.1:3000"])

# Registra as rotas
app.register_blueprint(materias_bp)
app.register_blueprint(flashcards_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(progresso_bp)


@app.route("/")
def home():
    return {"mensagem": "API no ar!"}


if __name__ == "__main__":
    app.run(debug=True)