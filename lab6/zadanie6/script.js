let password = document.getElementById("password");
let repeatPassword = document.getElementById("repeat-password");
let char8 = document.getElementById("8-characters");
let upperCase = document.getElementById("uppercase");
let digits = document.getElementById("digits");
let specialCharacters = document.getElementById("special-characters");
let passMatch = document.getElementById("passwords-match");

let showPassword = document.getElementById("show-password");
let showRepeatPassword = document.getElementById("show-repeat-password");

let is8Characters = false;
let hasUpperCase = false;
let hasDigits = false;
let hasSpecialCharacters = false;
let passwordsMatch = false;

let checkPassword = function () {
		is8Characters = password.value.length >= 8;
		hasUpperCase = password.value !== password.value.toLowerCase();
		hasDigits = /\d/.test(password.value);
		hasSpecialCharacters = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password.value);

		if(is8Characters) {
			char8.src = "./ok.png";
		}
		else {
			char8.src = "./wrong.png";
		}

		if(hasUpperCase) {
			upperCase.src = "./ok.png";
		}
		else {
			upperCase.src = "./wrong.png";
		}

		if(hasDigits) {
			digits.src = "./ok.png";
		}
		else {
			digits.src = "./wrong.png";
		}

		if(hasSpecialCharacters) {
			specialCharacters.src = "./ok.png";
		}
		else {
			specialCharacters.src = "./wrong.png";
		}
};

password.addEventListener("input", checkPassword);
repeatPassword.addEventListener("keydown", (e) => {
	if(e.keyCode === 13) {
		passwordsMatch = password.value === repeatPassword.value;
		if(passwordsMatch) {
			passMatch.src = "./ok.png";
		}
		else {
			passMatch.src = "./wrong.png";
		}
	}
});

showPassword.addEventListener("click", function () {
	if(password.type === "password") {
		password.type = "text";
		showPassword.childNodes[1].src = "./eye_open.png";
	}
	else {
		password.type = "password";
		showPassword.childNodes[1].src = "./eye_not_visible.png";
	}
});

showRepeatPassword.addEventListener("click", function () {
	if(repeatPassword.type === "password") {
		repeatPassword.type = "text";
		showRepeatPassword.childNodes[1].src = "./eye_open.png";
	}
	else {
		repeatPassword.type = "password";
		showRepeatPassword.childNodes[1].src = "./eye_not_visible.png";
	}
}
);
