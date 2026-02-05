"use client";
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext({ theme: false, toggleTheme: () => {} });

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider(props: ThemeProviderProps) {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    const storedValue = localStorage.getItem("theme") ?? false;
    if (storedValue) {
      document.documentElement.classList.add("dark");
    }
    return !!storedValue;
  });

  const toggleTheme = () => {
    const newValue = !darkMode;
    if (newValue) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.removeItem("theme");
    }
    console.log(localStorage.getItem("theme"));

    setDarkMode(() => newValue);
  };

  return (
    <ThemeContext.Provider value={{ theme: darkMode, toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
