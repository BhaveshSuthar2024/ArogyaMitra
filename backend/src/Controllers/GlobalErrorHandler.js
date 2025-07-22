// utils/globalErrorHandler.js

const devErrors = (res, error) => {
  return res.status(error.statusCode).json({
    status: "fail",
    statusCode: error.statusCode,
    message: error.message,
    stack: error.stack,
    error: error,
  });
};

const prodErrors = (res, error) => {
  // Trusted/expected error
  if (error?.isOperational) {
    return res.status(error.statusCode).json({
      status: "fail",
      message: error.message,
    });
  }

  // Unknown error (log to server console)
  console.error("UNEXPECTED ERROR 💥:", error);

  return res.status(500).json({
    status: "error",
    message: "Something went wrong! Please try again later.",
  });
};

// Final error handler middleware
const GlobalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    return devErrors(res, error);
  }

  if (process.env.NODE_ENV === "production") {
    return prodErrors(res, error);
  }

  // Default fallback (just in case)
  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

export default GlobalErrorHandler;
