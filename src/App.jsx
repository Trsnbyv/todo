import React, { useState, useEffect } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import ChooseImg from './assets/images/choose.png'

const App = () => {
  const [todos, setTodos] = useState(JSON.parse(localStorage.getItem('todos')) || []);
  const [newTodo, setNewTodo] = useState('');
  const [todoDate, setTodoDate] = useState('');
  const [priority, setPriority] = useState('low');
  const [todoImage, setTodoImage] = useState(null);
  const [elChooseImg, setElChooseImg] = useState(ChooseImg);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setElChooseImg(URL.createObjectURL(file));
      setTodoImage(file);
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newTodo.trim() && todoDate) {
      let imageDataUrl = null;
      if (todoImage) {
        imageDataUrl = await readFileAsDataURL(todoImage);
      }
      setTodos([
        ...todos,
        {
          id: uuidv4(),
          text: newTodo.trim(),
          date: todoDate,
          priority,
          completed: false,
          image: imageDataUrl,
        },
      ]);
      setNewTodo('');
      setTodoDate('');
      setTodoImage(null);
      setElChooseImg(ChooseImg);
    }
  };

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleUpdate = (id) => {
    const newText = prompt('Update your todo', todos.find(todo => todo.id === id).text);
    const newDate = prompt('Update your date', todos.find(todo => todo.id === id).date);
    const newPriority = prompt('Update your priority (low, medium, high)', todos.find(todo => todo.id === id).priority);
    if (newText && newDate && newPriority) {
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, text: newText, date: newDate, priority: newPriority } : todo
      ));
    }
  };

  const handleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const renderTodos = () => {
    let filteredTodos = todos;
    if (filter === 'completed') {
      filteredTodos = todos.filter(todo => todo.completed);
    } else if (filter === 'uncompleted') {
      filteredTodos = todos.filter(todo => !todo.completed);
    }

    if (searchTerm) {
      filteredTodos = filteredTodos.filter(todo => 
        todo.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredTodos.map((todo) => (
      <li key={todo.id} className={`${todo.completed ? 'completed' : ''} ${todo.priority}-priority`}>
        <div className="change-wrapper">
          <span>Name: {todo.text}, Date: {todo.date}, Priority: {todo.priority}</span>
          {todo.image && <img src={todo.image} width="50" height="30" alt="Task" />}
        </div>
        <div className="change-wrapper">
          <input
            type="radio"
            className="completedBtn"
            checked={todo.completed}
            onChange={() => handleComplete(todo.id)}
          />
          <button className="updateBtn" onClick={() => handleUpdate(todo.id)}>Update</button>
          <button className="deleteBtn" onClick={() => handleDelete(todo.id)}>Delete</button>
        </div>
      </li>
    ));
  };

  return (
    <div className="container">
      <h1>Enter your task</h1>
      <form id="todoForm" onSubmit={handleSubmit}>
        <input
          type="text"
          id="newTodo"
          placeholder="Enter your task"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          required
          autoComplete="off"
        />
        <label htmlFor="priority">Choose priority</label>
        <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <label htmlFor="todoDate">Enter the task date</label>
        <input
          type="date"
          id="todoDate"
          value={todoDate}
          onChange={(e) => setTodoDate(e.target.value)}
          required
        />
        <label className="img-label">
          <span>Upload the image</span>
          <input
            type="file"
            className="choose-input visually-hidden"
            id="todoImage"
            accept="image/*"
            onChange={handleImageChange}
          />
          <img className="choose-img" src={elChooseImg} alt="choose" width="100" height="70" />
        </label>
        <button type="submit" id="addBtn">Submit</button>
      </form>
      <div className="filters">
        <button id="allBtn" onClick={() => setFilter('all')}>
          All (<span id="allCount">{todos.length}</span>)
        </button>
        <button id="completedBtn" onClick={() => setFilter('completed')}>
          Completed (<span id="completedCount">{todos.filter(todo => todo.completed).length}</span>)
        </button>
        <button id="uncompletedBtn" onClick={() => setFilter('uncompleted')}>
          Uncompleted (<span id="uncompletedCount">{todos.filter(todo => !todo.completed).length}</span>)
        </button>
      </div>
      <input
        type="text"
        id="searchBar"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        autoComplete="off"
      />
      <ul id="todoList">
        {renderTodos()}
      </ul>
      <button id="darkModeToggle" onClick={() => setDarkMode(!darkMode)}>
        <i className="material-icons">brightness_4</i>
      </button>
    </div>
  );
};

export default App;
