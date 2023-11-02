const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

class AppError extends Error {
  constructor(
    name,
    statusCode,
    description,
    isOperational,
    errorStack,
    logErrorResponse 
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorStack = errorStack;
    this.logErrorResponse = logErrorResponse;
    Error.captureStackTrace(this);
  }
}

// 500
class APIError extends AppError {
  constructor(
    name,
    statusCode = STATUS_CODES.INTERNAL_ERROR,
    description = "Internal Server Error",
    isOperational = true
  ) {
    super(name, statusCode, description, isOperational, null, true);
  }
}

// 404
class NotFoundError extends AppError {
  constructor(description = "Not Found") {
    super("NOT FOUND", STATUS_CODES.NOT_FOUND, description, true, null, true);
  }
}

// 400
class BadRequestError extends AppError {
  constructor(description = "Bad Request", errorStack) {
    super("BAD REQUEST", STATUS_CODES.BAD_REQUEST, description, true, errorStack, true);
  }
}

module.exports = {
  AppError,
  APIError,
  NotFoundError,
  BadRequestError,
  STATUS_CODES,
};
