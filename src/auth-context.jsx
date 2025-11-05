import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
  useRef,
} from "react";
import { mockAuthService } from "./mockAuthService";

const ACCESS_KEY = "mock_access_token";
const REFRESH_KEY = "mock_refresh_token";

const AuthContext = createContext(null);

// Decodes JWT and returns payload or null
function parseJwt(token) {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

// Provides authentication context to children
export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem(ACCESS_KEY)
  );
  const [refreshToken, setRefreshToken] = useState(() =>
    localStorage.getItem(REFRESH_KEY)
  );
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem(ACCESS_KEY);
    const p = parseJwt(t);
    return p ? { name: p.name, sub: p.sub } : null;
  });
  const [authLoading, setAuthLoading] = useState(false);
  const refreshTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Schedules token refresh before expiry
  const scheduleRefresh = useCallback((token) => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    const payload = parseJwt(token);
    if (!payload || !payload.exp) return;
    const now = Math.floor(Date.now() / 1000);
    const secondsLeft = payload.exp - now;
    const refreshAt = Math.max(1, secondsLeft - 10) * 1000;
    if (secondsLeft <= 12) {
      refreshAccessToken();
      return;
    }
    refreshTimerRef.current = setTimeout(() => {
      refreshAccessToken();
    }, refreshAt);
  }, []);

  // Refreshes the access token using the refresh token
  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) {
      logout();
      return;
    }
    try {
      const res = await mockAuthService.refresh({ refreshToken });
      localStorage.setItem(ACCESS_KEY, res.accessToken);
      setAccessToken(res.accessToken);
      const p = parseJwt(res.accessToken);
      if (p) setUser({ name: p.name, sub: p.sub });
      scheduleRefresh(res.accessToken);
    } catch (err) {
      console.warn("Silent refresh failed:", err);
      logout();
    }
  }, [refreshToken, scheduleRefresh]);

  useEffect(() => {
    if (accessToken) scheduleRefresh(accessToken);
  }, [accessToken, scheduleRefresh]);

  // Attempts login with credentials
  const login = useCallback(
    async ({ username, password }) => {
      setAuthLoading(true);
      try {
        const res = await mockAuthService.login({ username, password });
        localStorage.setItem(ACCESS_KEY, res.accessToken);
        localStorage.setItem(REFRESH_KEY, res.refreshToken);
        setAccessToken(res.accessToken);
        setRefreshToken(res.refreshToken);
        const p = parseJwt(res.accessToken);
        setUser(p ? { name: p.name, sub: p.sub } : null);
        scheduleRefresh(res.accessToken);
        setAuthLoading(false);
        return { ok: true };
      } catch (err) {
        setAuthLoading(false);
        return { ok: false, error: err.message || "Login failed" };
      }
    },
    [scheduleRefresh]
  );

  // Clears tokens & resets auth state
  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  // Returns current access token
  const getAccessToken = useCallback(() => accessToken, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        getAccessToken,
        authLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to consume authentication context
export function useAuth() {
  return useContext(AuthContext);
}
