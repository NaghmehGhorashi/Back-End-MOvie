import db from "../db.js";

/**
 * @route GET /movies
 * @desc Get all movies (Limited for better performance)
 * @access Public
 */
export const getAllMovies = async (req, res) => {
  try {
    const [movies] = await db.query(
      "SELECT id, original_title, poster_path, release_date, vote_average, vote_count FROM movies LIMIT 50"
    );
    res.status(200).json(movies);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching movies", error: err.message });
  }
};

/**
 * @route GET /movies/:id
 * @desc Get movie by ID
 * @access Public
 */
export const getMovieById = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, original_title, overview, poster_path, backdrop_path, release_date, vote_average, vote_count FROM movies WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Movie not found" });

    res.status(200).json(rows[0]);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching movie", error: err.message });
  }
};

/**
 * @route POST /movies
 * @desc Add a new movie
 * @access Private (Requires authentication)
 */
export const createMovie = async (req, res) => {
  const {
    movie_id,
    original_title,
    original_language,
    overview,
    popularity,
    poster_path,
    backdrop_path,
    release_date,
    vote_average,
    vote_count,
    adult,
  } = req.body;

  if (!movie_id || !original_title || !release_date) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO movies (movie_id, original_title, original_language, overview, popularity, poster_path, backdrop_path, release_date, vote_average, vote_count, adult)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        movie_id,
        original_title,
        original_language,
        overview,
        popularity,
        poster_path,
        backdrop_path,
        release_date,
        vote_average,
        vote_count,
        adult,
      ]
    );
    res.status(201).json({ message: "Movie created", id: result.insertId });
  } catch (err) {
    res.status(400).json({
      message: "Invalid input or movie already exists",
      error: err.message,
    });
  }
};

/**
 * @route PATCH /movies/:id
 * @desc Update an existing movie
 * @access Private (Requires authentication)
 */
export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const [rows] = await db.query("SELECT id FROM movies WHERE id = ?", [id]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Movie not found" });

    const validFields = [
      "original_title",
      "original_language",
      "overview",
      "popularity",
      "poster_path",
      "backdrop_path",
      "release_date",
      "vote_average",
      "vote_count",
      "adult",
    ];

    const filteredUpdates = Object.keys(updates).reduce((acc, key) => {
      if (validFields.includes(key)) acc[key] = updates[key];
      return acc;
    }, {});

    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({ message: "No valid fields provided" });
    }

    const fields = Object.keys(filteredUpdates)
      .map((field) => `${field} = ?`)
      .join(", ");
    const values = Object.values(filteredUpdates);

    await db.query(`UPDATE movies SET ${fields} WHERE id = ?`, [...values, id]);
    res.status(200).json({ message: "Movie updated" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating movie", error: err.message });
  }
};
