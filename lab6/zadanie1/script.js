let sum = 0;
let propagation = true;
let firstButtonValue = 1;
let secondButtonValue = 2;
let thirdButtonValue = 5;
let btn1 = document.getElementById("btn-1");
let btn2 = document.getElementById("btn-2");
let btn3 = document.getElementById("btn-3");

function adder(
	event,
	value,
	przycisk
) {
		if(!propagation || sum > 30) event.stopPropagation();
		sum += value;
		document.getElementById("sum").innerHTML = sum;
		document.getElementById("komunikat").innerText = `Kliknięto przycisk ${przycisk} o wartości ${value}`;
		checkSum();
}

function reset() {
		sum = 0;
		document.getElementById("sum").innerHTML = sum;
}

function checkSum() {
		if (sum >= 30) {
			btn3.classList.remove("bg-warning")
			btn3.classList.add("bg-dark");
			thirdButtonValue = 0;
		}
		if (sum >= 50) {
			btn2.classList.remove("bg-danger")
			btn2.classList.add("bg-dark");
			secondButtonValue = 0;
		}
}

function changeButtonsOrder(order) {
	firstButtonValue = order[0];
	secondButtonValue = order[1];
	thirdButtonValue = order[2];
}

function togglePropagation() {
		propagation = !propagation;
		document.getElementById("btn-propagation").innerHTML = propagation ? "Stop propagation" : "Start propagation";
}

document.getElementById("btn-res").addEventListener("click", reset);
btn1.addEventListener("click", event => adder(event, firstButtonValue, "szary"));
btn2.addEventListener("click", event => adder(event, secondButtonValue, "czerwony"));
btn3.addEventListener("click", event => adder(event, thirdButtonValue, "żółty"));
document.getElementById("check-1").addEventListener("click", () => changeButtonsOrder([1,2,5]));
document.getElementById("check-2").addEventListener("click", () => changeButtonsOrder([5,2,1]));
document.getElementById("check-3").addEventListener("click", () => changeButtonsOrder([2,1,5]));
document.getElementById("sum").addEventListener("onchange", event => checkSum(event));