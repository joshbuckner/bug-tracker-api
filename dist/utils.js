"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.generateToken = (n) => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let token = "";
    for (let i = 0; i < n; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
};
exports.signJWT = ({ token, email, id, name }) => {
    // tslint:disable-next-line: no-console
    // Create JWT Payload
    const payload = {
        email,
        id,
        name,
        token,
    };
    // tslint:disable-next-line: no-console
    console.log(payload);
    // Sign token
    const signedToken = jsonwebtoken_1.default.sign(payload, process.env.SECRET_OR_KEY, {
        expiresIn: 31556926,
    });
    return {
        message: "success",
        token: "Bearer " + signedToken,
    };
};
//# sourceMappingURL=utils.js.map