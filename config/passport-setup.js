const passport  = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;

const User = require('./../app/model/User')
const Role = require('./../app/model/Role')

passport.serializeUser(async (user, done) => {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    if (user.hasOwnProperty('provider')) {
        if (user.provider == "google") {

            role = await Role.findOne({ name: 'user' })

            let userExist = await User.findOne({ 
                provider_id: user.id,
                provider: user.provider 
            })

            if (!userExist) {

                await User.create({
                    name: user.displayName,
                    email: user.email,
                    image: user._json.picture,
                    provider: user.provider,
                    provider_id: user.id,
                    role_id: role.id,
                    password: 'secret12345'
                })

                console.log("Google SignIn");
            }

        } else if (user.provider == "facebook") {

            role = await Role.findOne({ name: 'user' })

            let userExist = await User.findOne({ 
                provider_id: user.id,
                provider: user.provider 
            })

            if (!userExist) {

                await User.create({
                    name: user.displayName,
                    email: user._json.email,
                    image: user.photos[0].value,
                    provider: user.provider,
                    provider_id: user.id,
                    role_id: role.id,
                    password: 'secret12345'
                })

                console.log("Facebook SignIn");
            }
        } else if (user.provider == "linkedin") {
            role = await Role.findOne({ name: 'user' })

            let userExist = await User.findOne({ 
                provider_id: user.id,
                provider: user.provider 
            })

            if (!userExist) {

                await User.create({
                    name: user.displayName,
                    email: user.emails[0].value,
                    image: user.photos[0].value,
                    provider: user.provider,
                    provider_id: user.id,
                    role_id: role.id,
                    password: 'secret12345'
                })
                console.log("Linkedin SignIn");
            }
        }
    }

    done(null, user);
});
  
passport.deserializeUser((user, done) => {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    // console.log("Deserialize", user);
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback: true
}, (request, accessToken, refreshToken, profile, done) => {
    done(null, profile)
}));


passport.use(new FacebookStrategy({
    clientID        : process.env.FACEBOOK_CLIENT_ID,
    clientSecret    : process.env.FACEBOOK_SECRET_ID,
    callbackURL     : "http://localhost:3000/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email']
}, (token, refreshToken, profile, done) => {
    return done(null,profile)
}));

passport.use(new LinkedinStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_SECRET_ID,
    callbackURL: "http://localhost:3000/linkedin/callback",
    scope: ['r_emailaddress', 'r_liteprofile'],
    passReqToCallback: true,
}, (request, accessToken, refreshToken, profile, done) => {
    done(null, profile)
}));