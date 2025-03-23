// js/common.js

// Base URL for your backend API
const API_BASE_URL = "http://localhost:3000";

// Generic API request helper function
async function apiRequest(endpoint, method = "GET", data = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: { "Content-Type": "application/json" }
  };
  if (data) {
    options.body = JSON.stringify(data);
  }
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in API request:", error);
    throw error;
  }
}

// Helper functions for specific HTTP methods
function apiGet(endpoint) {
  return apiRequest(endpoint, "GET");
}

function apiPost(endpoint, data) {
  return apiRequest(endpoint, "POST", data);
}

function apiPut(endpoint, data) {
  return apiRequest(endpoint, "PUT", data);
}

function apiDelete(endpoint) {
  return apiRequest(endpoint, "DELETE");
}

// Utility function for formatting dates
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString();
}

