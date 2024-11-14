class FilterController {
    constructor(map, neighbourhoods) {
        this.map = map;
        this.neighbourhoods = neighbourhoods;

        // Initialize Layer groups
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

        // Incident numbers for map coloring
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

        // Initialize checkbox references
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

        // Attach event listeners to checkboxes
        this.initCheckboxHandlers();
    }

    initCheckboxHandlers() {
        // Iterate over each crime type and bind checkbox event listeners
        Object.keys(this.checkboxElements).forEach(crimeType => {
            this.checkboxElements[crimeType].addEventListener("change", (event) => {
                if (crimeType === "NEIGHBORHOODS") {
                    this.toggleNeighborhoodLayer(event.target.checked);
                } else {
                    this.toggleCrimeLayer(crimeType, event.target.checked);
                }
            });
        });
    }

    toggleNeighborhoodLayer(isChecked) {
        if (isChecked) {
            console.log("Neighborhoods filter is enabled");
            this.layerGroups["NEIGHBORHOODS"].clearLayers();

            this.neighbourhoods.forEach((neighbourhood) => {
                const { geometry, name, id, population, hoodId } = neighbourhood;
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
                this.layerGroups["NEIGHBORHOODS"].addLayer(polygon);
            });

            this.layerGroups["NEIGHBORHOODS"].addTo(this.map);
        } else {
            console.log("Neighborhoods filter is disabled");
            this.map.removeLayer(this.layerGroups["NEIGHBORHOODS"]);
        }
    }

    toggleCrimeLayer(crimeType, isChecked) {
        const layerGroup = this.layerGroups[crimeType];
        const maxIncidents = this.crimeMaxIncidents[crimeType];
        const color = this.getCrimeColor(crimeType);

        if (isChecked) {
            console.log(`${crimeType} filter is enabled`);
            layerGroup.clearLayers();

            this.neighbourhoods.forEach((neighbourhood) => {
                const { geometry, name, crimeDataList } = neighbourhood;
                const coordinates = geometry.coordinates.map(polygon => 
                    polygon.map(coords => coords.map(point => [point[1], point[0]]))
                );

                const crimeData = crimeDataList.filter(data => data.type === crimeType);
                const popupContent = this.generatePopupContent(name, crimeType, crimeData);
                const latestCrimeData = crimeData.find(data => data.year === 2023);
                const incidents = latestCrimeData ? latestCrimeData.incidents : 0;

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
        } else {
            console.log(`${crimeType} filter is disabled`);
            this.map.removeLayer(layerGroup);
        }
    }

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

    calculateFillOpacity(incidents, maxIncidents) {
        const minOpacity = 0.1;
        const maxOpacity = 0.8;
        return Math.min(maxOpacity, Math.max(minOpacity, (incidents / maxIncidents) * maxOpacity));
    }

    generatePopupContent(name, crimeType, crimeData) {
        return `
            <strong>${name}</strong><br>
            <p>${crimeType} Incidents and Rates by Year:</p>
            <ul>
                ${[2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023].map(year => {
                    const yearData = crimeData.find(data => data.year === year);
                    return yearData ? 
                        `<li>${year}: ${yearData.incidents} incidents, Rate: ${yearData.rate}</li>` :
                        `<li>${year}: No data</li>`;
                }).join('')}
            </ul>
        `;
    }
}