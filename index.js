
// display screen
const display = document.querySelector('input');

// All buttons
const buttons = document.querySelector("#calculator-body");

// flipbuttons for 2nd option of first row 
const flipButtons = document.querySelectorAll(".flip-btn");

// MR button for recalling saved memory
const memoryRecallButton = document.getElementById("memoryRecall");

// DEG/RAD buttons 
const degButtons = document.querySelectorAll(".deg-btn");

// checking for degree and radian mode, by default it's on degree mode
let degMode = true;

// stored memory , at first there is no memory
let memory = false;

// for stopping loops to go infinite loop
let check = 0;

// To show alert
const alertBar = document.getElementById("alert-bar");


// click eventlistener for all buttons
buttons.addEventListener('click', (e) => {

    let data = e.target.dataset;

    if (data.number) {
        display.value += data.number
    }

    else if (data.operator) {
        if (checkPreviousElement()) {
            display.value += data.operator;
        }
    }

    else if (data.result) {
        let result = 0;
        check = 0;
        if (display.value == "") {
            showAlert("Give Input");
        }
        else if (!checkParenthesis(display.value)) {
            showAlert("invalid input, check for parenthesis");
        }
        else {
            if (checkForScientificNotation()) {
                showAlert("It doesn't accept scientific notation");
            }
            else {
                result = evaluateExpression(display.value);
                if (isNaN(result)) {
                    showAlert("invalid Input");
                }
                else {
                    display.value = result;
                }
            }
        }
    }

    else if (data.unary) {
        addMultiplication();
        display.value += data.unary;

    }

    else if (data.value) {
        if (checkPreviousElement()) {
            display.value += data.value;
        }
    }

    else if (data.bracket) {
        display.value += data.bracket;
    }

    else if (data.period) {
        display.value += data.period;
    }

    else if (data.memory) {
        memorySetUp(data.memory);
    }

    else if (data.clear) {
        display.value = "";
    }

    else if (data.backspace) {
        display.value = removeLastElement(display.value);
    }

    else if (data.pi) {
        addMultiplication();
        display.value += Math.PI;
    }

    else if (data.e) {
        addMultiplication();
        display.value += Math.E;
    }

    else if (data.flip) {
        flipButtons.forEach(btn => {
            btn.classList.toggle("hide-btn");
        });
    }

    else if (data.deg) {
        degButtons.forEach((btn) => {
            btn.classList.toggle("hide-btn");
        })
        degMode = !degMode;

    }

    else if (data.minus) {
        if (display.value.charAt(0) == "(" || !isNaN(display.value.charAt(0))) {
            display.value = "-" + display.value;
        }
        else if (display.value.charAt(0) == "-") {
            display.value = display.value.slice(1)
        }
    }

    else if (data.fe) {
        if (checkForNumber(display.value) && display.value != "") {
            display.value = Number(display.value).toExponential(5);
        }
        else {
            showAlert("invalid number");
        }
    }

    else {
        console.log("clicked on different part");
    }

}, true)





// ------------------Validation Functions------------------------//

// check previous element if it is operator or blank then return false (it stops writing more than one operators sequentially)
function checkPreviousElement() {

    let displayLength = display.value.length;
    let previousElement = display.value.charAt(displayLength - 1);
    if (previousElement.match(/[+|/|*|%|^]/) || previousElement == "") {
        showAlert("Not Valid")
        return false;
    }
    else {
        return true;
    }

}


// if user direct add PI or E or any other data value like sqrt(),log() etc. It will add multiplication before it
function addMultiplication() {

    if ((!isNaN(display.value.slice(-1)) || display.value.slice(-1) == ")") && display.value.slice(-1) != "") {
        display.value += "*"
    }

}


// checks if there exists any alphabet or it is just normal arithmatic operation
function checkForNumber(expression) {

    if (expression.match(/[a-z]/gi)) {
        return false;
    }
    return true;

}


// if input is in scientific notation then it can not be evaluated
function checkForScientificNotation() {

    if (display.value.includes("e+")) {
        return true;
    }
    else {
        return false;
    }

}


// check for balance parenthesis
function checkParenthesis(expression) {
    const openParenthesis = expression.match(/\(/g);
    const closeParenthesis = expression.match(/\)/g);
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

// show alerts
function showAlert(text) {
    alertBar.children['alert-bar-input'].value = text;
    alertBar.style.display = "flex";
    setTimeout(() => {
        alertBar.style.display = "none";
    }, 3000);
}



// -----------------Evaluate Expression-------------//


// Expression Evaluation (if it contains only numbers and operator then postfix evaluation is done otherwise advance funtions evaluation is done)
function evaluateExpression(expression) {
    check++;
    if (check > 50) {
        showAlert("Something Wrong !");
        return 0;
    }
    if (checkForNumber(expression)) {
        return postfixEvaluation(expression);
    }
    else {
        return evaluateAdvanceFunction(expression);
    }

}


// evaluate postfix operation
function postfixEvaluation(expression) {

    // first convert infix to postfix
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
                    showAlert("invalid operator");
            }
            stack.push(temp);
        }
    }

    let result = stack.pop();
    if (stack.pop()) {
        return "invalid input"
    }
    if (Math.trunc(result).toString().length >= 15) {
        return "Out Of Range"
    }

    return Number.isInteger(Number(result)) ? result : Number(result).toFixed(2);
}






