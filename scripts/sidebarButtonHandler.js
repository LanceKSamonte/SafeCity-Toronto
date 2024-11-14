// Toggle Filters
document.getElementById("filterToggle").addEventListener("click", function() {
    document.getElementById("filterContent").style.display = "block";
    document.getElementById("graphsContent").style.display = "none";
    document.getElementById("exportContent").style.display = "none";
});

document.getElementById("graphsToggle").addEventListener("click", function() {
    document.getElementById("filterContent").style.display = "none";
    document.getElementById("graphsContent").style.display = "block";
    document.getElementById("exportContent").style.display = "none";
    
    // Delay map initialization until the graphs content is visible
    const mapContainer = document.getElementById('mapContainer'); // Assuming 'mapContainer' is your map container ID
    if (mapContainer) {
        if (!window.myMap) {  // Check if map is already initialized
            window.myMap = L.map(mapContainer).setView([43.7, -79.42], 13);  // Example coordinates for Toronto
            
            // Add tile layer (this is an example, adjust to your use case)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(window.myMap);
        }
    }

    // Initialize chart
    const ctx = document.getElementById('myChart').getContext('2d');
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Assault', 'Auto Theft', 'Bike Theft', 'Homicide', 'Robbery'],
            datasets: [{
                label: 'Number of Incidents',
                data: [12, 19, 3, 5, 2],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});


// Toggle Exports
document.getElementById("exportToggle").addEventListener("click", function(){
    document.getElementById("filterContent").style.display = "none";
    document.getElementById("graphsContent").style.display = "none";
    document.getElementById("exportContent").style.display = "block";  
});