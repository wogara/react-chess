const API_URL = "https://chesswho.org/api"; // Update with your actual API URL

// Register a new user
const register = async (name, email, password, password_confirmation) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Specify the content type
    },
    body: JSON.stringify({ name, email, password, password_confirmation }), // Convert data to JSON
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`); // Handle errors
  }
  const data = await response.json(); // Get the response data

  if (data.access_token) {
    localStorage.setItem("user", JSON.stringify(data)); // Store user data and token in local storage
  }
  return data; // Return the response data
};

// Log in an existing user
const login = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Specify the content type
    },
    body: JSON.stringify({ email, password }), // Convert data to JSON
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`); // Handle errors
  }

  const data = await response.json(); // Get the response data

  if (data.access_token) {
    localStorage.setItem("user", JSON.stringify(data)); // Store user data and token in local storage
  }
  return data; // Return the response data
};

// Get the currently logged-in user
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user")); // Return the user data from local storage
};

// Log out the user
const logout = () => {
  localStorage.removeItem("user"); // Remove user data from local storage
};

export default {
  register,
  login,
  getCurrentUser,
  logout,
};
