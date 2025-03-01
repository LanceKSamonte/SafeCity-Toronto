/**
 * class to handle the crime filters and map layers
 */
class FilterController {

    /**
     * constructor to initialize map, neighbourhoods, and other necessary elements
     * @param {object} map - the map instance to display crime data on
     * @param {array} neighbourhoods - the list of neighbourhood data for the city
     */
    constructor(map, neighbourhoods) {
        this.map = map;
        this.neighbourhoods = neighbourhoods;
        this.charts = new Graphs();

        // initialize layer groups
        this.layerGroups = {
            "ASSAULT": L.layerGroup(),
            "AUTOTHEFT": L.layerGroup(),
            "BIKETHEFT": L.layerGroup(),
            "BREAKENTER": L.layerGroup(),
            "HOMICIDE": L.layerGroup(),
            "SHOOTING": L.layerGroup(),
            "ROBBERY": L.layerGroup(),
            "THEFTFROMMV": L.layerGroup(),
            "THEFTOVER": L.layerGroup(),
            "NEIGHBORHOODS": L.layerGroup()
        };

        // incident numbers for map coloring
        this.crimeMaxIncidents = {
            "ASSAULT": 500,
            "AUTOTHEFT": 400,
            "BIKETHEFT": 60,
            "BREAKENTER": 218,
            "HOMICIDE": 3,
            "SHOOTING": 15,
            "ROBBERY": 70,
            "THEFTFROMMV": 250,
            "THEFTOVER": 40
        };

        // initialize checkbox references
        this.checkboxElements = {
            "NEIGHBORHOODS": document.getElementById("neighborhoodCheckbox"),
            "ASSAULT": document.getElementById("assaultCheckbox"),
            "AUTOTHEFT": document.getElementById("autotheftCheckbox"),
            "BIKETHEFT": document.getElementById("biketheftCheckbox"),
            "BREAKENTER": document.getElementById("bandeCheckbox"),
            "HOMICIDE": document.getElementById("homicideCheckbox"),
            "SHOOTING": document.getElementById("shootingCheckbox"),
            "ROBBERY": document.getElementById("robberyCheckbox"),
            "THEFTFROMMV": document.getElementById("tfmvCheckbox"),
            "THEFTOVER": document.getElementById("to5000Checkbox")
        };

        // initialize filters state to track active filters
        this.filtersState = {
            "ASSAULT": false,
            "AUTOTHEFT": false,
            "BIKETHEFT": false,
            "BREAKENTER": false,
            "HOMICIDE": false,
            "SHOOTING": false,
            "ROBBERY": false,
            "THEFTFROMMV": false,
            "THEFTOVER": false
        };

        // attach event listeners to checkboxes
        this.initCheckboxHandlers();
    }

    /**
     * method to initialize checkbox handlers and bind events to filter layers
     */
    initCheckboxHandlers() {
        // iterate over each crime type and bind checkbox event listeners
        Object.keys(this.checkboxElements).forEach(crimeType => {
            this.checkboxElements[crimeType].addEventListener("change", (event) => {
                const isChecked = event.target.checked;
                this.filtersState[crimeType] = isChecked; 

                if (crimeType === "NEIGHBORHOODS") {
                    this.toggleNeighborhoodLayer(isChecked);
                } else {
                    this.toggleCrimeLayer(crimeType, isChecked);
                }
            });
        });
    }

    /**
     * method to toggle the neighborhood layer on the map
     * @param {boolean} isChecked - whether the neighborhood filter is enabled
     */
    toggleNeighborhoodLayer(isChecked) {
        if (isChecked) {
            console.log("Neighborhoods filter is enabled");
            this.layerGroups["NEIGHBORHOODS"].clearLayers();

            this.neighbourhoods.forEach((neighbourhood) => {
                const { name, id, population, hoodId } = neighbourhood;
                let geometry;
                try {
                    geometry = JSON.parse(neighbourhood.geometry);
                } catch (error) {
                    console.error("Failed to parse geometry for neighbourhood:", neighbourhood, error);
                }

                const coordinates = geometry.coordinates.map(polygon => 
                    polygon.map(point => [point[1], point[0]])
                );

                const polygon = L.polygon(coordinates, {
                    color: "black",
                    weight: 1,
                    fillOpacity: 0.1
                });

                const popupContent = `
                    <strong>${name}</strong><br>
                    <p>Area ID: ${id}</p>
                    <p>Hood ID: ${hoodId}</p>
                    <p>Population: ${population}</p>
                `;
                polygon.bindPopup(popupContent);
                this.layerGroups["NEIGHBORHOODS"].addLayer(polygon);
            });

            this.layerGroups["NEIGHBORHOODS"].addTo(this.map);
        } else {
            console.log("Neighborhoods filter is disabled");
            this.map.removeLayer(this.layerGroups["NEIGHBORHOODS"]);
        }
    }

