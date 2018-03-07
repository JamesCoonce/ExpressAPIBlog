import User from '../models/user';
import bodyParser from 'body-parser';
import passport from 'passport';
const AuthController = {};

AuthController.register = async (req, res) => {
    try{
        
    }
    catch(err){
        return res.status(500).send('An error occurred: ' + err);
    }
};

AuthController.login = async (req, res) => {
    try {
        if (!req.body.user.email || !req.body.user.password) {
            res.status(403).end();
        }
    }
    catch(err){

    }
};



AuthController.logout = async (req, res) => {
    req.logout();
    res.status(200).send('Successfully logged out');
};

AuthController.me = async (req, res) => {
    try{

    }
    catch(err){

    }
};

