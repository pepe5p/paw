let mainContainer = document.getElementById("main-container");
let circleContainer = document.getElementById("circle-container");
let red_circle = document.getElementById("red-circle");
let text = document.getElementById("textCom");


circleContainer.addEventListener("click", function (event) {
	event.stopPropagation();
	let x = event.clientX - 55;
	let y = event.clientY - 55;
	red_circle.style.left = x + "px";
	red_circle.style.top = y + "px";
});

mainContainer.addEventListener("click", function (event) {
	text.style.left = event.clientX + "px";
	text.style.top = event.clientY + "px";
}
);