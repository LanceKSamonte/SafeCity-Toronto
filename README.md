# SafeCity-Toronto

This project involves developing a web-based platform that displays crime data for the City of Toronto using an open data catalogue. The platform will feature an interactive map 
here users can explore crime statistics by area, filter data by crime type and time, and view trends over specific periods. The primary goal of the project is to provide users with easy
access to detailed crime information to promote public safety and awareness.


### Team Members:

* Abel Tola
* Cristin Pappachan Philip
* Jalees Ahmad
* Lance Samonte
* Josh Hernandez Martinez
* Nicholas Flay
* William Nzoukekang Motsou

### Map: Leaflet
https://github.com/Leaflet/Leaflet <br>
https://leafletjs.com/

### Data is taken from Toronto's open data catalogue
https://open.toronto.ca/
<hr>

### Steps to Run a Server Locally
1. Download the zip file.
2. Extract the folder and open the project in a code editor.
3. Open a terminal and download the dependencies by running this command:<br>
```bash
npm install
```
5. Then you can run the local server by running the command:<br>
```bash
node ./backend/localServer.js
```
7. In the DataSource, you can replace the SERVER_URL to the link that will be shown in the terminal:<br>
```bash
http://localhost:8000/api/neighbourhoods
```
You are done! Now you can test the local server.
