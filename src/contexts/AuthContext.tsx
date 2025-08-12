import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  login as authLogin,
  register as authRegister,
  logout as authLogout,
  type User,
} from "@/services/auth/authService";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    userData: Omit<User, "id" | "role"> & {
      password: string;
      role?: "client" | "conseillere" | "admin";
    },
  ) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    const authUser = await authLogin(email, password);
    if (!authUser) return false;

    setUser(authUser);
    localStorage.setItem("current-user", JSON.stringify(authUser));

    const clientKey = `client-favorites-${authUser.codeClient || authUser.email}`;
    const clientFavorites = localStorage.getItem(clientKey);
    if (clientFavorites) {
      localStorage.setItem("lolly-favorites", clientFavorites);
      window.dispatchEvent(new CustomEvent("favoritesUpdated"));
    }

    window.dispatchEvent(new CustomEvent("loginSuccess", { detail: authUser }));
    return true;
  };

  const register = async (
    userData: Omit<User, "id" | "role"> & {
      password: string;
      role?: "client" | "conseillere" | "admin";
    },
  ): Promise<boolean> => {
    const newUser = await authRegister(userData);
    if (!newUser) return false;

    setUser(newUser);
    return true;
  };

  const logout = async () => {
    await authLogout();
    setUser(null);
    localStorage.removeItem("current-user");
    localStorage.removeItem("lolly-favorites");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("current-user", JSON.stringify(updatedUser));
      window.dispatchEvent(
        new CustomEvent("userUpdated", { detail: updatedUser }),
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
