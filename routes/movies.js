const express = require("express");
const { body, param, validationResult } = require("express-validator");
const router = express.Router();
const controller = require("../controllers/moviesController");

router.use((req, res, next) => {
  res.setHeader("X-API-Docs", "https://api.example.com/docs");
  next();
});

router.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "API is running smoothly" });
});

router.get("/", controller.getAllMovies);

router.get(
  "/:id",
  param("id").isInt().withMessage("Movie ID must be a valid integer"),
  validate,
  controller.getMovieById
);

router.post(
  "/",
  [
    body("original_title").notEmpty().withMessage("Title is required"),
    body("release_date").isDate().withMessage("Valid release year is required"),
  ],
  validate,
  controller.createMovie
);

router.patch(
  "/:id",
  [
    param("id").isInt().withMessage("Movie ID must be a valid integer"),
    body("original_title")
      .optional()
      .notEmpty()
      .withMessage("Title cannot be empty"),
    body("release_date").isDate().withMessage("Valid release year is required"),
  ],
  validate,
  controller.updateMovie
);

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", errors: errors.array() });
  }
  next();
}

router.use((req, res) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

module.exports = router;
