const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const mainRouter = require("./routes/index");
const { requestLogger, errorLogger } = require("./middleware/logger");
const errorHandler = require("./middleware/error-handler");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());

app.use(cors());

app.use(requestLogger);

//Crash Test
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
//Crash Test

app.use("/", mainRouter);

app.use(errorHandler);

app.use(errorLogger);

app.listen(PORT, () => {
  console.log(`Server is listening to port ${PORT}`);
});
