const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = 610; // Alto del canvas
const window_width = 1350; // Ancho del canvas

canvas.height = window_height;
canvas.width = window_width;

canvas.style.backgroundImage = "url('assets/img/fondo.png')";
canvas.style.backgroundSize = "100% 100%";

// Variable para almacenar las coordenadas del mouse
let mouseX = 0;
let mouseY = 0;

// Variable para la posición del clic
let clickX = 0;
let clickY = 0;

// Variable para determinar si se hizo clic
let isMouseClicked = false;

// Variable para el puntaje
let score = 0;

// Variable para el puntaje más alto
let highestScore = 0;

// Variable para el temporizador
let timeLeft = 60; // 60 segundos

class Circle {
    constructor(x, y, radius, image, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.image = image; // Nuevo atributo para almacenar la imagen
        this.speed = speed;
        this.dx = 5 * this.speed;
        this.dy = 5 * this.speed;
    }

    draw(context) {
        context.drawImage(this.image, this.posX - this.radius, this.posY - this.radius, this.radius * 2, this.radius * 2); // Dibuja la imagen dentro del círculo
    }

    update(context) {
        this.draw(context);

        // Actualizar la posición del círculo según su velocidad
        this.posX += this.dx;
        this.posY += this.dy;

        // Verificar si el círculo ha salido del lienzo por el lado izquierdo o derecho
        if (this.posX - this.radius < 0) {
            this.posX = this.radius; // Ajustar la posición para mantener el círculo dentro del lienzo
            this.dx = Math.abs(this.dx); // Invertir la velocidad horizontal para hacer que rebote
        } else if (this.posX + this.radius > window_width) {
            this.posX = window_width - this.radius; // Ajustar la posición para mantener el círculo dentro del lienzo
            this.dx = -Math.abs(this.dx); // Invertir la velocidad horizontal para hacer que rebote
        }

        // Verificar si el círculo ha salido del lienzo por la parte superior o inferior
        if (this.posY - this.radius < 0) {
            this.posY = this.radius; // Ajustar la posición para mantener el círculo dentro del lienzo
            this.dy = Math.abs(this.dy); // Invertir la velocidad vertical para hacer que rebote
        } else if (this.posY + this.radius > window_height) {
            this.posY = window_height - this.radius; // Ajustar la posición para mantener el círculo dentro del lienzo
            this.dy = -Math.abs(this.dy); // Invertir la velocidad vertical para hacer que rebote
        }
    }
}

function getDistance(posX1, posY1, posX2, posY2) {
    return Math.sqrt(Math.pow((posX2 - posX1), 2) + Math.pow((posY2 - posY1), 2));
}

let image = new Image();
image.src = 'assets/img/fantasma.png'; // Ruta de la imagen

let circles = [];

// Función para generar los círculos iniciales
function generateCircles() {
    for (let i = 0; i < 10; i++) {
        let x = Math.random() * window_width; // Coordenada X aleatoria
        let y = Math.random() * window_height; // Coordenada Y aleatoria
        let radius = Math.random() * 20 + 30; // Radio aleatorio entre 30 y 50
        let speed = Math.random() * 2 + 4; // Velocidad aleatoria entre 4 y 6

        circles.push(new Circle(x, y, radius, image, speed));
    }
}

// Función para actualizar los círculos
function updateCircles() {
    requestAnimationFrame(updateCircles);
    ctx.clearRect(0, 0, window_width, window_height);
    circles.forEach(circle => {
        circle.update(ctx);
        checkCollisions(); // Verificar colisiones en cada iteración de actualización
    });

    if (circles.length === 0) {
        generateCircles();
    }
}

