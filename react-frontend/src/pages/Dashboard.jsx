// src/pages/Dashboard.jsx
import { useUserData } from '../context/UserDataContext';
import { updateUserSettings } from '../api/user';

export default function Dashboard() {
  const { userData, setUserData, reloadUserData, loading } = useUserData();

  const handleUpdateCurrency = async () => {
    try {
      const updatedSettings = await updateUserSettings({
        ...userData.settings,
        currency: 'EUR'
      });

      // Update the frontend copy immediately
      setUserData(prev => ({
        ...prev,
        settings: updatedSettings
      }));

      alert('Currency updated to EUR ✅');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed ❌');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>

      {/* ✅ Temporary debug section */}
      <div style={{
        backgroundColor: '#f7f7f7',
        padding: '10px',
        borderRadius: '8px',
        marginTop: '20px',
        maxHeight: '500px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '0.9rem',
        whiteSpace: 'pre-wrap'
      }}>
        <h3>User Schema (Debug View)</h3>
        <button onClick={reloadUserData} style={{ marginBottom: '10px' }}>
          🔄 Refresh
        </button>
        <code>
        {JSON.stringify(userData || [], null, 2)}
        </code>
      </div>
      <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>

      <p>Current Currency: <strong>{userData.settings?.currency}</strong></p>

      <button onClick={handleUpdateCurrency}>
        Change Currency to EUR
      </button>
    </div>
    </div>
    
  );
}
