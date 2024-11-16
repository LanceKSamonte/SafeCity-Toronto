/**
 * A class to handle the search operations
 */
class Search {
    /**
     * initializes the element ids and calls apporopriate functions
     */
    constructor() {
        this.searchBar = document.getElementById("searchBar");
        this.autocomplete = document.getElementById("autocomplete");

        this.allNeighbourhoods = [];
        this.highlightedLayer = null; // Store the currently highlighted geometry layer

        this.getSearchData();  // Fetch the data when the class is initialized
        this.searchFunction();  // Set up the search functionality
    }

    /**
     * gets the data needed from the DataSource
     */
    async getSearchData() {
        try {
            const response = await fetch("./data/neighbourhood-crime-rates - 4326.geojson");
            const data = await response.json();
            
            // Parse the neighborhood data and extract all relevant information into objects
            const neighbourhoods = new DataSource();
            this.allNeighbourhoods = neighbourhoods.parseNeighbourhoodData(data); // passes the neighbourhood objects into allNeighbourhoods
        } catch (error) {
            console.error("Error loading GeoJSON data:", error);
        }
    }

    /**
     * handles searching and auto complete
     */
    searchFunction() {
        // event listener for user input into search bar
        this.searchBar.addEventListener("input", () => {
            const query = this.searchBar.value.trim().toLowerCase();
            
            // clear previous autocomplete results
            this.autocomplete.innerHTML = "";
            
            // clear the previously highlighted neighbourhood layer if the query is changed
            if (this.highlightedLayer) {
                map.removeLayer(this.highlightedLayer);
                this.highlightedLayer = null;
            }
        
            // show suggestions only if there are at least 2 characters typed
            if (query.length >= 2) {
                // Filter neighborhoods based on the query
                const filteredNeighbourhoods = this.allNeighbourhoods.filter((neighbourhood) =>
                    neighbourhood.name.toLowerCase().includes(query)
                );
                
                // Show autocomplete suggestions
                if (filteredNeighbourhoods.length > 0) {
                    this.autocomplete.style.display = "block";
                    filteredNeighbourhoods.forEach((neighbourhood) => {
                        // creates list elements for each neighbourhood
                        const li = document.createElement("li");
                        li.textContent = neighbourhood.name;
                        
                        // add click event to each list item
                        li.addEventListener("click", () => {
                            this.searchBar.value = neighbourhood.name;  // set the search bar value to the clicked name
                            this.autocomplete.style.display = "none";  // hide the suggestions list when one is clicked
                            
                            // function call
                            this.highlightGeometry(neighbourhood);
                        });
    
                        this.autocomplete.appendChild(li); //add list to the autocomplete div in html
                    });
                }
            } 
        });
    }    

    /**
     * function to highlight the searched neighbourhood and show popups
     * @param {object} neighbourhood 
     */
    highlightGeometry(neighbourhood) {
        // highlight the coordinates 
        const geoJsonLayer = L.geoJSON(neighbourhood.geometry).addTo(map);
        
        // bind a popup with the name and population
        geoJsonLayer.bindPopup(`<strong>${neighbourhood.name}</strong><br>Population: ${neighbourhood.population}`).openPopup();
        
        // adjust map zoom into the neighbourhood
        map.fitBounds(geoJsonLayer.getBounds());
    
        // store the current highlighted layer to remove it later
        this.highlightedLayer = geoJsonLayer;
    }
}

const search = new Search();  // instantiate class