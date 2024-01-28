const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable for port or default to 3000

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Basic error handling middleware
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

