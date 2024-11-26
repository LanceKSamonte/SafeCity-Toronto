import express from "express";
import fetch from "node-fetch";
import cors from "cors";

class NeighbourhoodApiServer {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  // Setup middleware such as CORS and static file serving
  setupMiddleware() {
    this.app.use(cors());
  }

  // Setup routes for the API
  setupRoutes() {
    this.app.get("/api/neighbourhoods", this.handleNeighbourhoodRequest.bind(this));
  }

  // Start the server
  start() {
    const port = process.env.PORT || 8000; // Use dynamic port for Render
    this.app.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on port ${port}`);
    });
  }

  // Route handler for /api/neighbourhoods
  async handleNeighbourhoodRequest(req, res) {
    console.log("Request received");
    try {
      const packageResponse = await fetch(
        'https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show?id=neighbourhood-crime-rates'
      );
      const packageData = await packageResponse.json();

      // Get the datastore resources for the package
      let datastoreResources = packageData["result"]["resources"].filter(r => r.datastore_active);

      // Ensure there's at least one active datastore resource
      if (datastoreResources.length === 0) {
        throw new Error("No active datastore resources found");
      }

      const data = await this.getDatastoreResource(datastoreResources[0]);
      // Send the API response
      res.json(data);
    } catch (error) {
      console.error("Error fetching API:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  // Helper function to fetch datastore resources
  async getDatastoreResource(resource) {
    const records = [];
    let offset = 0;
    const limit = 100; // Default limit for pagination

    while (true) {
      const response = await fetch(
        `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?id=${resource["id"]}&limit=${limit}&offset=${offset}`
      );
      const responseData = await response.json();

      // Accumulate the records
      records.push(...responseData["result"]["records"]);

      // Check if we have received fewer records than the limit (indicating we're at the last page)
      if (responseData["result"]["records"].length < limit) {
        break; // No more data, stop fetching
      } else {
        offset += limit; // Increase the offset to fetch the next page
      }
    }

    return records;
  }
}

// Instantiate and start the server
const server = new NeighbourhoodApiServer();
server.start();
 