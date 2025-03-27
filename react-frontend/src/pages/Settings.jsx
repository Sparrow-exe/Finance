// src/pages/Settings.jsx
import { useState, useEffect } from 'react';
import { useUserData } from '../context/UserDataContext';
import { updateUserSettings } from '../api/user';

export default function Settings() {
  const { userData, setUserData, loading } = useUserData();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userData?.settings) {
      setForm(userData.settings);
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateUserSettings(form);
      setUserData(prev => ({ ...prev, settings: updated }));
      alert('✅ Settings updated');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <p>Loading settings...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h1>Settings</h1>
      <form onSubmit={handleSubmit}>

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} />

        <label>Theme</label>
        <select name="theme" value={form.theme} onChange={handleChange}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>

        <label>Currency</label>
        <input type="text" name="currency" value={form.currency} onChange={handleChange} />

        <label>Default Pay Frequency</label>
        <select name="defaultPayFrequency" value={form.defaultPayFrequency} onChange={handleChange}>
          <option value="weekly">Weekly</option>
          <option value="biweekly">Biweekly</option>
          <option value="monthly">Monthly</option>
          <option value="annual">Annual</option>
        </select>

        <label>Start of Month</label>
        <input type="number" name="defaultStartOfMonth" value={form.defaultStartOfMonth} onChange={handleChange} />

        <label>Rounding Preference</label>
        <select name="roundingPreference" value={form.roundingPreference} onChange={handleChange}>
          <option value="exact">Exact</option>
          <option value="nearestDollar">Nearest Dollar</option>
        </select>

        <label>
          <input type="checkbox" name="twoFactorEnabled" checked={form.twoFactorEnabled} onChange={handleChange} />
          Enable Two-Factor Authentication
        </label>

        <label>
          <input type="checkbox" name="loginAlerts" checked={form.loginAlerts} onChange={handleChange} />
          Email Login Alerts
        </label>

        <label>
          <input type="checkbox" name="emailNotifications" checked={form.emailNotifications} onChange={handleChange} />
          Monthly Summary Emails
        </label>

        <label>
          <input type="checkbox" name="showWelcomeTips" checked={form.showWelcomeTips} onChange={handleChange} />
          Show Welcome Tips
        </label>

        <label>
          <input type="checkbox" name="compactMode" checked={form.compactMode} onChange={handleChange} />
          Compact Mode
        </label>

        <label>
          <input type="checkbox" name="uiHintsEnabled" checked={form.uiHintsEnabled} onChange={handleChange} />
          Enable UI Hints
        </label>

        <label>
          <input type="checkbox" name="showNetWorthOnHome" checked={form.showNetWorthOnHome} onChange={handleChange} />
          Show Net Worth on Home
        </label>

        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button>
      </form>
    </div>
  );
}