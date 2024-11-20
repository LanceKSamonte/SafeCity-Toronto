/**
 * class to get data from a geojson file and create neighbourhood objects
 */
class DataSource{

    /**
     * method to read geoJson file
     */
    async getData() {
        try {
            // Retrieve the package information from the API using fetch
            const packageResponse = await fetch('https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show?id=neighbourhood-crime-rates');
            const packageData = await packageResponse.json();
            
            // Get the datastore resources for the package
            let datastoreResources = packageData["result"]["resources"].filter(r => r.datastore_active);
    
            // Ensure there's at least one active datastore resource
            if (datastoreResources.length === 0) {
                throw new Error("No active datastore resources found");
            }
    
            // Retrieve the data from the datastore, with pagination
            const data = await this.getDatastoreResource(datastoreResources[0]);
    
            // Once all data is retrieved, pass it to the filter controller
            const neighbourhoods = this.parseNeighbourhoodData(data);
            this.filterController = new FilterController(map, neighbourhoods);
    
            console.log(neighbourhoods); // Log the neighbourhoods data for debugging
    
        } catch (error) {
            console.error("Error loading data:", error);
        }
    }
    
    // Function to get datastore resource with pagination support
    async getDatastoreResource(resource) {
        const records = [];
        let offset = 0;
        const limit = 100; // Default limit for pagination
    
        while (true) {
            const response = await fetch(`https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?id=${resource["id"]}&limit=${limit}&offset=${offset}`);
            const responseData = await response.json();
            
            // Accumulate the records
            records.push(...responseData["result"]["records"]);
    
            // Check if we have received fewer records than the limit (indicating we're at the last page)
            if (responseData["result"]["records"].length < limit) {
                break; // No more data, stop fetching
            } else {
                offset += limit; // Increase the offset to fetch the next page
            }
        }
    
        return records;
    }
    
    /**
     * function to parse geojson data and create Neighbourhood objects
     * @param {object} jsonData - the parsed geojson data
     * @returns {Array} neighbourhoods - list of neighbourhood objects
     */
    parseNeighbourhoodData(jsonData) {
        const neighbourhoods = [];
    
        jsonData.forEach(feature => {
            const { _id, AREA_NAME, HOOD_ID, POPULATION_2023, ...crimeFields } = feature;
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
        return neighbourhoods;
    }     
}

//init datasource
const data_source = new DataSource();
data_source.getData();