require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const {CLIENT_ORIGIN} = require('./config');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const app = express();
const {API_BASE_URL} = require('./config');
const WORDS = require('./words.json');

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
 app.use(cors())
 app.use(helmet())

app.get('/', (req, res) => {
    res.send('Welcome to the Write Now API!');
});

app.get('/words', function handleGetWords(req,res) {
    let response = WORDS.words;
  
  if (req.query.word) {
      response = response.filter(word =>
        word.word.toLowerCase().includes(req.query.word.toLowerCase())
      )
    }

    if (req.query.type) {
      response = response.filter(word =>
        word.type.includes(req.query.type)
      )
    }

    if (req.query.genre) {
      response = response.filter(word =>
        word.genre.includes(req.query.genre) ||
        word.genre.includes('lit')
      )
    }

    res.json(response)
  })
  
  app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
    } else {
      console.error(error)
    response = { message: error.message, error }
    }
    res.status(500).json(response)
  })
  
  module.exports = app