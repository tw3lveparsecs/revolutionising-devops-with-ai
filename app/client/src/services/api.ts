// Use environment variable for API URL or fallback to localhost for development
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Generic API request function with error handling
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
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
