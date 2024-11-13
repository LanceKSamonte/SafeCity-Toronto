// Checkbox html references
const neighborhoodCheckbox = document.getElementById("neighborhoodCheckbox"); 
const assaultCheckbox = document.getElementById("assaultCheckbox");
const autotheftCheckbox = document.getElementById("autotheftCheckbox");
const biketheftCheckbox = document.getElementById("biketheftCheckbox");
const bandeCheckbox = document.getElementById("bandeCheckbox");
const homicideCheckbox = document.getElementById("homicideCheckbox");
const robberyCheckbox = document.getElementById("robberyCheckbox");
const shootingCheckbox = document.getElementById("shootingCheckbox");
const tfmvCheckbox = document.getElementById("tfmvCheckbox");
const to5000Checkbox = document.getElementById("to5000Checkbox");

// get data from geojson
fetch("./data/neighbourhood-crime-rates - 4326.geojson")
    .then(response => response.json())
    .then(data => {
        
        const neighbourhoods = parseNeighbourhoodData(data); // Array of Neighbourhood objects

        // Initialize Layer groups
        const assaultLayer = L.layerGroup();
        const autotheftLayer = L.layerGroup();
        const biketheftLayer = L.layerGroup();
        const bandeLayer = L.layerGroup();
        const homicideLayer = L.layerGroup();
        const robberyLayer = L.layerGroup();
        const shootingLayer = L.layerGroup();
        const tfmvLayer = L.layerGroup();
        const to5000Layer = L.layerGroup();

        // Incident numbers for map coloring
        const crimeMaxIncidents = {
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

        // Checkbox handler function calls
        handleCheckboxChange("ASSAULT", assaultCheckbox, assaultLayer, neighbourhoods, "red", crimeMaxIncidents["ASSAULT"]);
        handleCheckboxChange("AUTOTHEFT", autotheftCheckbox, autotheftLayer, neighbourhoods, "blue", crimeMaxIncidents["AUTOTHEFT"]);
        handleCheckboxChange("BIKETHEFT", biketheftCheckbox, biketheftLayer, neighbourhoods, "green", crimeMaxIncidents["BIKETHEFT"]);
        handleCheckboxChange("BREAKENTER", bandeCheckbox, bandeLayer, neighbourhoods, "purple", crimeMaxIncidents["BREAKENTER"]);
        handleCheckboxChange("HOMICIDE", homicideCheckbox, homicideLayer, neighbourhoods, "#B23BAF", crimeMaxIncidents["HOMICIDE"]);
        handleCheckboxChange("SHOOTING", shootingCheckbox, shootingLayer, neighbourhoods, "orange", crimeMaxIncidents["SHOOTING"]);
        handleCheckboxChange("ROBBERY", robberyCheckbox, robberyLayer, neighbourhoods, "#41A239", crimeMaxIncidents["ROBBERY"]);
        handleCheckboxChange("THEFTFROMMV", tfmvCheckbox, tfmvLayer, neighbourhoods, "#3056ff", crimeMaxIncidents["THEFTFROMMV"]);
        handleCheckboxChange("THEFTOVER", to5000Checkbox, to5000Layer, neighbourhoods, "brown", crimeMaxIncidents["THEFTOVER"]);

        //neighborhoodCheckbox on click handler
        neighborhoodCheckbox.addEventListener("change", (event) => {
            if (event.target.checked) {
                // Check if works :)
                console.log("Neighborhoods filter is enabled");

                // Create a layer group to hold all neighborhood polygons
                neighborhoodLayer = L.layerGroup();

                neighbourhoods.forEach((neighbourhood) => {
                    const { geometry, name, id, population, hoodId } = neighbourhood;

                    // Reverse coordinates if necessary (from [lng, lat] to [lat, lng])
                    const coordinates = geometry.coordinates.map(polygon => 
                        polygon.map(coords => coords.map(point => [point[1], point[0]]))
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

                    // Add each polygon to the neighborhoodLayer group
                    neighborhoodLayer.addLayer(polygon);
                });

                // Add the entire neighborhoodLayer group to the map
                neighborhoodLayer.addTo(map);
            }else{
                // Check if works :)
                console.log("Neighborhoods filter is disabled");

                // Remove the entire neighborhoodLayer group from the map if it exists
                if (neighborhoodLayer) {
                    map.removeLayer(neighborhoodLayer);
                    neighborhoodLayer = null; // Clear the reference to the layer group
                }

            }
        }); 

        /**
         * Function to handle checkbox change and toggle crime data layer
         * @param {string} crimeType 
         * @param {HTML ELEMENT} checkbox 
         * @param {any} layerGroup 
         * @param {any} dataList 
         * @param {string} color 
         * @param {number} maxIncidents 
         */
        function handleCheckboxChange(crimeType, checkbox, layerGroup, dataList, color, maxIncidents) {
            checkbox.addEventListener("change", (event) => {
                if (event.target.checked) {
                    
                    // Debugging
                    console.log(`${crimeType} filter is enabled`);

                    // Clear existing layer groups
                    layerGroup.clearLayers();
                    
                    // Iterate through each neighborhood and display the polygons
                    neighbourhoods.forEach((neighbourhood) => {
                        const { geometry, name, crimeDataList } = neighbourhood;
                        
                        // Reverse the coordinates cuz for some reason leaflet reversed latitude and longtitude lmao
                        const coordinates = geometry.coordinates.map(polygon =>
                            polygon.map(coords => coords.map(point => [point[1], point[0]]))
                        );
                        
                        // Find the specific crime data for this neighborhood and year
                        const crimeData = crimeDataList.filter(data => data.type === crimeType);

                        // Popup content with incidents and rate by year
                        const popupContent = `
                            <strong>${name}</strong><br>
                            <p>${crimeType} Incidents and Rates by Year:</p>
                            <ul>
                                ${[2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023].map(year => {
                                    const yearData = crimeData.find(data => data.year === year);
                                    if (yearData) {
                                        return `<li>${year}: ${yearData.incidents} incidents, Rate: ${yearData.rate}</li>`;
                                    } else {
                                        return `<li>${year}: No data</li>`;
                                    }
                                }).join('')}
                            </ul>
                        `;

                        // Get the latest crime data (e.g., for 2023)
                        const latestCrimeData = crimeData.find(data => data.year === 2023);
                        const incidents = latestCrimeData ? latestCrimeData.incidents : 0;

                        // Function to calculate fillOpacity based on incidents and max incidents
                        const getFillOpacity = (incidents, maxIncidents) => {
                            const minOpacity = 0.1;
                            const maxOpacity = 0.8;
                            return Math.min(maxOpacity, Math.max(minOpacity, (incidents / maxIncidents) * maxOpacity));
                        };

                        // Set fillOpacity based on incidents and the maxIncidents for the crime type
                        const fillOpacity = getFillOpacity(incidents, maxIncidents);

                        // Create the polygon with dynamic fillOpacity and custom color
                        const polygon = L.polygon(coordinates, {
                            color: "black",  // Use the passed color for the crime type
                            weight: 1,
                            fillColor: color,      // Use the passed color for the fill
                            fillOpacity: fillOpacity
                        });

                        // Bind the popup to the polygon
                        polygon.bindPopup(popupContent);

                        // Add the polygon to the layer group
                        layerGroup.addLayer(polygon);
                    });

                    // Add the layer group to the map
                    layerGroup.addTo(map);

                } else {
                    console.log(`${crimeType} filter is disabled`);
                    
                    // Remove the entire layer group from the map if it exists
                    if (layerGroup) {
                        map.removeLayer(layerGroup);
                    }
                }
            });
        }
    })
    .catch(error => console.error("Error loading GeoJSON data:", error));
