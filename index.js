// equals sign for number
const equalsTo = document.querySelector('[data-display]');

// display screen
const display = document.querySelector('input');

// All buttons
const buttons = document.querySelector("#calculator-body");


const flipButtons=document.querySelectorAll(".flip-btn");

const memoryRecallButton=document.getElementById("memoryRecall");

const degButtons=document.querySelectorAll(".deg-btn");

let degMode=true;


checkForMemory();
function checkForMemory(){

    if(!localStorage.getItem("memory")){

        memoryRecallButton.setAttribute("disabled","");
    }
    else{
    
        memoryRecallButton.removeAttribute("disabled","");
    }

}



// click event for all buttons
buttons.addEventListener('click', (e) => {

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
        if (!checkParenthesis(display.value)) {
            alert("invalid input, check for parenthesis");
        }
        else {
            display.value=evaluateExpression(display.value);
        }
    }

    else if (value.unary) {
        display.value += value.unary;
    }

    else if (value.value) {

        display.value += value.value;
    }
    else if(value.memory){
        memorySetUp(value.memory);
    }

    else if (value.clear) {
        display.value = "";
    }

    else if (value.backspace) {
        display.value = removeLastElement(display.value);
    }

    else if (value.pi) {
        console.log(display.value.slice(-1));
        if (!isNaN(display.value.slice(-1)) && display.value.slice(-1) != "") {
            console.log("pi");
            display.value += "*"
        }
        display.value += Math.PI;
    }
    else if (value.e) {
        console.log(display.value.slice(-1));
        if (!isNaN(display.value.slice(-1)) && display.value.slice(-1) != "") {
            console.log("e");
            display.value += "*"
        }
        display.value += Math.E;
    }
    else if(value.flip){
        console.log("clicked");
        flipButtons.forEach(btn => {
            btn.classList.toggle("hide-btn");
        });
        
    }
    else if(value.deg){
        console.log('here');
        degButtons.forEach((btn)=>{
                    btn.classList.toggle("hide-btn");
                })
        degMode=!degMode;
        
    }
    else{
        console.log("another");
    }
    
}, true)



// check previous element if it is operator then return false (it stops writing more than operators sequentially)
function checkPreviousElement(element) {
    let displayLength = display.value.length;
    if (display.value.charAt(displayLength - 1).match(/[+|/|*|%|^]/)) {
        return false;
    }
    else {
        return true;
    }
}


// if alphabets are then shows invalid input
function checkForNumber(expression) {

    if (expression.match(/[a-df-z]/gi)) {
        return false;
    }
    return true;
}


// check for balance parenthesis
function checkParenthesis(expression) {
    const openParenthesis = expression.match(/\(/g);
    const closeParenthesis = expression.match(/\)/g);
    console.log(openParenthesis)
    console.log(closeParenthesis)
    console.log(openParenthesis != null);
    if (openParenthesis == null && closeParenthesis == null) {
        return true;
    }
    if (openParenthesis != null && closeParenthesis != null && openParenthesis.length === closeParenthesis.length) {
        return true
    }
    else {
        return false
    }
}





// backspace function
function removeLastElement(value) {
    return value.slice(0, value.length - 1);
}




function evaluateExpression(expression){
    console.log(expression);
    if (checkForNumber(expression)) {
        console.log("here");
        console.log(display.value);
        return postfixEvaluation(expression);

    }
    else {
        console.log("hereee");
        return evaluateAdvanceFunction(expression);
    }
}





// convert infix operation to postfix
function infixToPostFix(inputString) {
    inputString = "(" + inputString + ")";
    let expression = convertToArr(inputString)

    const stack = [];
    let output = [];


    for (i in expression) {

        if (expression[i].match(/[0-9]|\./g)) {

            output.push(expression[i]);
        }

        else if (expression[i] == "(") {

            stack.push(expression[i])
        }

        else if (expression[i] == ")") {

            while (stack.slice(-1) != "(") {
                output.push(stack.pop());
            }
            stack.pop();
        }

        else {
            if (getPrecedence(stack.slice(-1)) >= getPrecedence(expression[i])) {
                while (getPrecedence(stack.slice(-1)) >= getPrecedence(expression[i])) {
                    output.push(stack.pop());
                }
                stack.push(expression[i]);
            }
            else {
                stack.push(expression[i]);
            }
        }

    }

    return output;

}



// get Precedence of operators
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




// evaluate postfix operation
function postfixEvaluation(expression) {

    let arr = infixToPostFix(expression);
    let stack = [];
    let i = 0;
    let x, y;
    for (i = 0; i < arr.length; i++) {
        if (!isNaN(arr[i])) {
            stack.push(arr[i])
        }
        else {
            y = Number(stack.pop());
            x = Number(stack.pop());
            switch (arr[i]) {
                case "+":
                    temp = x + y; break;
                case "-":
                    temp = x - y; break;
                case "*":
                    temp = x * y; break;
                case "/":
                    temp = x / y; break;
                case "^":
                    temp = x ** y; break;
                case "%":
                    temp = x % y; break;
                default:
                    alert("error");
            }
            stack.push(temp);
        }
    }
    let result=stack.pop();
    return Number.isInteger(result)? result : Number(result).toFixed(2);
}






