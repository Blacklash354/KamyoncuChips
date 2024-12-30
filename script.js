const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
canvas.width = 480;
canvas.height = 640;

// Load images
const roadImage = new Image();
roadImage.src = 'assets/images/yol.png';

const truckImage = new Image();
truckImage.src = 'assets/images/chips.png';

const enemyImages = [
    'assets/images/dusman1.png',
    'assets/images/dusman2.png',
    'assets/images/dusman3.png'
].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

let truck = { x: 200, y: 500, width: 50, height: 80 };
let obstacles = [];
let gameOver = false;
let gameStarted = false;

const bgMusic = document.getElementById('bg-music');
const collisionSound = document.getElementById('collision-sound');

// Start the game when the button is clicked
startButton.addEventListener('click', () => {
    gameStarted = true;
    startButton.style.display = 'none';
    bgMusic.play();
    gameLoop();
});

document.addEventListener('keydown', (e) => {
    if (!gameStarted) return;
    if (e.key === 'ArrowLeft' || e.key === 'a') truck.x -= 10;
    if (e.key === 'ArrowRight' || e.key === 'd') truck.x += 10;
    if (e.key === 'ArrowUp' || e.key === 'w') truck.y -= 10;
    if (e.key === 'ArrowDown' || e.key === 's') truck.y += 10;

    if (truck.x < 0) truck.x = 0;
    if (truck.x + truck.width > canvas.width) truck.x = canvas.width - truck.width;
    if (truck.y < 0) truck.y = 0;
    if (truck.y + truck.height > canvas.height) truck.y = canvas.height - truck.height;
});

function drawTruck() {
    ctx.drawImage(truckImage, truck.x, truck.y, truck.width, truck.height);
}

function spawnObstacle() {
    if (!gameStarted) return;
    const x = Math.random() * (canvas.width - 60) + 30; // Keep within road bounds
    const speed = 2 + Math.random() * 3;
    const image = enemyImages[Math.floor(Math.random() * enemyImages.length)];
    obstacles.push({ x, y: 0, width: 50, height: 80, speed, image });
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        obstacle.y += obstacle.speed;
    });
}

function checkCollision() {
    obstacles.forEach(obstacle => {
        if (
            truck.x < obstacle.x + obstacle.width &&
            truck.x + truck.width > obstacle.x &&
            truck.y < obstacle.y + obstacle.height &&
            truck.y + truck.height > obstacle.y
        ) {
            playCollisionSound();
            gameOver = true;
        }
    });
}

function playCollisionSound() {
    const sounds = ['assets/sounds/collision1.mp3', 'assets/sounds/collision2.mp3', 'assets/sounds/collision3.mp3'];
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
    collisionSound.src = randomSound;
    collisionSound.play();
}

function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over!', 150, 320);
        ctx.fillText('Press F5 to Retry', 100, 360);
        bgMusic.pause();
        return;
    }

    ctx.drawImage(roadImage, 0, 0, canvas.width, canvas.height);
    drawTruck();
    drawObstacles();
    checkCollision();
    requestAnimationFrame(gameLoop);
}

setInterval(spawnObstacle, 1000);
