'use strict';
import * as sound from './sound.js';
import {Field, ItemType } from './field.js';

export const Reason = Object.freeze({
    win: 'win',
    lose:'lose',
    cancel:'cancel'
});

//Builder Pattern : 무언가 오브젝트를 만들 때 Builder Pattern을 이용해서 오브젝트를
//간단 명료하고 가독성이 좋게 만들수 있따.
export class GameBuilder {
    gameDuration(duration) {
        this.gameDuration = duration;
        return this;//클레스 자체를 리턴함.
    }

    carrotCount(num) {
        this.carrotCount = num;
        return this;
    }
    bugCount(num) {
        this.bugCount = num;
        return this;
    }
    
    build() {
        return new Game(
            this.gameDuration,//
            this.carrotCount,
            this.bugCount
        );
    }
}

class Game {
    constructor(gameDuration, carrotCount, bugCount) {
        this.gameDuration = gameDuration;
        this.carrotCount = carrotCount;
        this.bugCount = bugCount;

        this.gameTimer = document.querySelector('.game__timer');
        this.gameScore = document.querySelector('.game__score');
        this.gameBtn = document.querySelector('.game__button');

        this.gameBtn.addEventListener('click', () => {
            if(this.started) {//
                 //false가 시작 true가 정지 
                this.stop(Reason.cancel);
            } else {
                this.start();
            }
        })

        this.gameField = new Field(carrotCount, bugCount);
        this.gameField.setClickListener(this.onItemClick);

        this.started = false; // 게임 시작 확인
        this.score = 0;  //최종적인 점수를 기억함
        this.timer = undefined; // 총 남아있는 시간 . 게임이 시작 하지않으면 undefinthis.

    }

    setGameStopListener(onGameStop) {
        //게임이 끝나면 알려주는 콜백 부분
        this.onGameStop = onGameStop;
    }
    start() {
        this.started = true;
        this.initGame();
        this.showStopButton();
        this.showTimerAndScore();
        this.startGameTimer();
        sound.playBackground();
    }
    
    stop(reason) {
        this.started = false;
        this.stopGameTimer();
        this.hideGameButton();
        sound.stopBackground();
        this.onGameStop && this.onGameStop(reason);
    }
    onItemClick = (item) => {
        //바인딩.
        if (!this.started) {
            return;
        }
        if (item === ItemType.carrot) {
            this.score++;
            this.updateScoreBoard();
            if(this.score === this.carrotCount) {
                this.stop(Reason.win);
            }
        } else if (item === ItemType.bug) {
            this.stop(Reason.lose);
        }
        
    }
    
    showStopButton() {
        const icon = this.gameBtn.querySelector('.fas');
        icon.classList.add('fa-stop');
        icon.classList.remove('fa-play');
        this.gameBtn.style.visibility = 'visible';
    }
    hideGameButton() {
        this.gameBtn.style.visibility = 'hidden';
    }

    startGameTimer() {
        let remainingTimeSec = this.gameDuration; //남아있는 시간동안 인터벌이 진행 5초동안 인터벌을 유지함.
        this.updateTimerText(remainingTimeSec); // 처음 시작 값 5 
        this.timer = setInterval(()=> {//Interval이 1초마다 불려질때 
            if (remainingTimeSec <= 0) { //남아 있는 시간이 0초보다 작거나 같다면 
                clearInterval(this.timer);
                this.stop(this.carrotCount === this.score ? Reason.win : Reason.lose);
                return;
            }
            this.updateTimerText(--remainingTimeSec); // 한바퀴 돌때마다 1씩 감소 
        },1000);//1초마다 진행  
    }
    
    stopGameTimer() {
        clearInterval(this.timer);
    }

    updateTimerText(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        this.gameTimer.innerText = `${minutes}:${seconds}`;
    }

    showTimerAndScore() {
        this.gameTimer.style.visibility = 'visible';
        this.gameScore.style.visibility = 'visible';
    }

    initGame() {
        this.score = 0;
        this.gameScore.innerText = this.carrotCount;
        this.gameField.init();
    }

    updateScoreBoard() {
        this.gameScore.innerText = this.carrotCount - this.score;
    }
}