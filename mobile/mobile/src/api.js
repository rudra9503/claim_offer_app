import * as SecureStore from "expo-secure-store";
import { API_URL } from "./config";

export async function apiRequest(path, options = {}) {
  const token = await SecureStore.getItemAsync("token");

  // Give up after 10 seconds so the app never spins forever
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  } catch (err) {
    // fetch only throws when the request never reached the server
    throw new Error("Cannot reach the server. Check your internet connection.");
  } finally {
    clearTimeout(timer);
  }

  const data = await response.json();

  // fetch does NOT throw on 4xx/5xx, so we check manually
  if (!response.ok) {
    const error = new Error(data.message || "Something went wrong");
    error.status = response.status; // lets screens check for 401 later
    throw error;
  }
  return data;
}