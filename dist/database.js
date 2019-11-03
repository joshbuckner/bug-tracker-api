"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = require("sqlite3");
const sqlite3 = sqlite3_1.verbose();
const DBSOURCE = "db.sqlite";
const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // tslint:disable-next-line: no-console
        console.log(err);
        return;
    }
    // tslint:disable-next-line: no-console
    console.log("Connected to " + DBSOURCE + " database.");
    db.exec("PRAGMA foreign_keys = ON;", (error) => {
        if (error) {
            // tslint:disable-next-line: no-console
            console.error("Pragma statement didn't work.");
        }
        else {
            // tslint:disable-next-line: no-console
            console.log("Foreign Key Enforcement is on.");
        }
    });
});
const dbSchema = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name text,
  email text UNIQUE,
  password text,
  access_token text UNIQUE,
  CONSTRAINT email_unique UNIQUE (email)
);
CREATE TABLE IF NOT EXISTS events (
  event_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date text,
  message text,
  file text,
  line text,
  column text,
  error text,
  FOREIGN KEY (user_id) REFERENCES users(id)
);`;
db.exec(dbSchema, (err) => {
    if (err) {
        // tslint:disable-next-line: no-console
        console.log(err);
    }
});
exports.default = db;
//# sourceMappingURL=database.js.map