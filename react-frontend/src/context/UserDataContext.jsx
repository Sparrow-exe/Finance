// src/context/UserDataContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserData } from '../api/user';

const UserDataContext = createContext();
export const useUserData = () => useContext(UserDataContext);

export function UserDataProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const data = await fetchUserData();
      setUserData(data);
    } catch (err) {
      console.error('Failed to load user data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <UserDataContext.Provider value={{ userData, setUserData, loading, reloadUserData: loadUserData }}>
      {children}
    </UserDataContext.Provider>
  );
}
