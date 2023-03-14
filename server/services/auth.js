const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((user, done) => {
  done(null, user.id);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "978787721720-9u21qt5018q3vm9dcjrf51apfu6l1i5s.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      //Register user here
      done(null, profile);
    }
  )
);
