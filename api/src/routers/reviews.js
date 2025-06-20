import express from "express";
import knex from "../database_client.js";

const reviewsRouter = express.Router();

//get all meals
reviewsRouter.get("/", async (req, res) => {
  try {
    const result = await knex("review").select("*").orderBy("id");
    res.json(result);
  } catch {
    res.status(500).json({ error: "Failed to get all reviews" });
  }
});

//route to add review
reviewsRouter.post("/", async (req, res) => {
  const review = {
    title: req.body.title,
    description: req.body.description,
    meal_id: req.body.meal_id,
    stars: req.body.stars,
    created_date: req.body.created_date,
  };

  if (Object.values(review).some((value) => value == null)) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (
    typeof review.title !== "string" ||
    typeof review.description !== "string" ||
    typeof review.meal_id !== "number" ||
    typeof review.stars !== "number" ||
    typeof review.created_date !== "string"
  ) {
    return res.status(400).json({ error: "Invalid data types." });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(review.created_date)) {
    return res
      .status(400)
      .json({ error: "Invalid date format. Use YYYY-MM-DD." });
  }
  try {
    const [id] = await knex("review").insert(review);
    res.status(201).json({ message: "Review added", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not add review." });
  }
});

//route to get review by id
reviewsRouter.get("/:id", async (req, res) => {
  try {
    const review = await knex("review").where({ id: req.params.id });
    if (!review) return res.status(404).json({ error: "Review not found." });
    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not retrieve review." });
  }
});

//update review
reviewsRouter.put("/:id", async (req, res) => {
  const review = {
    title: req.body.title,
    description: req.body.description,
    meal_id: req.body.meal_id,
    stars: req.body.stars,
    created_date: req.body.created_date,
  };

  const requiredFields = Object.values(review);
  if (requiredFields.some((value) => value == null)) {
    return res
      .status(400)
      .json({ error: "All fields are required for update." });
  }
  if (
    typeof review.title !== "string" ||
    typeof review.description !== "string" ||
    typeof review.meal_id !== "number" ||
    typeof review.stars !== "number" ||
    typeof review.created_date !== "string"
  ) {
    return res.status(400).json({ error: "Invalid data types." });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(review.created_date)) {
    return res
      .status(400)
      .json({ error: "Invalid date format. Use YYYY-MM-DD." });
  }
  try {
    const count = await knex("review")
      .where({ id: req.params.id })
      .update(review);
    if (count === 0)
      return res.status(404).json({ error: "Review not found." });
    res.json({ message: "Review updated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update review." });
  }
});

//delete review by id
reviewsRouter.delete("/:id", async (req, res) => {
  try {
    const count = await knex("review").where({ id: req.params.id }).del();
    if (count === 0)
      return res.status(404).json({ error: "Review not found." });
    res.json({ message: "Review deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete review." });
  }
});

export default reviewsRouter;
