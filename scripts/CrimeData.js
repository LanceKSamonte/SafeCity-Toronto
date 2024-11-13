/**
 * CrimeData class containing the type of crime,
 *year, amount of incidents, and crime rate
 */
class CrimeData {
    /**
     * Constructs a CrimeData object
     * @param {string} type 
     * @param {number} year 
     * @param {number} incidents 
     * @param {number} rate 
     */
    constructor(type, year, incidents, rate) {
        this.type = type;
        this.year = year;
        this.incidents = incidents;
        this.rate = rate;
    }
}
