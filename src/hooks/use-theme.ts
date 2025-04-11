import React from "react";
import {
  ThemeContextType,
  ThemeProviderContext,
} from "@/components/shared/theme-provider";

const useTheme = (): ThemeContextType => {
  const context = React.useContext(ThemeProviderContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

export default useTheme;
