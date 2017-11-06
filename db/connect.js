import mongoose from 'mongoose';
import config from '../config/index';

mongoose.Promise = global.Promise;

const connectToDb = async () => {
    try {
        await mongoose.connect(config.mongoUrl, { useMongoClient: true });
        //logger.info('Connected to mongo!!!');
    }
    catch (err) {
        //logger.error('Could not connect to MongoDB');
    }
}

export default connectToDb;