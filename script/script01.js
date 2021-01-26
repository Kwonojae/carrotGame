'use strict';
const CARROT_SIZE = 80;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 20;

const field = document.querySelector('.game__field'); 
const fieldRect =  field.getBoundingClientRect();   //x와 y  width와 height를 가져올수있음.전체적인 사이즈.
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const popUp = document.querySelector('.pop-up');
const popUpText = document.querySelector('.pop-up__message');
const popUpRefresh = document.querySelector('.pop-up__refresh');

const carrotSound = new Audio('./sound/carrot_pull.mp3')
const alertSound = new Audio('./sound/alert.wav')
const bgSound = new Audio('./sound/bg.mp3')
const bugSound = new Audio('./sound/bug_pull.mp3')
const winSound = new Audio('./sound/game_win.mp3')

let started = false; // 게임 시작 확인
let score = 0;  //최종적인 점수를 기억함
let timer = undefined; // 총 남아있는 시간 . 게임이 시작 하지않으면 undefined

field.addEventListener('click', onFieldClick);
gameBtn.addEventListener('click', () => {
    if(started) {//
        console.log('started : ' + started); //false가 시작 true가 정지 
        stopGame();
    } else {
        console.log('started : ' + started);
        startGame();
    }
})

popUpRefresh.addEventListener('click', () => {
    startGame();
    hidePopUp();
})

function startGame() {
    started = true;
    initGame();
    showStopButton();
    showTimerAndScore();
    startGameTimer();
    playSound(bgSound);
}

function stopGame() {
    started = false;
    stopGameTimer();
    hideGameButton();
    showPopUpWithText('REPLAY?');
    playSound(alertSound);
    stopSound(bgSound);
}
function finishGame(win) {
    started = false;
    hideGameButton();
    if(win) {
        playSound(winSound);
    } else {
        playSound(bugSound);
    }
    stopGameTimer();
    stopSound(bgSound);
    showPopUpWithText(win? 'YOU WON 🌻' : 'YOU LOST 💦')
}
function showStopButton() {
    const icon = gameBtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    gameBtn.style.visibility = 'visible';
}
function hideGameButton() {
    gameBtn.style.visibility = 'hidden';
}

function startGameTimer() {
    let remainingTimeSec = GAME_DURATION_SEC; //남아있는 시간동안 인터벌이 진행 5초동안 인터벌을 유지함.
    updateTimerText(remainingTimeSec); // 처음 시작 값 5 
    timer = setInterval(()=> {//Interval이 1초마다 불려질때 
        if (remainingTimeSec <= 0) { //남아 있는 시간이 0초보다 작거나 같다면 
            clearInterval(timer);
            finishGame(CARROT_COUNT === score);
            return;
        }
        updateTimerText(--remainingTimeSec); // 한바퀴 돌때마다 1씩 감소 
    },1000);//1초마다 진행  
}
function stopGameTimer() {
    clearInterval(timer);
}
function updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    gameTimer.innerText = `${minutes}:${seconds}`;
}
function showPopUpWithText(text) {
    popUpText.innerText = text;
    popUp.classList.remove('pop-up--hide');
}

function hidePopUp() {
    popUp.classList.add('pop-up--hide');
}


function showTimerAndScore() {
    gameTimer.style.visibility = 'visible';
    gameScore.style.visibility = 'visible';
}

function initGame() {
    score = 0;
    field.innerHTML = '';
    gameScore.innerText = CARROT_COUNT;
    //벌레와 당근을 생성한뒤 field에 추가해줌
    console.log(fieldRect);
    addItem('carrot', CARROT_COUNT, '/img/carrot.png')
    addItem('bug', BUG_COUNT, '/img/bug.png')
}

function onFieldClick(event) {
    if (!started) {
        return;
    }
    const target = event.target;
    if(target.matches('.carrot')) {//클릭된 타겟이 캐럿 클래스가  맞으면
        //당근
        target.remove();
        score++;
        playSound(carrotSound);
        updateScoreBoard();
        if(score === CARROT_COUNT) {
            finishGame(true);
        }
    } else if (target.matches('.bug')) {
        finishGame(false);
    }
}

function playSound(sound) {
    sound.currentTime = 0; //처음부터 다시 시작할수있게 해줌
    sound.play();
}
function stopSound(sound) {
    sound.pause();
}

function updateScoreBoard() {
    gameScore.innerText = CARROT_COUNT - score;
}
function addItem(className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;
    const x2 = fieldRect.width - CARROT_SIZE; //필드의 사이즈를 가져오는데 
    const y2 = fieldRect.height - CARROT_SIZE;
    for(let i = 0; i <count ; i++){
        const item = document.createElement('img');
        item.setAttribute('class', className)
        item.setAttribute('src', imgPath)
        item.style.position = 'absolute';
        const x = randomNumber(x1, x2); // x1 부터 x2까지 랜덤한 값을 가져옴 
        const y = randomNumber(y1, y2);
        item.style.left = `${x}px`; //받아온 값을 left와 top에 넣어줌 .
        item.style.top = `${y}px`;
        field.appendChild(item);
    }
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min; 
    //정해진 min과 max 즉 x1 0 부터 필드의 사이즈 버위 안에서 max의 숫자는 빼고 랜덤한 숫자를 만들어줌 .
}