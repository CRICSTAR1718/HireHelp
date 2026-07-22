import { type ReactNode } from "react";
import { useLocation } from "react-router-dom";

/**
 * Wraps route content so it fades/slides in on every navigation.
 * Keyed by pathname so React remounts (and thus replays the CSS
 * animation defined in styles/theme.css: .hh-page-transition) each
 * time the route changes. No extra dependency (framer-motion, etc)
 * required — pure CSS keyframes.
 *
 * Usage:
 *   <PageTransition><Outlet /></PageTransition>
 */
export const PageTransition = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  return (
    <div key={location.pathname} className="hh-page-transition" style={{ position: "relative", zIndex: 1 }}>
      {children}
    </div>
  );
};

export default PageTransition;
