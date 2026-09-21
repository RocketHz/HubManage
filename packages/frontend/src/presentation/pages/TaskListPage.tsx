import React, { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../../core/tasks/Task';
import { taskApiService } from '../../application/api-services/TaskApiService';

const STATUS_OPTIONS: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.REVIEW,
  TaskStatus.DONE
];

const STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'To Do',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.REVIEW]: 'Review',
  [TaskStatus.DONE]: 'Done'
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: '#6c757d',
  [TaskStatus.IN_PROGRESS]: '#0d6efd',
  [TaskStatus.REVIEW]: '#fd7e14',
  [TaskStatus.DONE]: '#198754'
};

const TaskListPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | ''>('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await taskApiService.getAllTasks();
        setTasks(filterStatus ? data.filter(task => task.status === filterStatus) : data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch tasks. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filterStatus]);

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskApiService.deleteTask(id);
        setTasks(tasks.filter(task => task.id !== id));
      } catch (err) {
        setError('Failed to delete task. Please try again later.');
        console.error(err);
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: TaskStatus) => {
    try {
      const updated = await taskApiService.updateTaskStatus(id, newStatus);
      setTasks(tasks.map(task => task.id === id ? updated : task));
    } catch (err) {
      setError('Failed to update task status.');
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="task-list-page">
      <h1>Tasks</h1>

      <div className="task-filters">
        <label htmlFor="status-filter">Filter by status: </label>
        <select
          id="status-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as TaskStatus | '')}
        >
          <option value="">All</option>
          {STATUS_OPTIONS.map(status => (
            <option key={status} value={status}>{STATUS_LABELS[status]}</option>
          ))}
        </select>
      </div>

      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <table className="task-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd' }}>Title</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd' }}>Description</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd' }}>Due Date</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px' }}>{task.title}</td>
                <td style={{ padding: '8px' }}>{task.description}</td>
                <td style={{ padding: '8px' }}>{formatDate(task.dueDate)}</td>
                <td style={{ padding: '8px' }}>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      backgroundColor: STATUS_COLORS[task.status],
                      color: '#fff'
                    }}
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '8px' }}>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteTask(task.id)}
                    style={{ marginLeft: '4px' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskListPage;
