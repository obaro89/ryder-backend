const express = require("express");
const app = express();
const cors = require("cors");
const connectToDB = require("./config/database");

connectToDB();

app.use(
  express.json({
    extended: false,
  })
);
app.use(cors());
app.use("/api/user", require("./routes/api/user"));
app.use("/api/rider", require("./routes/api/rider"));
app.use("/api/booking", require("./routes/api/booking"));

if (process.env.NODE_ENV === "production") {
  app.get("/", (req, res) => {
    res.send("Backend service is running");
  });
}

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log("server started at port " + PORT);
});
