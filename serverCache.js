const express = require('express');

// Initialize Express app
const app = express();
const port = 3000;

// In-memory cache object
const cache = {};

// Middleware to check cache before processing request
const cacheMiddleware = (req, res, next) => {
  const key = req.params.key;;
  if (cache[key]) {
    console.log("Cache hit!");
    return res.send(cache[key]);
  }
  next();
};

// Endpoint to store data in cache
app.get('/cache/:key', (req, res) => {
  const key = req.params.key;
  const value = req.query.value; // Assuming value is passed as a query parameter

  if (!value) {
    return res.status(400).send("Value not provided");
  }

  cache[key] = value; // Update or add to cache
  res.send(`Data cached for key: ${key}`);
});

// Endpoint to retrieve data from cache
app.get('/data/:key', cacheMiddleware, (req, res) => {
  const key = req.params.key;

  if (!cache[key]) {
    return res.status(404).send("Data not found in cache");
  }

  res.send(`Data for key ${key}: ${cache[key]}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
