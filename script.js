const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');
const winnerMessage = document.getElementById('winnerMessage');
const restartButton = document.getElementById('restartButton');
const pauseButton = document.getElementById('pauseButton');
const playerScoreElement = document.getElementById('playerScore');
const computerScoreElement = document.getElementById('computerScore');

// Canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Player paddles
const paddleWidth = 10;
const paddleHeight = 100;
const playerX = 10;
const aiX = canvas.width - paddleWidth - 10;

// Ball
const ballRadius = 10;

let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

let playerScore = 0;
let computerScore = 0;

let gameRunning = true;
let gamePaused = false;

// Draw elements
function drawRect(x, y, width, height) {
    context.fillStyle = 'white';
    context.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius) {
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

function updateScore() {
    playerScoreElement.textContent = `Player: ${playerScore}`;
    computerScoreElement.textContent = `Computer: ${computerScore}`;
}

function displayWinner(winner) {
    winnerMessage.textContent = winner + ' Wins!';
    winnerMessage.style.display = 'block';
    restartButton.style.display = 'block';
    pauseButton.style.display = 'none';
    gameRunning = false;
}

// Game logic
function update() {
    if (!gameRunning || gamePaused) return;

    // Move the ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom walls
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with player paddle
    if (ballX - ballRadius < playerX + paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Ball collision with AI paddle
    if (ballX + ballRadius > aiX && ballY > aiY && ballY < aiY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Ball out of bounds
    if (ballX - ballRadius < 0) {
        computerScore++;
        updateScore();
        if (computerScore >= 5) {
            displayWinner('Computer');
        } else {
            resetBall();
        }
    } else if (ballX + ballRadius > canvas.width) {
        playerScore++;
        updateScore();
        if (playerScore >= 5) {
            displayWinner('Player');
        } else {
            resetBall();
        }
    }

    // AI paddle movement
    aiY += (ballY - (aiY + paddleHeight / 2)) * 0.1;

    // Prevent AI paddle from going out of bounds
    if (aiY < 0) {
        aiY = 0;
    } else if (aiY + paddleHeight > canvas.height) {
        aiY = canvas.height - paddleHeight;
    }
}

// Reset the ball to the center
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 5;
    ballSpeedY = 5;
}

// Render the game
function render() {
    if (!gameRunning || gamePaused) return;

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    drawRect(playerX, playerY, paddleWidth, paddleHeight);
    drawRect(aiX, aiY, paddleWidth, paddleHeight);

    // Draw ball
    drawCircle(ballX, ballY, ballRadius);
}

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Restart the game
function restartGame() {
    playerY = (canvas.height - paddleHeight) / 2;
    aiY = (canvas.height - paddleHeight) / 2;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 5;
    ballSpeedY = 5;
    playerScore = 0;
    computerScore = 0;
    updateScore();
    winnerMessage.style.display = 'none';
    restartButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
    gameRunning = true;
    gamePaused = false;
    gameLoop();
}

// Pause the game
function pauseGame() {
    gamePaused = !gamePaused;
    pauseButton.textContent = gamePaused ? 'Resume' : 'Pause';
}

// Control player paddle with mouse
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    playerY = event.clientY - rect.top - root.scrollTop - paddleHeight / 2;
});

// Start the game
gameLoop();
