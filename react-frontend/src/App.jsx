// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';
import PrivateRoute from './components/Auth/PrivateRoute';

import { AuthProvider } from './context/AuthContext';
import { UserDataProvider } from './context/UserDataContext';

export default function App() {
  return (
    <AuthProvider>
      <UserDataProvider>
        <Router>
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes nested under PrivateRoute */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              {/* add more protected routes here as needed */}
            </Route>
          </Routes>
        </Router>
      </UserDataProvider>
    </AuthProvider>
  );
}
