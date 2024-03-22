const express = require("express"), bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

 sampleData = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Doe' }
];

app.get("/", (req,res) => {
    res.send("Hello world")
})

// do your post here
app.post('/', (req, res) => {
    console.log(req.body.name)
    // find maximum id
    const itemWithMaxId = sampleData.reduce((maxItem, currentItem) => {
        return currentItem.id > maxItem.id ? currentItem : maxItem;
    }, { id: -Infinity });
    sampleDataOne = {"id" : itemWithMaxId.id +1, "name" :  req.body.name}
    sampleData.push(sampleDataOne)
    res.json({"status" : "success"});
});



// Define a route for GET request
app.get('/api/data', (req, res) => {
    // Sending sample data as response
    res.json(sampleData);
});

// Define a route for GET request with parameter
app.get('/api/data/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = sampleData.find(item => item.id === id);

    if (!data) {
        // If data not found, send 404 status
        res.status(404).json({ message: 'Data not found' });
    } else {
        // If data found, send it as response
        res.json(data);
    }
});


app.listen(3000)