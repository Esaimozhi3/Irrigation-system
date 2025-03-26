const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI="mongodb+srv://esaimozhi3:esaimozhi3@cluster0.wtzsu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Schema for irrigation schedule
const irrigationSchema = new mongoose.Schema({
  index: Number,
  plot: String,
  startTime: String,
  endTime: String,
  RunBy: String
});

const Irrigation = mongoose.model('Irrigation', irrigationSchema);

// Route to store irrigation data
// app.post('/api/schedule', async (req, res) => {
//   try {
//     const schedule = req.body;
    
//     // Store the entire schedule array into MongoDB
//     await Irrigation.insertMany(schedule);

//     res.status(201).send({ message: 'Irrigation schedule saved successfully!' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Failed to save schedule' });
//   }
// });

app.post("/api/schedule", async (req, res) => {
    try {
      const scheduleData = req.body;
  
      // Ensure the data is an array and validate schema before inserting
      if (!Array.isArray(scheduleData)) {
        return res.status(400).json({ message: "Invalid data format. Must be an array." });
      }
      await Irrigation.deleteMany({});
      await Irrigation.insertMany(scheduleData);
      res.status(201).json({ message: "Schedule saved successfully" });
  
    } catch (error) {
      console.error("Error saving schedule:", error);
  
      if (error.name === "ValidationError") {
        res.status(400).json({
          message: "Validation failed",
          errors: error.errors
        });
      } else {
        res.status(500).json({ message: "Failed to save schedule" });
      }
    }
  });
  
// Route to get all irrigation schedules
app.get('/api/schedule', async (req, res) => {
  try {
    const schedules = await Irrigation.find();
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch schedule' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
