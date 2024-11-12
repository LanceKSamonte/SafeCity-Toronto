/**
 * Neighborhood class with ID, name, hoodID, population
 * and a list of crime data associated with each neighborhood
 */
class Neighbourhood {

    /**
     * Constructs a Neighbourhood object
     * @param {number} id 
     * @param {string} name 
     * @param {number} hoodId 
     * @param {number} population 
     */
    constructor(id, name, hoodId, population) {
        this.id = id;
        this.name = name;
        this.hoodId = hoodId;
        this.population = population;
        this.crimeDataList = [];
    }

    addCrimeData(crimeData) {
        this.crimeDataList.push(crimeData);
    }

    // Method to display neighborhood info (optional)
    displayInfo() {
        console.log(`Neighbourhood: ${this.name} (ID: ${this.id}), Population: ${this.population}`);
        this.crimeDataList.forEach(data => console.log(data.toString()));
    }
}
