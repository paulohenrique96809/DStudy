from flask import Blueprint, request, jsonify
from models.usuario import Usuario
from database.connection import db
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/cadastro", methods=["POST"])
def cadastro():
    dados = request.get_json()

    nome = dados.get("nome")
    email = dados.get("email")
    senha = dados.get("senha")

    if not nome or not email or not senha:
        return jsonify({"erro": "Nome, email e senha são obrigatórios."}), 400

    email_existente = Usuario.query.filter_by(email=email).first()
    if email_existente:
        return jsonify({"erro": "Email já cadastrado."}), 409

    senha_hash = generate_password_hash(senha)

    novo_usuario = Usuario(nome=nome, email=email, senha_hash=senha_hash)
    db.session.add(novo_usuario)
    db.session.commit()

    return jsonify({"mensagem": "Usuário cadastrado com sucesso!"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    dados = request.get_json()

    email = dados.get("email")
    senha = dados.get("senha")

    if not email or not senha:
        return jsonify({"erro": "Email e senha são obrigatórios."}), 400

    usuario = Usuario.query.filter_by(email=email).first()

    if not usuario or not check_password_hash(usuario.senha_hash, senha):
        return jsonify({"erro": "Credenciais inválidas."}), 401

    return jsonify({"mensagem": "Login realizado com sucesso!"}), 200