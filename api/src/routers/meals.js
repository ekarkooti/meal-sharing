import express from "express";
import knex from "../database_client.js";

const mealsRouter = express.Router();

mealsRouter.get("/", async (req, res) => {
  const {
    maxPrice,
    availableReservations,
    title,
    dateAfter,
    dateBefore,
    limit,
    sortKey,
    sortDir,
  } = req.query;

  const validators = {
    maxPrice: {
      validate: (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0,
      transform: (val) => parseFloat(val),
      errorMsg: "Invalid value for maxPrice",
    },
    availableReservations: {
      validate: (val) => val === "true" || val === "false",
      errorMsg: "availableReservations must be 'true' or 'false'",
    },
    title: {
      validate: (val) => typeof val === "string" && val.trim().length > 0,
      errorMsg: "Invalid title",
    },
    dateAfter: {
      validate: (val) => !isNaN(new Date(val).getTime()),
      transform: (val) => new Date(val),
      errorMsg: "Invalid dateAfter value",
    },
    dateBefore: {
      validate: (val) => !isNaN(new Date(val).getTime()),
      transform: (val) => new Date(val),
      errorMsg: "Invalid dateBefore value",
    },
    limit: {
      validate: (val) => Number.isInteger(Number(val)) && Number(val) > 0,
      transform: (val) => parseInt(val, 10),
      errorMsg: "Invalid limit value",
    },
    sortKey: {
      validate: (val) =>
        ["when_date", "max_reservations", "price"].includes(val),
      errorMsg:
        "Invalid sortKey. Valid keys: when_date, max_reservations, price",
    },
    sortDir: {
      validate: (val) => val === "asc" || val === "desc",
      errorMsg: "Invalid sortDir. Valid values: asc, desc",
    },
  };

  const validateParam = (key, value) => {
    const validator = validators[key];
    if (!validator) return { valid: true, value };
    if (!validator.validate(value)) {
      res.status(400).json({ error: validator.errorMsg });
      return { valid: false };
    }
    return {
      valid: true,
      value: validator.transform ? validator.transform(value) : value,
    };
  };

  try {
    const query = knex("meal");

    if (maxPrice !== undefined) {
      const { valid, value } = validateParam("maxPrice", maxPrice);
      if (!valid) return;
      query.where("price", "<", value);
    }

    if (availableReservations !== undefined) {
      const { valid, value } = validateParam(
        "availableReservations",
        availableReservations
      );
      if (!valid) return;

      const subquery = knex("Reservation")
        .count("id")
        .whereRaw("Reservation.meal_id = meal.id");

      if (value === "true") {
        query.whereRaw("(?) < ??", [subquery, "meal.max_reservations"]);
      } else {
        query.whereRaw("(?) >= ??", [subquery, "meal.max_reservations"]);
      }
    }

    if (title !== undefined) {
      const { valid, value } = validateParam("title", title);
      if (!valid) return;
      query.where("title", "like", `%${value}%`);
    }

    if (dateAfter !== undefined) {
      const { valid, value } = validateParam("dateAfter", dateAfter);
      if (!valid) return;
      query.where("when_date", ">", value);
    }

    if (dateBefore !== undefined) {
      const { valid, value } = validateParam("dateBefore", dateBefore);
      if (!valid) return;
      query.where("when_date", "<", value);
    }

    if (limit !== undefined) {
      const { valid, value } = validateParam("limit", limit);
      if (!valid) return;
      query.limit(value);
    }

    if (sortKey !== undefined) {
      const { valid: validKey, value: keyVal } = validateParam(
        "sortKey",
        sortKey
      );
      if (!validKey) return;

      let direction = "asc";
      if (sortDir !== undefined) {
        const { valid: validDir, value: dirVal } = validateParam(
          "sortDir",
          sortDir
        );
        if (!validDir) return;
        direction = dirVal;
      }

      query.orderBy(keyVal, direction);
    } else {
      query.orderBy("id");
    }

    const meals = await query.select("meal.*");
    res.json(meals);
  } catch (err) {
    console.error("Error fetching meals:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST new meal
mealsRouter.post("/", async (req, res) => {
  const meal = {
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    when_date: req.body.when_date,
    max_reservations: req.body.max_reservations,
    price: req.body.price,
    created_date: req.body.created_date,
    photo_address: req.body.photo_address,
    avg_rating: req.body.avg_rating,
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
    typeof meal.created_date !== "string" ||
    typeof meal.photo_address !== "string" ||
    typeof meal.avg_rating !== "number"
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
    const [id] = await knex("meal").insert(meal);
    res.status(201).json({ message: "Meal added", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not add meal." });
  }
});

// GET meal by ID
mealsRouter.get("/:id", async (req, res) => {
  try {
    const meal = await knex("meal")
      .select("meal.*")
      .where({ id: req.params.id })
      .first();
    if (!meal) return res.status(404).json({ error: "Meal not found." });
    res.json(meal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not retrieve meal." });
  }
});

// PUT update meal
mealsRouter.put("/:id", async (req, res) => {
  const meal = {
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    when_date: req.body.when_date,
    max_reservations: req.body.max_reservations,
    price: req.body.price,
    created_date: req.body.created_date,
    photo_address: req.body.photo_address,
    avg_rating: req.body.avg_rating,
  };

  if (Object.values(meal).some((value) => value == null)) {
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
    typeof meal.created_date !== "string" ||
    typeof meal.photo_address !== "string" ||
    typeof meal.avg_rating !== "number"
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
    const count = await knex("meal").where({ id: req.params.id }).update(meal);
    if (count === 0) return res.status(404).json({ error: "Meal not found." });
    res.json({ message: "Meal updated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update meal." });
  }
});

// DELETE meal
mealsRouter.delete("/:id", async (req, res) => {
  try {
    const count = await knex("meal").where({ id: req.params.id }).del();
    if (count === 0) return res.status(404).json({ error: "Meal not found." });
    res.json({ message: "Meal deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete meal." });
  }
});

export default mealsRouter;
