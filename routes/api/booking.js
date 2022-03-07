const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const Booking = require("../../models/Bookings");

router.post(
  "/addbooking",

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { user, pickup, dropoff, rider, amount } = req.body;
      const booking = new Booking({
        user,
        pickup,
        dropoff,
        rider,
        amount,
      });
      await booking.save();
      return res.status(200).json(booking);
    } catch (error) {
      res.status(500).send("Server Error");
      console.log(error);
    }
  }
);

router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", ["phone", "name", "id"])
      .populate("rider", ["phone", "name", "id"]);
    return res.status(200).json(booking);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ msg: "Booking not found" });
    }
    res.status(500).send("server error");
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(400).json({ msg: "Booking not available" });
    }
    booking.status = status;
    await booking.save();
    return res.status(200).json(booking);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ msg: "Booking not found" });
    }
    res.status(500).send("server error");
  }
});

module.exports = router;
