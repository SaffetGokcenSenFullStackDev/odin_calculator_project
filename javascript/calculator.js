// definition of the objects for all of the buttons of the calculator
const division = document.querySelector("#division");
const multiplication = document.querySelector("#multiplication");
const subtraction = document.querySelector("#subtraction");
const addition = document.querySelector("#addition");
const six = document.querySelector("#six");
const seven = document.querySelector("#seven");
const eight = document.querySelector("#eight");
const nine = document.querySelector("#nine");
const two = document.querySelector("#two");
const three = document.querySelector("#three");
const four = document.querySelector("#four");
const five = document.querySelector("#five");
const zero = document.querySelector("#zero");
const one = document.querySelector("#one");
const dot = document.querySelector("#dot");
const equals = document.querySelector("#equals");
const clear = document.querySelector("#clear");
const backspace = document.querySelector("#backspace");
// definition of the object for the screen of the calculator
const display = document.querySelector(".screen");

// division, multiplication, summation and subtraction operations are defined
let getResult = function(operator, firstOperand, secondOperand) {
    if (operator === '/') {
        return (+firstOperand) / (+secondOperand);
    }
    else if (operator === '*') {
        return (+firstOperand) * (+secondOperand);
    }
    else if (operator === '+') {
        return (+firstOperand) + (+secondOperand);
    }
    else {
        return (+firstOperand) - (+secondOperand);
    }
}

// this function is designed to evaluate the expression entered by the user 
// according to the precedence rules. the arguments are ordered according to the
// precedence the operations are to be performed.
// reduceExpression(div, cross, minus, plus) evaluates an expression according
// to the correct precedence.
let reduceExpression = function(expression, concatenationArray, ...opIndexArrays) {
    let opIndex, concatIndex, concatArrLength, firstOperand, secondOperand;
    let previousOpIndex, nextOpIndex;
    let result, operator;
    let expressionLength;
    let firstOperandLength, secondOperandLength;
    // take all of the operations into consideration
    while (opIndexArrays.length) {
        // take all incidences of the current operation into consideration
        while (opIndexArrays[0].length) {
            // opIndex is the index of the operation in the expression array
            opIndex = (opIndexArrays[0])[0];
            // drop this incidence of the operation from the operation array
            opIndexArrays[0].splice(0, 1);
            // identify the operator
            operator = expression[opIndex];
            // locate the opIndex in the concatenation array
            concatIndex = concatenationArray.findIndex((element) => 
            element === opIndex);
            concatArrLength = concatenationArray.length;
            expressionLength = expression.length;
            // the case when the operation is the first in the expression
            if (concatIndex === 0) {
                firstOperand = expression.slice(0, opIndex);
                firstOperandLength = firstOperand.length;
                firstOperand = firstOperand.join('');
                // the case when there is only one operation
                if (concatArrLength === 1) {
                    secondOperand = expression.slice((opIndex+1), 
                    expressionLength).join('');
                    result = getResult(operator, firstOperand, secondOperand);
                    // remove the operation and its operands from the expression
                    expression.splice(0, expressionLength, result);
                    // remove the operation from the operations array
                    concatenationArray.splice(concatIndex, 1);
                }
                // the case when there are more than one operations
                else {
                    // the index of the next operator
                    nextOpIndex = concatenationArray[1];
                    secondOperand = expression.slice((opIndex+1), nextOpIndex);
                    secondOperandLength = secondOperand.length;
                    secondOperand = secondOperand.join('');
                    result = getResult(operator, firstOperand, secondOperand);
                    expression.splice(0, nextOpIndex, result);
                    concatenationArray.splice(concatIndex, 1);
                    // the indices of the operators are updated due to the
                    // removal of the current operator
                    opIndexArrays.forEach((element) => {
                        element.forEach((element, index, array) => {
                            array[index] = element - 
                            (firstOperandLength + secondOperandLength);
                        })
                    });
                    // update of the indices due to the removal of the current
                    // operator
                    concatenationArray.forEach((element, index, array) => {
                        array[index] = element - 
                        (firstOperandLength + secondOperandLength);
                    });
                    concatenationArray.sort(function(a, b) {
                        return a - b;
                    });
                }
            }
            // the case when the operation is the last in the expression
            else if (concatIndex === (concatArrLength - 1)) {
                // the index of the previous operator
                previousOpIndex = concatenationArray[concatIndex - 1];
                firstOperand = 
                expression.slice(previousOpIndex + 1, opIndex).join('');
                secondOperand = 
                expression.slice(opIndex + 1, expressionLength).join('');
                result = getResult(operator, firstOperand, secondOperand);
                expression.splice((previousOpIndex+1), 
                (expressionLength-(previousOpIndex+1)), result);
                concatenationArray.splice(concatIndex, 1);
                concatenationArray.sort(function(a, b) {
                    return a - b;
                });
            }
            // the case when the operation is neither the first nor the last in
            // the expression
            else {
                previousOpIndex = concatenationArray[concatIndex - 1];
                firstOperand = expression.slice(previousOpIndex + 1, opIndex);
                firstOperandLength = firstOperand.length;
                firstOperand = firstOperand.join('');
                nextOpIndex = concatenationArray[concatIndex + 1];
                secondOperand = expression.slice((opIndex + 1), nextOpIndex);
                secondOperandLength = secondOperand.length;
                secondOperand = secondOperand.join('');
                result = getResult(operator, firstOperand, secondOperand);
                expression.splice((previousOpIndex + 1), 
                (nextOpIndex - (previousOpIndex + 1)), result);
                concatenationArray.splice(concatIndex, 1);
                opIndexArrays.forEach((element) => {
                    element.forEach((element, index, array) => {
                        if (element >= nextOpIndex) {
                            array[index] = element - 
                            (firstOperandLength + secondOperandLength);
                        }
                    })
                });
                concatenationArray.forEach((element, index, array) => {
                    if (element >= nextOpIndex) {
                        array[index] = element - 
                        (firstOperandLength + secondOperandLength);
                    }
                });
                concatenationArray.sort(function(a, b) {
                    return a - b;
                });
            }
        }
        // all of the incidences of the first operation have been taken into
        // consideration
        opIndexArrays.splice(0, 1);
    }
    // expression has only one element which is its result
    return expression[0];
}

