class CrimeData {
    constructor(type, year, incidents, rate) {
        this.type = type;
        this.year = year;
        this.incidents = incidents;
        this.rate = rate;
    }

    toString() {
        return `${this.year} - ${this.type}: ${this.incidents} incidents, Rate: ${this.rate}`;
    }
}