// convert String expression to array
function convertToArr(expression) {

    let output = [];
    let temp = "";
    let i = 0;
    while (i < expression.length) {

        if (expression[i] == "-") {
            // check for operator 

            if (expression[i + 1] == "-") {
                expression = expression.slice(0, i) + expression.slice(i + 2, expression.length)
            }
            else if (expression[i + 1] == "(") {

                let j = i + 1;
                let temp2 = "(";
                const tempStack = [];
                tempStack.push("(");
                while (tempStack.includes("(")) {
                    if (expression[j + 1] == "(") {
                        tempStack.push("(");
                    }
                    else if (expression[j + 1] == ")") {
                        tempStack.pop();
                    }
                    temp2 += expression[j + 1];
                    j++;
                }
                let count = j - i;

                let solved = postfixEvaluation(temp2);


                expression = expression.substring(0, i + 1) + solved + expression.substring(j + 1, expression.length);

                i = 0;
                output = [];
                temp = ""
            }

            else if ((i == 0 && expression[0] == "-") || expression[i - 1] == ")" || isNaN(expression[i - 1])) {

                temp += expression[i];
                i++;
                while (!isNaN(expression[i]) || expression[i] == ".") {
                    temp += expression[i];
                    i++;
                }
                output.push(temp);
                temp = "";
            }
            else {
                output.push(expression[i]);
                i++;
            }
        }
        else if (!isNaN(expression[i]) || expression[i] == ".") {
            temp += expression[i];
            i++;
            while (!isNaN(expression[i]) || expression[i] == ".") {
                temp += expression[i];
                i++;
            }
            output.push(temp);
            temp = "";
        }
        else {
            output.push(expression[i]);
            i++;
        }
    }


    return output;
}



function evaluateAdvanceFunction(expression) {

    const arrObject = {
        sqrt: function (num) {
            return Math.sqrt(num);
        },
        mod: function (num) {
            return Math.abs(num);
        },
        floor: function (num) {
            return Math.floor(num);
        },
        ceil: function (num) {
            return Math.ceil(num);
        },
        fact: function (num) {
            return factorial(num);
        },
        log: function (num) {
            return Math.log10(num);
        },
        ln: function (num) {
            return Math.log(num);
        },
        exp: function (num) {
            return Math.exp(num);
        },
        sini: function (num) {
            return degMode ? Math.sini(num*Math.PI/180).toFixed(2) : Math.sini(num).toFixed(2) ;
        },
        cosi: function (num) {
            return degMode ? Math.cosi(num*Math.PI/180).toFixed(2) : Math.cosi(num).toFixed(2) ;
        },
        tani: function (num) {
            return degMode ? Math.tani(num*Math.PI/180).toFixed(2) : Math.tani(num).toFixed(2) ;
        },
        sin: function (num) {
            return degMode ? Math.sin(num*Math.PI/180).toFixed(2): Math.sin(num).toFixed(2);
        },
        cos: function (num) {
            return degMode ? Math.cos(num*Math.PI/180).toFixed(2) : Math.cos(num).toFixed(2) ;
        },
        tan: function (num) {
            return degMode ? Math.tan(num*Math.PI/180).toFixed(2) : Math.tan(num).toFixed(2) ;
        },
        cbrt: function (num) {
            return Math.cbrt(num);
        },
        deg: function (num) {
            return foundDeg(num);
        },
        rad: function (num) {
            return foundRad(num);
        }
       
    }


    for (i in arrObject) {

        if (expression.includes(i)) {
            console.log(expression);
            console.log(i);
            let regExp = new RegExp(`${i}\\([-+]?[0-9]*\.?[0-9]*\\)`, "gi")
            console.log(regExp);
            let functionArr= expression.match(regExp);
            console.log(functionArr);
            let valueArr = getValues(functionArr);
            console.log(valueArr);
            for (j in valueArr) {

                expression = expression.replace(functionArr[j], arrObject[i](valueArr[j]));
            }

        }
    }
    console.log(expression + " expression")
    // if(isNaN(expression)){
    //     return false;
    // }
    return postfixEvaluation(expression)

}

function getValues(arr) {
    let startIndex = arr[0].indexOf("(")
    let endIndex;
    arr = arr.map((element) => {
        endIndex = element.indexOf(")");
        return element.slice(startIndex + 1, endIndex);
    })
    return arr;
}

function factorial(n) {
    if (n == 0 || n == 1) {
        return 1;
    }
    else {
        return n * factorial(n - 1);
    }
}







let memory=0;

function memorySetUp(value){
    console.log(value);

    if(value!="MR" && value!="MC" && display.value==""){
        alert("Give Input");
    }
    else{

        switch (value) {
            case "M+":
    
                memory+=Number(evaluateExpression(display.value))
                localStorage.setItem("memory",memory);
                
    
                break;
        
            case "M-":
                
            memory-=Number(evaluateExpression(display.value))
            localStorage.setItem("memory",memory);
    
    
                break;
        
            case "MR":
                
            display.value=localStorage.getItem("memory");
    
            
    
                break;
        
            case "MC":
                
                memory=0;
                localStorage.clear();
    
                break;
        
            case "MS": 
            memory=Number(evaluateExpression(display.value))
                localStorage.setItem("memory",memory)    
    
                break;
        
            default:
                alert("Invalid input at memory section")
                break;
        }
    }
    checkForMemory();
   
}