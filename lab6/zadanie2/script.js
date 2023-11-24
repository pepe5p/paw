const form = document.getElementById('phone-book-form');
const bookItems = document.getElementById('phone-book-items');

form.addEventListener('submit', function (event) {
    event.preventDefault();
    const nameInput = document.getElementById('name');
    const phoneNumberInput = document.getElementById('phone-number');

    if (!nameInput.checkValidity()) {
        return;
    }
    if (!phoneNumberInput.checkValidity()) {
        return;
    }

    const entry = document.createElement('div');
    entry.className = 'phone-book-item';
    entry.innerHTML = `
        <div class="item-info">
            <div class="name">${nameInput.value}</div>
            <div class="phone-number">${phoneNumberInput.value}</div>
        </div>
        <button class="delete-entry" onclick="removeBookItem(event)">X</button>
    `;
    bookItems.appendChild(entry);
});

function removeBookItem(event) {
    const entry = event.target.parentNode;
    bookItems.removeChild(entry);
}