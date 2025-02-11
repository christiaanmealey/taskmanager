import mongoose from 'mongoose';

const url = 'mongodb://localhost:27017';
const dbName = 'taskmanager';

const connectDB = async () => {
    try {
        await mongoose.connect(`${url}/${dbName}`);
        console.log('connected to mongo');
    } catch (error) {
        console.error(`error connecting to mongo: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;