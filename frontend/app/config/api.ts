import { Platform } from "react-native";

// Base URL for API endpoints
const BASE_URL =
  Platform.OS === "web" ? "http://localhost:8084" : "http://10.0.2.2:8084"; // Use 10.0.2.2 for Android emulator

// API endpoints
export const API_ENDPOINTS = {
  UPLOAD_IMAGE: `${BASE_URL}/api/images/upload`,
} as const;

// API configuration
export const API_CONFIG = {
  HEADERS: {
    Accept: "application/json",
  },
} as const;

// Helper function to handle API errors
export const handleApiError = (error: any) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return error.response.data.error || "Server error occurred";
  } else if (error.request) {
    // The request was made but no response was received
    return "No response from server";
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message || "An error occurred";
  }
};

// You can add more configurations here, like:
// export const API_CONFIG = {
//   TIMEOUT: 5000,
//   RETRY_ATTEMPTS: 3,
// } as const;
