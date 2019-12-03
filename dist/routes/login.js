"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const login_1 = __importDefault(require("../validation/login"));
// login user
exports.default = (req, res, db, bcrypt, signJWT) => {
    const { email, password } = req.body;
    const { errors, isValid } = login_1.default(req.body);
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
        bcrypt.compare(password, row.password).then((isMatch) => {
            if (isMatch) {
                res.json(signJWT({ token: row.access_token, email: row.email, id: row.id, name: row.name }));
            }
            else {
                return res.status(400).json({ password: "Password incorrect" });
            }
        });
    });
};
//# sourceMappingURL=login.js.map