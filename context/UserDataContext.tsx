"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface UserData {
  age: number;
  netWorth: number; // 만원 단위
  salary: number; // 만원 단위
}

interface UserDataContextType {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  clearUserData: () => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [userData, setUserDataState] = useState<UserData | null>(null);

  const setUserData = (data: UserData) => {
    setUserDataState(data);
  };

  const clearUserData = () => {
    setUserDataState(null);
  };

  return (
    <UserDataContext.Provider value={{ userData, setUserData, clearUserData }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
}
