const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await response.json();

  // fetch does NOT throw on 4xx/5xx, so we check manually
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}