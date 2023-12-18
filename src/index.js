const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

const patientSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
});

const Patient = mongoose.model('Patient', patientSchema);

app.use(express.json());

app.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/patients/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const patient = await Patient.findOne({ id });

    if (patient) {
      res.json(patient);
    } else {
      res.status(404).json({ error: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/patients', async (req, res) => {
  const { id, name } = req.body;

  try {
    const newPatient = await Patient.create({ id, name });
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(400).json({ error: 'Invalid input. Please provide both id and name for the patient' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
