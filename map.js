// Leaflet api stuff to show the map
// literally copy pasted from their website https://leafletjs.com/examples/quick-start/

var map = L.map('display').setView([43.653963, -79.377319], 10);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
