import cors from "cors";
import "dotenv/config";
import express from "express";
import { router } from "./routes/routes";

// init express
const app = express();

// apply middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use(router);

app.listen(process.env.PORT, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${process.env.PORT}`);
});
