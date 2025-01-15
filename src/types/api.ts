export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface User {
  username: string;
  email: string;
  id: string;
}

export interface UserProfile {
  email: string;
  username: string;
  id: string;
  // Add other profile fields as needed
}

export interface ApiError extends Error {
  status?: number;
}
