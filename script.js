document.addEventListener('keydown', function(e) {
    if (e.code === 'Enter') {
        if (document.getElementById('flappybird').style.display === '') startFlappyBird();
        if (document.getElementById('tetris').style.display === '') startTetris();
        if (document.getElementById('snake').style.display === '') startSnake();
        if (document.getElementById('raadhetgetal').style.display === '') startRaadHetGetal();
        if (document.getElementById('galgje').style.display === '') startGalgje();
    }
});