// indicates if a nonzero digit has been clicked
let nonZeroDigitClicked = false;
// indicates if the decimal separator has been clicked
let dotClicked = false;
// the string representing the calculator display
let displayString = ""; 
// stack for the operator event history
let opEventStack = ['0'];
// stack for the digit event history
let digitEventStack = ['1'];
// stack for the dot button event history
let dotEventStack = ['0'];
// stack for the nonzero digit click boolean
let nonZeroDigitClickStack = [false];
// stack for dot click boolean
let dotClickStack = [false];
// stack for equals button availability
let equalsAvailableStack = [false];

// removes the event listeners for the operation clicks
function dropOpEventListener() {
    division.removeEventListener("click", opButtonClicked);
    multiplication.removeEventListener("click", opButtonClicked);
    subtraction.removeEventListener("click", opButtonClicked);
    addition.removeEventListener("click", opButtonClicked);
}

// adds the event listeners for the operation clicks
function addOpEventListener() {
    division.addEventListener("click", opButtonClicked);
    multiplication.addEventListener("click", opButtonClicked);
    subtraction.addEventListener("click", opButtonClicked);
    addition.addEventListener("click", opButtonClicked);
}

// adds the event listeners for the digit clicks
function addDigitEventListener() {
    six.addEventListener("click", digitButtonClicked);
    seven.addEventListener("click", digitButtonClicked);
    eight.addEventListener("click", digitButtonClicked);
    nine.addEventListener("click", digitButtonClicked);
    two.addEventListener("click", digitButtonClicked);
    three.addEventListener("click", digitButtonClicked);
    four.addEventListener("click", digitButtonClicked);
    five.addEventListener("click", digitButtonClicked);
    zero.addEventListener("click", digitButtonClicked);
    one.addEventListener("click", digitButtonClicked);
}

