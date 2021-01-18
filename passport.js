const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const User = require("./models/User");


const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["access_token"];
    }
    return token;
};

// authorization
passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: cookieExtractor,
            secretOrKey: process.env.SECRETORKEY,
        },
        (payload, done) => {
            User.findById({ _id: payload.sub }, (err, user) => {
                if (err) return done(err, false);
                if (user) return done(null, user);
                else return done(null, false);
            });
        }
    )
);

// authenticated local strategy using username and password
passport.use(
    new LocalStrategy((email, password, done) => {
        User.findOne({ email }, (err, user) => {
            // something went wrong with database
            if (err) return done(err);
            // if no user exist
            if (!user) return done(null, false);
            // check if password is correct
            user.comparePassword(password, done);
        });
    })
);

//LinkedIn
passport.use(
    new LinkedInStrategy(
        {
            clientID: process.env.LINKEDIN_KEY,
            clientSecret: process.env.LINKEDIN_SECRET,
            callbackURL: "http://localhost:4000/api/user/auth/linkedin/success",
            scope: ["r_emailaddress", "r_liteprofile"],
            // state: true,
        },
        function (accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function () {
                // To keep the example simple, the user's LinkedIn profile is returned to
                // represent the logged-in user. In a typical application, you would want
                // to associate the LinkedIn account with a user record in your database,
                // and return that user instead.
                console.log(accessToken, refreshToken, profile);
                return done(null, profile);
            });
        }
    )
);



