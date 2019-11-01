import cors from "cors";
import "dotenv/config";
import express from "express";

// init express
const app = express();

// apply middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.send("Hi!");
});

app.post("/api/:id/error", (req, res) => {
  if (req.params.id === "an34k2n3sdkfj3kl2") {
    console.log(req.body);
  }
});

app.listen(process.env.PORT, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${process.env.PORT}`);
});
