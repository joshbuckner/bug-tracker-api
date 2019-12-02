import { Request, Response } from "express";
import validateLoginInput from "../validation/login";

// login user
export default (req: Request, res: Response, db, bcrypt, signJWT) => {
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
      return res.status(404).json({ email: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, row.password).then((isMatch: boolean) => {
      if (isMatch) {
        res.json(signJWT({ token: row.access_token, email: row.email, id: row.id, name: row.name }));
      } else {
        return res.status(400).json({ password: "Password incorrect" });
      }
    });
  });
};
