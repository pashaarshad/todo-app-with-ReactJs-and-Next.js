'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        // Convert createdAt strings back to Date objects
        const todosWithDates = parsedTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }));
        setTodos(todosWithDates);
      } catch (error) {
        console.error('Error parsing saved todos:', error);
      }
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo: Todo = {
        id: Date.now(),
        title: inputValue.trim(),
        completed: false,
        createdAt: new Date(),
        dueDate: selectedDate ? new Date(selectedDate) : undefined
      };
      setTodos([newTodo, ...todos]);
      setInputValue('');
      setSelectedDate('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const isOverdue = (dueDate?: Date) => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const isDueToday = (dueDate?: Date) => {
    if (!dueDate) return false;
    const today = new Date();
    return dueDate.toDateString() === today.toDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-300 to-green-400 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-gray-600 text-sm mb-2 font-medium">By Arshad Pasha</p>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Advanced TO DO List App with localStorage
          </h1>
          {/* <p className="text-gray-700 text-lg">Stay organized and productive</p> */}
        </div>
        
        {/* Add todo section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter Your Daily Takes for Today..."
              className="flex-1 px-4 py-3 border-0 rounded-xl bg-white/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 placeholder-gray-500 font-medium"
            />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-3 border-0 rounded-xl bg-white/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 font-medium"
            />
            <button
              onClick={addTodo}
              className="px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              ADD
            </button>
          </div>
        </div>

        {/* Stats */}
        {totalCount > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 mb-6 text-center shadow-md">
            <div className="flex justify-center items-center gap-6">
              <div className="text-gray-700">
                <span className="text-2xl font-bold text-green-600">{totalCount}</span>
                <p className="text-sm">Total Tasks</p>
              </div>
              <div className="text-gray-700">
                <span className="text-2xl font-bold text-blue-600">{completedCount}</span>
                <p className="text-sm">Completed</p>
              </div>
              <div className="text-gray-700">
                <span className="text-2xl font-bold text-orange-600">{totalCount - completedCount}</span>
                <p className="text-sm">Remaining</p>
              </div>
            </div>
          </div>
        )}

        {/* Todo list */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 text-center shadow-md">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-600 text-lg font-medium">No tasks yet!</p>
              <p className="text-gray-500">Add your first task above to get started</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 border-l-4 ${
                  todo.completed
                    ? 'border-green-500 bg-green-50/80'
                    : isOverdue(todo.dueDate)
                    ? 'border-red-500 bg-red-50/80'
                    : isDueToday(todo.dueDate)
                    ? 'border-yellow-500 bg-yellow-50/80'
                    : 'border-blue-500'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <div className="flex-1">
                      <span
                        className={`block font-medium ${
                          todo.completed
                            ? 'line-through text-gray-500'
                            : 'text-gray-800'
                        }`}
                      >
                        {todo.title}
                      </span>
                      {todo.dueDate && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-600">Due:</span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              todo.completed
                                ? 'bg-green-100 text-green-800'
                                : isOverdue(todo.dueDate)
                                ? 'bg-red-100 text-red-800'
                                : isDueToday(todo.dueDate)
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {formatDate(todo.dueDate)}
                            {isOverdue(todo.dueDate) && !todo.completed && ' (Overdue)'}
                            {isDueToday(todo.dueDate) && !todo.completed && ' (Today)'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Clear completed button */}
        {completedCount > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setTodos(todos.filter(todo => !todo.completed))}
              className="px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 border-2 border-gray-300 rounded-xl font-semibold hover:bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              🗑️ Clear Completed ({completedCount})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
