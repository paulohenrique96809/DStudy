from flask import Flask
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


# Cria a aplicação Flask
app = Flask(__name__)

CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
# Conecta o app ao banco de dados
init_app(app)

app.register_blueprint(materias_bp)
app.register_blueprint(flashcards_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(progresso_bp)


@app.route("/")
def home():
    return {"mensagem": "API no ar!"}


if __name__ == "__main__":
    app.run(debug=True)