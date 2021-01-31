'use strict';
import * as sound from './sound.js';

const CARROT_SIZE = 80;

export const ItemType = Object.freeze({
    carrot:'carrot',
    bug:'bug'
});

export class Field {
    constructor(carrotCount, bugCount){
        this.carrotCount = carrotCount;
        this.bugCount = bugCount;
        this.field = document.querySelector('.game__field'); 
        this.fieldRect = this.field.getBoundingClientRect();   //x와 y  width와 height를 가져올수있음.전체적인 사이즈.
        this.field.addEventListener('click', this.onClick);
        //함수를 어딘가에 인자로 전달할때 클래스 정보느 함께 전달되지 않음.
        //전달하고 싶다면 함수를 클래스와 바인딩 해줘야한다 . this바인딩.
        //this는 어떤 클레스 안에 있는 함수를 다른 콜백으로 전달할 때는 그함수가 포함되어져 있는 클래스의 정보가 사라진다.
        //그래서 클래스와 이함수를 묶을수 있는 this와 함수를 묶을수 있는 바인딩이 있다.
    }
    init() {
        this.field.innerHTML = '';
        this._addItem('carrot', this.carrotCount, '/img/carrot.png');
        this._addItem('bug', this.bugCount, '/img/bug.png');
        //벌레와 당근을 생성한뒤 field에 추가해줌
    }

    setClickListener(onItemClick) {
        this.onItemClick = onItemClick;
        //아이템이 클릭되면
    }

    _addItem(className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;
    const x2 = this.fieldRect.width - CARROT_SIZE; //필드의 사이즈를 가져오는데 
    const y2 = this.fieldRect.height - CARROT_SIZE;
        for(let i = 0; i <count ; i++){
            const item = document.createElement('img');
            item.setAttribute('class', className)
            item.setAttribute('src', imgPath)
            item.style.position = 'absolute';
            const x = randomNumber(x1, x2); // x1 부터 x2까지 랜덤한 값을 가져옴 
            const y = randomNumber(y1, y2);
            item.style.left = `${x}px`; //받아온 값을 left와 top에 넣어줌 .
            item.style.top = `${y}px`;
            this.field.appendChild(item);
        }
    }

    onClick = (event) => {
        const target = event.target;
        if(target.matches('.carrot')) {//클릭된 타겟이 캐럿 클래스가  맞으면
            //당근
            target.remove();
            sound.playCarrot();
            this.onItemClick && this.onItemClick(ItemType.carrot);
            //이 클래스 안에 this.onItemClick이 있다면 호출한다 뒤에것을  && 조건이 true이면 뒤에것이 호출이됨  
        } else if (target.matches('.bug')) {
            this.onItemClick && this.onItemClick(ItemType.bug);
        }
    }
}
//class상관없는 함수라면  밖에다가 빼둔이유는 똑같이 반복해서 오브젝트에 만들어지지 않아서 효율적임  static함수 

function randomNumber(min, max) {
    return Math.random() * (max - min) + min; 
    //정해진 min과 max 즉 x1 0 부터 필드의 사이즈 버위 안에서 max의 숫자는 빼고 랜덤한 숫자를 만들어줌 .
}