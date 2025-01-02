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
    'assets/images/dusman3.png',
    'assets/images/dusman4.png',
    'assets/images/dusman5.png',
    'assets/images/dusman6.png',
    'assets/images/dusman7.png',
    'assets/images/dusman8.png',
    'assets/images/dusman9.png',
    'assets/images/dusman10.png',
    'assets/images/dusman11.png',
    'assets/images/dusman12.png',
    'assets/images/dusman13.png',
    'assets/images/dusman14.png',
    'assets/images/dusman15.png',
    'assets/images/dusman16.png',
    'assets/images/dusman17.png',
    'assets/images/dusman18.png',
    'assets/images/dusman19.png',
    'assets/images/dusman20.png',
    'assets/images/dusman21.png',
    'assets/images/dusman22.png',
    'assets/images/dusman23.png',
    'assets/images/dusman24.png',
    'assets/images/dusman25.png',
    'assets/images/dusman26.png',
    'assets/images/dusman27.png',
    'assets/images/dusman28.png'
].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

let truck = { x: 200, y: 500, width: 50, height: 80, speedX: 0, speedY: 0 };
let traffic = [];
let gameOver = false;
let gameStarted = false;
let roadOffset = 0; // For simulating road movement
let score = 0; // For tracking score
let speedMultiplier = 1; // Speed multiplier to increase game difficulty
let baseSpeed = 2; // Base speed of the game (modifiable by player)
let distanceTraveled = 0; // Distance traveled by the player

const bgMusic = new Audio('assets/sounds/basla2.mp3'); // Background music
const collisionSound = document.getElementById('collision-sound');
const startSound = new Audio('assets/sounds/basla.mp3'); // Start button sound

// Ensure background music loops
bgMusic.loop = true;

// Preload all images
function preloadImages(images, callback) {
    let loadedCount = 0;
    images.forEach(image => {
        image.onload = () => {
            loadedCount++;
            if (loadedCount === images.length) {
                callback();
            }
        };
        image.onerror = () => {
            console.error(`Failed to load image: ${image.src}`);
            loadedCount++;
            if (loadedCount === images.length) {
                callback();
            }
        };
    });
}

// Wait for images to preload before starting
preloadImages([roadImage, truckImage, ...trafficImages], () => {
    console.log('All images loaded successfully.');
    startButton.style.display = 'block'; // Show start button after images are loaded
});

// Start the game when the button is clicked
startButton.addEventListener('click', () => {
    gameStarted = true;
    startButton.style.display = 'none';

    startSound.play().then(() => {
        startSound.onended = () => {
            bgMusic.play();
        };
    }).catch(error => {
        console.error('Start sound could not play:', error);
        bgMusic.play();
    });

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
    // Shuffle traffic images to ensure no repeats until all are used
    let unusedImages = [...trafficImages]; // Copy of all images

    for (let i = 0; i < 5; i++) {
        const lane = Math.floor(Math.random() * 4) * 100 + 40;
        const carY = Math.random() * -canvas.height * 2; // Place cars randomly off-screen

        // Ensure unique images
        if (unusedImages.length === 0) {
            unusedImages = [...trafficImages]; // Reset if all images are used
        }
        const randomIndex = Math.floor(Math.random() * unusedImages.length);
        const image = unusedImages.splice(randomIndex, 1)[0]; // Remove and get the image

        traffic.push({ x: lane, y: carY, width: 50, height: 80, image, speedY: 1 });
    }
}

function drawTraffic() {
    traffic.forEach(car => {
        if (car.image.complete && car.image.naturalWidth > 0) {
            car.y += (car.speedY + baseSpeed * speedMultiplier) - truck.speedY / 5; // Cars move relative to player
            if (car.y > canvas.height) {
                car.y = -car.height; // Reset car position
                car.x = Math.floor(Math.random() * 4) * 100 + 40;

                // Benzersiz bir resim seç
                let unusedImages = [...trafficImages];
                traffic.forEach(trafficCar => {
                    unusedImages = unusedImages.filter(img => img !== trafficCar.image);
                });
                if (unusedImages.length === 0) unusedImages = [...trafficImages]; // Reset if all used
                const randomIndex = Math.floor(Math.random() * unusedImages.length);
                car.image = unusedImages.splice(randomIndex, 1)[0];

                score += 1; // Increase score when a car is passed
            }
            try {
                ctx.drawImage(car.image, car.x, car.y, car.width, car.height);
            } catch (error) {
                console.error(`Failed to draw image: ${car.image.src}`, error);
            }
        } else {
            console.warn(`Image not loaded or broken: ${car.image.src}`);
        }
    });
}

function drawRoad() {
    const speed = baseSpeed + speedMultiplier;
    roadOffset += speed; // Road moves faster with speedMultiplier
    distanceTraveled += speed * 0.1; // Increase distance traveled based on speed
    if (roadOffset > canvas.height) roadOffset = 0;
    ctx.drawImage(roadImage, 0, roadOffset - canvas.height, canvas.width, canvas.height);
    ctx.drawImage(roadImage, 0, roadOffset, canvas.width, canvas.height);
}

function drawScoreAndSpeed() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Patlak Skor: ${score}`, 10, 30);
    const speedKmh = Math.round((baseSpeed + speedMultiplier) * 20); // Convert speed to km/h
    const speedMph = Math.round(speedKmh * 0.621371); // Convert km/h to mph
    ctx.fillText(`Hız: ${speedKmh} km/h (${speedMph} mph)`, 10, 60);
    ctx.fillText(`Mesafe: ${Math.round(distanceTraveled)} km`, 10, 90);
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
    const sounds = ['assets/sounds/carpma1.mp3', 'assets/sounds/carpma2.mp3', 'assets/sounds/carpma3.mp3'];
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
    collisionSound.src = randomSound;
    collisionSound.play();
}

function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('PATLAK BASARAMADIN', 150, 320);
        ctx.fillText('F5 BAS LA GOT', 100, 360);
        bgMusic.pause();
        return;
    }

    // Gradually increase speedMultiplier based on score
    speedMultiplier = 1 + Math.min(2, score / 100); // SpeedMultiplier starts at 1 and caps at 3

    drawRoad();
    drawTruck();
    drawTraffic();
    drawScoreAndSpeed();
    checkCollision();
    requestAnimationFrame(gameLoop);
}
