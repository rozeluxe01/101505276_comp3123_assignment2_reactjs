export function notFound(req, res, next) {
  res.status(404).json({
    error: "NotFound",
    message: `Route ${req.originalUrl} not found`,
  });
}

export function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    error: err.name || "Error",
    message,
  });
}
