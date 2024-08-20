// Event listeners
const searchInput = document.getElementById('search-bar');
const searchButton = document.getElementById('search-btn');
const resetButton = document.getElementById('reset-btn');

searchButton.addEventListener('click', searchDestinations);
resetButton.addEventListener('click', resetResults);

// Function to fetch data and handle search results
function searchDestinations() {
    const query = searchInput.value.toLowerCase().trim();
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            // Check if the query matches any city names
            const cityResults = [];
            const countryResults = [];
            const typeResults = [];

            data.forEach(country => {
                // Check if the query matches the country name
                if (country.name.toLowerCase() === query) {
                    country.cities.forEach(city => {
                        countryResults.push(city);
                    });
                }

                country.cities.forEach(city => {
                    // Check if the query matches the city name
                    if (city.name.toLowerCase() === query) {
                        cityResults.push(city);
                    }
                    // Check if the query matches the city type
                    if (city.type.toLowerCase() === query) {
                        typeResults.push(city);
                    }
                });
            });

            // Display city results
            if (cityResults.length > 0) {
                displayFilteredData(cityResults);
            } else if (countryResults.length > 0) {
                // Display all cities if the query matches a country name
                displayFilteredData(countryResults);
            } else if (typeResults.length > 0) {
                // Display cities with the same type
                displayFilteredData(typeResults);
            } else {
                resultsContainer.innerHTML = '<p>No results found. Please try a different search term.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching recommendations:', error);
            resultsContainer.innerHTML = '<p>Error loading recommendations. Please try again later.</p>';
        });
}

function displayFilteredData(filteredData) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';

    filteredData.forEach(city => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <h2>${city.itemName}</h2>
            <img src="${city.imageUrl}" alt="${city.itemName}">
            <p>${city.description}</p>
            <button>Visit</button>
        `;
        resultsContainer.appendChild(resultItem);
    });

    resultsContainer.classList.add('show'); // Show results
}
// Function to reset search results
function resetResults() {
    searchInput.value = '';
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';
    resultsContainer.classList.remove('show'); // Hide results
}

// Function to paginate data
function paginateData(data, pageSize, currentPage) {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
}

// Example: Handling pagination and displaying paginated results
const paginatedData = paginateData(filteredData, 10, 1);
displayFilteredData(paginatedData);