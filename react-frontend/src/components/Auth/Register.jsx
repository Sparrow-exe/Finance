// src/components/Auth/Register.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../api/auth';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState('');
  const [errors, setErrors] = useState({});
  const [formValid, setFormValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const newErrors = {};

    // Validate email
    if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    // Validate password strength
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain an uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      newErrors.password = 'Password must contain a lowercase letter';
    }
    if (!/\d/.test(password)) {
      newErrors.password = 'Password must contain a number';
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      newErrors.password = 'Password must contain a symbol';
    }

    // Set strength level
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) setStrength('Weak');
    else if (score <= 4) setStrength('Medium');
    else setStrength('Strong');

    setErrors(newErrors);
    setFormValid(Object.keys(newErrors).length === 0);
  }, [email, password]);

  const getStrengthColor = () => {
    switch (strength) {
      case 'Weak': return 'red';
      case 'Medium': return 'orange';
      case 'Strong': return 'green';
      default: return 'transparent';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(email, password);
      alert('Registered successfully!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Register</h2>

      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        required
        style={{ display: 'block', marginBottom: '8px', width: '100%' }}
      />
      {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        required
        style={{ display: 'block', marginBottom: '8px', width: '100%' }}
      />
      {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}

      {/* ✅ Password Strength Bar */}
      {password && (
        <div style={{ marginBottom: '10px' }}>
          <strong>Password Strength: </strong>
          <span style={{ color: getStrengthColor() }}>{strength}</span>
          <div style={{
            height: '5px',
            width: '100%',
            backgroundColor: '#eee',
            borderRadius: '3px',
            marginTop: '4px'
          }}>
            <div style={{
              width: strength === 'Weak' ? '33%' :
                    strength === 'Medium' ? '66%' : '100%',
              backgroundColor: getStrengthColor(),
              height: '100%',
              borderRadius: '3px',
              transition: 'width 0.3s',
            }} />
          </div>
        </div>
      )}

      <button type="submit" disabled={!formValid} style={{ marginTop: '10px' }}>
        Register
      </button>

      {/* ✅ Link to Login */}
      <p style={{ marginTop: '15px' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </form>
  );
}
