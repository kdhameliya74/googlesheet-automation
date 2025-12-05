require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { appendToSheet } = require('./services/sheets');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.post('/api/submit', async (req, res) => {
    try {
        const data = req.body;
        console.log('Received data:', data);
        
        // Basic validation
        if (!data.firstName || !data.email) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        await appendToSheet(data);
        res.status(200).json({ message: 'Data submitted successfully' });
    } catch (error) {
        console.error('Error submitting data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
