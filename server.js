const express = require('express');
const dotenv = require('dotenv');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const rateLimiting = require('express-rate-limit');
const cors = require('cors');
const hpp = require('hpp');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieparser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const path = require('path');
// Load env vars
dotenv.config({ path: './config/config.env' });

const connectDB = require('./config/db')();

const bootcamps = require('./routes/bootcams');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();

// Body Parser
app.use(express.json());

// File upload
app.use(fileupload());

// Cookie Parser
app.use(cookieparser());

// Sanitize data
app.use(mongoSanitize());

// Set secuity headers
app.use(helmet());

// Cross site scripting text prevent
app.use(xssClean());

// Rate limiter
const limiter = rateLimiting({
  windowMs: 10 * 60 * 1000, // 10min,
  max: 100
});
app.use(limiter);

// Prevent http params polution
app.use(hpp());

// Enable CORS
app.use(cors());

// Mount routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

// Error Handler
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.bgGreen
  )
);

// Handle unhandeled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error:${err.message}`.red);
  // Close sever & exit process
  server.close(() => process.exit(1));
});
