import { defineConfig, type Connect, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// The landing (public/index.html and friends) owns "/" and its pages; only these paths belong to the app.
// Keep in sync with the rewrites in vercel.json and APP_PATH in src/lib/appPaths.ts.
const APP_ROUTE = /^\/(auth|challenge|training|improve|feed|portfolio|messages|pago|user|blog)(\/|$)/;

const LANDING_PAGE = /^(?:\/en)?\/(premium|comunidad|privacidad|aviso-legal)\/?$/;

// Mirrors vercel.json locally, so `vite` and `vite preview` route like production.
const serveAppRoutes = (): Plugin => {
  const rewrite: Connect.NextHandleFunction = (req, _res, next) => {
    const [pathname, query] = (req.url ?? "").split("?");
    const q = query ? `?${query}` : "";
    const page = pathname.match(LANDING_PAGE);
    if (APP_ROUTE.test(pathname)) req.url = `/app.html${q}`;
    else if (pathname === "/" || pathname === "/en" || pathname === "/en/") req.url = `/index.html${q}`;
    else if (page) req.url = `/${page[1]}.html${q}`;
    next();
  };
  return {
    name: "serve-app-routes",
    configureServer: (server) => { server.middlewares.use(rewrite); },
    configurePreviewServer: (server) => { server.middlewares.use(rewrite); },
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [serveAppRoutes(), react(), mode === "development" && componentTagger()].filter(Boolean),
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, "app.html"),
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
