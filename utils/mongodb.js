import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  useUnifiedTopology: true,
};

if (!uri) {
  throw new Error('Mongo URI is missing from the environment variables.');
}

let client;
let clientPromise;

client = new MongoClient(uri, options);
clientPromise = client.connect();

export default clientPromise;
