import express from 'express';
import bodyParser from 'body-parser';
import connectToDb from './db/connect';
import passport from 'passport';
import posts from './routes/posts.routes';
import User from './models/user';

const LocalStrategy = require('passport-local').Strategy;

const server = express();

connectToDb();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
        extended: false
}));
server.use(passport.initialize());
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    User.authenticate()
));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

server.get('/', (req, res) => app.render(req, res, '/'));
server.use('/api', posts);
server.listen(3005, () => {
    console.log('server started - 3005');
});

