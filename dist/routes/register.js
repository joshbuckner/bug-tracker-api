"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const register_1 = __importDefault(require("../validation/register"));
// register user
exports.default = (req, res, db, bcrypt, signJWT) => {
    let passwordHash = "";
    const { email, password, name } = req.body;
    const { errors, isValid } = register_1.default(req.body);
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
        }
        else {
            const sql = "INSERT INTO users (name, email, password, access_token) VALUES (?,?,?,?)";
            const token = utils_1.generateToken(14);
            const params = [name, email, passwordHash, token];
            db.run(sql, params, function (error) {
                if (error) {
                    res.status(400).json({ error: error.message });
                    return;
                }
                res.json(signJWT({ token, email, id: this.lastID, name }));
            });
        }
    });
};
//# sourceMappingURL=register.js.map