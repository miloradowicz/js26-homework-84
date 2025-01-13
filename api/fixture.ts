import mongoose from 'mongoose';

import config from './config';

(async () => {
  await mongoose.connect(new URL(config.mongo.db, config.mongo.host).href);
  const db = mongoose.connection;

  try {
    await db.dropCollection('tasks');
    await db.dropCollection('users');
  } finally {
    await db.close();
  }
})().catch(console.error);
