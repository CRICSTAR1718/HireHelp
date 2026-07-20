import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import "./index.css";
import { store, persistor } from "./store";
import { sessionResolved } from "./store/authSlice";
import { AppRouter } from "./routes/AppRouter";
import { ThemeProvider } from "./contexts/ThemeContext";
import { getCurrentStaffUser } from "./api/shared/auth";
import { loginSuccess, sessionResolved as sessionResolvedAction, logout } from "./store/authSlice";
import { setAuthFailureHandler } from "./api/shared/client";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Set up auth failure handler to redirect to login on 401 errors
setAuthFailureHandler(() => {
  store.dispatch(logout());
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <PersistGate
          loading={
            <main className="grid min-h-screen place-items-center">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            </main>
          }
          persistor={persistor}
          onBeforeLift={async () => {
            // Resolve loading state - auth is now cookie-based, so we don't
            // need to check /me on boot. If a cookie exists, the first API call
            // will succeed. If not, the user will be redirected to login.
            store.dispatch(sessionResolvedAction());
          }}
        >

          <QueryClientProvider client={queryClient}>
            <AppRouter />
            <Toaster closeButton position="top-right" richColors />
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  </StrictMode>,
);
