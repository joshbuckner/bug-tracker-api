import "dotenv/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import db from "./database";
const opts: any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_OR_KEY;
module.exports = (passport: any) => {
  passport.use(
    new Strategy(opts, (jwtPayload, done) => {
      const query = "select * from users where id = ?";
      db.get(query, jwtPayload.id, (err, user) => {
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
    }),
  );
};
