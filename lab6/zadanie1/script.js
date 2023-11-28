let sum = 0;
let propagation = true;
let orderAsc = false;
const firstButtonValue = 1;
const secondButtonValue = 2;
const thirdButtonValue = 5;
let btn1 = document.getElementById("btn-1");
let btn2 = document.getElementById("btn-2");
let btn3 = document.getElementById("btn-3");
const sumElement = document.getElementById("sum")
const logElement = document.getElementById("log")

function adder(event, value, button) {
    if (propagation) event.stopPropagation();
    sum += value;
    sumElement.innerHTML = sum;
    let textNode = document.createTextNode(`* Kliknięto ${button} za ${value}`);
    logElement.appendChild(textNode);
    logElement.appendChild(document.createElement("br"));
    checkSum();
}

function reset() {
    sum = 0;
    sumElement.innerHTML = sum;
    logElement.innerHTML = "";
    orderAsc = !orderAsc;
    toggleButtonsOrder();
    btn2.classList.add("bg-danger");
    btn3.classList.add("bg-warning");
}

function checkSum() {
    if (sum >= 30) {
        btn3.classList.remove("bg-warning");
        btn3.replaceWith(btn3.cloneNode(true));
        btn3 = document.getElementById("btn-3");
    }
    if (sum >= 50) {
        btn2.classList.remove("bg-danger");
        btn2.replaceWith(btn2.cloneNode(true));
        btn2 = document.getElementById("btn-2");
    }
}

function toggleButtonsOrder() {
    orderAsc = !orderAsc;
    btn1.replaceWith(btn1.cloneNode(true));
    btn1 = document.getElementById("btn-1");
    btn1.addEventListener("click", event => adder(event, firstButtonValue, "szary"), orderAsc);
    if (sum < 30) {
        btn2.replaceWith(btn2.cloneNode(true));
        btn2 = document.getElementById("btn-2");
        btn2.addEventListener("click", event => adder(event, secondButtonValue, "czerwony"), orderAsc);
    }
    if (sum < 50) {
        btn3.replaceWith(btn3.cloneNode(true));
        btn3 = document.getElementById("btn-3");
        btn3.addEventListener("click", event => adder(event, thirdButtonValue, "żółty"), orderAsc);
    }
}

function togglePropagation() {
    propagation = !propagation;
    document.getElementById("btn-propagation").innerHTML = propagation ? "Stop propagation" : "Start propagation";
}

document.getElementById("btn-res").addEventListener("click", reset);
document.getElementById("check-1").addEventListener("click", toggleButtonsOrder);
document.getElementById("check-2").addEventListener("click", toggleButtonsOrder);
sumElement.addEventListener("onchange", event => checkSum(event));
toggleButtonsOrder();