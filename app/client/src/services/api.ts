// Add a TypeScript interface for the global window object with our config
declare global {
  interface Window {
    APP_CONFIG?: {
      API_URL?: string;
    };
  }
}

// Helper function to determine if we're running in a local development environment
function isLocalDevelopment(): boolean {
  return (
    !process.env.NODE_ENV ||
    process.env.NODE_ENV === "development" ||
    window.location.hostname === "localhost"
  );
}

// Helper function to ensure URL uses HTTPS in production
function ensureHttps(url: string): string {
  // Skip for localhost development
  if (url.includes("localhost")) return url;

  // Force HTTPS by replacing http:// with https:// if needed
  return url.replace(/^http:\/\//i, "https://");
}

// Get the appropriate API URL based on the environment
function getApiUrl(): string {
  // For local development, always use localhost
  if (isLocalDevelopment()) {
    console.log("Running in local development mode");
    return "http://localhost:5000";
  }

  // In production, prefer the runtime config, then environment variable
  const productionUrl =
    window.APP_CONFIG?.API_URL || process.env.REACT_APP_API_URL;

  if (!productionUrl) {
    console.warn(
      "No API URL configured, falling back to localhost (this will not work in production)"
    );
    return "http://localhost:5000";
  }

  return ensureHttps(productionUrl);
}

// Set the API URL
const API_URL = getApiUrl();

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
