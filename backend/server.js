const path = require('path');

require('dotenv').config({ path: path.join(__dirname, 'config.env') });

const morgan = require('morgan');
const cors = require('cors');
const express = require('express');
const connectDB = require('./config/db');

const nodeEnv = process.env.NODE_ENV || 'development';
const port = Number(process.env.PORT) || 5000;

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(express.json({ limit: '5mb' }));

if (nodeEnv === 'development') {
  app.use(morgan('dev'));
  console.log('Morgan is enabled');
}

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'EwiSSouq API',
    docs: '/api',
  });
});

const registerRoutes = require('./routes');
registerRoutes(app);

const errorMiddleware = require('./middleware/errorMiddleware');
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`EwiSSouq backend listening on port ${port} in ${nodeEnv} mode`);
});
