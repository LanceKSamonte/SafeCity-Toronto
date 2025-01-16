import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/neighbourhoods", async (req, res) => {
  try {
    const packageResponse = await fetch(
      'https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show?id=neighbourhood-crime-rates'
    );
    const packageData = await packageResponse.json();

    let datastoreResources = packageData["result"]["resources"].filter(r => r.datastore_active);

    if (datastoreResources.length === 0) {
      throw new Error("No active datastore resources found");
    }

    const data = await getDatastoreResource(datastoreResources[0]);
    res.json(data);
  } catch (error) {
    console.error("Error fetching API:", error);
    res.status(500).send("Internal Server Error");
  }
});

async function getDatastoreResource(resource) {
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

export default app;
