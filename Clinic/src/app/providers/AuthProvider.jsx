import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createApiClient } from "../../lib/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "clinic.erp.accessToken";

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const api = useMemo(
    () =>
      createApiClient({
        getToken: () => accessToken,
      }),
    [accessToken]
  );

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      if (!accessToken) {
        setIsBootstrapping(false);
        return;
      }
      try {
        const me = await api.get("/auth/me");
        if (!cancelled) setUser(me.user);
      } catch {
        if (!cancelled) {
          setUser(null);
          setAccessToken("");
          localStorage.removeItem(TOKEN_KEY);
        }
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [accessToken, api]);

  const value = useMemo(
    () => ({
      api,
      accessToken,
      user,
      isAuthenticated: Boolean(accessToken && user),
      isBootstrapping,
      async login({ email, password }) {
        const res = await api.post("/auth/login", { email, password });
        setAccessToken(res.accessToken);
        localStorage.setItem(TOKEN_KEY, res.accessToken);
        setUser(res.user);
      },
      logout() {
        setUser(null);
        setAccessToken("");
        localStorage.removeItem(TOKEN_KEY);
      },
    }),
    [api, accessToken, user, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

