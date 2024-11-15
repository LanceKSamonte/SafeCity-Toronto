class Graphs{

    constructor(){
        this.allCharts = [];
    }
    
    addCanvas(canvasID){
        const graphsContentDiv = document.getElementById("graphsContent");
        const newCanvas = document.createElement("canvas");
        
        newCanvas.id = canvasID;
        newCanvas.className = "graphs";
        
        graphsContentDiv.appendChild(newCanvas)
        console.log("yes");
    }

    showCharts(chartName, incidents, years) {
    
        if(chartName != "NEIGHBORHOODS"){
            this.addCanvas(chartName);

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

    

    clearCharts() {
        // Destroy each chart instance
        this.allCharts.forEach(chart => chart.destroy());
        
        // Clear the chart array
        this.allCharts.length = 0;
    
        // Remove all canvas elements from the DOM
        const canvasElements = document.querySelectorAll('canvas');
        canvasElements.forEach(canvas => canvas.remove());
    
        console.log("All charts and canvas elements destroyed");
    }

}
