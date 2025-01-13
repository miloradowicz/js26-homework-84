import express from 'express';

import auth, { RequestWithUser } from '../middleware/auth';
import Task from '../models/Task';

const router = express.Router();

router.post('/', auth, async (_req, res, next) => {
  const req = _req as RequestWithUser;

  try {
    const task = await Task.create({
      user: req.user._id,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    });
    res.send(task);
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send({ error: e.message });
    } else {
      next(e);
    }
  }
});

router.get('/', auth, async (_req, res, next) => {
  const req = _req as RequestWithUser;

  try {
    const tasks = await Task.find({ user: req.user._id });
    res.send(tasks);
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send({ error: e.message });
    } else {
      next(e);
    }
  }
});

router.put('/:id', auth, async (_req, res, next) => {
  const req = _req as RequestWithUser;
  const id = req.params.id;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return void res.status(404).send({ error: 'task not found' });
    }

    if (!task.user.equals(req.user._id)) {
      return void res.status(403).send({ error: 'task does not belong to the user' });
    }

    task.title = req.body.title ?? task.title;
    task.description = req.body.description ?? task.description;
    task.status = req.body.status ?? task.status;
    await task.save();
    res.send(task);
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send({ error: e.message });
    } else {
      next(e);
    }
  }
});

router.delete('/:id', auth, async (_req, res, next) => {
  const req = _req as RequestWithUser;
  const id = req.params.id;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return void res.status(404).send({ error: 'task not found' });
    }

    if (!task.user.equals(req.user._id)) {
      return void res.status(403).send({ error: 'task does not belong to the user' });
    }

    await task.deleteOne();
    res.send(null);
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send({ error: e.message });
    } else {
      next(e);
    }
  }
});

export default router;
