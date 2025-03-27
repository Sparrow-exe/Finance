// src/components/Auth/Login.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../api/auth';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formValid, setFormValid] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const newErrors = {};
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email';
    if (password.length === 0) newErrors.password = 'Password is required';
    setErrors(newErrors);
    setFormValid(Object.keys(newErrors).length === 0);
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      login(data);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}

      <button type="submit" disabled={!formValid}>Login</button>

      {/* ✅ Link to Register */}
      <p style={{ marginTop: '10px' }}>
        Don’t have an account? <Link to="/register">Register here</Link>
      </p>
    </form>
  );
}
