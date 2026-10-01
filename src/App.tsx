import { useEffect } from "react";
import BlogBloqueoCreativo from "./pages/BlogBloqueoCreativo";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { SubscriptionProvider } from "@/hooks/useSubscription";
import { LanguageProvider } from "@/hooks/useLanguage";
import { AnimatePresence } from "framer-motion";
import Challenge from "./pages/Challenge";
import Training from "./pages/Training";
import Feed from "./pages/Feed";
import Auth from "./pages/Auth";
import Portfolio from "./pages/Portfolio";
import Improve from "./pages/Improve";
import Checkout from "./pages/Checkout";
import CheckoutReturn from "./pages/CheckoutReturn";
import Messages from "./pages/Messages";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import { APP_PATH } from "@/lib/appPaths";
import PageTransition from "./components/PageTransition";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  // Landing pages ("/", "/premium"…) are not part of this app, so an in-app link to one needs a full page load.
  // Only for in-app navigation: on the first load the server already chose this app, and reloading would loop.
  const leaving = !APP_PATH.test(location.pathname) && location.key !== "default";

  // On the location change itself: waiting for the exit animation could leave the visitor on a blank page.
  useEffect(() => {
    if (leaving) window.location.replace(location.pathname + location.search + location.hash);
  }, [leaving, location]);

  if (leaving) return null;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/blog/bloqueo-creativo" element={<BlogBloqueoCreativo />} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/challenge" element={<PageTransition><Challenge /></PageTransition>} />
        <Route path="/training" element={<PageTransition><Training /></PageTransition>} />
        <Route path="/improve" element={<PageTransition><Improve /></PageTransition>} />
        <Route path="/feed" element={<PageTransition><Feed /></PageTransition>} />
        <Route path="/portfolio" element={<PageTransition><Portfolio /></PageTransition>} />
        <Route path="/messages" element={<PageTransition><Messages /></PageTransition>} />
        <Route path="/pago" element={<PageTransition><Checkout /></PageTransition>} />
        <Route path="/pago/gracias" element={<PageTransition><CheckoutReturn /></PageTransition>} />
        <Route path="/user/:userId" element={<PageTransition><UserProfile /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <LanguageProvider>
              <BrowserRouter>
                <AnimatedRoutes />
              </BrowserRouter>
            </LanguageProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;