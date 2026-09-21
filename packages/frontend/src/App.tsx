import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductListPage from './presentation/pages/ProductListPage';
import TaskListPage from './presentation/pages/TaskListPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>HubManage</h1>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
              <li>
                <Link to="/tasks">Tasks</Link>
              </li>
              <li>
                <Link to="/users">Users</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main className="app-content">
          <Routes>
            <Route path="/" element={<div>Welcome to HubManage!</div>} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/tasks" element={<TaskListPage />} />
            <Route path="/users" element={<div>User Management (Coming Soon)</div>} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} HubManage. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
