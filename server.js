// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ---------- Middleware (order matters!) ----------
app.use(cors({ origin: '*' }));          // allow any origin (dev only)
app.use(express.json());                 // parse JSON bodies
app.use(express.static('public'));       // serve HTML/CSS/JS

// ---------- MongoDB ----------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// ---------- Schema ----------
const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  budget: Number,
});
const Project = mongoose.model('Project', projectSchema);

// ---------- Routes ----------
app.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/projects', async (req, res) => {
  try {
    const { title, description, budget } = req.body;
    const project = new Project({ title, description, budget: Number(budget) });
    await project.save();
    res.status(201).json(project);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.delete('/projects/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ---------- Start ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});