// logger.js
import winston from 'winston';

// Create a new winston logger instance
const logger = winston.createLogger({
  level: 'info', // default level of logging
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Log to a file
    new winston.transports.File({ filename: 'logs/api.log' }),
    // Log to the console (optional)
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

export default logger;