function checkCollisions() {
    for (let i = 0; i < circles.length; i++) {
        for (let j = 0; j < circles.length; j++) {
            if (i !== j) {
                if (getDistance(circles[i].posX, circles[i].posY, circles[j].posX, circles[j].posY) < (circles[i].radius + circles[j].radius)) {
                    // Calcular la nueva dirección para el primer círculo
                    const dx = circles[i].posX - circles[j].posX;
                    const dy = circles[i].posY - circles[j].posY;
                    const angle = Math.atan2(dy, dx);

                    circles[i].dx = Math.cos(angle) * circles[i].speed;
                    circles[i].dy = Math.sin(angle) * circles[i].speed;

                    // Calcular la nueva dirección para el segundo círculo
                    circles[j].dx = -Math.cos(angle) * circles[j].speed;
                    circles[j].dy = -Math.sin(angle) * circles[j].speed;
                }
            }
        }
    }
}

// Función para actualizar el temporizador
function updateTimer() {
    let startTime = Date.now();
    let elapsedTime = 0;

    function update() {
        let currentTime = Date.now();
        let deltaTime = currentTime - startTime;
        startTime = currentTime;
        elapsedTime += deltaTime;

        if (elapsedTime >= 1000) {
            elapsedTime -= 1000;
            timeLeft--;
            if (timeLeft <= 0) {
                endGame();
            } else {
                document.getElementById("timeDisplay").textContent = "Time Left: " + timeLeft + "s";
            }
        }
        requestAnimationFrame(update);
    }

    update();
}

// Función para reiniciar el juego cuando se acabe el tiempo
function endGame() {
    alert("Game Over. Your Score: " + score);
    updateHighScore(); // Actualizar el puntaje más alto
    score = 0; // Reiniciar el puntaje a cero
    timeLeft = 60; // Reiniciar el tiempo a 60 segundos
    circles = [];
    generateCircles();
    updateScoreDisplay(); // Actualizar la visualización del puntaje en la pantalla
}

// Función para actualizar el puntaje
function updateScore() {
    score++; // Aumenta el puntaje en uno
    updateScoreDisplay(); // Actualiza el contenido del div con el puntaje
}

// Función para actualizar el contenido del div con el puntaje
function updateScoreDisplay() {
    const scoreDisplay = document.getElementById("scoreDisplay");
    scoreDisplay.textContent = "Score: " + score;
}

// Función para actualizar el puntaje más alto en el localStorage
function updateHighScore() {
    highestScore = Math.max(score, highestScore);
    localStorage.setItem("highestScore", highestScore);
    updateHighScoreDisplay();
}

// Función para cargar el puntaje más alto desde el localStorage
function loadHighScoreFromLocalStorage() {
    highestScore = localStorage.getItem("highestScore") || 0;
    updateHighScoreDisplay();
}

// Función para actualizar el contenido del div con el puntaje más alto
function updateHighScoreDisplay() {
    document.getElementById("highestScoreDisplay").textContent = "Highest Score: " + highestScore;
}

// Llama a la función para cargar el puntaje más alto desde el localStorage
loadHighScoreFromLocalStorage();

// Llama a la función para actualizar el temporizador
updateTimer();

// Llama a la función para generar los círculos iniciales
generateCircles();

// Llama a la función para actualizar los círculos
updateCircles();

// Manejador de eventos para detectar el movimiento del mouse
canvas.addEventListener('mousemove', function(evt) {
    getMousePos(canvas, evt);
});

// Manejador de eventos para detectar el clic del mouse
canvas.addEventListener('mousedown', function(evt) {
    clickX = evt.clientX - canvas.getBoundingClientRect().left;
    clickY = evt.clientY - canvas.getBoundingClientRect().top;
    isMouseClicked = true;
    checkCircleClick(); // Llama a la función para verificar si se hizo clic en un círculo
});

// Función para obtener las coordenadas del mouse dentro del canvas
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    mouseX = evt.clientX - rect.left;
    mouseY = evt.clientY - rect.top;
}

function checkCircleClick() {
    circles.forEach((circle, index) => {
        const distance = getDistance(clickX, clickY, circle.posX, circle.posY);
        if (distance < circle.radius) {
            circles.splice(index, 1); // Elimina el círculo de la matriz de círculos
            updateScore(); // Actualiza el puntaje en la pantalla
        }
    });
}