// convert infix operation to postfix  ex. ["12","+","4","*","7.8"] will be converted into ["12","4","7.8","*","+"]
function infixToPostFix(inputString) {

    inputString = "(" + inputString + ")";

    // convert InputString to Array (Split numbers, brackets and operators)
    let expression = convertToArr(inputString)

    const stack = [];
    let output = [];

    for (i in expression) {

        if (!isNaN(expression[i])) {
            output.push(expression[i]);
        }

        else if (expression[i] == "(") {
            stack.push(expression[i])
        }

        else if (expression[i] == ")") {
            while (stack.slice(-1) != "(" && stack.length != 0 && stack.includes("(")) {
                output.push(stack.pop());
            }
            stack.pop();
        }

        else {

            while (getPrecedence(stack.slice(-1)) >= getPrecedence(expression[i]) && stack.length != 0) {
                output.push(stack.pop());
            }
            stack.push(expression[i]);

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








// convert String expression to array ex. "12.5+7-6+(-6)" will be converted into ["12.5","+","7","-","6","+","(","-6",")"]
function convertToArr(expression) {

    let output = [];
    let temp = "";
    let i = 0;

    while (i < expression.length) {

        if (expression[i] == "-") {

            // if "-" comes sequentially then remove it for making positive value
            if (expression[i + 1] == "-") {
                expression = expression.slice(0, i) + expression.slice(i + 2, expression.length)
            }

            // if "-" occurs at beginning , after opening parenthesis and after operator
            else if (expression[i + 1] == "(") {

                let j = i + 1;
                let extractString = "(";
                const tempStack = [];
                tempStack.push("(");

                if (checkParenthesis(expression)) {

                    while (tempStack.includes("(")) {

                        if (expression[j + 1] == "(") {
                            tempStack.push("(");
                        }
                        else if (expression[j + 1] == ")") {
                            tempStack.pop();
                        }
                        extractString += expression[j + 1];
                        j++;

                    }

                }

                let solvedExtractString = evaluateExpression(extractString);

                expression = expression.substring(0, i + 1) + solvedExtractString + expression.substring(j + 1, expression.length);

                i = 0;
                output = [];
                temp = ""
            }

            else if ((i == 0 && expression[0] == "-") || (expression[i - 1] != ")" && isNaN(expression[i - 1]))) {
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



// Evaluation Of Advance Functions , It will convert into normal arithmatic expression and that will be evaluated by postfix expression.
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
        log2: function (num) {
            return Math.log2(num).toFixed(2);
        },
        log: function (num) {
            return Math.log10(num).toFixed(2);
        },
        ln: function (num) {
            return Math.log(num).toFixed(2);
        },
        exp: function (num) {
            return Math.exp(num).toFixed(2);
        },
        sini: function (num) {
            return degMode ? Math.sini(num * Math.PI / 180).toFixed(2) : Math.sini(num).toFixed(2);
        },
        cosi: function (num) {
            return degMode ? Math.cosi(num * Math.PI / 180).toFixed(2) : Math.cosi(num).toFixed(2);
        },
        tani: function (num) {
            return degMode ? Math.tani(num * Math.PI / 180).toFixed(2) : Math.tani(num).toFixed(2);
        },
        sin: function (num) {
            return degMode ? Math.sin(num * Math.PI / 180).toFixed(2) : Math.sin(num).toFixed(2);
        },
        cos: function (num) {
            return degMode ? Math.cos(num * Math.PI / 180).toFixed(2) : Math.cos(num).toFixed(2);
        },
        tan: function (num) {
            return degMode ? Math.tan(num * Math.PI / 180).toFixed(2) : Math.tan(num).toFixed(2);
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



    // here i is a key of arrObject
    for (i in arrObject) {

        if (expression.includes(i)) {
            let regExp = new RegExp(`${i}\\(([\\d+*^%/\\-.\\s]+)\\)(?!\\))`, "gi")
            let functionArr = expression.match(regExp);
            try {
                if (functionArr != null) {
                    let valueArr = getValues(functionArr);
                    for (j in valueArr) {
                        if (!isNaN(valueArr[j])) {
                            expression = expression.replace(functionArr[j], arrObject[i](valueArr[j]));
                        }
                        else {
                            expression = expression.replace(functionArr[j], arrObject[i](evaluateExpression(valueArr[j])));
                        }
                    }
                }

            } catch (error) {
                showAlert(error);
            }
        }
    }
    if (expression.includes("NaN")) {
        showAlert("Invalid Input")
    }
    else {
        return evaluateExpression(expression)
    }

}

// extract values from array ex: arr=[sqrt(100),sqrt(16)] then function will return arr=["100","16"]
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


// -------------------Memory Function------------------//

function memorySetUp(value) {

    if (value != "MR" && value != "MC" && display.value == "") {
        showAlert("Give Input");
    }
    else {

        switch (value) {
            case "M+":

                memory += Number(evaluateExpression(display.value))

                break;

            case "M-":

                memory -= Number(evaluateExpression(display.value))

                break;

            case "MR":

                display.value = memory;

                break;

            case "MC":

                memory = false;

                break;

            case "MS":
                memory = Number(evaluateExpression(display.value))
                break;

            default:
                showAlert("Invalid input at memory section")
                break;
        }
    }
    checkForMemory();

}


// it runs when first time page loads
checkForMemory();
// for making MR button disabled
function checkForMemory() {

    if (memory == false) {
        memoryRecallButton.setAttribute("disabled", "");
    }
    else {
        memoryRecallButton.removeAttribute("disabled", "");
    }

}


