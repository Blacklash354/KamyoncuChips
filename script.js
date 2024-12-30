const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 480;
canvas.height = 640;

let truck = { x: 200, y: 500, width: 50, height: 80 };
let obstacles = [];
let gameOver = false;

const bgMusic = document.getElementById('bg-music');
const collisionSound = document.getElementById('collision-sound');
bgMusic.play();

document.addEventListener('keydown', (e) => {
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
    ctx.fillStyle = 'blue';
    ctx.fillRect(truck.x, truck.y, truck.width, truck.height);
}

function spawnObstacle() {
    const x = Math.random() * (canvas.width - 50);
    const speed = 2 + Math.random() * 3;
    obstacles.push({ x, y: 0, width: 50, height: 80, speed });
}

function drawObstacles() {
    ctx.fillStyle = 'red';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTruck();
    drawObstacles();
    checkCollision();
    requestAnimationFrame(gameLoop);
}

setInterval(spawnObstacle, 1000);
gameLoop();
