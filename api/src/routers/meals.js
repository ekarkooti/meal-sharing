import express from "express";
import knex from "../database_client.js";

const mealsRouter = express.Router();

//get all meals
mealsRouter.get("/", async (req, res) => {
  try {
    const result = await knex("Meal").select("*").orderBy("id");
    res.json(result);
  } catch {
    res.status(500).json({ error: "Failed to get all meals" });
  }
});

//route to add meal
mealsRouter.post("/", async (req, res) => {
  const meal = {
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    when_date: req.body.when_date,
    max_reservations: req.body.max_reservations,
    price: req.body.price,
    created_date: req.body.created_date,
  };

  if (Object.values(meal).some((value) => value == null)) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (
    typeof meal.title !== "string" ||
    typeof meal.description !== "string" ||
    typeof meal.location !== "string" ||
    typeof meal.when_date !== "string" ||
    typeof meal.max_reservations !== "number" ||
    typeof meal.price !== "number" ||
    typeof meal.created_date !== "string"
  ) {
    return res.status(400).json({ error: "Invalid data types." });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(meal.when_date) || !dateRegex.test(meal.created_date)) {
    return res
      .status(400)
      .json({ error: "Invalid date format. Use YYYY-MM-DD." });
  }
  try {
    const [id] = await knex("Meal").insert(meal);
    res.status(201).json({ message: "Meal added", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not add meal." });
  }
});

//route to get meal by id
mealsRouter.get("/:id", async (req, res) => {
  try {
    const meal = await knex("Meal").where({ id: req.params.id });
    if (!meal) return res.status(404).json({ error: "Meal not found." });
    res.json(meal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not retrieve meal." });
  }
});

//update meal
mealsRouter.put("/:id", async (req, res) => {
  const meal = {
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    when_date: req.body.when_date,
    max_reservations: req.body.max_reservations,
    price: req.body.price,
    created_date: req.body.created_date,
  };

  const requiredFields = Object.values(meal);
  if (requiredFields.some((value) => value == null)) {
    return res
      .status(400)
      .json({ error: "All fields are required for update." });
  }
  if (
    typeof meal.title !== "string" ||
    typeof meal.description !== "string" ||
    typeof meal.location !== "string" ||
    typeof meal.when_date !== "string" ||
    typeof meal.max_reservations !== "number" ||
    typeof meal.price !== "number" ||
    typeof meal.created_date !== "string"
  ) {
    return res.status(400).json({ error: "Invalid data types." });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(meal.when_date) || !dateRegex.test(meal.created_date)) {
    return res
      .status(400)
      .json({ error: "Invalid date format. Use YYYY-MM-DD." });
  }
  try {
    const count = await knex("Meal").where({ id: req.params.id }).update(meal);
    if (count === 0) return res.status(404).json({ error: "Meal not found." });
    res.json({ message: "Meal updated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update meal." });
  }
});

//delete meal by id
mealsRouter.delete("/:id", async (req, res) => {
  try {
    const count = await knex("Meal").where({ id: req.params.id }).del();
    if (count === 0) return res.status(404).json({ error: "Meal not found." });
    res.json({ message: "Meal deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete meal." });
  }
});

export default mealsRouter;
