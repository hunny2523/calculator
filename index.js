const equalsTo= document.querySelector('[data-display]');
const display=document.querySelector('input');


const numbers=document.querySelector('[data-number]');
const operators=document.querySelector('[data-operator]');

const buttons=document.querySelector(".main-features");



buttons.addEventListener('click',(e)=>{
    console.log(e.target.dataset);
    let value=e.target.dataset;
    if(value.number){
        display.value+=value.number
    }
    else if(value.operator){
        if(checkPreviousElement()){
            display.value+=value.operator;
        }
    }
    else if(value.result){
        display.value=eval(display.value)
    }
    else if(value.value){
        display.value=""
    }
})

function checkPreviousElement(element){
    let displayLength=display.value.length;
    if(display.value.charAt(displayLength-1).match(/[0-9]/))
    {
        return true;
    }
    else{
        return false;
    }
}