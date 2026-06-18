import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { loginUser, registerUser } from "../api/authApi";
import type {
  LoginRequest,
  RegisterRequest,
  UserResponse,
} from "../models/auth";
import {
  clearAuthSession,
  getStoredToken,
  getStoredUser,
  saveAuthSession,
} from "./authStorage";

interface AuthContextValue {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<UserResponse | null>(() => getStoredUser());

  async function login(request: LoginRequest): Promise<void> {
    const response = await loginUser(request);

    saveAuthSession(response.token, response.user);
    setToken(response.token);
    setUser(response.user);
  }

  async function register(request: RegisterRequest): Promise<void> {
    const response = await registerUser(request);

    saveAuthSession(response.token, response.user);
    setToken(response.token);
    setUser(response.user);
  }

  function logout(): void {
    clearAuthSession();
    setToken(null);
    setUser(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}