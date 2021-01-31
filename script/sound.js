'use strict';


const carrotSound = new Audio('./sound/carrot_pull.mp3');
const alertSound = new Audio('./sound/alert.wav');
const bgSound = new Audio('./sound/bg.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const winSound = new Audio('./sound/game_win.mp3');

//export 문은 JavaScript 모듈에서 함수, 
//객체, 원시 값을 내보낼 때 사용합니다. 내보낸 값은 다른 프로그램에서 
//import 문으로 가져가 사용할 수 있습니다.
export function playCarrot() {
    playSound(carrotSound);
}
export function playBug() {
    playSound(bugSound);
}
export function playAlert() {
    playSound(alertSound);
}
export function playWin() {
    playSound(winSound);
}
export function playBackground() {
    playSound(bgSound);
}
export function stopBackground() {
    stopSound(bgSound);
}

function playSound(sound) {
    sound.currentTime = 0; //처음부터 다시 시작할수있게 해줌
    sound.play();
}
function stopSound(sound) {
    sound.pause();
}