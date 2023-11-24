const form = document.getElementById('phone-book-form');
const bookItems = document.getElementById('phone-book-items');

form.addEventListener('submit', function (event) {
    event.preventDefault();
    const nameInput = document.getElementById('name');
    const phoneNumberInput = document.getElementById('phone-number');

    const nameRegex = /^[A-Z][a-z]+\s[A-Z][a-z]+(-[A-Z][a-z]+)?$/;
    const phoneNumberRegex = /^(\+\d{3})?(\s?\d){9}$/;

    const isNameValid = nameInput.value.match(nameRegex);
    const isPhoneNumberValid = phoneNumberInput.value.match(phoneNumberRegex);

    if (isNameValid) {
        nameInput.classList.remove('invalid');
    }
    else {
        nameInput.classList.add('invalid');
    }

    if (isPhoneNumberValid) {
        phoneNumberInput.classList.remove('invalid');
    }
    else {
        phoneNumberInput.classList.add('invalid');
    }

    if (!isNameValid || !isPhoneNumberValid) {
        return;
    }

    const entry = document.createElement('div');
    entry.className = 'phone-book-item';
    entry.innerHTML = `
        <div class="item-info">
            <div class="name">${nameInput.value}</div>
            <div class="phone-number">${phoneNumberInput.value}</div>
        </div>
        <button class="delete-entry" onclick="removeBookItem(event)">Usuń</button>
    `;
    bookItems.appendChild(entry);
});

function removeBookItem(event) {
    const entry = event.target.parentNode;
    bookItems.removeChild(entry);
}