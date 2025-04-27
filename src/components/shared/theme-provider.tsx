import React, { createContext, useEffect, useState, ReactNode } from "react";

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
};

const ThemeProviderContext = createContext<ThemeContextType | undefined>(
  undefined
);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("vite-ui-theme") || "light"
  );

  useEffect(() => {
    localStorage.setItem("vite-ui-theme", theme);
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
};

export { ThemeProviderContext };
export type { ThemeContextType };
