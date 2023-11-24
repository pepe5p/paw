async function fetchData() {
    try {
        const response = await fetch('source/city.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
    }
}

async function displayMalopolskieCities() {
    const data = await fetchData();
    const malopolskieCities = data.filter(city => city.province === 'małopolskie');

    const malopolskieList = document.getElementById('malopolskieList');
    malopolskieCities.forEach(city => {
        const listItem = document.createElement('li');
        listItem.textContent = city.name;
        malopolskieList.appendChild(listItem);
    });
}

async function displayCitiesWithTwoA() {
    const data = await fetchData();
    const twoACities = data.filter(city => {
        const lowercaseName = city.name.toLowerCase();
        const countA = lowercaseName.split('a').length - 1;
        return countA === 2 && lowercaseName.indexOf('a') !== lowercaseName.lastIndexOf('a');
    });

    const twoAList = document.getElementById('twoAList');
    twoACities.forEach(city => {
        const listItem = document.createElement('li');
        listItem.textContent = city.name;
        twoAList.appendChild(listItem);
    });
}

async function displayFifthCity() {
    const data = await fetchData();
    const sortedCities = data.sort((a, b) => (b.people / b.area) - (a.people / a.area));

    const fifthCityInfo = document.getElementById('fifthCityInfo');
    fifthCityInfo.textContent = `Miasto: ${sortedCities[4].name}, Gęstość zaludnienia: ${sortedCities[4].people / sortedCities[4].area}`;
}

async function addCityToAbove100000Cities() {
    const data = await fetchData();
    const above100000Cities = data.filter(city => city.people > 100000);

    const above100000List = document.getElementById('above100000List');
    above100000Cities.forEach(city => {
        const listItem = document.createElement('li');
        listItem.textContent = `${city.name} city`;
        above100000List.appendChild(listItem);
    });
}

async function comparePopulation() {
    const data = await fetchData();
    const above80000Cities = data.filter(city => city.people > 80000);
    const below80000Cities = data.filter(city => city.people <= 80000);

    const populationComparisonInfo = document.getElementById('populationComparisonInfo');

    populationComparisonInfo.textContent = `Liczba miast powyżej 80000 mieszkańców: ${above80000Cities.length}. 
        Liczba miast poniżej lub równa 80000 mieszkańców: ${below80000Cities.length}.`;
}

async function calculateAverageAreaForPCities() {
    const data = await fetchData();
    const pCities = data.filter(city => city.township.startsWith('P'));
    const totalArea = pCities.reduce((acc, city) => acc + city.area, 0);
    const averageArea = totalArea / pCities.length;

    const averageAreaInfo = document.getElementById('averageAreaInfo');
    averageAreaInfo.textContent = `Średnia powierzchnia miast z powiatów zaczynających się na literkę „p”: ${averageArea.toFixed(2)} km².`;
}


async function checkIfPomorskieCitiesAbove5000() {


    const data = await fetchData();
    const pomorskieCities = data.filter(city => city.province === 'pomorskie');

    if (pomorskieCities.length === 0) {
        console.log('Brak miast województwa pomorskiego.');
        return;
    }

    const allAbove5000 = pomorskieCities.every(city => city.people > 5000);
    const above5000CitiesCount = pomorskieCities.filter(city => city.people > 5000).length;

    const pomorskieCitiesInfo = document.getElementById('pomorskieCitiesInfo');
    pomorskieCitiesInfo.innerHTML = `<p><strong>Czy wszystkie miasta z województwa pomorskiego są większe od 5000 osób?</strong> ${allAbove5000 ? 'Tak' : 'Nie'}.</p><p><strong>Liczba miast województwa pomorskiego większych od 5000 osób:</strong> ${above5000CitiesCount}.</p>`;
    isButtonCheckIfPomorskieCitiesAbove5000Clicked = true;
}

function executeOnPageLoad() {
    displayMalopolskieCities();
    displayCitiesWithTwoA();
    displayFifthCity();
    addCityToAbove100000Cities();
    comparePopulation();
    calculateAverageAreaForPCities();
    checkIfPomorskieCitiesAbove5000();
}

executeOnPageLoad();
