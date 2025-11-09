import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI not set');
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
