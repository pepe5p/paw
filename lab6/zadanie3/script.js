async function displayTaskA(data) {
    const taskAInfo = document.getElementById('task-a-info');
    data.filter(city => city.province === 'małopolskie').forEach(city => {
        const listItem = document.createElement('li');
        listItem.textContent = city.name;
        taskAInfo.appendChild(listItem);
    });
}

async function displayTaskB(data) {
    const taskBInfo = document.getElementById('task-b-info');
    data.filter(city => {
        const lowercaseName = city.name.toLowerCase();
        const countA = lowercaseName.split('a').length - 1;
        return countA === 2 && lowercaseName.indexOf('a') !== lowercaseName.lastIndexOf('a');
    }).forEach(city => {
        const listItem = document.createElement('li');
        listItem.textContent = city.name;
        taskBInfo.appendChild(listItem);
    });
}

async function displayTaskC(data) {
    const sortedCities = data.sort((a, b) => (b.people / b.area) - (a.people / a.area));
    const taskCInfo = document.getElementById('task-c-info');
    taskCInfo.textContent = `${sortedCities[4].name} - gęstość zaludnienia: ${sortedCities[4].people / sortedCities[4].area}`;
}

async function displayTaskD(data) {
    const above100000Cities = data.filter(city => city.people > 100000);
    const taskDInfo = document.getElementById('task-d-info');
    above100000Cities.forEach(city => {
        const listItem = document.createElement('li');
        listItem.textContent = `${city.name} city`;
        taskDInfo.appendChild(listItem);
    });
}

async function displayTaskE(data) {
    const above80000Cities = data.filter(city => city.people > 80000);
    const below80000Cities = data.filter(city => city.people <= 80000);
    const taskEInfo = document.getElementById('task-e-info');
    taskEInfo.innerHTML = `
        <p>Liczba miast z ilością mieszkańców większą od 80000: ${above80000Cities.length}.</p>
        <p>Liczba miast z ilością mieszkańców mniejszą bądź równą 80000: ${below80000Cities.length}.</p>
    `;
}

async function displayTaskF(data) {
    const pCities = data.filter(city => city.township.startsWith('P'));
    const totalArea = pCities.reduce((acc, city) => acc + city.area, 0);
    const averageArea = totalArea / pCities.length;
    const taskFInfo = document.getElementById('task-f-info');
    taskFInfo.innerHTML = `
        <p>Średnia powierzchnia miast z powiatów zaczynających się na literę „P”: ${averageArea.toFixed(2)} km².</p>
    `;
}


async function displayTaskG(data) {
    const pomorskieCities = data.filter(city => city.province === 'pomorskie');
    const allAbove5000 = pomorskieCities.every(city => city.people > 5000);
    const above5000CitiesCount = pomorskieCities.filter(city => city.people > 5000).length;
    const taskGInfo = document.getElementById('task-g-info');
    taskGInfo.innerHTML = `
        <p>
            Czy wszystkie miasta z województwa pomorskiego są większe od 5000 osób? 
            ${allAbove5000 ? 'Tak' : 'Nie'}.
        </p>
        <p>
            Liczba miast województwa pomorskiego większych od 5000 osób: 
            ${above5000CitiesCount}.
        </p>
    `;
}

async function fetchData() {
    try {
        const response = await fetch('source/city.json');
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

async function runTasks() {
    const data = await fetchData();
    displayTaskA(data).then(() => console.log('Task A done'));
    displayTaskB(data).then(() => console.log('Task B done'));
    displayTaskC(data).then(() => console.log('Task C done'));
    displayTaskD(data).then(() => console.log('Task D done'));
    displayTaskE(data).then(() => console.log('Task E done'));
    displayTaskF(data).then(() => console.log('Task F done'));
    displayTaskG(data).then(() => console.log('Task G done'));
}

runTasks().then(() => console.log('All tasks done'));
