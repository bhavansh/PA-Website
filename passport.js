const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("./models/User");

// Authorization Using passport-jwt

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRETORKEY;
opts.issuer = "Programmers_Army";

passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
        User.findOne({ _id: jwt_payload.sub }, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        });
    })
);

// For authorization of admin
// passport.use(
//     new JwtStrategy(opts, function (jwt_payload, done) {
//         User.findOne({ _id: jwt_payload.sub }, function (err, user) {
//             if (err) {
//                 return done(err, false);
//             }
//             if (user) {
//                 if (user.role === "admin") {
//                     return done(null, user);
//                 } else {
//                     return done(null, false);
//                 }
//             } else {
//                 return done(null, false);
//                 // or you could create a new account
//             }
//         });
//     })
// );
