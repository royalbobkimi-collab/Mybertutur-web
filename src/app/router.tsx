/**
 * Minimal history-API router (no extra dependencies).
 *
 * The marketing site lives at `/`; the authenticated learning app lives at
 * `/app/*`. Vercel's SPA rewrite (vercel.json) already serves index.html for
 * every non-asset path, so deep links like /app/testbm work on reload.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type RouterContextValue = {
  /** Current pathname, e.g. "/app/testbm". */
  path: string;
  navigate: (to: string, options?: { replace?: boolean }) => void;
};

const RouterContext = createContext<RouterContextValue | undefined>(undefined);

function currentPath(): string {
  return window.location.pathname || '/';
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState<string>(() => currentPath());

  useEffect(() => {
    const onPop = () => setPath(currentPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback(
    (to: string, options?: { replace?: boolean }) => {
      if (to === currentPath()) {
        setPath(to);
        return;
      }
      if (options?.replace) {
        window.history.replaceState({}, '', to);
      } else {
        window.history.pushState({}, '', to);
      }
      setPath(to);
      // Match native stack behaviour: new route starts at the top.
      window.scrollTo(0, 0);
    },
    [],
  );

  const value = useMemo<RouterContextValue>(() => ({ path, navigate }), [path, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRouter(): RouterContextValue {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within a RouterProvider');
  return ctx;
}

/** True when `path` equals `route` or is a child of it ("/app" ⊃ "/app/settings"). */
export function isRouteActive(path: string, route: string): boolean {
  if (route === '/') return path === '/';
  if (route === '/app') return path === '/app' || path === '/app/';
  return path === route || path.startsWith(`${route}/`);
}
