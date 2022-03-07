const express = require("express");
const router = express.Router();
const User = require("../../models/Users");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");

router.post("/verify/token", async (req, res) => {
  try {
    const verifiedToken = jwt.verify(req.body.token, process.env.SECRET_KEY);

    return res.send(verifiedToken);
  } catch (error) {
    return res.status(400).send(error);
  }
});

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
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).json({
          errors: [{ msg: "Invalid Credentials" }],
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        process.env.SECRET_KEY,
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
      const checkEmail = await User.findOne({ email: email });
      const checkPhone = await User.findOne({ phone: phone });
      if (checkEmail) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email is already taken" }] });
      } else if (checkPhone) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Phone number is taken" }] });
      }
      const user = new User();
      await user.setPassword(password);
      user.name = name;
      user.email = email;
      user.phone = phone;
      await user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        process.env.SECRET_KEY,
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

router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-__v -salt -password"
    );
    return res.status(200).json(user);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ msg: "User not found" });
    }
    res.status(500).send("server error");
  }
});

module.exports = router;
