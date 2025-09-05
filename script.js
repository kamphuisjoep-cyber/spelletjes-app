// MENU HANDLING
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
function terugNaarMenu() { showMenu(); }

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
let canvas = document.getElementById('spelCanvas');
let ctx = canvas.getContext('2d');
let bird, pipes, pipeWidth, pipeGap, pipeSpeed, score, gameOver, flappyLoopId;
function startFlappyBird() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('flappybird').style.display = '';
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
function stopFlappyBird() { gameOver = true; ctx.clearRect(0,0,canvas.width,canvas.height); }
function addPipe() { let top=Math.random()*(canvas.height-pipeGap-80)+40; pipes.push({x:canvas.width, top:top, bottom:top+pipeGap}); }
function loop() {
    if (gameOver || document.getElementById('flappybird').style.display==='none') return;
    bird.velocity+=bird.gravity; bird.y+=bird.velocity;
    if(pipes.length===0 || pipes[pipes.length-1].x<canvas.width-200) addPipe();
    for(let i=0;i<pipes.length;i++) pipes[i].x-=pipeSpeed;
    for(let i=0;i<pipes.length;i++){
        let p=pipes[i];
        if(bird.x+bird.w>p.x && bird.x<p.x+pipeWidth && (bird.y<p.top || bird.y+bird.h>p.bottom)) endGame();
        if(!p.passed && p.x+pipeWidth<bird.x){ score++; p.passed=true; }
    }
    if(bird.y+bird.h>
