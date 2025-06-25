import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";
import mealsRouter from "./routers/meals.js";
import reservationsRouter from "./routers/reservations.js";

import reviewsRouter from "./routers/reviews.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

// You can delete this route once you add your own routes
apiRouter.get("/", async (req, res) => {
  const SHOW_TABLES_QUERY =
    process.env.DB_CLIENT === "pg"
      ? "SELECT * FROM pg_catalog.pg_tables;"
      : "SHOW TABLES;";
  const tables = await knex.raw(SHOW_TABLES_QUERY);
  res.json({ tables });
});

// This nested router example can also be replaced with your own sub-router
apiRouter.use("/nested", nestedRouter);
apiRouter.use("/meals", mealsRouter);
apiRouter.use("/reservations", reservationsRouter);

apiRouter.use("/reviews", reservationsRouter);

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});

//My routes
// Future meals
apiRouter.get("/future-meals", async (req, res) => {
  try {
    const result = await knex.raw(
      "SELECT * FROM Meal WHERE `when_date` > NOW()"
    );
    res.json(result[0]);
  } catch {
    res.status(500).json({ error: "Failed to get future meals" });
  }
});

// Past meals
apiRouter.get("/past-meals", async (req, res) => {
  try {
    const result = await knex.raw(
      "SELECT * FROM Meal WHERE `when_date` < NOW()"
    );
    res.json(result[0]);
  } catch {
    res.status(500).json({ error: "Failed to get past meals" });
  }
});

// All meals
apiRouter.get("/all-meals", async (req, res) => {
  try {
    const result = await knex.raw("SELECT * FROM Meal ORDER BY id");
    res.json(result[0]);
  } catch {
    res.status(500).json({ error: "Failed to get all meals" });
  }
});

// First meal
apiRouter.get("/first-meal", async (req, res) => {
  try {
    const result = await knex.raw("SELECT * FROM Meal ORDER BY id ASC LIMIT 1");
    const meal = result[0][0];
    if (meal) {
      res.json(meal);
    } else {
      res.status(404).json({ error: "No meals found" });
    }
  } catch {
    res.status(500).json({ error: "Failed to get first meal" });
  }
});

// Last meal
apiRouter.get("/last-meal", async (req, res) => {
  try {
    const result = await knex.raw(
      "SELECT * FROM Meal ORDER BY id DESC LIMIT 1"
    );
    const meal = result[0][0];
    if (meal) {
      res.json(meal);
    } else {
      res.status(404).json({ error: "No meals found" });
    }
  } catch {
    res.status(500).json({ error: "Failed to get last meal" });
  }
});
