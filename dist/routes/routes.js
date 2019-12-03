"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../database"));
const utils_1 = require("../utils");
const events = __importStar(require("./events"));
const login_1 = __importDefault(require("./login"));
const register_1 = __importDefault(require("./register"));
exports.router = express_1.Router();
// unprotected routes
exports.router.post("/api/register/", (req, res) => register_1.default(req, res, database_1.default, bcryptjs_1.default, utils_1.signJWT));
exports.router.post("/api/login/", (req, res) => login_1.default(req, res, database_1.default, bcryptjs_1.default, utils_1.signJWT));
exports.router.post("/api/event/:access_token/", (req, res) => events.create(req, res, database_1.default));
// protected route middleware
exports.router.post("/api/events/", (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({ error: "No authorization token" });
    }
    jsonwebtoken_1.default.verify(req.headers.authorization.replace("Bearer ", ""), process.env.SECRET_OR_KEY, (err, decoded) => {
        if (err) {
            return res.status(400).json({ error: "Invalid token" });
        }
        else {
            next("route");
        }
    });
});
// protected routes
exports.router.post("/api/events/", (req, res, next) => events.get(req, res, database_1.default));
//# sourceMappingURL=routes.js.map