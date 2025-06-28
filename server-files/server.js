const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config(); // load env vars
const morgan = require('morgan'); // request logging
const cors = require('cors');
const helmet = require("helmet");

const indexRouter = require('./routes/index');
const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

// Routes
app.use('/api', indexRouter);

// Root route
app.get('/', (req, res) => {
  res.status(200).send(`IGO server is running...`);
});

// Error handler LAST
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.get('/', (req, res) => {
    res.status(200).send(`IGO server is running on Node js as reverse proxy on Nginx ¯\\_(ツ)_/¯`);
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
