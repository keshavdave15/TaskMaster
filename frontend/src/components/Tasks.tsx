import React, { useState, useEffect } from 'react';
import API from '../services/api';

interface Task {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await API.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const handleAddTask = async () => {
    if (!title || !description) return;
    try {
      const response = await API.post('/tasks', { title, description });
      setTasks((prev) => [...prev, response.data]);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const updatedTask = { ...task, isComplete: !task.isComplete };
      await API.put(`/tasks/${task.id}`, updatedTask);
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? updatedTask : t))
      );
    } catch (err) {
      console.error('Failed to toggle completion:', err);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleSaveTask = async (id: number) => {
    try {
      const updatedTask = { title: editTitle, description: editDescription };
      const response = await API.put(`/tasks/${id}`, updatedTask);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? response.data : task))
      );
      setEditingTask(null);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h2>📝 Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {editingTask === task.id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <input
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  <button onClick={() => handleSaveTask(task.id)}>💾 Save</button>
                </>
              ) : (
                <>
                  <span>
                    {task.title} - {task.description} (
                    {task.isComplete ? '✅ Complete' : '❌ Incomplete'})
                  </span>
                  <button onClick={() => handleToggleComplete(task)}>
                    {task.isComplete ? 'Mark Incomplete' : 'Mark Complete'}
                  </button>
                  <button onClick={() => handleEditTask(task)}>🖊️ Edit</button>
                  <button onClick={() => handleDeleteTask(task.id)}>🗑 Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      <h3>Add Task</h3>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleAddTask}>➕ Add Task</button>
    </div>
  );
};

export default Tasks;