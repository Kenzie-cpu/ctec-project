const express = require("express");
const app = express();
const router = express.Router();

const productRouter = require("./server/routes/productRouter");

app.use("/product", productRouter);
app.use(express.json());

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.use(express.static("public"));

app.listen(80, () => {
  console.log("Server listing on port 80");
});
