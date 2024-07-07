// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Define a simple schema and model for SDKs
const sdkSchema = new mongoose.Schema({
  name: String,
  language: String,
  code: String,
  description: String,
});

const SDK = mongoose.model('SDK', sdkSchema);

// Routes
app.get('/api/sdks', async (req, res) => {
  try {
    const sdks = await SDK.find();
    res.json(sdks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sdks', async (req, res) => {
  const { name, language, code, description } = req.body;
  try {
    const newSdk = new SDK({ name, language, code, description });
    await newSdk.save();
    res.json(newSdk);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/search', async (req, res) => {
  const { name } = req.body
  try {
    const sdks = await SDK.findOne({name : name});
    res.json(sdks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
