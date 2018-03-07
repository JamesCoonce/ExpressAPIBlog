import Customer from '../models/customer';
import cuid from 'cuid';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';

const CustomerController = {};

CustomerController.getAll = async (req, res) => {
    try {
        await Customer.find().sort('-dateAdded').exec((err, customers) => {
            if (err) {
                res.status(500).send(err);
            }
            res.json({
                customers,
            });
        });
    } catch (err) {
        res.send(err);
    }
};

CustomerController.getPost = async (req, res) => {
    try {
        Customer.findOne({
            cuid: req.params.cuid,
        }).exec((err, customer) => {
            if (err) {
                res.status(500).send(err);
            }
            res.json({
                customer,
            });
        });
    } catch (err) {
        res.send(err);
    }
};

CustomerController.addPost = async (req, res) => {
    try {
        if (!req.body.customer.fistName || !req.body.customer.lastName || !req.body.customer.userName) {
            res.status(403).end();
        }

        const newCustomer = new Customer(req.body.customer);

        // Let's sanitize inputs
        newCustomer.firstName = sanitizeHtml(newCustomer.firstName);
        newCustomer.lastName = sanitizeHtml(newCustomer.lastName);
        newCustomer.userName = sanitizeHtml(newCustomer.userName);

        newCustomer.cuid = cuid();

        newCustomer.save((err, saved) => {
            if (err) {
                res.status(500).send(err);
            }
            res.json({
                customer: saved,
            });
        });
    } catch (err) {
        console.log(err);
    }
};

CustomerController.updatePost = async (req, res) => {
    try {
        if (!req.body.customer.fistName || !req.body.customer.lastName) {
            res.status(403).end();
        }
        Customer.findOne({
            cuid: req.params.cuid,
        }).exec((err, customer) => {
            // Handle any possible database errors
            if (err) {
                res.status(500).send(err);
            } else {
                // Update each attribute with any possible attribute that may have been submitted in the body of the request
                // If that attribute isn't in the request body, default back to whatever it was before.
                customer.fistName = req.body.customer.firstName || customer.firstName;
                customer.lastName = req.body.customer.lastName || customer.content;
                console.log('Customer about to be saved');
                // Save the updated document back to the database
                customer.save((err, saved) => {
                    if (err) {
                        res.status(500).send(err);
                    }
                    res.json({
                        customer: saved,
                    });
                });
            }
        });
    } catch (err) {
        console.log(err);
    }
};

CustomerController.deletePost = async (req, res) => {
    try {
        Customer.findOne({
            cuid: req.params.cuid,
        }).exec((err, customer) => {
            if (err) {
                res.status(500).send(err);
            }

            customer.remove(() => {
                res.status(200).end();
            });
        });
    } catch (err) {
        console.log(err);
    }
};

export default CustomerController;
