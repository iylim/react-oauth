# React Oauth Tutorial

## Step 1: Get Oauth Keys
Obtain Google authentication key by registering app. 
https://console.developers.google.com/  
1. Create Project
2. Enable Google+ API
3. Go down to credentials tab and create new credentials
4. Select Oauth Client Id
5. Set redirect URI http://localhost:3001/googlecallback
6. Get keys for env (Google client ID, Secret, and Callback)

## Step 2: Backend Code
### Dependencies
* Passport: authentication framework for express
* Cors
* Session

### Setting Up Passport
1. Mount passport by adding the code below to  *server.js*.  
```passport.initialize()``` is required but ```passport.session()``` is only needed to persist login sessions.
```
app.use(passport.initialize());
app.use(passport.session());
```
2. Create passport file in config folder.  
* In *server.js* add code.
```
require('./config/passport')
```
* In the *passport.js* file add code.
```
const passport = require('passport');
```
3. Install OAuth strategy.
```
npm i passport-google-oauth20
```
* this module implements Google's OAuth 2.0 API

4. Require OAuth strategy.
* require the ```passport-google-oauth``` inside *passport.js*.
```
const GoogleStrategy = require('passport-goggle-oauth20').Strategy;
```
5. Configure Passport
* ```passport.use``` method with GoogleStrategy
```
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK
},
function(acessToken, refreshToken, profile, cb) {
   User.findOne({ googleId: profile.id }, (err, user) => {
        if (err) return done(err);
        if (user) {
          return done(null, user);
        }
        const newUser = new User({
          fullName: profile.displayName,
          email: profile.emails[0].value,
        });
        newPreference.userId = newUser._id;
      }
    });
    newUser.save()
    .then(() => done(null, newUser))
      .catch((error) => {
        done(error);
      });
    )
}
));
```
6. Serialize User  
* First up is the ```passport.serializeUser``` method that's used to give Passport the nugget of data to put into the session for this authenticated user.
* Put code below after ```passport.use```.
```
passport.serializeUser((user, done) => {
  done(null, user);
});
```
7. Deserialize User  
* The ```passport.deserializeUser``` method is used to provide Passport with the user from the db we want assigned to the req.user object.
* Put code below after ```passport.serializeUser```.

```
passport.deserializeUser((obj, done) => {
  User.findById(id, function(err, user) {
     done(err, user);
   });
});
```
### Routing
1. Login Route
* The ```passport.authenticate``` function will coordinate with Google's OAuth server.
* Add code below to *server.js*.
``` 
router.get('/auth/google', passport.authenticate(
   'google',
   { scope: ['profile', 'email'] }
));
 ```
2. Callback Route
* This is the route that gets called after Google user confirms. This was added to redirect URI setting up on Google.
* Add code after login route. 
```
 router.get('/googlecallback', passport.authenticate(
   'google', { failureRedirect: '/', session: false }),
  (req, res) => {
    const token = createJWT(req.user);
    res.redirect(`http://localhost:3000?token=${token}`);
  },
  );
 ));
 ```

 ## Step 3: Frontend Code
1. Add Routing  
```npm i react-router-dom```
* Replace index.js with code below.
``` 
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { Route, Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
ReactDOM.render(
 <BrowserRouter>
  <Switch>
   <Route path="/" component={App} />
  </Switch>
 </BrowserRouter>,
 document.getElementById("root")
);
registerServiceWorker();
```
2. Get token from query.
``` 
npm i query-string --save 
```
* In App.js we use query-string in ```componentWillMount```.
```
import queryString from "query-string";
```
* Then before render.
```
 componentWillMount() {
    const { location, history } = this.props;
    const query = queryString.parse(location.search);
    if (query.token) {
      window.localStorage.setItem('token', query.token);
      history.push('/');
    }
  }
```
3. Logout
* To logout a user we remove token.
```
 handleLogout = () => {
    localStorage.removeItem('token');
    this.setState({ user: null });
  };
```