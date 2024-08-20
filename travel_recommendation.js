// Event listeners
const searchInput = document.getElementById('search-bar');
const searchButton = document.getElementById('search-btn');
const resetButton = document.getElementById('reset-btn');

searchButton.addEventListener('click', searchDestinations);
resetButton.addEventListener('click', resetResults);

// Function to fetch data and handle search results
function searchDestinations() {
    const query = searchInput.value.toLowerCase();
    const resultsContainer = document.getElementById('results-container');
    console.log(query);
    resultsContainer.innerHTML = '';
    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(country => 
                country.cities.some(city => city.name.toLowerCase().includes(query))
            );
            displayFilteredData(filteredData);
        })
        .catch(error => {
            console.error('Error fetching recommendations:', error);
            resultsContainer.innerHTML = '<p>Error loading recommendations. Please try again later.</p>';
        });

// Function to display filtered data
function displayFilteredData(filteredData) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';

    filteredData.forEach(country => {
        country.cities.forEach(city => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <h2>${city.name}</h2>
                <img src="${city.imageUrl}" alt="${city.name}">
                <p>${city.description}</p>
                <button>Visit</button>
            `;
            resultsContainer.appendChild(resultItem);
        });
    })
    resultsContainer.classList.add('show'); // Show results
}
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