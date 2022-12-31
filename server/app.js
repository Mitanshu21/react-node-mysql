const express = require("express");
const app = express();
const db = require("./database");
const PORT = 5000;

const cors = require("cors");
app.use(cors());

db.connect((err) => {
  if (err) {
    console.error("error connecting: " + err);
    return;
  }
  console.log("Connection Successful !!");
});

app.use(express.json());
app.use(require("./routes/auth"));

app.get("/", (req, res) => {
  console.log("home");
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log("Listning at Port no.", PORT);
});
