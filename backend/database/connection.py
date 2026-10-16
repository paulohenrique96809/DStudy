import os
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy

# Carrega as variáveis do arquivo .env
load_dotenv()

# Cria o objeto que vai gerenciar o banco de dados
db = SQLAlchemy()


def init_app(app):
    """
    Configura a conexão do Flask com o PostgreSQL.
    Recebe o app Flask e aplica as configurações do banco.
    """
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)