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

const trafficImages = [
    'assets/images/dusman1.png',
    'assets/images/dusman2.png',
    'assets/images/dusman3.png'
].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

let truck = { x: 200, y: 500, width: 50, height: 80, speedX: 0, speedY: 0 };
let traffic = [];
let gameOver = false;
let gameStarted = false;

const bgMusic = document.getElementById('bg-music');
const collisionSound = document.getElementById('collision-sound');

// Start the game when the button is clicked
startButton.addEventListener('click', () => {
    gameStarted = true;
    startButton.style.display = 'none';
    bgMusic.play();
    initTraffic();
    gameLoop();
});

// Handle key press for smooth movement
document.addEventListener('keydown', (e) => {
    if (!gameStarted) return;
    if (e.key === 'ArrowLeft' || e.key === 'a') truck.speedX = -5;
    if (e.key === 'ArrowRight' || e.key === 'd') truck.speedX = 5;
    if (e.key === 'ArrowUp' || e.key === 'w') truck.speedY = -5;
    if (e.key === 'ArrowDown' || e.key === 's') truck.speedY = 5;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'ArrowRight' || e.key === 'd') truck.speedX = 0;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'ArrowDown' || e.key === 's') truck.speedY = 0;
});

function drawTruck() {
    truck.x += truck.speedX;
    truck.y += truck.speedY;

    if (truck.x < 0) truck.x = 0;
    if (truck.x + truck.width > canvas.width) truck.x = canvas.width - truck.width;
    if (truck.y < 0) truck.y = 0;
    if (truck.y + truck.height > canvas.height) truck.y = canvas.height - truck.height;

    ctx.drawImage(truckImage, truck.x, truck.y, truck.width, truck.height);
}

function initTraffic() {
    // Initialize traffic cars
    for (let i = 0; i < 5; i++) {  // Reduced traffic cars
        const lane = Math.floor(Math.random() * 4) * 100 + 40;
        const carY = Math.random() * -canvas.height * 2; // Start off-screen
        const image = trafficImages[Math.floor(Math.random() * trafficImages.length)];
        traffic.push({ x: lane, y: carY, width: 50, height: 80, image, speed: 1 + Math.random() * 2 }); // Slower speed
    }
}

function drawTraffic() {
    traffic.forEach(car => {
        ctx.drawImage(car.image, car.x, car.y, car.width, car.height);
        car.y += car.speed; // Cars move down
        if (car.y > canvas.height) {
            car.y = -car.height; // Reset car position
            car.x = Math.floor(Math.random() * 4) * 100 + 40;
        }
    });
}

function checkCollision() {
    traffic.forEach(car => {
        if (
            truck.x < car.x + car.width &&
            truck.x + truck.width > car.x &&
            truck.y < car.y + car.height &&
            truck.y + truck.height > car.y
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
    drawTraffic();
    checkCollision();
    requestAnimationFrame(gameLoop);
}
