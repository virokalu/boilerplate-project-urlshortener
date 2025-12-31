require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// URL Shortener Microservice
let urlDatabase = {};
let idCounter = 1;
app.use(express.json());

app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;
  const urlPattern = /^(https?:\/\/)(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
  if (!urlPattern.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }
  const shortUrl = idCounter++;
  urlDatabase[shortUrl] = originalUrl;
  res.json({ original_url: originalUrl, short_url: shortUrl });
});
app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrl = req.params.short_url;
  const originalUrl = urlDatabase[shortUrl];
  if (originalUrl) {
    return res.redirect(originalUrl);
  }
  res.json({ error: 'No short URL found for the given input' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
