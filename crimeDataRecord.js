const CrimeTypes = Object.freeze({
    ASSAULT: 'assault',
    AUTO_THEFT: 'auto_theft',
    BIKE_THEFT: 'bike_theft',
    BREAK_ENTER: 'break_enter',
    HOMICIDE: 'homicide',
    ROBBERY: 'robbery',
    SHOOTING: 'shooting',
    THEFT_FROM_MV: 'theft_from_mv',     //theft from motor vehicles
    THEFT_OVER: 'theft_over'
});

class CrimeDataRecord{
    constructor(id, areaName, hoodId, population2023){
        this.id = id
        this.areaName = areaName;
        this.hoodId = hoodId;
        this.population2023 = population2023;

        this.crimeData = {
            assault: {},
            autoTheft: {},
            bikeTheft: {},
            breakEnter: {},
            homicide: {},
            robbery: {},
            shooting: {},
            theftFromMV: {},
            theftOver: {}
        };
    }

    setCrimeData(){
        
    }
}

class CrimeData{
    constructor(crimeType, year,count, rate){
        this.crimeType = crimeType;
        this.year = year;
        this.count = count;
        this.rate = rate;
    }
}
