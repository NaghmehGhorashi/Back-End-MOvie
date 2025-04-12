require("dotenv").config(); // Load .env

const API_KEY = process.env.API_KEY;

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized: API Key is required",
      code: 401,
    });
  }

  if (apiKey !== API_KEY) {
    return res.status(403).json({
      status: "error",
      message: "Forbidden: Invalid API Key",
      code: 403,
    });
  }

  next(); // All good, continue to the route
};

module.exports = apiKeyMiddleware;
