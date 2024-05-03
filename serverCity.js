const express = require('express');

// Initialize Express app
const app = express();
const port = 3000;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('example.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, 
    (err) => {
        if (err) {
            console.error(err.message);
        }
        else {
            db.run('CREATE TABLE IF NOT EXISTS City (plate TEXT, name TEXT)')
            console.log ("Table created successfully, if it didnt exist")
            console.log('Connected to the database.');
        }
});

// In-memory cache object
const cache = {};

// Middleware to check cache before processing request
const cacheMiddleware = (req, res, next) => {
  const key = req.params.key;;
  if (cache[key]) {
    console.log("Cache hit!");
    return res.send(cache[key]);
  }
  else {
    const sql = "SELECT name FROM City WHERE plate = ?"; 
    db.all(sql, [key], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Error executing query');
        }
        // Render the 'data' view with the fetched rows
        // res.render('data', { rows });
        if (rows.length > 0) {
            cache[key] = rows[0]['name']
            console.log("Cache updated!");

        }
    });    
  }
  next();
};


// Endpoint to retrieve data from cache
app.get('/city/:key', cacheMiddleware, (req, res) => {
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
