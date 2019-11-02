import cors from "cors";
import "dotenv/config";
import express from "express";
import md5 from "md5";
import db from "./database";

// init express
const app = express();

// apply middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.send("Hi!");
});

app.get("/api/users", (req, res, next) => {
  const sql = "select * from users";
  const params: any[] = [];
  db.all(sql, params, (err: { message: any }, rows: any) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      data: rows,
      message: "success",
    });
  });
});

app.post("/api/user/", (req, res, next) => {
  const errors = [];
  if (!req.body.access_token) {
    errors.push("No access_token specified");
  }
  if (!req.body.password) {
    errors.push("No password specified");
  }
  if (!req.body.email) {
    errors.push("No email specified");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }
  const data = {
    access_token: req.body.access_token,
    email: req.body.email,
    name: req.body.name,
    password: md5(req.body.password),
  };
  const sql = "INSERT INTO users (name, email, password, access_token) VALUES (?,?,?,?)";
  const params = [data.name, data.email, data.password, data.access_token];
  db.run(sql, params, function(err: { message: any; }, result: any) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      data,
      id: this.lastID,
      message: "success",
    });
  });
});

app.post("/api/event/:id/", (req, res) => {
  const errors = [];
  if (!req.body.message) {
    errors.push("No message specified");
  }
  if (!req.body.file) {
    errors.push("No file specified");
  }
  if (!req.body.line) {
    errors.push("No line specified");
  }
  if (!req.body.column) {
    errors.push("No column specified");
  }
  if (!req.body.error) {
    errors.push("No error specified");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }
  const data = {
    access_token: req.params.id,
    column: req.body.column,
    error: req.body.error,
    file: req.body.file,
    line: req.body.line,
    message: req.body.message,
  };
  const query = "select * from users where access_token = ?";
  db.get(query, data.access_token, (err, row) => {
    if (err) {
      res.status(400).json({error: err.message});
      return;
    }
    const sql = "INSERT INTO events (user_id, message, file, line, column, error) VALUES (?,?,?,?,?,?)";
    const params = [row.id, data.message, data.file, data.line, data.column, data.error];
    db.run(sql, params, (error: { message: any; }, result: any) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        data,
        message: "success",
        row,
      });
    });
  });
});

app.listen(process.env.PORT, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${process.env.PORT}`);
});
