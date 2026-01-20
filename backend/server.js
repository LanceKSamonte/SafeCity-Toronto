import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import https from "https";
import fs from "fs";

class NeighbourhoodApiServer {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(cors());
  }

  setupRoutes() {
    this.app.get("/api/neighbourhoods", this.handleNeighbourhoodRequest.bind(this));
  }

  // start the server
  start() {
    const httpsOptions = {
      key: fs.readFileSync('/etc/letsencrypt/live/safecity-toronto.l5.ca/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/safecity-toronto.l5.ca/fullchain.pem'),
    };

    const httpsPort = 443;
    https.createServer(httpsOptions, this.app).listen(httpsPort, '0.0.0.0', () => {
      console.log(`Server is running securely on HTTPS port ${httpsPort}`);
    });

    const http = require('http');
    const httpPort = 80; 
    http.createServer((req, res) => {
      res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
      res.end();
    }).listen(httpPort, '0.0.0.0', () => {
      console.log(`HTTP traffic is redirected to HTTPS`);
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

      let datastoreResources = packageData["result"]["resources"].filter(r => r.datastore_active);

      if (datastoreResources.length === 0) {
        throw new Error("No active datastore resources found");
      }

      const data = await this.getDatastoreResource(datastoreResources[0]);
      res.json(data);
    } catch (error) {
      console.error("Error fetching API:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  // fetch data resources
  async getDatastoreResource(resource) {
    const records = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const response = await fetch(
        `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?id=${resource["id"]}&limit=${limit}&offset=${offset}`
      );
      const responseData = await response.json();

      records.push(...responseData["result"]["records"]);

      if (responseData["result"]["records"].length < limit) {
        break;
      } else {
        offset += limit;
      }
    }

    return records;
  }
}

const server = new NeighbourhoodApiServer();
server.start();
