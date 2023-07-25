function searchAndScrape() {
    const searchInput = document.getElementById('searchInput').value;
    if (!searchInput) {
        alert('Please enter a search query.');
        return;
    }

    fetch('/search-and-scrape', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: searchInput })
    })
    .then(response => response.json())
    .then(data => {
        displayResults(data.results);
    })
    .catch(error => {
        console.error('Error during search and scraping:', error.message);
        alert('Error during search and scraping. Please try again later.');
    });
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; 

    results.forEach((text, index) => {
        const paragraph = document.createElement('p');
        paragraph.textContent = `Result ${index + 1}: ${text}`;
        resultsDiv.appendChild(paragraph);
    });
}
