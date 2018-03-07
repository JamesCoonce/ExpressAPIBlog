import mongoose, { Schema } from 'mongoose';

const customerSchema = new Schema({
    firstName: { type: 'String', required: true },
    lastName: { type: 'String', required: true },
    userName: { type: 'String', required: true, unique: true },
    cuid: { type: 'String', required: true },
    dateAdded: { type: 'Date', default: Date.now, required: true },
});

const Customer = mongoose.model('Post', customerSchema);

export default Customer;