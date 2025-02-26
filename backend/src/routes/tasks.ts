import { Router, Request, Response, NextFunction } from 'express';
import { pool } from '../db';
import { authenticateToken } from '../middleware/authenticate';

interface AuthenticatedRequest extends Request {
  user?: { id: number; username: string };
}

const router: Router = Router();

router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const tasks = await pool.query('SELECT * FROM tasks WHERE "userId" = $1', [userId]);
    res.json(tasks.rows);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    next(err);
  }
});

router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const { title, description } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, description, "userId", "isComplete") VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, userId, false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating task:', err);
    next(err);
  }
});

router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { title, description, isComplete } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const result = await pool.query(
      'UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description), "isComplete" = COALESCE($3, "isComplete") WHERE id = $4 AND "userId" = $5 RETURNING *',
      [title, description, isComplete, id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Task not found or unauthorized' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error updating task:', err);
    next(err);
  }
});

router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND "userId" = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Task not found or unauthorized' });
    } else {
      res.json({ message: 'Task deleted successfully' });
    }
  } catch (err) {
    console.error('Error deleting task:', err);
    next(err);
  }
});

export default router;