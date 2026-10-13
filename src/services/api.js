const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : "/api";

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    let errorMsg = `Request failed: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.message) errorMsg = errorData.message;
      else if (errorData.error) errorMsg = errorData.error;
    } catch {
      try {
        const text = await response.text();
        if (text) errorMsg = text;
      } catch {
        // ignore fallback
      }
    }
    throw new Error(errorMsg);
  }

  // Handle empty bodies (e.g. 204 or text responses)
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

export const api = {
  // Students
  getStudents: () => request("/students"),
  getStudentById: (id) => request(`/students/${id}`),
  createStudent: (studentData) =>
    request("/students", {
      method: "POST",
      body: JSON.stringify(studentData),
    }),
  updateStudent: (id, studentData) =>
    request(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(studentData),
    }),
  deleteStudent: (id) =>
    request(`/students/${id}`, {
      method: "DELETE",
    }),

  // Foods
  getFoods: (params = {}) => {
    const query = new URLSearchParams();
    if (params.query) query.set("query", params.query);
    if (params.category && params.category !== "All") query.set("category", params.category);
    if (params.maxPrice) query.set("maxPrice", params.maxPrice);
    const queryString = query.toString() ? `?${query.toString()}` : "";
    return request(`/foods${queryString}`);
  },
  addFood: (foodData) =>
    request("/foods", {
      method: "POST",
      body: JSON.stringify(foodData),
    }),
  deleteFood: (id) =>
    request(`/foods/${id}`, {
      method: "DELETE",
    }),

  // Recommendations
  generateRecommendation: (studentId) =>
    request(`/recommendations/${studentId}`, {
      method: "POST",
    }),
  getRecommendations: () => request("/recommendations"),
  getRecommendationsByStudent: (studentId) =>
    request(`/recommendations/student/${studentId}`),
  deleteRecommendation: (id) =>
    request(`/recommendations/${id}`, {
      method: "DELETE",
    }),

  // Dashboard
  getDashboardStats: () => request("/dashboard/stats"),

  // Health
  checkHealth: () => request("/health"),
};
