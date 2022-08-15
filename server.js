const express = require("express");
const app = express();
const router = express.Router();

//express server routing
// app.use("/user", userRouter);

app.listen(3000, "127.0.0.1", () => {
  console.log("Server up and running on port 3000");
});
