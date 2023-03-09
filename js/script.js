let pcPoints = 0;
let playerPoints = 0;
let roundCounter = 1;

const buttons = Array.from(document.querySelectorAll('.choiceBtn'));
const butonStart = document.querySelector('button.startPlay');
const butonRestart = document.querySelectorAll('button.restart');

const machineScore = Array.from(document.querySelectorAll('.machinePoint'));
const playerScore = Array.from(document.querySelectorAll('.playerPoint'));
const machineChoice = document.querySelector('#machineChoice');
const slider = document.querySelector('.slider');

const divEndGame = document.querySelector('#endGame');

const restultTimer = 700;

// I like the result of the console game I created 
// and because of that, I didn't remove it.

// GAME FUNCTIONS

function gameOver() {
    return pcPoints == 5 || playerPoints == 5
};
function capitalyze(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

function isTheWinner() {
    disableButtons();
    console.error('THE GAME IS FUCKIN OVER!');
    if (pcPoints > playerPoints) {
        showEndGame("lost");
        console.log('%c HAHA, LOOSER!', 'color:red;');
    } else if (pcPoints < playerPoints) {
        showEndGame("won");
        console.log('%c NICE! YOU WON THE GAME!', 'color: green;');
    };
};

function computerPlay() {
    const randomNum = Math.floor(Math.random() * 3);

    switch (randomNum) {
        case 0: {
            showPcSelection('0');
            return 'ROCK';
        }
        case 1: {
            showPcSelection('1');
            return 'PAPER';
        }
        case 2: {
            showPcSelection('2');
            return 'SCISSOR';
        }
    };
};

function playRound(playerSelection) {
    let roundResult = '';
    const pcMove = computerPlay();
    const playerMove = playerSelection.target.getAttribute('data-value').toUpperCase();

    // send pc Selection to UI

    // setting the round result
    if (pcMove == playerMove) {
        roundResult = "It's a Tie!";
    } else if (
        (pcMove == 'ROCK' && playerMove == 'SCISSOR') ||
        (pcMove == 'PAPER' && playerMove == 'ROCK') ||
        (pcMove == 'SCISSOR' && playerMove == 'PAPER')) {
        ++pcPoints;
        roundResult = "You Lose!";
        addScore(machineScore, pcPoints);
    } else {
        ++playerPoints;
        roundResult = "You Win!";
        addScore(playerScore, playerPoints);
    };
    showRoundResult(roundResult);

    if (gameOver()) {
        isTheWinner();
        return
    }
    gameContinue(); // continue playing

    // printing round results on console
    console.warn(`Round: %c${roundCounter}`, 'color: red;');
    console.log(`${capitalyze('You')}: ${capitalyze(playerMove)}`);
    console.log(`Pc: ${capitalyze(pcMove)}`);
    console.log(`Points:\nPc: ${pcPoints}\nYou: ${playerPoints}`);
    console.log(`%c${roundResult.toUpperCase()}`, 'color: white;');
    ++roundCounter;
};


// UI

function disableButtons() {
    buttons.forEach(button => {
        button.classList.add('disabled')
    });
};

function enableButtons() {
    buttons.forEach(button => {
        button.classList.remove('disabled');
    });
};

function gameContinue() {

    disableButtons();

    setTimeout(() => {
        machineChoice.removeChild(machineChoice.firstChild);
        machineChoice.appendChild(slider);
        enableButtons();
    }, restultTimer);
};

function fadeOut(disable, dontRemove, transitionTime) {

    // Created a function displayNone to use on eventListner insted of anonnymous function
    // so this way I can use the removeEventListner.
    // Then removing the eventListner. This solved the problem with displayNone
    // auto change without calling fadeOut().

    const displayNone = function () {
        disable.classList.add('displayNone');
        disable.removeEventListener('transitionend', displayNone);
    };

    if (transitionTime) disable.style.transitionDuration = transitionTime;

    disable.classList.remove('visible');
    disable.classList.add('hidden');

    if (dontRemove != true) {
        disable.addEventListener('transitionend', displayNone);
    };
};

function fadeIn(enable, timer, transitionTime) {
    if (!timer) timer = 10;

    if (transitionTime) enable.style.transitionDuration = transitionTime;
    if (enable.classList.contains('displayNone')) {
        enable.classList.remove('displayNone');
    };
    setTimeout(() => {
        enable.classList.remove('hidden');
        enable.classList.add('visible');
    }, timer);
};

function startPlaying() {
    const gameScreen = document.querySelector('#theGame');
    const toCloseOpeningScreen = document.querySelector('#openingScreen');
    const fadeStart = 600;

    fadeOut(toCloseOpeningScreen);
    toCloseOpeningScreen.addEventListener('transitionend', () => fadeIn(gameScreen, fadeStart));

};

function showPcSelection(pcResult) {
    const imgArray = ['./imgs/rockR.png', './imgs/paperR.png', './imgs/scissorR.png'];
    const img = document.createElement('img');

    while (machineChoice.firstChild) {
        machineChoice.removeChild(machineChoice.firstChild);
    };

    img.src = imgArray[pcResult];
    img.width = '70';
    machineChoice.appendChild(img);
};

function addScore(playerPoint, point) {
    playerPoint[point - 1].classList.add('winnerPoint');
};

function showRoundResult(result) {
    const divResult = document.querySelector('#roundResult');
    const para = divResult.querySelector('p');

    para.textContent = result;
    para.classList.add('hidden');

    if (result == "It's a Tie!") {
        para.style.color = 'yellow';
    } else if (result == "You Lose!") {
        para.style.color = 'red';
    } else para.style.color = 'green';

    divResult.appendChild(para);

    fadeIn(para);

    setTimeout(() => {
        fadeOut(para, true);
    }, restultTimer);
};

function showEndGame(result) {
    const screenToShow = document.querySelector(`#${result}`);
    const pointsResult = `<h3>Result:</h3> <h3>${playerPoints} x ${pcPoints}</h3>`;
    const finalScore = screenToShow.querySelector('.finalScore');

    finalScore.innerHTML = pointsResult;
    fadeIn(divEndGame);
    fadeIn(screenToShow);
};

function gameRestart() {
    const removeScorePoints = Array.from(document.querySelectorAll('.winnerPoint'));
    const resultScore = divEndGame.querySelector('.visible')

    // reset score
    pcPoints = 0;
    playerPoints = 0;
    removeScorePoints.forEach(e => { e.classList.remove('winnerPoint') });
    console.clear();

    //reset rounds
    roundCounter = 1;

    gameContinue();

    // close Game Result
    fadeOut(divEndGame, true);
    fadeOut(resultScore);
};

// using keyboard

function controls(e) {
    const control = document.querySelector(`div[data-key="${e.keyCode}"]`);
    if (gameOver()) return
    if (!control) return;
    control.click();
};

// playing the game
buttons.forEach(button => button.addEventListener('click', playRound));
window.addEventListener('keydown', controls);

// start playing
butonStart.addEventListener('click', startPlaying);

// reset game
butonRestart.forEach(e => e.addEventListener('click', gameRestart));