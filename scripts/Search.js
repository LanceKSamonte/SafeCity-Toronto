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
        this.initializeSearchbarLlm();
    }

    /**
     * gets the data needed from the DataSource
     */
    async getSearchData() {
        try {
            const packageResponse = await fetch('https://safecity-toronto.l5.ca/api/neighbourhoods');
            const packageData = await packageResponse.json();
    
            const neighbourhoods = new DataSource();
            this.allNeighbourhoods = neighbourhoods.parseNeighbourhoodData(packageData); // passes the neighbourhood objects into allNeighbourhoods
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
                map.setView([43.693963, -79.377319], 11);
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

    initializeSearchbarLlm() {
        this.searchBar_llm = document.getElementById("searchBar-llm");
        if (this.searchBar_llm) {
          this.searchBar_llm.addEventListener("keypress", function (event) {
            // Check if the Enter key is pressed
            if (event.key === "Enter") {
              event.preventDefault(); // Prevent the default form submission behavior
    
              const inputValue = event.target.value.trim(); // Get the input value
              if (inputValue) {
                fetch("https://038f-34-125-53-35.ngrok-free.app/query", {
                  method: "POST", // HTTP method
                  headers: {
                    "Content-Type": "application/json", // Set content type to JSON
                  },
                  body: JSON.stringify({ question: inputValue }), // Stringify the body with the question
                })
                  .then((response) => response.json())
                  .then((response) => {
                    this.llm_answer = document.getElementById("llm-answer");
                    this.llm_answer.innerHTML = "";
                    this.llm_answer.style.display = "block";
                    this.llm_answer.textContent = response.answer;
                    // this.llm_answer.appendChild(li);
                  });
              } else {
                console.log("Searchbar is empty!");
              }
            }
          });
        } else {
          console.error('Element with ID "searchbar-llm" not found.');
        }
    }

    /**
     * function to highlight the searched neighbourhood and show popups
     * @param {object} neighbourhood 
     */
    highlightGeometry(neighbourhood) {
        // highlight the coordinates 
        let geometry;
        try {
            geometry = JSON.parse(neighbourhood.geometry);
        } catch (error) {
            console.error("Failed to parse geometry for neighbourhood:", neighbourhood, error);
        }

        const geoJsonLayer = L.geoJSON(geometry).addTo(map);
        
        // bind a popup with the name and population
        geoJsonLayer.bindPopup(`<strong>${neighbourhood.name}</strong><br>Population: ${neighbourhood.population}`).openPopup();
        
        // adjust map zoom into the neighbourhood
        map.fitBounds(geoJsonLayer.getBounds());
    
        // store the current highlighted layer to remove it later
        this.highlightedLayer = geoJsonLayer;
    }
}

const search = new Search();  // instantiate class
