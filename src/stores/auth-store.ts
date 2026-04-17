import { create } from "zustand";
import { getCookie, setCookie, removeCookie } from "@/lib/cookies";

const ACCESS_TOKEN = "thisisjustarandomstring";

interface AuthUser {
  accountNo: string;
  name: string;
  email: string;
  role: string[];
  exp: number;
}

interface AuthState {
  auth: {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
    accessToken: string;
    setAccessToken: (accessToken: string, persist?: boolean) => void;
    resetAccessToken: () => void;
    reset: () => void;
  };
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN);
  const initToken = cookieState ? JSON.parse(cookieState) : "";
  return {
    auth: {
      user: {
        accountNo: "",
        name: "Usuário Sistema",
        email: "sigas@gmail.com",
        role: ['general_administrator'],
        exp: 0,
      },
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initToken,
      setAccessToken: (accessToken, persist = true) =>
        set((state) => {
          if (persist) {
            setCookie(ACCESS_TOKEN, JSON.stringify(accessToken));
          } else {
            removeCookie(ACCESS_TOKEN);
          }
          return { ...state, auth: { ...state.auth, accessToken } };
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN);
          return { ...state, auth: { ...state.auth, accessToken: "" } };
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN);
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: "" },
          };
        }),
    },
  };
});
