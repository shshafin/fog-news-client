"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { IUser } from "@/lib/content-models";
// Update the import path below if "@/lib/auth" is incorrect
// Update the import path below if "@/lib/auth" is incorrect
import { authLogin, authLogout, getCurrentUser } from "@/hooks/auth";

interface AuthContextType {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  setLoading?: (loading: boolean) => void;
  error: string | null;
  user: IUser;
  setUser?: (user: IUser) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<IUser>({}as IUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
  setLoading(true);
  setError(null);
  try {
    const result = await authLogin(email, password);
    if (result.isAuthenticated) {
      setUser(result.user); // ✅ store the user
      setIsAuthenticated(true);
      return true;
    }
    return false;
  } catch (err) {
    setError((err as Error).message);
    return false;
  } finally {
    setLoading(false);
  }
};


  const logout = async () => {
    try {
      await authLogout();
      setUser({} as IUser);
      setIsAuthenticated(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const auth = getCurrentUser();
      setIsAuthenticated(auth.isAuthenticated);
      setUser(auth.user || {} as IUser);
    };
    checkAuth();
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        loading,
        setLoading,
        error,
        user,
        setUser,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}
