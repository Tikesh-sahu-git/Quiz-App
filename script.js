// Quiz questions
const quizQuestions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        answer: "Paris"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        answer: "Mars"
    },
    {
        question: "What is the largest mammal?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        answer: "Blue Whale"
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        answer: "Leonardo da Vinci"
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        answer: "Au"
    },
    {
        question: "Which language is primarily used for web development?",
        options: ["Java", "Python", "C++", "JavaScript"],
        answer: "JavaScript"
    },
    {
        question: "What is the tallest mountain in the world?",
        options: ["K2", "Mount Everest", "Kangchenjunga", "Lhotse"],
        answer: "Mount Everest"
    },
    {
        question: "Which country is home to the kangaroo?",
        options: ["New Zealand", "South Africa", "Australia", "Brazil"],
        answer: "Australia"
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        answer: "Pacific Ocean"
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        answer: "William Shakespeare"
    }
];

// DOM elements
const quizContent = document.getElementById('quiz-content');
const resultContainer = document.getElementById('result-container');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextButton = document.getElementById('next-btn');
const timerElement = document.getElementById('timer');
const progressElement = document.getElementById('progress');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-btn');
const progressBar = document.getElementById('progress-bar');

// Quiz variables
let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;
let selectedOption = null;
let quizCompleted = false;

// Shuffle array function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Create confetti effect
function createConfetti() {
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Start the quiz
function startQuiz() {
    shuffledQuestions = shuffleArray([...quizQuestions]);
    currentQuestionIndex = 0;
    score = 0;
    quizCompleted = false;
    quizContent.style.display = 'block';
    resultContainer.style.display = 'none';
    showQuestion();
}

// Show question with animation
function showQuestion() {
    resetState();
    if (currentQuestionIndex >= shuffledQuestions.length) {
        showResult();
        return;
    }

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    
    // Update progress bar
    const progressPercent = (currentQuestionIndex / shuffledQuestions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
    
    questionElement.textContent = currentQuestion.question;
    progressElement.textContent = `Question ${currentQuestionIndex + 1} of ${shuffledQuestions.length}`;

    // Animate question appearance
    questionElement.style.animation = 'none';
    void questionElement.offsetWidth; // Trigger reflow
    questionElement.style.animation = 'fadeIn 0.4s ease-out';

    // Clear options with fade out effect
    optionsElement.style.opacity = '0';
    setTimeout(() => {
        while (optionsElement.firstChild) {
            optionsElement.removeChild(optionsElement.firstChild);
        }

        // Add options with staggered animation
        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option');
            button.style.animationDelay = `${index * 0.1}s`;
            button.addEventListener('click', () => selectOption(option, button));
            optionsElement.appendChild(button);
        });

        optionsElement.style.opacity = '1';
    }, 300);

    startTimer();
}

// Reset state for new question
function resetState() {
    clearInterval(timer);
    timeLeft = 30;
    timerElement.textContent = `Time left: ${timeLeft}s`;
    timerElement.style.color = '#e74c3c';
    timerElement.classList.remove('warning');
    nextButton.disabled = true;
    selectedOption = null;
}

// Start timer for current question
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time left: ${timeLeft}s`;
        
        if (timeLeft <= 5) {
            timerElement.style.color = '#e74c3c';
            timerElement.classList.add('warning');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeUp();
        }
    }, 1000);
}

// Handle time up
function handleTimeUp() {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    
    options.forEach(button => {
        button.disabled = true;
        if (button.textContent === currentQuestion.answer) {
            button.classList.add('correct');
        }
    });
    
    nextButton.disabled = false;
}

// Select option with animation
function selectOption(option, button) {
    if (selectedOption !== null) return;
    
    selectedOption = option;
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    
    // Disable all options
    const options = document.querySelectorAll('.option');
    options.forEach(opt => {
        opt.disabled = true;
        opt.style.transform = 'none'; // Reset hover effect
    });
    
    // Highlight selected option with animation
    button.classList.add('selected');
    
    // Check if answer is correct
    if (option === currentQuestion.answer) {
        button.classList.add('correct');
        score++;
    } else {
        button.classList.add('incorrect');
        // Highlight correct answer
        options.forEach(opt => {
            if (opt.textContent === currentQuestion.answer) {
                opt.classList.add('correct');
            }
        });
    }
    
    clearInterval(timer);
    timerElement.classList.remove('warning');
    nextButton.disabled = false;
}

// Show result with celebration
function showResult() {
    quizContent.style.display = 'none';
    resultContainer.style.display = 'block';
    scoreElement.textContent = `Your score: ${score} out of ${shuffledQuestions.length}`;
    quizCompleted = true;
    
    // Complete progress bar
    progressBar.style.width = '100%';
    
    // Add confetti for good scores
    if (score >= shuffledQuestions.length * 0.7) {
        createConfetti();
    }
}

// Event listeners
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
        showQuestion();
    } else {
        showResult();
    }
});

restartButton.addEventListener('click', () => {
    // Remove any remaining confetti
    document.querySelectorAll('.confetti').forEach(el => el.remove());
    startQuiz();
});

// Start the quiz when the page loads
startQuiz();