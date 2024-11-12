function parseNeighbourhoodData(jsonData) {
    const neighbourhoods = [];

    jsonData.features.forEach(feature => {
        const { _id, AREA_NAME, HOOD_ID, POPULATION_2023, ...crimeFields } = feature.properties;

        // Create a Neighbourhood object
        const neighbourhood = new Neighbourhood(_id, AREA_NAME, HOOD_ID, POPULATION_2023);

        // Loop through each year and crime type to add CrimeData to Neighbourhood
        const years = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
        const crimeTypes = ["ASSAULT", "AUTOTHEFT", "BIKETHEFT", "BREAKENTER", "HOMICIDE", "ROBBERY", "SHOOTING", "THEFTFROMMV", "THEFTOVER"];

        years.forEach(year => {
            crimeTypes.forEach(type => {
                const incidentsKey = `${type}_${year}`;
                const rateKey = `${type}_RATE_${year}`;

                if (crimeFields[incidentsKey] != null && crimeFields[rateKey] != null) {
                    const crimeData = new CrimeData(
                        type,
                        year,
                        crimeFields[incidentsKey],
                        crimeFields[rateKey]
                    );
                    neighbourhood.addCrimeData(crimeData);
                }
            });
        });

        neighbourhoods.push(neighbourhood);
    });

    console.log(neighbourhoods);
    return neighbourhoods;
}

let moreData;
console.log(moreData)

fetch("./data/neighbourhood-crime-rates - 4326.geojson")
            .then(response => response.json())
            .then(data => {
                parseNeighbourhoodData(data);
            })
            .catch(error => console.error("Error loading GeoJSON data:", error));