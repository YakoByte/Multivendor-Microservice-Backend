const { createLogger, transports, format } = require("winston");
const { AppError } = require("./app-error");

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
    console.log("==================== Start Error Logger ===============");
    LogErrors.log({
      level: "error",
      message: `${new Date()}-${JSON.stringify(err)}`,
    });
    console.log("==================== End Error Logger ===============");

    return false;
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
  const errorLogger = new ErrorLogger();

  if (err) {
    await errorLogger.logError(err);

    if (errorLogger.isTrustedError(err)) {
      if (err.errorStack) {
        const errorDescription = err.errorStack;
        return res.status(err.statusCode).json({ message: errorDescription });
      }
      return res.status(err.statusCode).json({ message: err.message });
    } else {
      return next(err);
    }
  }
  next();
};

module.exports = ErrorHandler;