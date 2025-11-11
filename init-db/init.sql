-- Remove a tabela antiga se ela existir
DROP TABLE IF EXISTS words;

-- Cria a nova tabela para as perguntas do jogo
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL, -- 'cores', 'animais', 'comida'
    correct_answer VARCHAR(50) NOT NULL, -- A palavra em inglês
    image_path VARCHAR(100) NOT NULL -- O caminho para a imagem
);

-- Insere os dados de exemplo (5 de cada categoria)
-- Lembre-se de criar as pastas e colocar as imagens correspondentes!
INSERT INTO questions (category, correct_answer, image_path) VALUES
-- Animais
('animais', 'dog', 'images/animais/dog.png'),
('animais', 'cat', 'images/animais/cat.png'),
('animais', 'fish', 'images/animais/fish.png'),
('animais', 'bird', 'images/animais/bird.png'),
('animais', 'lion', 'images/animais/lion.png'),

-- Cores
('cores', 'red', 'images/cores/red.png'),
('cores', 'blue', 'images/cores/blue.png'),
('cores', 'green', 'images/cores/green.png'),
('cores', 'yellow', 'images/cores/yellow.png'),
('cores', 'purple', 'images/cores/purple.png'),

-- Comida
('comida', 'apple', 'images/comida/apple.png'),
('comida', 'banana', 'images/comida/banana.png'),
('comida', 'pizza', 'images/comida/pizza.png'),
('comida', 'cake', 'images/comida/cake.png'),
('comida', 'juice', 'images/comida/juice.png');