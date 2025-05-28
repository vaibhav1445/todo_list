import React, { useState, useEffect } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [filter, setFilter] = useState('all'); 

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tasks'));
    if (saved) setTasks(saved);
  }, []);

  
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() === '') return;
    const now = new Date();
    const task = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
      createdAt: now.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };
    setTasks([task, ...tasks]);
    setNewTask('');
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const handleToggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all tasks?')) {
      setTasks([]);
    }
  };

  const handleEditTask = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const handleSaveEdit = (id) => {
    if (editingText.trim() === '') return;
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: editingText.trim() } : task
      )
    );
    setEditingId(null);
    setEditingText('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const remainingCount = tasks.length - completedCount;

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  return (
  <div className="bg-gradient-to-b from-[#0a0f1a] to-[#000000] grid py-4 min-h-screen text-white">
    <div className="max-w-xl mx-auto p-6 bg-[#101826]/80 rounded-lg shadow-lg w-full">
      <h1 className="text-3xl font-semibold text-center mb-6 text-white">WorkList</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-grow px-3 py-2 rounded bg-[#1e2a38] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          onClick={handleAddTask}
          className="text-blue-400 hover:text-blue-500 cursor-pointer"
          title="Add Task"
        >
          <AddCircleIcon fontSize="large" />
        </button>
      </div>

      <div className="flex justify-between text-sm mb-3">
        <div className="space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-1 rounded ${
              filter === 'all' ? 'bg-blue-700' : 'bg-[#2d3748]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-2 py-1 rounded ${
              filter === 'completed' ? 'bg-blue-700' : 'bg-[#2d3748]'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('incomplete')}
            className={`px-2 py-1 rounded ${
              filter === 'incomplete' ? 'bg-blue-700' : 'bg-[#2d3748]'
            }`}
          >
            Incomplete
          </button>
        </div>
        <div className="text-gray-300">
          Total: {tasks.length} ✅ {completedCount} / ❌ {remainingCount}
        </div>
      </div>

      <ul className="space-y-2 mb-4 max-h-80 overflow-y-auto pr-1">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#1f2a38] px-4 py-2 rounded"
          >
            <div className="flex items-start gap-2 flex-grow">
              <button onClick={() => handleToggleComplete(task.id)} title="Toggle Complete">
                {task.completed ? (
                  <CheckCircleIcon className="text-green-400" />
                ) : (
                  <RadioButtonUncheckedIcon className="text-gray-500 cursor-pointer" />
                )}
              </button>

              <div className="flex flex-col flex-grow">
                {editingId === task.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      className="flex-grow px-2 py-1 rounded bg-[#2d3748] text-white"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                    <button onClick={() => handleSaveEdit(task.id)} title="Save">
                      <SaveIcon className="text-green-400" />
                    </button>
                    <button onClick={handleCancelEdit} title="Cancel">
                      <CancelIcon className="text-red-400" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      className={`cursor-pointer break-words ${
                        task.completed ? 'line-through text-gray-500' : 'text-white'
                      }`}
                    >
                      {task.text}
                    </span>
                    <span className="text-xs text-gray-500">{task.createdAt}</span>
                  </>
                )}
              </div>
            </div>

            {editingId !== task.id && (
              <div className="flex mt-2 sm:mt-0 sm:ml-2 gap-2">
                <button
                  onClick={() => handleEditTask(task.id, task.text)}
                  className="text-yellow-400 hover:text-yellow-500"
                  title="Edit Task"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-400 hover:text-red-500"
                  title="Delete Task"
                >
                  <DeleteIcon />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {tasks.length > 0 && (
        <button
          onClick={handleClearAll}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded cursor-pointer"
        >
          Clear All Tasks
        </button>
      )}
    </div>
  </div>
);

};

export default Todo;
