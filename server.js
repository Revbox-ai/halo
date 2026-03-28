'use strict';
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const { initDb } = require('./db/init');

// Initialize DB
initDb();

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'halo_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24h
}));

// Flash messages middleware
app.use((req, res, next) => {
  res.locals.flash = req.session.flash || {};
  delete req.session.flash;
  next();
});

// Routes
const webRouter = require('./routes/web');
const adminRouter = require('./routes/admin');

app.use('/', webRouter);
app.use('/admin', adminRouter);

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: '404 - Nie znaleziono', settings: {} });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Coś poszło nie tak. Spróbuj ponownie.');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Halo Agency running on http://localhost:${PORT}`);
});
