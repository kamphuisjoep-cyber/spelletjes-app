// GALGJE SPEL
let woorden = ["javascript", "python", "netlify", "github", "computer", "spelletje"];
let geheimWoord, goedeLetters, fouteLetters, fouten;

function startGalgje() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('raadhetgetal').style.display = 'none';
    document.getElementById('flappybird').style.display = 'none';
    document.getElementById('tetris').style.display = 'none';
    document.getElementById('snake').style.display = 'none';
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

    if (!display.includes("_")) {
        document.getElementById('galgje-resultaat').textContent = "🎉 Je hebt gewonnen!";
    } else if (fouten >= 6) {
        document.getElementById('galgje-resultaat').textContent = "❌ Verloren! Het woord was: " + geheimWoord;
    } else {
        document.getElementById('galgje-resultaat').textContent = "";
    }
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
