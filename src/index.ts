import bcrypt from "bcryptjs";
import cors from "cors";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import db from "./database";

// Load input validation
import validateEvent from "./validation/event";
import validateLoginInput from "./validation/login";
import validateRegisterInput from "./validation/register";

// init express
const app = express();

// apply middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// tslint:disable-next-line: no-var-requires
require("./passport")(passport);

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

// register user
app.post("/api/register/", (req, res, next) => {
  let passwordHash: string;
  const { email, password, name } = req.body;
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const generateToken = (n: number) => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let token = "";
    for (let i = 0; i < n; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
  };
  bcrypt.genSalt(10, (error, salt) => {
    bcrypt.hash(password, salt, (er, hash) => {
      if (er) {
        throw er;
      }
      passwordHash = hash;
    });
  });
  const query = "select * from users where email = ?";
  db.get(query, email, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (row) {
      res.status(400).json({ error: "Email already exists" });
    } else {
      const sql =
        "INSERT INTO users (name, email, password, access_token) VALUES (?,?,?,?)";
      const params = [name, email, passwordHash, generateToken(14)];
      db.run(sql, params, function(error: { message: any }, result: any) {
        if (error) {
          res.status(400).json({ error: error.message });
          return;
        }
        res.json({
          id: this.lastID,
          message: "success",
          params,
        });
      });
    }
  });
});

// login user
app.post("/api/login/", (req, res, next) => {
  const { email, password } = req.body;
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const query = "select * from users where email = ?";
  db.get(query, email, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (!row) {
      return res.status(404).json({ error: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, row.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          access_token: row.access_token,
          email: row.email,
          id: row.id,
          name: row.name,
        };
        // Sign token
        jwt.sign(
          payload,
          process.env.SECRET_OR_KEY,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (error, token) => {
            res.json({
              token: "Bearer " + token,
            });
          },
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

// incoming event from snippet
app.post("/api/event/:access_token/", (req, res) => {
  const { date, message, file, line, column, error } = req.body;
  const { access_token } = req.params;
  const { errors, isValid } = validateEvent(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const query = "select * from users where access_token = ?";
  db.get(query, access_token, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    const sql =
      "INSERT INTO events (user_id, date, message, file, line, column, error) VALUES (?,?,?,?,?,?,?)";
    const params = [row.id, date, message, file, line, column, error];
    db.run(sql, params, (insertErr: { message: any }, result: any) => {
      if (insertErr) {
        res.status(400).json({ error: insertErr.message });
        return;
      }
      res.json({
        message: "success",
        params,
      });
    });
  });
});

app.use((req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ error: "No authorization token" });
  }
  jwt.verify(req.headers.authorization.replace("Bearer ", ""), process.env.SECRET_OR_KEY, (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: "Invalid token" });
    } else {
      // tslint:disable-next-line: no-console
      console.log(decoded);
    }
  });
  next();
});

// get events
app.post("/api/events/", (req, res, next) => {
  const { id } = req.body;
  const sql = "select * from events where user_id = ?";
  db.all(sql, id, (err: { message: any }, rows: any) => {
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

app.listen(process.env.PORT, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${process.env.PORT}`);
});
