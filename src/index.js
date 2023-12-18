const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/patientdb';

mongoose.connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true });

const patientSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
});

const Patient = mongoose.model('Patient', patientSchema);

app.use(bodyParser.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    next(error);
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
    next(error);
  }
});

app.post('/patients', async (req, res) => {
  const { id, name } = req.body;

  try {
    const newPatient = await Patient.create({ id, name });
    res.status(201).json(newPatient);
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
