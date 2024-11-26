/**
 * Class to handle side bar button operations
 */
class SidebarButtonHandler {
    /**
     * gets ID elements and creates event listeners for each element
     * @param {HTMLElement} filterButtonId
     * @param {HTMLElement} graphsButtonId
     * @param {HTMLElement} exportButtonId
     */
    constructor(filterButtonId, graphsButtonId, exportButtonId, askButtonId) {
      this.filterButton = document.getElementById(filterButtonId);
      this.graphsButton = document.getElementById(graphsButtonId);
      this.exportButton = document.getElementById(exportButtonId);
      this.askButton = document.getElementById(askButtonId);
  
      this.filterContent = document.getElementById("filterContent");
      this.graphsContent = document.getElementById("graphsContent");
      this.exportContent = document.getElementById("exportContent");
      this.askContent = document.getElementById("askContent");
  
      this.sidebar = document.getElementById("sidebar");
      this.sidebarToggle = document.getElementById("sidebarToggle");
  
      this.initializeListeners();
    }
  
    /**
     * function to add event listeners to each button
     */
    initializeListeners() {
      // toggle filters on click
      this.filterButton.addEventListener("click", () => this.showFilters());
  
      // toggle graphs on click
      this.graphsButton.addEventListener("click", () => this.showGraphs());
  
      // toggle exports on click
      this.exportButton.addEventListener("click", () => this.showExports());
  
      this.askButton.addEventListener("click", () => this.showAskLlm());
  
      // for that sweet ass sidebar animation
      this.sidebarToggle.addEventListener("click", function () {
        sidebar.classList.toggle("visible");
  
        setTimeout(() => {
          map.invalidateSize(); // adjust the map to fit the new container dimensions
        }, 500);
      });
    }
  
    /**
     * function to display the filters
     */
    showFilters() {
      this.filterContent.style.display = "block";
      this.graphsContent.style.display = "none";
      this.exportContent.style.display = "none";
      this.askContent.style.display = "none";
    }
  
    /**
     * function to display the graphs
     */
    showGraphs() {
      this.filterContent.style.display = "none";
      this.graphsContent.style.display = "block";
      this.exportContent.style.display = "none";
      this.askContent.style.display = "none";
    }
  
    /**
     * function to display the exports
     */
    showExports() {
      this.filterContent.style.display = "none";
      this.graphsContent.style.display = "none";
      this.exportContent.style.display = "block";
      this.askContent.style.display = "none";
    }
  
    showAskLlm() {
      this.filterContent.style.display = "none";
      this.graphsContent.style.display = "none";
      this.exportContent.style.display = "none";
      this.askContent.style.display = "block";
    }
  }
  
