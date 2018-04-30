import User from '../models/user';
import bodyParser from 'body-parser';
import passport from 'passport';
const AuthController = {};
import jwt from 'jsonwebtoken';
import { generateToken, respond } from '../middleware/authMiddleware';

AuthController.register = async (req, res) => {
    try{
        User.register(new User({ username: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            }), req.body.password, function(err, account) {
            if (err) {
                return res.status(500).send('An error occurred: ' + err);
            }

            passport.authenticate(
                'local', {
                    session: false
                })(req, res, () => {
                res.status(200).send('Successfully created new account');
            });
        });
    }
    catch(err){
        return res.status(500).send('An error occurred: ' + err);
    }
};

AuthController.login = async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({
                message: 'Something is not right with your input'
            });
        }
        passport.authenticate('local', {session: false}, (err, user, info) => {
            if (err || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user   : user
                });
            }
            req.login(user, {session: false}, (err) => {
                if (err) {
                    res.send(err);
                }
                // generate a signed son web token with the contents of user object and return it in the response
                const token = jwt.sign({ id: user.id, email: user.username}, 'ILovePokemon');
                return res.json({user: user.username, token});
            });
        })(req, res);
    }
    catch(err){
        console.log(err);
    }
};



AuthController.logout = async (req, res) => {
    req.logout();
    res.status(200).send('Successfully logged out');
};

AuthController.profile = async (req, res) => {
    try{
        res.send(req.user);
    }
    catch(err){
        res.send("No user Returned");
    }
};

export default AuthController;