// removes the event listeners for the digit clicks
function dropDigitEventListener() {
    six.removeEventListener("click", digitButtonClicked);
    seven.removeEventListener("click", digitButtonClicked);
    eight.removeEventListener("click", digitButtonClicked);
    nine.removeEventListener("click", digitButtonClicked);
    two.removeEventListener("click", digitButtonClicked);
    three.removeEventListener("click", digitButtonClicked);
    four.removeEventListener("click", digitButtonClicked);
    five.removeEventListener("click", digitButtonClicked);
    zero.removeEventListener("click", digitButtonClicked);
    one.removeEventListener("click", digitButtonClicked);            
}

// called when an operation button is clicked
function opButtonClicked() {
    // gets and stores the operation character
    let buttonText = this.textContent;
    // the expression in the calculator display is stored
    displayString += buttonText;
    // adds the character to the calculator display 
    display.textContent += buttonText;
    // indicates that no nonzero digit has been clicked since this operation 
    // click
    nonZeroDigitClicked = false;
    nonZeroDigitClickStack.push(false);
    // once an operator is clicked, click of another operator is mathematically
    // meaningless
    dropOpEventListener();
    opEventStack.push("0");
    // once an operator is clicked, a digit click is expected
    addDigitEventListener();
    digitEventStack.push("1");
    // a possible  listener for the decimal separator from the previous operator
    // click is removed
    dot.removeEventListener("click", dotButtonClicked);
    // indicates that no decimal separator has been clicked since this operation
    // click
    dotClicked = false;
    dotClickStack.push(false);
    dotEventStack.push("0");
    // after an operator sign, equals sign cannot be clicked
    equals.removeEventListener("click", equalsButtonClicked);
    equalsAvailableStack.push(false);
}

// called when the decimal separator is clicked
function dotButtonClicked() {
    // the expression in the caculator display is stored
    displayString += ".";
    // adds the decimal separator to the calculator display
    display.textContent += ".";
    // indicates that the decimal separator has been clicked
    dotClicked = true;
    dotClickStack.push(true);
    // another click on the decimal separator is mathematically senseless
    dot.removeEventListener("click", dotButtonClicked);
    dotEventStack.push("0");
    // an operation cannot follow a decimal point separator
    dropOpEventListener();
    opEventStack.push("0");
    // if zero and decimal separator have been clicked, then a digit must be
    // able to be clicked
    if (!nonZeroDigitClicked) {
        addDigitEventListener();
        nonZeroDigitClickStack.push(false);
    }
    else {
        nonZeroDigitClickStack.push(true);
    }
    digitEventStack.push("1");
    // after the decimal separator is clicked, equals cannot be pressed
    equals.removeEventListener("click", equalsButtonClicked);
    equalsAvailableStack.push(false);
}

// called when a digit is clicked
function digitButtonClicked() {
    // gets and stores the digit
    let buttonText = this.textContent;
    // the expression in the calculator display is stored
    displayString += buttonText;
    // adds the digit to the calculator display 
    display.textContent += buttonText;
    // listen for the click of the backspace button
    backspace.addEventListener("click", backspaceButtonClicked);
    
    if (buttonText !== "0") { // a nonzero digit click is recorded
        nonZeroDigitClicked = true;
        digitEventStack.push("1");
        nonZeroDigitClickStack.push(true);
        // if the decimal separator has not been clicked, it can be clicked.
        if (!dotClicked) {
            dot.addEventListener("click", dotButtonClicked);
            dotEventStack.push("1");
            dotClickStack.push(false);
        }
        else {
            dotEventStack.push("0");
            dotClickStack.push(true);
        }
    }
    else {
        if (!dotClicked) {
            dot.addEventListener("click", dotButtonClicked);
            dotEventStack.push("1");
            dotClickStack.push(false);
            // if zero was clicked and no nonzero digit was clicked before and
            // the decimal separator was not clicked, then another digit cannot
            // be clicked
            if (!nonZeroDigitClicked) {
                dropDigitEventListener();
                digitEventStack.push("0");
            }
            else {
                digitEventStack.push("1");
            }
        }
        else {
            dotEventStack.push("0");
            digitEventStack.push("1");
            dotClickStack.push(true);
        }
    }
    // after a digit is clicked, an operator can be clicked
    addOpEventListener();
    opEventStack.push("1");
    // listen for an equal sign click
    equals.addEventListener("click", equalsButtonClicked);
    equalsAvailableStack.push(true);
}

