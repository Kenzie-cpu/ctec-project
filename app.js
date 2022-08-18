const express = require("express");
const app = express();
const router = express.Router();

const productRouter = require("./server/routes/productRouter");

app.use("/product", productRouter);
app.use(express.json());

app.use(express.static("public"));

router.get("/", (req, res) => {
  console.log(__dirname + "/public/index.html");
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(3000, (err) => {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port 3000");
});
