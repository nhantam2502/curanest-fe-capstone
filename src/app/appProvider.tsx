"use client";
import { AccountResType } from "@/schemaValidation/auth.schema";
import { isClient } from "../lib/http";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type User = AccountResType["data"];

type Account = {
  email?: string;
  phoneNumber?: string;
  password: string;
};

const AppContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  account: Account | null;
  setAccount: (account: Account | null) => void;
}>(
  {
    user: null,
    setUser: () => {},
    account: null,
    setAccount: () => {},
  }
);

export const useAppContext = () => useContext(AppContext);

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUserState] = useState<User | null>(null);
  const [account, setAccount] = useState<Account | null>(null);

  const setUser = useCallback((user: User | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      document.cookie = `userRole=${user.role}; path=/; max-age=86400; secure; samesite=strict`;
    } else {
      localStorage.removeItem("user");
      document.cookie =
        "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }, []);

  useEffect(() => {
    if (isClient()) {
      const _user = localStorage.getItem("user");
      setUserState(_user ? JSON.parse(_user) : null);
    }
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, account, setAccount }}>
      {children}
    </AppContext.Provider>
  );
}
