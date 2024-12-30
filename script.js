const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 480;
canvas.height = 640;

let truck = { x: 200, y: 500, width: 50, height: 80 };
let obstacles = [];
let gameOver = false;

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && truck.x > 0) truck.x -= 20;
    if (e.key === 'ArrowRight' && truck.x + truck.width < canvas.width) truck.x += 20;
});

function drawTruck() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(truck.x, truck.y, truck.width, truck.height);
}

function spawnObstacle() {
    const x = Math.random() * (canvas.width - 50);
    obstacles.push({ x, y: 0, width: 50, height: 80 });
}

function drawObstacles() {
    ctx.fillStyle = 'red';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        obstacle.y += 5;
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
            gameOver = true;
        }
    });
}

function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over!', 150, 320);
        ctx.fillText('Press F5 to Retry', 100, 360);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTruck();
    drawObstacles();
    checkCollision();
    requestAnimationFrame(gameLoop);
}

setInterval(spawnObstacle, 2000);
gameLoop();
