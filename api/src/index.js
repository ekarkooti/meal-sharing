import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import mealsRouter from "./routers/meals.js";
import reservationsRouter from "./routers/reservations.js";
import reviewsRouter from "./routers/reviews.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

apiRouter.get("/", async (req, res) => {
  const SHOW_TABLES_QUERY =
    process.env.DB_CLIENT === "pg"
      ? "SELECT * FROM pg_catalog.pg_tables;"
      : "SHOW TABLES;";
  const result = await knex.raw(SHOW_TABLES_QUERY);
  const tables = process.env.DB_CLIENT === "pg" ? result.rows : result[0];
  res.json({ tables });
});

apiRouter.use("/meals", mealsRouter);
apiRouter.use("/reservations", reservationsRouter);
apiRouter.use("/reviews", reviewsRouter);
app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});

// Future meals
apiRouter.get("/future-meals", async (req, res) => {
  try {
    const result = await knex("meal").where("when_date", ">", knex.fn.now());
    res.json(result);
  } catch {
    res.status(500).json({ error: "Failed to get future meals" });
  }
});

// Past meals
apiRouter.get("/past-meals", async (req, res) => {
  try {
    const result = await knex("meal").where("when_date", "<", knex.fn.now());
    res.json(result);
  } catch {
    res.status(500).json({ error: "Failed to get past meals" });
  }
});

// All meals
apiRouter.get("/all-meals", async (req, res) => {
  try {
    const result = await knex("meal").select("*").orderBy("id");
    res.json(result);
  } catch {
    res.status(500).json({ error: "Failed to get all meals" });
  }
});

// First meal
apiRouter.get("/first-meal", async (req, res) => {
  try {
    const result = await knex("meal").select("*").orderBy("id", "asc").limit(1);
    const meal = result[0];
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
    const result = await knex("meal")
      .select("*")
      .orderBy("id", "desc")
      .limit(1);
    const meal = result[0];
    if (meal) {
      res.json(meal);
    } else {
      res.status(404).json({ error: "No meals found" });
    }
  } catch {
    res.status(500).json({ error: "Failed to get last meal" });
  }
});
