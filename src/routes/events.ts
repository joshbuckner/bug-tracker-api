import { Request, Response } from "express";
import validateEvent from "../validation/event";

// incoming event from snippet
export const create = (req: Request, res: Response, db) => {
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
    db.run(sql, params, (insertErr) => {
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
};

// get events for user
export const get = (req: Request, res: Response, db) => {
  const { id } = req.body;
  const sql = "select * from events where user_id = ?";
  db.all(sql, id, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      data: rows,
      message: "success",
    });
  });
};
