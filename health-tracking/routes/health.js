const express = require('express');
const router = express.Router();
const Health = require('../models/health.model');


// GET: Retrieve all health data
router.get('/', async (req, res) => {
    try {
      const health = await Health.find();
      res.json(health);
    } catch (error) {
      res.status(400).json({ error: 'Error: ' + error.message });
    }
  });

// POST: Add a new health data
router.post('/add', async (req, res) => {
  console.log(req.body)
  try {
    const { username, tiredness, stress, weight, height, restingHeartRate, bloodPressure, date } = req.body;

    const newHealth = new Health({
      username,
      tiredness,
      stress,
      weight: Number(weight),
      height: Number(height),
      restingHeartRate: Number(restingHeartRate),
      bloodPressure,
      date: Date.parse(date),
    });

    await newHealth.save();
    res.json({ message: 'Health data added!' });
  } catch (error) {
    res.status(400).json({ error: 'Error: ' + error.message });
  }
});

// GET: Retrieve health data by username
router.get("/:username/", async (req, res) => {
  try {
    const health = await Health.find({
      username: req.params.username,
    });
    res.json(health);
  } catch (error) {
    res.status(400).json({ error: "Error: " + error.message });
  }
});

// DELETE: Delete health data by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedHealth = await Health.findByIdAndDelete(req.params.id);
    if (!deletedHealth) {
      res.status(404).json({ error: 'Health data not found' });
      return;
    }
    res.json({ message: 'Health data deleted.' });
  } catch (error) {
    res.status(400).json({ error: 'Error: ' + error.message });
  }
});

// PUT: Update health data by ID
router.put('/update/:id', async (req, res) => {
    try {
      const { username, tiredness, stress, height, weight, restingHeartRate, bloodPressure, date } = req.body;

      if (!username || !tiredness || !stress || !weight || !height || !restingHeartRate || !bloodPressure || !date) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }

      const health = await Health.findById(req.params.id);
      if (!health) {
        res.status(404).json({ error: 'Health data not found' });
        return;
      }

      health.username = username;
      health.tiredness = tiredness;
      health.stress = stress;
      health.weight = Number(weight);
      health.height = Number(height);
      health.restingHeartRate = Number(restingHeartRate);
      health.bloodPressure = bloodPressure;
      health.date = new Date(date);

      await health.save();
      res.json({ message: 'Health data updated!', health });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while updating the health data' });
    }
  });

  module.exports = router;