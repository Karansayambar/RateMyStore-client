"use client";

import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/common.utils";

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: "ADMIN" | "USER" | "OWNER";
  storeId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (
    userData: Omit<User, "id" | "role"> & { password: string }
  ) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
}



const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy users data
const dummyUsers: (User & { password: string })[] = [
  {
    id: "1",
    name: "System Administrator User",
    email: "admin@example.com",
    address: "123 Admin Street, Admin City, AC 12345",
    role: "ADMIN",
    password: "Admin123!",
  },
  {
    id: "2",
    name: "John Doe Regular Customer",
    email: "john@example.com",
    address: "456 User Avenue, User City, UC 67890",
    role: "USER",
    password: "User123!",
  },
  {
    id: "3",
    name: "Jane Smith Store Manager",
    email: "jane@store1.com",
    address: "789 Store Boulevard, Store City, SC 11111",
    role: "OWNER",
    storeId: "1",
    password: "Store123!",
  },
  {
    id: "4",
    name: "Bob Wilson Coffee Shop Owner",
    email: "bob@store2.com",
    address: "321 Coffee Lane, Coffee City, CC 22222",
    role: "OWNER",
    storeId: "2",
    password: "Coffee123!",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState(dummyUsers);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const res = await axiosInstance.post("/api/auth/login", {
      email,
      password,
    });
    const foundUser = await res.data;
    console.log("Found User:", foundUser);
    if (foundUser?.message === "Login successful.") {
      setUser(foundUser.user);
      localStorage.setItem("currentUser", JSON.stringify(foundUser.user));
      return true;
    }
    return false;
    // return true
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const signup = async (
    userData: Omit<User, "id" | "role"> & { password: string }
  ): Promise<boolean> => {
    const existingUser = users.find((u) => u.email === userData.email);
    if (existingUser) {
      return false;
    }

    const newUser = {
      ...userData,
      id: Date.now().toString(),
      role: "USER" as const,
    };

    setUsers((prev) => [...prev, newUser]);
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
    return true;
  };

  const updatePassword = async (newPassword: string): Promise<boolean> => {
    if (!user) return false;

    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, password: newPassword } : u))
    );
    return true;
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, signup, updatePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
