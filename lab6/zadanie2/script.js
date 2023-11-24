const form = document.getElementById('phoneBookForm');
const entriesContainer = document.getElementById('phoneBookEntries');

form.addEventListener('submit', function (event) {
    event.preventDefault();
    const nameInput = document.getElementById('name');
    const phoneNumberInput = document.getElementById('phoneNumber');

    if (nameInput.checkValidity() && phoneNumberInput.checkValidity()) {
        const name = nameInput.value;
        const phoneNumber = phoneNumberInput.value;

        const entry = document.createElement('div');
        entry.className = 'entry';
        entry.innerHTML = `
                    <span>${name} ${phoneNumber}</span>
                    <button class="removeEntryButton" onclick="removeEntry(event)">🗑️</button>
                `;

        entriesContainer.appendChild(entry);

        nameInput.value = '';
        phoneNumberInput.value = '';
    }
});

function removeEntry(event) {
    const entry = event.target.parentNode;
    entriesContainer.removeChild(entry);
}