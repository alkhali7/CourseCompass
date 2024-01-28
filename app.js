const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

// Route to get assignments data
app.get('/api/assignments', (req, res) => {
    fs.readFile('assignments.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading assignments data');
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Route to get courses data
app.get('/api/courses', (req, res) => {
    fs.readFile('courses.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading courses data');
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
