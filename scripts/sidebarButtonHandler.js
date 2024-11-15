/**
 * Class to handle side bar button operations
 */
class SidebarButtonHandler {
    /**
     * Gets ID elements and creates event listeners for each element
     * @param {HTMLElement} filterButtonId 
     * @param {HTMLElement} graphsButtonId 
     * @param {HTMLElement} exportButtonId 
     */
    constructor(filterButtonId, graphsButtonId, exportButtonId) {
        this.filterButton = document.getElementById(filterButtonId);
        this.graphsButton = document.getElementById(graphsButtonId);
        this.exportButton = document.getElementById(exportButtonId);

        this.filterContent = document.getElementById("filterContent");
        this.graphsContent = document.getElementById("graphsContent");
        this.exportContent = document.getElementById("exportContent");

        this.sidebar = document.getElementById('sidebar');
        this.sidebarToggle = document.getElementById('sidebarToggle');

        this.initializeListeners();
    }

    initializeListeners() {
        // Toggle filters on click
        this.filterButton.addEventListener("click", () => this.showFilters());

        // Toggle fraphs on click
        this.graphsButton.addEventListener("click", () => this.showGraphs());

        // Toggle exports on click
        this.exportButton.addEventListener("click", () => this.showExports());
        
        this.sidebarToggle.addEventListener('click', function () {
                sidebar.classList.toggle('visible');

                setTimeout(() => {
                    map.invalidateSize(); // Adjust the map to fit the new container dimensions
                }, 500); // Matches the CSS transition duration (0.3s)
        });
    }

    showFilters() {
        this.filterContent.style.display = "block";
        this.graphsContent.style.display = "none";
        this.exportContent.style.display = "none";

    }

    showGraphs() {
        this.filterContent.style.display = "none";
        this.graphsContent.style.display = "block";
        this.exportContent.style.display = "none";
    }
    showExports() {
        this.filterContent.style.display = "none";
        this.graphsContent.style.display = "none";
        this.exportContent.style.display = "block";
    }
}

// Instantiate the SidebarButtonHandler
const sidebarHandler = new SidebarButtonHandler("filterToggle", "graphsToggle", "exportToggle");

