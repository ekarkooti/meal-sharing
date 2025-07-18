import express from "express";
import knex from "../database_client.js";

const reservationsRouter = express.Router();

//get all reservations
reservationsRouter.get("/", async (req, res) => {
  try {
    const reservations = await knex("reservation").select("*").orderBy("id");
    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not retrieve reservations." });
  }
});

//add reservation
reservationsRouter.post("/", async (req, res) => {
  const reservation = {
    number_of_guests: req.body.number_of_guests,
    meal_id: req.body.meal_id,
    contact_phonenumber: req.body.contact_phonenumber,
    contact_name: req.body.contact_name,
    contact_email: req.body.contact_email,
    created_date: new Date(),
  };

  if (Object.values(reservation).some((value) => value == null)) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (
    typeof reservation.number_of_guests !== "number" ||
    typeof reservation.meal_id !== "number" ||
    typeof reservation.contact_name !== "string" ||
    typeof reservation.contact_phonenumber !== "string" ||
    typeof reservation.contact_email !== "string"
  ) {
    return res.status(400).json({ error: "Invalid data types." });
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(reservation.contact_email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  try {
    const [id] = await knex("reservation").insert(reservation);
    res.status(201).json({ message: "Reservation added", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not add reservation." });
  }
});

//get reservation by id
reservationsRouter.get("/:id", async (req, res) => {
  try {
    const reservation = await knex("reservation")
      .where({ id: req.params.id })
      .first();
    if (!reservation)
      return res.status(404).json({ error: "Reservation not found." });
    res.json(reservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not retrieve reservation." });
  }
});

//update reservation
reservationsRouter.put("/:id", async (req, res) => {
  const reservation = {
    number_of_guests: req.body.number_of_guests,
    meal_id: req.body.meal_id,
    contact_phonenumber: req.body.contact_phonenumber,
    contact_name: req.body.contact_name,
    contact_email: req.body.contact_email,
  };

  if (Object.values(reservation).some((value) => value == null)) {
    return res
      .status(400)
      .json({ error: "All fields are required for update." });
  }
  if (
    typeof reservation.number_of_guests !== "number" ||
    typeof reservation.meal_id !== "number" ||
    typeof reservation.contact_name !== "string" ||
    typeof reservation.contact_phonenumber !== "string" ||
    typeof reservation.contact_email !== "string"
  ) {
    return res.status(400).json({ error: "Invalid data types." });
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(reservation.contact_email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }
  try {
    const count = await knex("reservation")
      .where({ id: req.params.id })
      .update(reservation);
    if (count === 0)
      return res.status(404).json({ error: "Reservation not found." });
    res.json({ message: "Reservation updated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update reservation." });
  }
});

//delete reservation
reservationsRouter.delete("/:id", async (req, res) => {
  try {
    const count = await knex("reservation").where({ id: req.params.id }).del();
    if (count === 0)
      return res.status(404).json({ error: "Reservation not found." });
    res.json({ message: "Reservation deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete reservation." });
  }
});

export default reservationsRouter;
