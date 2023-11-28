let regions = [];
let regionsPerPage = 3;
let currentPage = 1;
let accordionList = document.getElementById("accordionList");
let countries = [];

fetch("https://restcountries.com/v3.1/all")
		.then(response => response.json())
		.then(data => {
			countries = data;
			searchAndRender() //if user has some input in search fields, render only filtered countries
		})

function subregionizeData(countries) {
	let regions = []
	countries.forEach(country => {
		if (!regions.includes(country.subregion)) {
			regions.push(country.subregion)
		}
	})
	filteredRegions = regions;
	return regions
}

function sanitize(str) {
	if(typeof str !== "string") return str;
	return str.replace(/\s/g, "")
}

function renderRegions(countries, currentPage, regionsPerPage = 3, sortMethod = "population"){
	subregions = subregionizeData(countries);
	let subregionsToDisplay = subregions.slice((currentPage - 1) * regionsPerPage, currentPage * regionsPerPage);
	subregionsToDisplay.forEach(subregion => {
		let noSpaceSubregion = sanitize(subregion);
		let regionCountries = countries.filter(country => country.subregion == subregion);
		let checkBox = document.getElementById(sortMethod + "-sort").checked;
		regionCountries = sortBy(sortMethod, regionCountries, checkBox);
		let regionCountriesList = document.createElement("div");
		regionCountriesList.classList.add("accordion-item") ;
		regionCountriesList.innerHTML = `
			<h2 class="accordion-header" id="heading${noSpaceSubregion}">
				<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${noSpaceSubregion}" aria-expanded="false" aria-controls="collapse${noSpaceSubregion}">
				<div class="w-100 px-2 d-flex justify-content-between align-items-center">
					${subregion ? subregion : "Other"}
					<div>${regionCountries.reduce((acc, country) => acc + country.population, 0)}</div>
				</div>	
				</button>
			</h2>
			<div id="collapse${noSpaceSubregion}" class="accordion-collapse collapse" aria-labelledby="heading${noSpaceSubregion}">
				<div class="accordion-body px-0">
					<ul>
						${regionCountries.map(country => `<li class="d-flex justify-content-between align-items-center">
						<p class="col-4"><b>${country.name.common}</b></p>
						<p class="col-4">${country.capital?.[0]}</p>
						<p class="col-4 text-center">${country.population}</p>
						</li>`).join("")}
					</ul>
				</div>
			</div>
		`
		accordionList.appendChild(regionCountriesList)
	});
}

function renderPagination(countries) {
	let pagination = document.getElementById("pagination");
	let noPages = Math.ceil(subregionizeData(countries).length / regionsPerPage);
	for (let i = 1; i <= noPages; i++) {
		let page = document.createElement("li");
		let pagButton = document.createElement("button");
		pagButton.classList.add("page-link");
		pagButton.innerText = i;
		pagButton.addEventListener("click", () => {
			currentPage = i;
			accordionList.innerHTML = "";
			renderRegions(countries, currentPage);
		})
		page.classList.add("page-item");
		page.appendChild(pagButton);
		pagination.appendChild(page);
	}
}

function changeNoRegionsPerPage(e) {
	regionsPerPage = e.target.value;
	accordionList.innerHTML = "";
	renderRegions(countries, currentPage, regionsPerPage);
	pagination.innerHTML = "";
	renderPagination(countries);
}

function searchAndRender(){
	let name = document.getElementById("name").value;
	let capital = document.getElementById("capital").value;
	let population = document.getElementById("population").value;
	let filteredCountries = countries.filter(country => {
		return country.name.common.toLowerCase().includes(name.toLowerCase()) &&
				country.capital?.[0].toLowerCase().includes(capital.toLowerCase()) &&
				(country.population >= population || population == "");
	});
	accordionList.innerHTML = "";
	renderRegions(filteredCountries, currentPage);
	pagination.innerHTML = "";
	renderPagination(filteredCountries);
}

function flipCheckbox(key){
	let checkboxVal = document.getElementById(key+"-sort").checked;
	document.getElementById(key+"-sort").checked = !checkboxVal;
	document.getElementById("sort-" + key + "-button").innerText = checkboxVal ? "Dsc" : "Asc";
	accordionList.innerHTML = "";
	renderRegions(countries, currentPage, regionsPerPage, key);
	pagination.innerHTML = "";
	renderPagination(countries);
}

function sortBy(key, regions, checked) {
	let sortedRegions = regions.slice(); // Create a copy of the array to avoid modifying the original array
	if (key === "population") {
			sortedRegions.sort((a, b) => {
					return checked ? a.population - b.population : b.population - a.population;
			});
	} else if (key === "name") {
			sortedRegions.sort((a, b) => {
					const nameA = a.name.common.toLowerCase();
					const nameB = b.name.common.toLowerCase();
					return checked ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
			});
	} else if (key === "capital") {
			sortedRegions.sort((a, b) => {
					const capitalA = a.capital?.[0]?.toLowerCase() || "";
					const capitalB = b.capital?.[0]?.toLowerCase() || "";
					return checked ? capitalA.localeCompare(capitalB) : capitalB.localeCompare(capitalA);
			});
	}
	return sortedRegions;
}

document.getElementById("regionsNumInput").addEventListener("change", e => changeNoRegionsPerPage(e));
document.getElementById("name").addEventListener("keyup", e => searchAndRender());
document.getElementById("capital").addEventListener("keyup", e => searchAndRender());
document.getElementById("population").addEventListener("keyup", e => searchAndRender());
document.getElementById("sort-name-button").addEventListener("click", e => flipCheckbox("name"));
document.getElementById("sort-capital-button").addEventListener("click", e => flipCheckbox("capital"));
document.getElementById("sort-population-button").addEventListener("click", e => flipCheckbox("population"));
