import mongoose from 'mongoose';

import config from './config';
import User from './models/User';
import Task from './models/Task';

(async () => {
  await mongoose.connect(new URL(config.mongo.db, config.mongo.host).href);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users').catch(() => {
      console.log('skipping users...');
    });
    await db.dropCollection('tasks').catch(() => {
      console.log('skipping tasks...');
    });

    const users = await User.create(
      {
        username: 'newton',
        password: 'apple',
        token: crypto.randomUUID(),
      },
      {
        username: 'einstein',
        password: '1234',
        token: crypto.randomUUID(),
      }
    );

    await Task.create(
      {
        user: users[0]._id,
        title: 'discover gravity',
        description: 'the law of squares rulezzz',
        status: 'new',
      },
      {
        user: users[0]._id,
        title: 'invent calculus',
        description: 'cuz math is too simple',
        status: 'in_progress',
      },
      {
        user: users[0]._id,
        title: 'be awesome',
        description: 'i am already awesome',
        status: 'complete',
      },
      {
        user: users[1]._id,
        title: 'mess with time',
        status: 'in_progress',
      },
      {
        user: users[1]._id,
        title: 'new gravity yall',
        description: 'make gravity with more gravity',
        status: 'complete',
      },
      {
        user: users[1]._id,
        title: 'marry da cousin',
        description: 'i have known her since tender age',
        status: 'new',
      }
    );
  } finally {
    await db.close();
  }
})().catch(console.error);
