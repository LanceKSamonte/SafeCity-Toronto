/**
 * class to handle the crime graphs
 */
class Graphs{

    // initialize chart array for chart creation/deletion
    constructor(){
        this.allCharts = [];
    }
    
    /**
     * method to add a new canvas to the graphs content div
     * @param {string} canvasID - the id to assign to the new canvas element
     */
    addCanvas(canvasID){
        // get elements
        const graphsContentDiv = document.getElementById("graphsContent");
        const newCanvas = document.createElement("canvas");
        
        //create a newCanvas with ID canvasID
        newCanvas.id = canvasID;
        newCanvas.className = "graphs";
        
        graphsContentDiv.appendChild(newCanvas)
    }

    /**
     * method to show charts with given data
     * @param {string} chartName - the name of the chart to display
     * @param {Array} incidents - the number of incidents for each year
     * @param {Array} years - the years to be used as labels on the x-axis
     */
    showCharts(chartName, incidents, years) {
        
        // no chart for neighborhoods (there is lowkey a bug with this :( )
        if(chartName != "NEIGHBORHOODS"){
            // add canvas for the chart if it does not exist
            this.addCanvas(chartName);

            // create a chart with chart.js
            const ctx = document.getElementById(chartName).getContext('2d');
            const newChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: years,  // Use years as labels
                    datasets: [{
                        label: `${chartName} Incidents per Year`,  // Crime type as the label
                        data: incidents,  // Use incidents for the dataset
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)'
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
    
            // Store the new chart instance in the allCharts array
            this.allCharts.push(newChart);
            console.log(this.allCharts);
        }
       
    }   

    /**
     * method to clear all charts and canvas elements from the html page
     */
    clearCharts() {
        // destroy each chart instance
        this.allCharts.forEach(chart => chart.destroy());
        
        // clear the chart array
        this.allCharts.length = 0;
    
        // remove all canvas elements
        const canvasElements = document.querySelectorAll('canvas');
        canvasElements.forEach(canvas => canvas.remove());
    
        console.log("All charts and canvas elements destroyed");
    }

}
