
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const app = express();
const PORT = 3001;
const dataDirectory = path.join(__dirname, 'data'); // Directory containing JSON files

app.use(cors());
app.use(express.json());

// Function to read JSON files and extract data
const readJsonFiles = () => {
  const jsonFiles = fs.readdirSync(dataDirectory).filter(file => file.endsWith('.json'));
  const data = [];

  jsonFiles.forEach(file => {
    const filePath = path.join(dataDirectory, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent);
    data.push(jsonData);
  });

  return data;
};

// Endpoint to get JSON data
app.get('/data', (req, res) => {
  const jsonData = readJsonFiles();
  res.json(jsonData);
});

// Watch the data directory for changes
const watcher = chokidar.watch(dataDirectory, { persistent: true });

watcher.on('add', path => {
  console.log(`File ${path} has been added.`);
  // Optionally, you can emit an event or perform actions when a new file is added
});

watcher.on('change', path => {
  console.log(`File ${path} has been changed.`);
});

watcher.on('unlink', path => {
  console.log(`File ${path} has been removed.`);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
