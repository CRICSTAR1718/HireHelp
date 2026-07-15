import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getCurrentUser, loginRequest, logoutRequest, refreshTokenRequest } from "../../api/admin/auth";
import { configureAuthenticationFailureHandler, configureTokenUpdateHandler } from "../../api/admin/client";
import { tokenStorage } from "../../services/admin/token-storage";
import type { AuthContextValue, LoginInput, RefreshTokenResult } from "../../types/admin/auth";
import { AuthContext } from "./auth-context";

const AUTH_ME_QUERY_KEY = ["auth", "me"] as const;

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const [accessToken, setAccessToken] = useState<string | null>(() => tokenStorage.getAccessToken());
  const sessionAvailable = Boolean(accessToken || tokenStorage.getRefreshToken());

  const clearSession = useCallback(() => {
    tokenStorage.clear();
    setAccessToken(null);
    queryClient.removeQueries({ queryKey: AUTH_ME_QUERY_KEY });
  }, [queryClient]);

  const meQuery = useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: getCurrentUser,
    enabled: sessionAvailable,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    configureAuthenticationFailureHandler(clearSession);
    configureTokenUpdateHandler(setAccessToken);
    return () => {
      configureAuthenticationFailureHandler(undefined);
      configureTokenUpdateHandler(undefined);
    };
  }, [clearSession]);

  const applyTokens = useCallback((tokens: RefreshTokenResult) => {
    tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
    setAccessToken(tokens.accessToken);
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (input: LoginInput) => {
      const result = await loginRequest(input);
      applyTokens(result);
      await queryClient.fetchQuery({ queryKey: AUTH_ME_QUERY_KEY, queryFn: getCurrentUser });
    },
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) throw new Error("No refresh token is available");
      const tokens = await refreshTokenRequest(refreshToken);
      applyTokens(tokens);
      await queryClient.fetchQuery({ queryKey: AUTH_ME_QUERY_KEY, queryFn: getCurrentUser });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) await logoutRequest(refreshToken);
    },
    onSettled: clearSession,
  });

  const value = useMemo<AuthContextValue>(() => ({
    user: meQuery.data ?? null,
    accessToken,
    isAuthenticated: Boolean(meQuery.data),
    loading: sessionAvailable && meQuery.isLoading,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    refresh: refreshMutation.mutateAsync,
  }), [accessToken, loginMutation.mutateAsync, logoutMutation.mutateAsync, meQuery.data, meQuery.isLoading, refreshMutation.mutateAsync, sessionAvailable]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

