/**
 * class to get data from a geojson file and create neighbourhood objects
 */
class DataSource{

    /**
     * method to read geoJson file
     */
    async getData() {
        const SERVER_URL = 'https://safecity-toronto.onrender.com/api/neighbourhoods';

        try {
            // Fetch from server with timeout
            const packageResponse = await this.fetchWithTimeout(SERVER_URL, 3000); // 5-second timeout
            if (!packageResponse.ok) {
                
                throw new Error(`Server response not ok: ${packageResponse.status}`);
            }
            const packageData = await packageResponse.json();
    
            // Process data and initialize FilterController
            const neighbourhoods = this.parseNeighbourhoodData(packageData);
            this.filterController = new FilterController(map, neighbourhoods);
    
            console.log(neighbourhoods); // Log the neighbourhoods data for debugging
    
        } catch (error) {
            alert("Server may be down cuz I ain't paying for aws :). Give it a minute because it's deployed on render and it is very delayed");
            console.error("Error loading data from server", error);
        }
    }
    
    // Helper function to add timeout to fetch
    async fetchWithTimeout(url, timeout) {
        const controller = new AbortController();
        const signal = controller.signal;
    
        // Set a timeout to abort the request
        const timeoutId = setTimeout(() => controller.abort(), timeout);
    
        try {
            const response = await fetch(url, { signal });
            return response;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error(`Request to ${url} timed out`);
            }
            throw error;
        } finally {
            clearTimeout(timeoutId); // Clear the timeout
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
