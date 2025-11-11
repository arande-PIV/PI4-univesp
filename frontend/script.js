document.addEventListener('DOMContentLoaded', () => {
    // Telas
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultsScreen = document.getElementById('results-screen');

    // Botões
    const startGameBtn = document.getElementById('start-game-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const playAgainBtn = document.getElementById('play-again-btn');

    // Elementos do Jogo
    const questionCounterEl = document.getElementById('question-counter');
    const questionImageEl = document.getElementById('question-image');
    const optionsContainer = document.getElementById('options-container');

    // Elementos de Resultado
    const resultTitleEl = document.getElementById('result-title');
    const resultScoreEl = document.getElementById('result-score');
    const resultRecommendationEl = document.getElementById('result-recommendation');

    // Estado do Jogo
    let questions = [];
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let selectedAnswer = null;

    // --- Funções de Controle de Tela ---
    function showScreen(screen) {
        startScreen.classList.remove('active');
        gameScreen.classList.remove('active');
        resultsScreen.classList.remove('active');
        screen.classList.add('active');
    }

    // --- Lógica do Jogo ---
    async function startGame() {
        try {
            const response = await fetch('/api/game/start');
            questions = await response.json();
            currentQuestionIndex = 0;
            userAnswers = [];
            showScreen(gameScreen);
            displayQuestion();
        } catch (error) {
            console.error("Falha ao iniciar o jogo:", error);
            alert("Não foi possível carregar as perguntas. Tente novamente.");
        }
    }

    function displayQuestion() {
        selectedAnswer = null;
        nextQuestionBtn.disabled = true;
        const question = questions[currentQuestionIndex];

        questionCounterEl.textContent = `Pergunta ${currentQuestionIndex + 1} de ${questions.length}`;
        questionImageEl.src = question.image_path;
        optionsContainer.innerHTML = '';

        question.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option-btn');
            button.addEventListener('click', () => handleOptionSelect(button, option));
            optionsContainer.appendChild(button);
        });
    }

    function handleOptionSelect(button, option) {
        // Deseleciona o botão anterior
        const previouslySelected = optionsContainer.querySelector('.selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }
        // Seleciona o novo botão
        button.classList.add('selected');
        selectedAnswer = option;
        nextQuestionBtn.disabled = false;
    }

    function handleNextQuestion() {
        userAnswers.push({
            question_id: questions[currentQuestionIndex].id,
            selected_answer: selectedAnswer
        });

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            showResults();
        }
    }
    
    async function showResults() {
        try {
            const response = await fetch('/api/game/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userAnswers)
            });
            const result = await response.json();
            
            resultScoreEl.textContent = `Você acertou ${result.score} de ${result.total}!`;
            if (result.recommendation === 'parabens') {
                resultTitleEl.textContent = 'Parabéns!';
                resultRecommendationEl.innerHTML = 'Você acertou todas as perguntas! 🥳';
            } else {
                resultTitleEl.textContent = 'Fim de Jogo!';
                resultRecommendationEl.innerHTML = `Que tal estudar um pouco mais sobre: <strong>${result.recommendation.charAt(0).toUpperCase() + result.recommendation.slice(1)}</strong>`;
            }
            showScreen(resultsScreen);
        } catch (error) {
            console.error("Falha ao enviar resultados:", error);
            alert("Não foi possível carregar os resultados. Tente novamente.");
        }
    }

    // --- Event Listeners ---
    startGameBtn.addEventListener('click', startGame);
    nextQuestionBtn.addEventListener('click', handleNextQuestion);
    playAgainBtn.addEventListener('click', () => showScreen(startScreen));
});