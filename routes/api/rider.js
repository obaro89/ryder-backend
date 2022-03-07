const express = require("express");
const router = express.Router();
const Rider = require("../../models/Riders");
const { check, validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post(
  "/login",
  [
    check("email", "A valid email is required").isEmail(),
    check("password", "Please enter your password").not(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const rider = await Rider.findOne({ email: email });
      if (!rider) {
        return res.status(400).json({
          errors: [{ msg: "Invalid Credentials" }],
        });
      }
      const isMatch = await bcrypt.compare(password, rider.password);
      if (!isMatch) {
        return res.json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      const payload = {
        rider: {
          id: rider.id,
        },
      };
      jwt.sign(
        payload,
        process.env.mongourl,
        //config.get("SECRET_KEY"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
);
router.post(
  "/signup",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Enter a valid email").isEmail(),
    check(
      "phone",
      "Phone number is required and must be 11 characters"
    ).isLength({ min: 11 }),
    check("password", "Password must be atleast 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, email, phone, password } = req.body;
      const checkEmail = await Rider.findOne({ email: email });
      const checkPhone = await Rider.findOne({ phone: phone });
      if (checkEmail) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email is already taken" }] });
      } else if (checkPhone) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Phone number is taken" }] });
      }
      const rider = new Rider();
      await rider.setPassword(password);
      rider.name = name;
      rider.email = email;
      rider.phone = phone;
      await rider.save();
      const payload = {
        rider: {
          id: rider.id,
        },
      };
      jwt.sign(
        payload,
        process.env.mongourl,
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      res.status(500).send("Server Error" + error);
    }
  }
);

module.exports = router;
