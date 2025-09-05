/* script.js */

// MENU HANDLING
function showMenu() {
    document.getElementById('menu').style.display = '';
    document.getElementById('raadhetgetal').style.display = 'none';
    document.getElementById('flappybird').style.display = 'none';
    document.getElementById('tetris').style.display = 'none';
    document.getElementById('snake').style.display = 'none';
    stopFlappyBird();
    stopTetris();
    stopSnake();
}

function terugNaarMenu() {
    showMenu();
}

// RAAD HET GETAL SPEL
let getal;
function startRaadHetGetal() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('raadhetgetal').style.display = '';
    document.getElementById('flappybird').style.display = 'none';
    document.getElementById('tetris').style.display = 'none';
    document.getElementById('snake').style.display = 'none';
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

// FLAPPY BIRD SPEL
let canvas = document.getElementById('spelCanvas');
let ctx = canvas.getContext('2d');
let bird, pipes, pipeWidth, pipeGap, pipeSpeed, score, gameOver, flappyLoopId;

function startFlappyBird() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('raadhetgetal').style.display = 'none';
    document.getElementById('flappybird').style.display = '';
    document.getElementById('tetris').style.display = 'none';
    document.getElementById('snake').style.display = 'none';
    bird = { x: 60, y: 300, w: 30, h: 30, velocity: 0, gravity: 0.6, jump: -10 };
    pipes = [];
    pipeWidth = 50;
    pipeGap = 150;
    pipeSpeed = 2;
    score = 0;
    gameOver = false;
    document.getElementById('score').textContent = '';
    loop();
}
function stopFlappyBird() {
    gameOver = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function addPipe() {
    let top = Math.random() * (canvas.height - pipeGap - 80) + 40;
    pipes.push({ x: canvas.width, top: top, bottom: top + pipeGap });
}
function loop() {
    if (gameOver || document.getElementById('flappybird').style.display === 'none') return;
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    if (pipes.length === 0 || pipes[pipes.length-1].x < canvas.width - 200) addPipe();
    for (let i = 0; i < pipes.length; i++) pipes[i].x -= pipeSpeed;
    for (let i = 0; i < pipes.length; i++) {
        let p = pipes[i];
        if (
            bird.x + bird.w > p.x &&
            bird.x < p.x + pipeWidth &&
            (bird.y < p.top || bird.y + bird.h > p.bottom)
        ) endGame();
        if (!p.passed && p.x + pipeWidth < bird.x) { score++; p.passed = true; }
    }
    if (bird.y + bird.h > canvas.height || bird.y < 0) endGame();
    draw();
    pipes = pipes.filter(p => p.x + pipeWidth > 0);
    flappyLoopId = requestAnimationFrame(loop);
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffeb3b";
    ctx.fillRect(bird.x, bird.y, bird.w, bird.h);
    ctx.fillStyle = "#388e3c";
    pipes.forEach(p => {
        ctx.fillRect(p.x, 0, pipeWidth, p.top);
        ctx.fillRect(p.x, p.bottom, pipeWidth, canvas.height - p.bottom);
    });
    ctx.fillStyle = "#0277bd";
    ctx.font = "28px Arial";
    ctx.fillText("Score: " + score, 20, 40);
}
document.addEventListener('keydown', function(e) {
    if (document.getElementById('flappybird').style.display === '') {
        if (e.code === 'Space') {
            if (gameOver) startFlappyBird();
            else bird.velocity = bird.jump;
        }
    }
});
function endGame() {
    gameOver = true;
    document.getElementById('score').textContent = "Game Over! Je score: " + score + ". Druk op spatie om opnieuw te spelen.";
}

// TETRIS SPEL
let tetrisCanvas = document.getElementById('tetrisCanvas');
let tetrisCtx = tetrisCanvas.getContext('2d');
let tetrisBoard, tetrisScore, tetrisGameOver, tetrisPiece, tetrisInterval, tetrisNextDrop;

const COLS = 10, ROWS = 20, BLOCK_SIZE = 20;
const TETROMINOS = [
    [[1,1,1,1]], // I
    [[1,1,1],[0,1,0]], // T
    [[1,1,0],[0,1,1]], // S
    [[0,1,1],[1,1,0]], // Z
    [[1,1],[1,1]], // O
    [[1,0,0],[1,1,1]], // J
    [[0,0,1],[1,1,1]], // L
];
const COLORS = ["#00f0f0","#a020f0","#00f000","#f00000","#f0f000","#2020f0","#f0a000"];

function startTetris() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('raadhetgetal').style.display = 'none';
    document.getElementById('flappybird').style.display = 'none';
    document.getElementById('tetris').style.display = '';
    document.getElementById('snake').style.display = 'none';
    tetrisBoard = Array.from({length: ROWS}, ()=>Array(COLS).fill(0));
    tetrisScore = 0;
    tetrisGameOver = false;
    tetrisNextDrop = Date.now();
    document.getElementById('tetrisScore').textContent = '';
    newPiece();
    if (tetrisInterval) clearInterval(tetrisInterval);
    tetrisInterval = setInterval(tetrisLoop, 20);
    drawTetris();
}
function stopTetris() {
    tetrisGameOver = true;
    if (tetrisInterval) clearInterval(tetrisInterval);
    tetrisCtx.clearRect(0,0,tetrisCanvas.width,tetrisCanvas.height);
}
function newPiece() {
    const r = Math.floor(Math.random()*TETROMINOS.length);
    tetrisPiece = {
        tetro: TETROMINOS[r],
        color: COLORS[r],
        x: Math.floor(COLS/2)-1,
        y: 0,
        rotation: 0,
    };
    if (collides(tetrisPiece.tetro, tetrisPiece.x, tetrisPiece.y)) {
        tetrisGameOver = true;
        document.getElementById('tetrisScore').textContent = "Game Over! Je score: " + tetrisScore;
    }
}
function rotate(matrix) {
    return matrix[0].map((_,i)=>matrix.map(row=>row[i])).reverse();
}
function tetrisLoop() {
    if (tetrisGameOver || document.getElementById('tetris').style.display === 'none') return;
    if (Date.now()>tetrisNextDrop) {
        moveDown();
        tetrisNextDrop = Date.now()+500;
    }
    drawTetris();
}
function moveDown() {
    if (!collides(tetrisPiece.tetro, tetrisPiece.x, tetrisPiece.y+1)) {
        tetrisPiece.y++;
    } else {
        placePiece();
        clearLines();
        newPiece();
    }
}
function collides(tetro, x, y) {
    for (let r=0;r<tetro.length;r++) for(let c=0;c<tetro[r].length;c++) {
        if (tetro[r][c]) {
            let nx = x+c, ny = y+r;
            if (nx<0 || nx>=COLS || ny>=ROWS) return true;
            if (ny>=0 && tetrisBoard[ny][nx]) return true;
        }
    }
    return false;
}
function placePiece() {
    let t = tetrisPiece.tetro;
    for (let r=0;r<t.length;r++) for(let c=0;c<t[r].length;c++) {
        if (t[r][c]) {
            let nx = tetrisPiece.x+c, ny = tetrisPiece.y+r;
            if (ny>=0 && nx>=0 && nx<COLS && ny<ROWS)
                tetrisBoard[ny][nx] = COLORS.indexOf(tetrisPiece.color)+1;
        }
    }
}
function clearLines() {
    let lines = 0;
    for (let r=ROWS-1;r>=0;r--) {
        if (tetrisBoard[r].every(v=>v)) {
            tetrisBoard.splice(r,1);
            tetrisBoard.unshift(Array(COLS).fill(0));
            lines++;
            r++;
        }
    }
    if (lines>0) {
        tetrisScore += [0,40,100,300,1200][lines];
        document.getElementById('tetrisScore').textContent = "Score: " + tetrisScore;
    }
}
function drawTetris() {
    tetrisCtx.clearRect(0,0,tetrisCanvas.width,tetrisCanvas.height);
    // Board
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) {
        if (tetrisBoard[r][c]) {
            tetrisCtx.fillStyle = COLORS[tetrisBoard[r][c]-1];
            tetrisCtx.fillRect(c*BLOCK_SIZE,r*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
            tetrisCtx.strokeStyle = "#333";
            tetrisCtx.strokeRect(c*BLOCK_SIZE,r*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
        }
    }
    // Piece
    let t = tetrisPiece.tetro;
    tetrisCtx.fillStyle = tetrisPiece.color;
    for(let r=0;r<t.length;r++) for(let c=0;c<t[r].length;c++) {
        if (t[r][c]) {
            let nx = tetrisPiece.x+c, ny = tetrisPiece.y+r;
            if (ny>=0) {
                tetrisCtx.fillRect(nx*BLOCK_SIZE,ny*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
                tetrisCtx.strokeStyle = "#333";
                tetrisCtx.strokeRect(nx*BLOCK_SIZE,ny*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
            }
        }
    }
}

// Besturing Tetris
document.addEventListener('keydown', function(e) {
    if (document.getElementById('tetris').style.display === '') {
        if (tetrisGameOver) {
            startTetris();
            return;
        }
        if (e.code === 'ArrowLeft') {
            if (!collides(tetrisPiece.tetro, tetrisPiece.x-1, tetrisPiece.y)) tetrisPiece.x--;
        }
        if (e.code === 'ArrowRight') {
            if (!collides(tetrisPiece.tetro, tetrisPiece.x+1, tetrisPiece.y)) tetrisPiece.x++;
        }
        if (e.code === 'ArrowDown') {
            moveDown();
        }
        if (e.code === 'ArrowUp') {
            let rotated = rotate(tetrisPiece.tetro);
            if (!collides(rotated, tetrisPiece.x, tetrisPiece.y)) tetrisPiece.tetro = rotated;
        }
    }
});

// SNAKE SPEL
let snakeCanvas = document.getElementById('snakeCanvas');
let snakeCtx = snakeCanvas.getContext('2d');
let snake, snakeDir, snakeFood, snakeScore, snakeGameOver, snakeInterval;

function startSnake() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('raadhetgetal').style.display = 'none';
    document.getElementById('flappybird').style.display = 'none';
    document.getElementById('tetris').style.display = 'none';
    document.getElementById('snake').style.display = '';
    snake = [{x:10, y:10}];
    snakeDir = {x:1, y:0};
    snakeFood = {x:Math.floor(Math.random()*20), y:Math.floor(Math.random()*20)};
    snakeScore = 0;
    snakeGameOver = false;
    document.getElementById('snakeScore').textContent = '';
    if (snakeInterval) clearInterval(snakeInterval);
    snakeInterval = setInterval(snakeLoop, 100);
    drawSnake();
}

function stopSnake() {
    snakeGameOver = true;
    if (snakeInterval) clearInterval(snakeInterval);
    snakeCtx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
}

function snakeLoop() {
    if (snakeGameOver || document.getElementById('snake').style.display === 'none') return;
    let head = {x:snake[0].x + snakeDir.x, y:snake[0].y + snakeDir.y};
    // Check walls
    if (head.x<0 || head.x>=20 || head.y<0 || head.y>=20) {
        endSnake();
        return;
    }
    // Check self collision
    for(let i=0;i<snake.length;i++) {
        if (snake[i].x===head.x && snake[i].y===head.y) {
            endSnake();
            return;
        }
    }
    snake.unshift(head);
    // Check food
    if (head.x===snakeFood.x && head.y===snakeFood.y) {
        snakeScore++;
        document.getElementById('snakeScore').textContent = "Score: " + snakeScore;
        // Nieuwe food
        let valid = false;
        while(!valid) {
            snakeFood = {x:Math.floor(Math.random()*20), y:Math.floor(Math.random()*20)};
            valid = !snake.some(s=>s.x===snakeFood.x&&s.y===snakeFood.y);
        }
    } else {
        snake.pop();
    }
    drawSnake();
}

function drawSnake() {
    snakeCtx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    // Grid
    snakeCtx.strokeStyle = "#c0c0c0";
    for(let i=0;i<=20;i++) {
        snakeCtx.beginPath();
        snakeCtx.moveTo(i*20,0); snakeCtx.lineTo(i*20,400);
        snakeCtx.moveTo(0,i*20); snakeCtx.lineTo(400,i*20);
        snakeCtx.stroke();
    }
    // Food
    snakeCtx.fillStyle = "#ff3030";
    snakeCtx.fillRect(snakeFood.x*20, snakeFood.y*20, 20, 20);
    // Snake
    for(let i=0;i<snake.length;i++) {
        snakeCtx.fillStyle = i===0?"#008000":"#00cc00";
        snakeCtx.fillRect(snake[i].x*20, snake[i].y*20, 20, 20);
        snakeCtx.strokeStyle = "#fff";
        snakeCtx.strokeRect(snake[i].x*20, snake[i].y*20, 20, 20);
    }
}

document.addEventListener('keydown', function(e) {
    if (document.getElementById('snake').style.display === '') {
        if (snakeGameOver) {
            startSnake();
            return;
        }
        // Richting veranderen, geen omkeren!
        if (e.code === 'ArrowLeft' && snakeDir.x !== 1) {
            snakeDir = {x:-1,y:0};
        }
        if (e.code === 'ArrowRight' && snakeDir.x !== -1) {
            snakeDir = {x:1,y:0};
        }
        if (e.code === 'ArrowUp' && snakeDir.y !== 1) {
            snakeDir = {x:0,y:-1};
        }
        if (e.code === 'ArrowDown' && snakeDir.y !== -1) {
            snakeDir = {x:0,y:1};
        }
    }
});

function endSnake() {
    snakeGameOver = true;
    document.getElementById('snakeScore').textContent = "Game Over! Je score: " + snakeScore + ". Druk op een pijltje om opnieuw te spelen.";
}

// Start menu als pagina geladen is
showMenu();