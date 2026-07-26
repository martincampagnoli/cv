//Install express server
const express = require('express');
const path = require('path');

const app = express();
const distDir = path.join(__dirname, 'dist/cv/browser');

// Serve only the static files form the dist directory
app.use(express.static(distDir));

app.get('/*splat', function(req,res) {
res.sendFile(path.join(distDir, 'index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);