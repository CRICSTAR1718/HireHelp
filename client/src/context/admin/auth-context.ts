import { createContext } from "react";
import type { AuthContextValue } from "../../types/admin/auth";

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);