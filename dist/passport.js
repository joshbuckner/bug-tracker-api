"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const passport_jwt_1 = require("passport-jwt");
const database_1 = __importDefault(require("./database"));
const opts = {};
opts.jwtFromRequest = passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_OR_KEY;
module.exports = (passport) => {
    passport.use(new passport_jwt_1.Strategy(opts, (jwtPayload, done) => {
        const query = "select * from users where id = ?";
        database_1.default.get(query, jwtPayload.id, (err, user) => {
            if (err) {
                // tslint:disable-next-line: no-console
                console.log(err.message);
                return;
            }
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        });
    }));
};
//# sourceMappingURL=passport.js.map