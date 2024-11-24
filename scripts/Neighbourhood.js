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
    constructor(id, name, hoodId, population, geometry) {
        this.id = id;
        this.name = name;
        this.hoodId = hoodId;
        this.population = population;
        this.geometry = geometry
        this.crimeDataList = [];
    }

    /**
     * adds crime data into neighbourhood class
     * @param {object} crimeData 
     */
    addCrimeData(crimeData) {
        this.crimeDataList.push(crimeData);
    }
}
