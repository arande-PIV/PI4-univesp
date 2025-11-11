import os
import random
import psycopg2
from flask import Flask, jsonify, request
from psycopg2.extras import RealDictCursor

app = Flask(__name__)

# Função para obter conexão com o banco de dados
def get_db_connection():
    conn = psycopg2.connect(
        os.environ.get('DATABASE_URL'),
        cursor_factory=RealDictCursor
    )
    return conn

@app.route('/api/game/start')
def start_game():
    """
    Prepara e retorna uma lista de 15 perguntas para o jogo.
    5 de cada categoria, com 4 alternativas cada.
    """
    conn = get_db_connection()
    cur = conn.cursor()

    categories = ['animais', 'cores', 'comida']
    full_quiz = []
    all_words_by_category = {}

    # Pega todas as palavras de cada categoria para usar como distratores
    for category in categories:
        cur.execute("SELECT correct_answer FROM questions WHERE category = %s", (category,))
        rows = cur.fetchall()
        all_words_by_category[category] = [row['correct_answer'] for row in rows]

    # Monta o quiz com 5 perguntas de cada categoria
    for category in categories:
        cur.execute("SELECT * FROM questions WHERE category = %s ORDER BY RANDOM() LIMIT 5", (category,))
        questions_for_category = cur.fetchall()

        for question in questions_for_category:
            options = [question['correct_answer']]
            distractors = list(filter(lambda x: x != question['correct_answer'], all_words_by_category[category]))
            options.extend(random.sample(distractors, 3))
            random.shuffle(options)
            
            full_quiz.append({
                "id": question['id'],
                "category": question['category'],
                "image_path": question['image_path'],
                "options": options
            })

    cur.close()
    conn.close()
    return jsonify(full_quiz)

@app.route('/api/game/submit', methods=['POST'])
def submit_game():
    """
    Recebe as respostas do usuário, calcula o resultado e retorna a recomendação.
    """
    user_answers = request.json
    
    conn = get_db_connection()
    cur = conn.cursor()

    score = 0
    errors_by_category = {'animais': 0, 'cores': 0, 'comida': 0}

    for answer in user_answers:
        cur.execute("SELECT correct_answer, category FROM questions WHERE id = %s", (answer['question_id'],))
        correct_info = cur.fetchone()
        
        if correct_info and correct_info['correct_answer'] == answer['selected_answer']:
            score += 1
        else:
            category = correct_info['category']
            errors_by_category[category] += 1
    
    cur.close()
    conn.close()

    if score == 15:
        recommendation = "parabens"
    else:
        # Lógica "ML": recomenda a categoria com mais erros
        recommendation = max(errors_by_category, key=errors_by_category.get)

    return jsonify({
        "score": score,
        "total": len(user_answers),
        "recommendation": recommendation
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0')