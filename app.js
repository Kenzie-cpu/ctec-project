const express = require("express");
const app = express();
const router = express.Router();

const productRouter = require("./server/routes/productRouter");

app.use("/product", productRouter);
app.use(express.json());

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.use("/public", express.static("public"));

app.listen(3000);
