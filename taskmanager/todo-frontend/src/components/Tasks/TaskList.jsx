import React, { useEffect, useState } from 'react';
import { fetchTasks, updateTask, deleteTask } from '../../services/api';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('created_at');
  const [form, setForm] = useState({ title: "", description: "" });
  const [editTaskId, setEditTaskId] = useState(null); // ID редактируемой задачи

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/tasks/?ordering=${sortOrder}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Токен для аутентификации
        },
      })
      .then(response => setTasks(response.data)) // Обновляем задачи
      .catch(error => console.error(error));
  }, [sortOrder]); // Перезапуск при изменении sortOrder

  useEffect(() => {
    const loadTasks = async () => {
      const response = await fetchTasks();
      setTasks(response.data);
    };
    loadTasks();
  }, []);

  const handleToggle = async (task) => {
    await updateTask(task.id, { ...task, status: !task.status });
    setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: !t.status } : t)));
  };
  

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editTaskId) {
      // Редактирование задачи
      axios
        .put(
          `http://127.0.0.1:8000/tasks/${editTaskId}/`,
          form,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        )
        .then((response) => {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === editTaskId ? response.data : task
            )
          );
          setForm({ title: "", description: "" });
          setEditTaskId(null);
        })
        .catch((error) => console.error(error));
    } else {
      // Добавление задачи
      axios
        .post("http://127.0.0.1:8000/tasks/", form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          setTasks((prevTasks) => [...prevTasks, response.data]);
          setForm({ title: "", description: "" });
        })
        .catch((error) => console.error(error));
    }
  };

  // Начало редактирования задачи
  const editTask = (task) => {
    setForm({ title: task.title, description: task.description });
    setEditTaskId(task.id);
  };

  const filteredTasks = tasks.filter(
    (task) => filter === 'all' || (filter === 'completed' && task.status) || (filter === 'pending' && !task.status)
  );

  return (
    <div class="container">
      <div>
        <h1>Список задач:</h1>
        <button onClick={() => setFilter('all')}>Все</button>
        <button onClick={() => setFilter('completed')}>Выполненные</button>
        <button onClick={() => setFilter('pending')}>Невыполненные</button>
        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="created_at">Сортировать по дате</option>
          <option value="-created_at">Сортировать по дате (обратно)</option>
        </select>
      </div>
      {editTaskId && (
        <form onSubmit={handleSubmit} className="edit-form">
          <h2>Редактировать задачу</h2>
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
          <button className="save-task-btn" type="submit">
            Сохранить
          </button>
          <button
            className="cancel-btn"
            type="button"
            onClick={() => setEditTaskId(null)} // Отмена редактирования
          >
            Отмена
          </button>
        </form>
      )}
      <ul class="task-list">
        {filteredTasks.map((task) => (
          <li key={task.id} class="task-item">
            <span
              style={{ textDecoration: task.status ? 'line-through' : 'none' }}
              onClick={() => handleToggle(task)}
            >
              {task.id} | {task.title} | {task.description}
            </span>
            <button
                className="edit-btn"
                onClick={() => editTask(task)}
              >
                Редактировать
              </button>
            <button onClick={() => handleDelete(task.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
