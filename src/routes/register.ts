import { Request, Response } from "express";
import { generateToken } from "../utils";
import validateRegisterInput from "../validation/register";

// register user
export default (req: Request, res: Response, db, bcrypt, signJWT) => {
  let passwordHash = "";
  const { email, password, name } = req.body;
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  bcrypt.genSalt(10, (_, salt) => {
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
      res.status(400).json({ email: "Email already exists" });
    } else {
      const sql =
        "INSERT INTO users (name, email, password, access_token) VALUES (?,?,?,?)";
      const token = generateToken(14);
      const params = [name, email, passwordHash, token];
      db.run(sql, params, function(error) {
        if (error) {
          res.status(400).json({ error: error.message });
          return;
        }
        res.json(signJWT({ token, email, id: this.lastID, name }));
      });
    }
  });
};
