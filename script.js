// ================= MENU =================
function showMenu() {
    document.getElementById('menu').style.display = '';
    document.getElementById('raadhetgetal').style.display = 'none';
    document.getElementById('flappybird').style.display = 'none';
    document.getElementById('tetris').style.display = 'none';
    document.getElementById('snake').style.display = 'none';
    document.getElementById('galgje').style.display = 'none';
    stopFlappyBird();
    stopTetris();
    stopSnake();
}

function terugNaarMenu() {
    showMenu();
}

// ================= RAAD HET GETAL =================
let getal;
function startRaadHetGetal() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('raadhetgetal').style.display = '';
    document.getElementById('resultaat').textContent = '';
    getal = Math.floor(Math.random() * 10) + 1;
}

document.getElementById('raad-knop').addEventListener('click', function() {
    const antwoord = prompt('Raad het getal tussen 1 en 10:');
    if (parseInt(antwoord) === getal) {
        document.getElementById('resultaat').textContent = 'Goed geraden! Het getal was ' + getal;
    } else {
        document.getElementById('resultaat').textContent = 'Helaas, het getal was ' + getal;
    }
    getal = Math.floor(Math.random() * 10) + 1;
});

// ================= FLAPPY BIRD =================
let flappyCanvas = document.getElementById('flappyCanvas');
let flappyCtx = flappyCanvas.getContext('2d');
let bird, pipes, pipeWidth, pipeGap, pipeSpeed, score, flappyGameOver, flappyLoopId;

function startFlappyBird() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('flappybird').style.display = '';
    bird = { x: 60, y: 300, w: 30, h: 30, velocity: 0, gravity: 0.6, jump: -10 };
    pipes = [];
    pipeWidth = 50;
    pipeGap = 150;
    pipeSpeed = 2;
    score = 0;
    flappyGameOver = false;
    document.getElementById('score').textContent = '';
    loopFlappy();
}

function stopFlappyBird() {
    flappyGameOver = true;
    flappyCtx.clearRect(0, 0, flappyCanvas.width, flappyCanvas.height);
}

function addPipe() {
    let top = Math.random() * (flappyCanvas.height - pipeGap - 80) + 40;
    pipes.push({ x: flappyCanvas.width, top: top, bottom: top + pipeGap });
}

function loopFlappy() {
    if (flappyGameOver || document.getElementById('flappybird').style.display === 'none') return;

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (pipes.length === 0 || pipes[pipes.length - 1].x < flappyCanvas.width - 200) addPipe();

    for (let p of pipes) p.x -= pipeSpeed;

    for (let p of pipes) {
        if (bird.x + bird.w > p.x && bird.x < p.x + pipeWidth && (bird.y < p.top || bird.y + bird.h > p.bottom)) endFlappy();
        if (!p.passed && p.x + pipeWidth < bird.x) {
            score++;
            p.passed = true;
        }
    }

    if (bird.y + bird.h > flappyCanvas.height || bird.y < 0) endFlappy();

    drawFlappy();
    pipes = pipes.filter(p => p.x + pipeWidth > 0);
    flappyLoopId = requestAnimationFrame(loopFlappy);
}

function drawFlappy() {
    flappyCtx.clearRect(0, 0, flappyCanvas.width, flappyCanvas.height);
    flappyCtx.fillStyle = "#ffeb3b";
    flappyCtx.fillRect(bird.x, bird.y, bird.w, bird.h);
    flappyCtx.fillStyle = "#388e3c";
    pipes.forEach(p => {
        flappyCtx.fillRect(p.x, 0, pipeWidth, p.top);
        flappyCtx.fillRect(p.x, p.bottom, pipeWidth, flappyCanvas.height - p.bottom);
    });
    flappyCtx.fillStyle = "#0277bd";
    flappyCtx.font = "28px Arial";
    flappyCtx.fillText("Score: " + score, 20, 40);
}

document.addEventListener('keydown', function(e) {
    if (document.getElementById('flappybird').style.display === '') {
        if (e.code === 'Space') {
            if (flappyGameOver) startFlappyBird();
            else bird.velocity = bird.jump;
        }
    }
});

function endFlappy() {
    flappyGameOver = true;
    document.getElementById('score').textContent = "Game Over! Je score: " + score + ". Druk op spatie om opnieuw te spelen.";
}

// ================= TETRIS =================
// (Gebruik dezelfde code zoals in je eerdere tetris-code, let op id="tetrisCanvas")

// ================= SNAKE =================
// (Gebruik dezelfde code zoals in je eerdere snake-code, let op id="snakeCanvas")

// ================= GALGJE =================
let woorden = ["javascript", "python", "netlify", "github", "computer", "spelletje"];
let geheimWoord, goedeLetters, fouteLetters, fouten;

function startGalgje() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('galgje').style.display = '';
    geheimWoord = woorden[Math.floor(Math.random() * woorden.length)];
    goedeLetters = [];
    fouteLetters = [];
    fouten = 0;
    updateGalgjeDisplay();
}

function updateGalgjeDisplay() {
    let display = "";
    for (let letter of geheimWoord) {
        display += goedeLetters.includes(letter) ? letter + " " : "_ ";
    }
    document.getElementById('galgje-woord').textContent = display;
    document.getElementById('foute-letters').textContent = fouteLetters.join(", ");
    document.getElementById('fout-teller').textContent = fouten;
    if (!display.includes("_")) document.getElementById('galgje-resultaat').textContent = "🎉 Je hebt gewonnen!";
    else if (fouten >= 6) document.getElementById('galgje-resultaat').textContent = "❌ Verloren! Het woord was: " + geheimWoord;
    else document.getElementById('galgje-resultaat').textContent = "";
}

function raadLetter() {
    let invoer = document.getElementById('galgje-invoer').value.toLowerCase();
    document.getElementById('galgje-invoer').value = "";
    if (!invoer.match(/[a-z]/) || invoer.length !== 1) return;
    if (geheimWoord.includes(invoer)) {
        if (!goedeLetters.includes(invoer)) goedeLetters.push(invoer);
    } else {
        if (!fouteLetters.includes(invoer)) {
            fouteLetters.push(invoer);
            fouten++;
        }
    }
    updateGalgjeDisplay();
}

// ================= ENTER RESET =================
document.addEventListener('keydown', function(e) {
    if (e.code === 'Enter') {
        if (document.getElementById('flappybird').style.display === '') startFlappyBird();
        if (document.getElementById('tetris').style.display === '') startTetris();
        if (document.getElementById('snake').style.display === '') startSnake();
        if (document.getElementById('raadhetgetal').style.display === '') startRaadHetGetal();
        if (document.getElementById('galgje').style.display === '') startGalgje();
    }
});

// Start menu bij laden
showMenu();
