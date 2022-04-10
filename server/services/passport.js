const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    done(null, user.id);
    // uses MongoDB object ID for session cookie
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    })
});

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
}, 
(accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id}).then((existingUser) => {
            if (existingUser) {
                //already have record with profile ID
                done(null, existingUser);
            } else {
                // don't have user record with profile ID
                new User({ googleId: profile.id })
                .save()
                .then(user => done(null, user));
            }

        })

    // console.log('accessToken', accessToken);
    // console.log('refreshToken', refreshToken);
    // console.log('profile:', profile);
}
)
);