    /**
     * method to toggle crime layer on the map based on the selected crime type
     * @param {string} crimeType - the type of crime to filter by
     * @param {boolean} isChecked - whether the crime filter is enabled
     */
    toggleCrimeLayer(crimeType, isChecked) {
        console.log(this.getActiveFilters());
        const layerGroup = this.layerGroups[crimeType];
        const maxIncidents = this.crimeMaxIncidents[crimeType];
        const color = this.getCrimeColor(crimeType);
        this.graphTutorial = document.getElementById("graphTutorial");
        
        if (isChecked) {
            this.graphTutorial.style.display = "none";
            console.log(`${crimeType} filter is enabled`);
            layerGroup.clearLayers();
            this.charts.clearCharts();

            // loops through each neighbourhood
            this.neighbourhoods.forEach((neighbourhood) => {
                const { name, crimeDataList } = neighbourhood;
                let geometry;
                try {
                    geometry = JSON.parse(neighbourhood.geometry);
                } catch (error) {
                    console.error("Failed to parse geometry for neighbourhood:", neighbourhood, error);
                }
                const coordinates = geometry.coordinates.map(polygon => 
                    polygon.map(point => [point[1], point[0]])
                );

                const crimeData = crimeDataList.filter(data => data.type === crimeType);
                const popupContent = this.generatePopupContent(name, crimeType, crimeData);
                const latestCrimeData = crimeData.find(data => data.year === 2023);
                const incidents = latestCrimeData ? latestCrimeData.incidents : 0;

                // create a highlighted area from the coordinates of a neighbourhood
                const polygon = L.polygon(coordinates, {
                    color: "black",
                    weight: 1,
                    fillColor: color,
                    fillOpacity: this.calculateFillOpacity(incidents, maxIncidents)
                });

                polygon.bindPopup(popupContent);
                layerGroup.addLayer(polygon);

                
            });

            layerGroup.addTo(this.map);
            this.generateCharts();
            
        } else {
            console.log(`${crimeType} filter is disabled`); // debugging
            this.map.removeLayer(layerGroup);
            this.charts.clearCharts();
            const activeFilters = this.getActiveFilters();
            if (activeFilters.length != 0) {
                this.generateCharts();
                
            }
            else{
                this.graphTutorial.style.display = "block";
            }
        }
    }

    /**
     * method to get the color for a specific crime type
     * @param {string} crimeType - the type of crime
     * @returns {string} color - the color associated with the crime type
     */
    getCrimeColor(crimeType) {
        const colors = {
            "ASSAULT": "red",
            "AUTOTHEFT": "blue",
            "BIKETHEFT": "green",
            "BREAKENTER": "purple",
            "HOMICIDE": "#B23BAF",
            "SHOOTING": "orange",
            "ROBBERY": "#41A239",
            "THEFTFROMMV": "#3056ff",
            "THEFTOVER": "brown"
        };
        return colors[crimeType] || "black";
    }

    /**
     * method to calculate the opacity for the fill color of a polygon
     * @param {number} incidents - the number of incidents in the neighborhood
     * @param {number} maxIncidents - the maximum number of incidents for the crime type
     * @returns {number} opacity - the opacity of the polygon fill
     */
    calculateFillOpacity(incidents, maxIncidents) {
        const minOpacity = 0.1;
        const maxOpacity = 0.8;
        return Math.min(maxOpacity, Math.max(minOpacity, (incidents / maxIncidents) * maxOpacity));
    }

    /**
     * method to generate popup content for a polygon
     * @param {string} name - the name of the neighborhood
     * @param {string} crimeType - the crime type being displayed
     * @param {array} crimeData - the list of crime data for the neighborhood
     * @returns {string} popupContent - the HTML content for the popup
     */
    generatePopupContent(name, crimeType, crimeData) {
        const years = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
        return `
            <strong>${name}</strong><br>
            <p>${crimeType} Incidents and Rates by Year:</p>
            <ul>
                ${years.map(year => {
                    const yearData = crimeData.find(data => data.year === year);
                    return yearData ? 
                        `<li>${year}: ${yearData.incidents} incidents, Rate: ${yearData.rate}</li>` :
                        `<li>${year}: No data</li>`;
                }).join('')}
            </ul>
        `;
    }

    /**
     * method to generate crime charts based on the active filters
     */
    generateCharts() {
        // Get the active filters using the getActiveFilters() method
        const activeFilters = this.getActiveFilters();
    
        // Loop through the active filters
        activeFilters.forEach(crimeType => {
            const years = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
            const incidents = this.getIncidentData(crimeType, years); // Get incidents data for the filter
    
            // Call the showCharts function to display the chart
            this.charts.showCharts(crimeType, incidents, years);
        });
    }
    
    /**
     * method to get the amount of incidents for each crime type in each year
     * @param {string} crimeType 
     * @param {array} years 
     * @returns 
     */
    getIncidentData(crimeType, years) {
        const incidents = years.map(year => {
            const crimeData = this.neighbourhoods.flatMap(neighbourhood => 
                neighbourhood.crimeDataList.filter(data => data.type === crimeType && data.year === year)
            );
            return crimeData.reduce((total, data) => total + data.incidents, 0);
        });
        return incidents;
    }

    /**
     * method to get all active filters as an array of crime types
     * @returns {Array} activeFilters - the list of active crime filters
     */
    getActiveFilters() {
        return Object.keys(this.filtersState).filter(crimeType => this.filtersState[crimeType]);
    }
}