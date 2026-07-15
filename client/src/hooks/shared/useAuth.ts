import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginStart, loginSuccess, loginFailure, logout as logoutAction } from "@/store/authSlice";
import { staffLogin, type LoginInput } from "@/api/shared/auth";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, loading, error } = useAppSelector((s) => s.auth);

  const login = useCallback(
    async (input: LoginInput) => {
      dispatch(loginStart());
      try {
        const result = await staffLogin(input);
        dispatch(loginSuccess(result));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to sign in. Please try again.";
        dispatch(loginFailure(message));
        throw err;
      }
    },
    [dispatch],
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  return { user, token, isAuthenticated, loading, error, login, logout };
}
