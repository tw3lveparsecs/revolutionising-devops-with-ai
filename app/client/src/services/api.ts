// Add a TypeScript interface for the global window object with our config
declare global {
  interface Window {
    APP_CONFIG: {
      API_URL: string;
    };
  }
}

// Helper function to ensure URL uses HTTPS in production
function ensureHttps(url: string): string {
  // Skip for localhost development
  if (url.includes("localhost")) return url;

  // Force HTTPS by replacing http:// with https:// if needed
  return url.replace(/^http:\/\//i, "https://");
}

// Use runtime configuration from window.APP_CONFIG or fall back to environment variable or localhost
const rawApiUrl =
  window.APP_CONFIG?.API_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

// Ensure we're using HTTPS in production
const API_URL = ensureHttps(rawApiUrl);

// Log the API URL to help with debugging
console.log("API is configured to use URL:", API_URL);

// Generic API request function with error handling
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    // Add more debugging for network issues
    console.log(`Making API request to: ${API_URL}/api${endpoint}`);

    const response = await fetch(`${API_URL}/api${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error("API Request failed:", error);
    throw error;
  }
}

// Collectibles API methods
export const collectiblesApi = {
  getAll: () => apiRequest("/collectibles"),
  getById: (id: string) => apiRequest(`/collectibles/${id}`),
  create: (data: any) =>
    apiRequest("/collectibles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest(`/collectibles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest(`/collectibles/${id}`, {
      method: "DELETE",
    }),
};

// Users API methods
export const usersApi = {
  getAll: () => apiRequest("/users"),
  getById: (id: string) => apiRequest(`/users/${id}`),
};

// Orders API methods
export const ordersApi = {
  getAll: () => apiRequest("/orders"),
  getById: (id: string) => apiRequest(`/orders/${id}`),
};
