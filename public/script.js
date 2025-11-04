// public/script.js

// Load projects when page opens
document.addEventListener('DOMContentLoaded', loadProjects);

// Fetch and display all projects
async function loadProjects() {
  try {
    const res = await fetch('/projects');
    const projects = await res.json();

    const container = document.getElementById('projects');
    container.innerHTML = ''; // Clear old list

    projects.forEach(p => {
      const div = document.createElement('div');
      div.className = 'project';
      div.innerHTML = `
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <p><strong>Budget: $${p.budget}</strong></p>
        <button class="delete-btn" onclick="deleteProject('${p._id}')">Delete</button>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error('Load failed:', err);
  }
}

// Add new project
async function addProject() {
  const title = document.getElementById('title').value.trim();
  const desc = document.getElementById('desc').value.trim();
  const budget = document.getElementById('budget').value.trim();

  if (!title || !desc || !budget) {
    return alert('Please fill all fields');
  }

  try {
    const res = await fetch('/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description: desc, budget: Number(budget) })
    });

    if (!res.ok) throw new Error('Server error');

    // Clear form
    document.getElementById('title').value = '';
    document.getElementById('desc').value = '';
    document.getElementById('budget').value = '';

    loadProjects(); // Refresh list
  } catch (err) {
    alert('Add failed: ' + err.message);
  }
}

// Delete project
async function deleteProject(id) {
  try {
    await fetch(`/projects/${id}`, { method: 'DELETE' });
    loadProjects(); // Refresh
  } catch (err) {
    alert('Delete failed');
  }
}