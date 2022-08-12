require("dotenv").config();
const User = require("../../model/userSchema");
const passport = require("passport"),
  // , findOrCreate = require('mongoose-findorcreate')
  googleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      callbackURL: process.env.CALLBACK_URI,
      clientSecret: process.env.GOOGLE_CLIENT_SECRETE,
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log(profile)
      await User.find({ googleId: profile.id }, (err, user) => {
        if (user.id == profile.id) {
          console.log(`this is user:${user}`);
          return done(err, user);
        }
      else{
          console.log("not user");
          const user = User.create({
            googleId: profile.id,
            name: profile.given_name,
            family_name: profile.family_name,
            email: profile.email,
            displayName: profile.displayName,
            photos: profile.photos,
          }, ((err, user) => {
            try {
              if (user) {
                user.save(saved=>{ console.log(`new ${saved}}`);})
                return done(err, user);
              }
            } catch (error) {
              console.log(error);
            }
          }));
         
        }
      });
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
