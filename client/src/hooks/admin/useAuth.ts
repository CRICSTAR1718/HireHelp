import { useContext } from "react";
import { AuthContext } from "../../context/admin/auth-context";
import type { AuthContextValue } from "../../types/admin/auth";

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};