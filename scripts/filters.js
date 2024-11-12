// Toggle filter box visibility on button click
filterButton.addEventListener("click", () => {
    if (filterBox.style.display === "none") {
        filterBox.style.display = "block";
    } else {
        filterBox.style.display = "none";
    }
});

// Check if neighborhoodCheckbox is checked 

const neighborhoodCheckbox = document.getElementById("neighborhoodCheckbox"); //reference the checkbox
let neighborhoodLayer; // storing the neighborhood hightlight for display/removal
// Add event listener to detect checkbox state change
neighborhoodCheckbox.addEventListener("change", (event) => {
    if (event.target.checked) {
        // check if works :)
        console.log("Neighborhoods filter is enabled");
        // load and display the neighborhood geojson data
        fetch("./data/neighbourhood-crime-rates - 4326.geojson")
            .then(response => response.json())
            .then(data => {
                // add neighborhood geojson to the map 
                neighborhoodLayer = L.geoJSON(data, {
                    style: {
                        color: "black",
                        weight: 1,
                        fillOpacity: 0.1
                    },
                    // leaflet function for the neighborhood information popups
                    onEachFeature: (feature, layer) => {
                        const popupContent = `
                            <strong>${feature.properties.AREA_NAME}</strong><br>
                            <p>AREA ID: ${feature.properties.AREA_ID}</p>
                        `;
                        layer.bindPopup(popupContent);
                    }
                }).addTo(map);
            })
            .catch(error => console.error("Error loading GeoJSON data:", error));
        
    } else {
        // check if works :)
        console.log("Neighborhoods filter is disabled");
        // remove the geojson layer from the map if it exists
        if (neighborhoodLayer) {
            map.removeLayer(neighborhoodLayer);
            neighborhoodLayer = null; // clear the reference to the layer
        }
    }
});
