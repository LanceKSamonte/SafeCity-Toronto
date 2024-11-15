/**
 * Class to get data from a geojson file and 
 * create neighbourhood objects
 */
class DataSource{

    constructor(){
        this.getData();
    }

    // function to read geojson file 
    async getData() {
        try {
            const response = await fetch("./data/neighbourhood-crime-rates - 4326.geojson");
            const data = await response.json();
    
            const neighbourhoods = this.parseNeighbourhoodData(data);

            this.filterController = new FilterController(map, neighbourhoods);


        } catch (error) {
            console.error("Error loading GeoJSON data:", error);
        }
    }

    // Use data as Neighbourhood objects
    parseNeighbourhoodData(jsonData) {
        const neighbourhoods = [];
    
        jsonData.features.forEach(feature => {
            const { _id, AREA_NAME, HOOD_ID, POPULATION_2023, ...crimeFields } = feature.properties;
            const geometry = feature.geometry; // for the highlighting
            // Create a Neighbourhood object
            const neighbourhood = new Neighbourhood(_id, AREA_NAME, HOOD_ID, POPULATION_2023, geometry);
    
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
    
        //debugging purposes
        console.log(neighbourhoods);
        return neighbourhoods;
    }    
    
    
}

//init datasource
const data_source = new DataSource();

