import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NotFound from "./NotFound";
import { APP_PATH } from "@/lib/appPaths";

// In-app links to landing pages ("/", "/premium"…) need a full page load: the landing is not part of this app.
export default function OutsideApp() {
  const { pathname, search, hash } = useLocation();
  const inside = APP_PATH.test(pathname);
  useEffect(() => {
    if (!inside) window.location.replace(pathname + search + hash);
  }, [inside, pathname, search, hash]);
  return inside ? <NotFound /> : null;
}
