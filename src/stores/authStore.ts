/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import type { User, UserProfile } from "../types/api";
import { api } from "../utils/api";

interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: User | null;
  login: (accessToken: string, user: User) => void;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  login: (accessToken: string, user: User) => {
    sessionStorage.setItem("access_token", accessToken);
    set({ isAuthenticated: true, user });
  },
  logout: () => {
    sessionStorage.removeItem("access_token");
    console.log("removed local storage");
    set({ isAuthenticated: false, user: null });
  },
  initialize: async () => {
    try {
      const token = sessionStorage.getItem("access_token");
      if (!token) {
        set({ isInitialized: true });
        return;
      }

      const { user } = await api.get<{ user: UserProfile }>("/api/auth/me");
      set({ isAuthenticated: true, user, isInitialized: true });
    } catch (error) {
      // console.error("Failed to initialize auth state:", error);
      sessionStorage.removeItem("access_token");
      set({ isAuthenticated: false, user: null, isInitialized: true });
    }
  },
}));
