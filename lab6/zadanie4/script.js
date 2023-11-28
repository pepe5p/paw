let mainContainer = document.getElementById("main-container");
let circleContainer = document.getElementById("circle-container");
let redCircle = document.getElementById("red-circle");
let text = document.getElementById("text-com");


circleContainer.addEventListener("click", function (event) {
	event.stopPropagation();
	let x = event.clientX - 55;
	let y = event.clientY - 55;
	redCircle.style.left = x + "px";
	redCircle.style.top = y + "px";
	text.style.visibility = "hidden";
});

mainContainer.addEventListener("click", function (event) {
	text.style.left = event.clientX + "px";
	text.style.top = event.clientY + "px";
	text.style.visibility = "visible";
}
);