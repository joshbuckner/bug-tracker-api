"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_1 = require("express");
const database_1 = __importDefault(require("../database"));
const utils_1 = require("../utils");
const events_1 = require("./events");
const login_1 = __importDefault(require("./login"));
const register_1 = __importDefault(require("./register"));
exports.router = express_1.Router();
// tslint:disable-next-line: max-line-length
exports.router.post("/api/register/", (req, res) => register_1.default(req, res, database_1.default, bcryptjs_1.default, utils_1.signJWT));
exports.router.post("/api/login/", (req, res) => login_1.default(req, res, database_1.default, bcryptjs_1.default, utils_1.signJWT));
exports.router.post("/api/event/:access_token/", (req, res) => events_1.newEvent(req, res, database_1.default));
//# sourceMappingURL=routes.js.map