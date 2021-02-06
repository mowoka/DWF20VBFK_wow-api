const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const router = require("./src/routes");

const port = 6000;

app.use(bodyParser.json());
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Api Sedang berjalan");
});

app.listen(port, () => {
  console.log(`Server Running on Port ${port}, App Ready`);
});
