import React, { useState } from 'react';
import { createTask } from '../../services/api';

const TaskForm = ({ onTaskAdded }) => {
  const [form, setForm] = useState({ title: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createTask(form);
      onTaskAdded(response.data);
      setForm({ title: '', description: '' });
    } catch (error) {
      console.error('Ошибка создания задачи.');
    }
  };

  return (
    <div class="container">
      <h1>Добавление задачи:</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Название"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Описание"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button class="add-task-btn" type="submit">Добавить</button>
      </form>
    </div>
  );
};

export default TaskForm;
