const express = require('express');
const os = require('os-utils');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/stats', (req, res) => {
    os.cpuUsage(cpuPercent => {
        res.json({
            cpu: (cpuPercent * 100).toFixed(2), // % CPU used
            memory: ((1 - os.freememPercentage()) * 100).toFixed(2) // % Memory used
        });
    });
});

app.listen(3001, () => {
    console.log('Stats API is running on http://localhost:3001/stats');
});
