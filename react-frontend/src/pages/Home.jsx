// src/pages/Home.jsx
import API from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, logout } = useAuth();

  const checkProtected = async () => {
    try {
      const res = await API.get('/auth/protected');
      alert(`Protected route says: ${res.data.message}`);
    } catch (err) {
      alert('Access denied: ' + err.response?.data?.message);
    }
  };

  return (
    <div>
      <h1>Home</h1>
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={logout}>Logout</button>
          <button onClick={checkProtected}>Test Protected Route</button>
        </>
      ) : (
        <p>Please log in to access protected content.</p>
      )}
    </div>
  );
}
