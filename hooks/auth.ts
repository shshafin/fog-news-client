// lib/auth.ts
import UseAxiosPublic from "@/hooks/UseAxiosPublic"
import { IUser } from "@/lib/content-models"
import { jwtDecode } from "jwt-decode"


export interface AuthState {
  isAuthenticated: boolean
}

const ACCESS_TOKEN_KEY = "accessToken"
const REFRESH_TOKEN_KEY = "refreshToken"


export async function authLogin(email: string, password: string): Promise<{ isAuthenticated: boolean, user: IUser }> {
  const axiosPublic = UseAxiosPublic();
  const response = await axiosPublic.post("/auth/login", { email, password });
  const { accessToken, refreshToken } = response.data.data;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  const user = jwtDecode<IUser>(accessToken);
  return { isAuthenticated: true, user };
}


export async function authLogout(): Promise<void> {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getCurrentUser(): { isAuthenticated: boolean, user?: IUser } {
  const token = getAccessToken();
  if (!token) return { isAuthenticated: false };

  try {
    const user = jwtDecode<IUser>(token);
    const isExpired = Date.now() >= user.exp * 1000;
    return isExpired
      ? { isAuthenticated: false }
      : { isAuthenticated: true, user };
  } catch {
    return { isAuthenticated: false };
  }
}


export function initializeAuth() {
  // This function just ensures localStorage keys exist — optional
}
