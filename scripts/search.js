// Import and insert header and footer components
import headerContainer from "../components/header.js";
import footerContainer from "../components/footer.js";
import { basePath } from "../helpers/constants.js";
document.getElementById("header").appendChild(headerContainer);
document.getElementById("footer").appendChild(footerContainer);

// Keep this on top
// The search string of the user is available in the keyword constant you see here
const searchString = new URLSearchParams(window.location.search);
const keyword = searchString.get('search');

// Find the search form and search results container
const searchForm = document.getElementById("search-form");
const searchResultsContainer = document.getElementById("search-results");

// Add event listener to the search form
searchForm.addEventListener("submit", (event) => {
    // Prevent default form submission behavior
    event.preventDefault();
});

// Fetch call
const fileNames = ['smart_lights.json', 'smart_plugs.json', 'smart_speaker.json', 'smart_thermostats.json', 'wifi_extenders'];
// const fileNames = `${basePath}/products`;

fileNames.forEach(fileName =>
fetch(`./${fileName}`)
.then(res => res.json()) 
.then(data => {
    console.log(data); 
})
.catch(err => 
{ 
        console.log('No results');
}));

// Define a function to render search results
function renderSearchResults(results){
    searchResultsContainer.innerHTML = "";

    // If there are no results
    if(results.length === 0){
        searchResultsContainer.innerHTML = "<p> No results found</p>"
        return;
    }
    // Otherwise case
    results.forEach(result => {
        const resultContainer = document.createElement("div");
        resultContainer.innerHTML = `
        <h2>${result.name}</h2>
        <img>${result.imageUrl}</img>
        <p>${result.description}</p>
        `;
        searchResultsContainer.appendChild(resultContainer);
    });
}

// Function to perform the search
function performSearch(){
    // const fileNames = `${basePath}/products`;
    const fileNames = ['smart_lights.json', 'smart_plugs.json', 'smart_speaker.json', 'smart_thermostats.json', 'wifi_extenders.json'];
    const promises = fileNames.map(fileName => fetch(`./${fileName}`)
    .then(res => res.json()));
    // console.log(res);

    Promise.all(promises)
    .then(data => {
        const results = data.reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);

        const filteredResults = results.filter(result => {
            return result.name.toLowerCase().include(keyword.toLowerCase());
        });
        renderSearchResults(filteredResults);
    })
    .catch(err => {
        console.log(err);
        searchResultsContainer.innerHTML = "<p> Error fetching results</p>";
    });
}

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    performSearch();
})