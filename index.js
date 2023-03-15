const equalsTo = document.querySelector('[data-display]');
const display = document.querySelector('input');


const numbers = document.querySelector('[data-number]');
const operators = document.querySelector('[data-operator]');

const buttons = document.querySelector(".main-features");


buttons.addEventListener('click', (e) => {
    console.log(e.target.dataset);
    let value = e.target.dataset;

    if (value.number) {
        display.value += value.number
    }
    else if (value.operator) {
        if (checkPreviousElement()) {
            display.value += value.operator;
        }
    }
    else if (value.result) {
        if(checkForNumber(display.value)){
            console.log("valid");
            display.value=postfixEvaluation(display.value);
        }
        else{
            display.value="";
        }
    }
    else if (value.unary) {
        display.value += value.unary;
        // display.value=evaluateUnaryOperation(value.unary)
    }
    else if (value.value) {
        console.log(value.value);
        display.value += value.value;
    }
    else if (value.clear) {
        display.value = "";
    }
    else if (value.backspace) {
        display.value = removeLastElement(display.value);
    }
})

function checkPreviousElement(element) {
    let displayLength = display.value.length;
    if (display.value.charAt(displayLength - 1).match(/[0-9]/)) {
        return true;
    }
    else {
        return false;
    }
}

function checkForNumber(expression) {
    console.log(expression);
    if(expression.match(/[a-df-z]/gi)){
        alert("invalid input")
        return false;
    }
    return true;
}

// function evaluateUnaryOperation(operator){
//     let value=display.value;
//     if(checkForNumber(value)){
//         switch (operator) {
//             case mod:
//                 return
//                 break;

//             default:
//                 break;
//         }
//     }
//     else{
//         log("unvalid")
//     }
// }


function removeLastElement(value) {
    return value.slice(0, value.length - 1);
}





function infixToPostFix(expression) {
    expression = "(" + expression + ")";
    console.log("expression: "+expression);
    let output = "";
    let i=0;
    const stack = [];
    while (i<expression.length) {
        char=expression[i]
      
        if (!isNaN(char)) {
            console.log(output+"output");
            output += char;
            i++;
            while(!isNaN(expression[i]) || expression[i]=="."){
                output+=expression[i];
                i++;
            }
            output+=" ";

           
        }
        else if (char == "(") {
            stack.push(char);
            i++;
        }
        else if (char == ".") {
            output+=char
            i++;
        }
        else if (char == ")") {
            while (stack.slice(-1) != "(") {
                output +=stack.pop();
                output+=" ";
            }
            stack.pop();
            i++;
        }
        else {

            if (getPrecedence(stack.slice(-1)) >= getPrecedence(char)) {
                while (getPrecedence(stack.slice(-1)) >= getPrecedence(char)) {
                    output += stack.pop();
                  
                }
                stack.push(char);
            }
            else{
                stack.push(char);
            }
            output+=" "
            i++;
        }
    }
    return output;
}

function getPrecedence(char) {
    if (char == "*" || char == "/" || char == "%") {
        return 2;
    }
    else if (char == "+" || char == "-") {
        return 1;
    }
    else if (char == "^") {
        return 3;
    }
    else if (char == "(") {
        return 0;
    }
    else {
        return -1;
    }
}





function postfixEvaluation(expression){
    let postfixResult=infixToPostFix(expression);
    let arr=postfixResult.replaceAll(/  +/g, ' ').trim().split(" ");

    let stack=[];
    let i=0;
    let x,y;
    for(i=0;i<arr.length;i++){
        if(!isNaN(arr[i])){
            stack.push(arr[i])
        }
        else{
            y=Number(stack.pop());
            x=Number(stack.pop());
            switch(arr[i]){
                case "+":
                    temp=x+y; break;
                case "-":
                    temp=x-y; break;
                case "*":
                    temp=x*y; break;
                case "/":
                    temp=x/y; break;
                case "^":
                    temp=x**y; break;
                case "%":
                    temp=x%y; break;
                default:
                    alert("error");
                }
            stack.push(temp);
        }
    }
    return stack.pop();
}

























// console.log("hello");
// let result=infixToPostFix("13*5+6");
// console.log("result "+result);
// function infixToPostFix(expression) {
//     expression = "(" + expression + ")";
//     console.log("expression: "+expression);
//     let output = "";
//     let i=0
//     const stack = [];
//     let temp;
//     for (i=0;i<expression.length;i++) {
//         char=expression[i]
//         console.log(char);
//         if (!isNaN(char)) {
//             console.log(output+"output");
//             console.log(char+"char");
//             console.log(("___"+typeof output.slice(-1)+output.slice(-1)));
//             if (isNaN(output.slice(-1))) {
//                 console.log("there");
//                 output += char
//                 console.log("after"+output);
//             }
//             else {
//                 console.log("hereee");
//                 output += " ";
//                 output += char;
//             }
//         }
//         else if (char == "(") {
//             stack.push(char);
//         }
//         else if (char == ")") {
//             while (stack.slice(-1) != "(") {
//                 output +=stack.pop();
//             }
//             stack.pop();
//         }
//         else {

//             if (getPrecedence(stack.slice(-1)) >= getPrecedence(char)) {
//                 while (getPrecedence(stack.slice(-1)) >= getPrecedence(char)) {
//                     output += stack.pop();
//                 }
//                 stack.push(char);
//             }
//             else{
//                 stack.push(char);
//             }
//         }
//     }
//     return output;
// }

// function getPrecedence(char) {
//     if (char == "*" || char == "/" || char == "%") {
//         return 2;
//     }
//     else if (char == "+" || char == "-") {
//         return 1;
//     }
//     else if (char == "^") {
//         return 3;
//     }
//     else if (char == "(") {
//         return 0;
//     }
//     else {
//         return -1;
//     }
// }