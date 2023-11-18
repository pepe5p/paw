function getUserInput() {
    let personName = prompt("Podaj swoje imię: ");
    let element = document.getElementsByClassName('name-placeholder');
    let greeting = "pana ";
    if (personName.endsWith("a")) {
        greeting = "panią ";
    }
    element[0].innerHTML = "Witam " + greeting + personName + ".";
}

let element = document.getElementsByTagName('button');
element[0].addEventListener('click', getUserInput);
