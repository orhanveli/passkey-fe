export interface LoginRequest {
  email: string;
  password?: string;
  otp?: string;
  regular_login?: boolean;
}

export interface LoginResponse {
  access_token?: string;
  user?: User;
  passkey_enabled: boolean;
  totp_enabled: boolean;
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
