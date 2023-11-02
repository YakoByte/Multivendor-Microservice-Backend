const { createLogger, transports, format } = require("winston");
const { AppError , STATUS_CODES } = require("./app-error");

// Set up the Winston logger with error handling
const LogErrors = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: "app_error.log" }),
  ],
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
});

class ErrorLogger {
  constructor() {}

  async logError(err) {
    try {
      console.log("==================== Start Error Logger ===============");
      LogErrors.error(`${new Date()}-${JSON.stringify(err)}`);
      console.log("==================== End Error Logger ===============");
    } catch (error) {
      console.error("Error occurred while logging:", error);
    }
  }

  isTrustedError(error) {
    if (error instanceof AppError) {
      return error.isOperational;
    } else {
      return false;
    }
  }
}

const ErrorHandler = async (err, req, res, next) => {
  try {
    const errorLogger = new ErrorLogger();

    if (err) {
      await errorLogger.logError(err);

      if (errorLogger.isTrustedError(err)) {
        if (err.errorStack) {
          const errorDescription = err.errorStack;
          return res.status(err.STATUS_CODES).json({ message: errorDescription });
        }
        return res.status(err.STATUS_CODES).json({ message: err.message });
      } else {
        return next(err);
      }
    }
    next();
  } catch (error) {
    console.error("Error occurred in error handling:", error);
    next(error); 
  }
};

module.exports = ErrorHandler;
