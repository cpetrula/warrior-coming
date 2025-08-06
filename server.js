// // server.js
// const express = require('express');
// const path = require('path');

// const app = express();
// const PORT = 3000;

// // Serve static files from the Vue app
// app.use(express.static(path.join(__dirname, 'frontend/dist')));

// // Fallback to index.html for SPA routing
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
import express from 'express'
import path from 'path'

const app = express()

// // Serve static files from the Vue app
app.use(express.static('frontend/dist'));

app.listen(3000)