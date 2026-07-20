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
          loading={null}
          persistor={persistor}
          onBeforeLift={async () => {
            const token = localStorage.getItem("hirehelp_access_token");
            if (token) {
              try {
                const me = await getCurrentStaffUser();
                store.dispatch(
                  loginSuccess({
                    user: {
                      id: me.id,
                      email: me.email,
                      full_name: me.firstName && me.lastName ? `${me.firstName} ${me.lastName}` : undefined,
                      firstName: me.firstName,
                      lastName: me.lastName,
                      role: me.role,
                    },
                    token,
                  })
                );
              } catch {
                store.dispatch(sessionResolvedAction());
              }
            } else {
              store.dispatch(sessionResolvedAction());
            }
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
