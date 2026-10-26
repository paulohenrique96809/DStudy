import random
import sys
import os

# Adiciona a pasta backend ao caminho para importar os módulos
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app
from database.connection import db
from models.flashcard import Flashcard

LETRAS = ["a", "b", "c", "d"]


def embaralhar_flashcards():
    with app.app_context():
        flashcards = Flashcard.query.all()
        total = len(flashcards)
        alterados = 0

        for f in flashcards:
            # Monta a lista de textos das alternativas na ordem original
            textos = [f.alt_a, f.alt_b, f.alt_c, f.alt_d]

            # Encontra o texto da resposta correta atual
            indice_correto = LETRAS.index(f.correta)
            texto_correto = textos[indice_correto]

            # Escolhe uma nova letra aleatória para a correta
            nova_letra = random.choice(LETRAS)

            if nova_letra == f.correta:
                continue  # se sorteou a mesma letra, pula

            # Troca os textos: a nova letra recebe o texto correto,
            # e a letra antiga recebe o texto que estava na nova letra
            nova_posicao = LETRAS.index(nova_letra)
            textos[nova_posicao], textos[indice_correto] = textos[indice_correto], textos[nova_posicao]

            # Atualiza no model
            f.alt_a, f.alt_b, f.alt_c, f.alt_d = textos
            f.correta = nova_letra

            alterados += 1

        db.session.commit()

        print(f"Total de flashcards: {total}")
        print(f"Flashcards alterados: {alterados}")


if __name__ == "__main__":
    embaralhar_flashcards()