// called when the clear button is clicked
function clearButtonClicked() {
    // the expression in the calculator display is stored
    displayString = "";
    // clear the calculator display
    display.textContent = "";
    // a digit can be clicked after a clear
    addDigitEventListener();
    // an operator cannot be clicked after a clear
    dropOpEventListener();
    // a decimal separator cannot be clicked after a clear
    dot.removeEventListener("click", dotButtonClicked);
    // reset the booleans to their initial states
    nonZeroDigitClicked = false;
    nonZeroDigitClickStack = [false];
    dotClicked = false;
    dotClickStack = [false];
    // empty the event history stacks
    opEventStack = ['0'];
    digitEventStack = ['1'];
    dotEventStack = ['0'];
    // after the clear button is clicked, equals sign cannot be pressed
    equals.removeEventListener("click", equalsButtonClicked);
    equalsAvailableStack = [false];
}

// called when the backspace button is clicked
function backspaceButtonClicked() {
    // erase the last character in the string
    displayString = displayString.slice(0, -1);
    // erase the last character in the display
    display.textContent = displayString;
    // remove the last element of the stack
    digitEventStack.pop();
    //  add or remove the listener according to the previous state
    if (digitEventStack[digitEventStack.length - 1] === "1") {
        addDigitEventListener();
    }
    else {
        dropDigitEventListener();
    }
    opEventStack.pop();
    if (opEventStack[opEventStack.length - 1] === "1") {
        addOpEventListener();
    }
    else {
        dropOpEventListener();
    }
    dotEventStack.pop();
    if (dotEventStack[dotEventStack.length - 1] === "1") {
        dot.addEventListener("click", dotButtonClicked);
    }
    else {
        dot.removeEventListener("click", dotButtonClicked);
    }
    dotClickStack.pop();
    if (dotClickStack[dotClickStack.length - 1]) {
        dotClicked = true;
    }
    else {
        dotClicked = false;
    }
    nonZeroDigitClickStack.pop();
    if (nonZeroDigitClickStack[nonZeroDigitClickStack.length - 1]) {
        nonZeroDigitClicked = true;
    }
    else {
        nonZeroDigitClicked = false;
    }
    equalsAvailableStack.pop();
    if (equalsAvailableStack[equalsAvailableStack.length - 1]) {
        equals.addEventListener("click", equalsButtonClicked);
    }
    else {
        equals.removeEventListener("click", equalsButtonClicked);
    }
}

function equalsButtonClicked() {
    // adds the equal sign to the calculator display 
    display.textContent += "=";
    // only the clear button can be pressed after clicking the equals sign
    dropDigitEventListener();
    dropOpEventListener();
    backspace.removeEventListener("click", backspaceButtonClicked);
    dot.removeEventListener("click", dotButtonClicked);
    equals.removeEventListener("click", equalsButtonClicked);
    // the mathematical expression entered by the user is converted to an array
    // of digits, operators and signs
    let expression = displayString.split("");
    // operator index arrays initialized to empty arrays 
    let div = [];
    let cross = [];
    let plus = [];
    let minus = [];
    // the array indices of each operator are extracted from the expression array
    expression.forEach((element, index) => {
        if (element === '/') {
            div.push(index);
        }
        else if (element === '*') {
            cross.push(index);
        }
        else if (element === '+') {
            plus.push(index);
        }
        else if (element === '-') {
            minus.push(index);
        }
    })

    // operator indices are collected in a single array
    let concatenationArray = div.concat(cross, plus, minus);
    // operator indices are sorted in an ascending order
    concatenationArray.sort(function(a, b) {
        return a - b;
    });
    // calculate the result of the expression
    let calc_result = 
    reduceExpression(expression, concatenationArray, div, cross, minus, plus);
    // display the result of the expression
    display.textContent += calc_result;
}

// listen for the click of a digit
addDigitEventListener();

// listen for the click of the clear button
clear.addEventListener("click", clearButtonClicked);