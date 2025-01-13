import mongoose from 'mongoose';

import { Status } from '../types';
import User from './User';

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'value is required'],
      validate: {
        validator: async (value: mongoose.Types.ObjectId) => !!(await User.findById(value)),
        message: 'value not found',
      },
    },
    title: { type: String, required: [true, 'value is required'] },
    description: String,
    status: { type: Status, required: [true, 'value is required'] },
    __v: { type: Number, select: false },
  },
  {
    strict: 'throw',
  }
);

export default mongoose.model('Task', schema);
