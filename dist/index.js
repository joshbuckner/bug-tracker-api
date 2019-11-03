"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const database_1 = __importDefault(require("./database"));
// Load input validation
const event_1 = __importDefault(require("./validation/event"));
const login_1 = __importDefault(require("./validation/login"));
const register_1 = __importDefault(require("./validation/register"));
// init express
const app = express_1.default();
// apply middleware
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(passport_1.default.initialize());
// tslint:disable-next-line: no-var-requires
require("./passport")(passport_1.default);
app.get("/", (req, res) => {
    return res.send("Hi!");
});
app.get("/api/users", (req, res, next) => {
    const sql = "select * from users";
    const params = [];
    database_1.default.all(sql, params, (err, rows) => {
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
    let passwordHash;
    const { email, password, name, access_token } = req.body;
    const { errors, isValid } = register_1.default(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    bcryptjs_1.default.genSalt(10, (error, salt) => {
        bcryptjs_1.default.hash(password, salt, (er, hash) => {
            if (er) {
                throw er;
            }
            passwordHash = hash;
        });
    });
    const query = "select * from users where email = ?";
    database_1.default.get(query, email, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (row) {
            res.status(400).json({ error: "Email already exists" });
        }
        else {
            const sql = "INSERT INTO users (name, email, password, access_token) VALUES (?,?,?,?)";
            const params = [name, email, passwordHash, access_token];
            database_1.default.run(sql, params, function (error, result) {
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
    const { errors, isValid } = login_1.default(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const query = "select * from users where email = ?";
    database_1.default.get(query, email, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (!row) {
            return res.status(404).json({ error: "Email not found" });
        }
        // Check password
        bcryptjs_1.default.compare(password, row.password).then((isMatch) => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: row.id,
                    name: row.name,
                };
                // Sign token
                jsonwebtoken_1.default.sign(payload, process.env.SECRET_OR_KEY, {
                    expiresIn: 31556926,
                }, (error, token) => {
                    res.json({
                        success: true,
                        token: "Bearer " + token,
                    });
                });
            }
            else {
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
    const { errors, isValid } = event_1.default(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const query = "select * from users where access_token = ?";
    database_1.default.get(query, access_token, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        const sql = "INSERT INTO events (user_id, date, message, file, line, column, error) VALUES (?,?,?,?,?,?,?)";
        const params = [row.id, date, message, file, line, column, error];
        database_1.default.run(sql, params, (insertErr, result) => {
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
app.listen(process.env.PORT, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${process.env.PORT}`);
});
//# sourceMappingURL=index.js.map