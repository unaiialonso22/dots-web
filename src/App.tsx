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
import Landing from "./pages/Landing";
import Challenge from "./pages/Challenge";
import Training from "./pages/Training";
import Feed from "./pages/Feed";
import Auth from "./pages/Auth";
import Portfolio from "./pages/Portfolio";
import Improve from "./pages/Improve";
import Premium from "./pages/Premium";
import Messages from "./pages/Messages";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import PageTransition from "./components/PageTransition";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/challenge" element={<PageTransition><Challenge /></PageTransition>} />
        <Route path="/training" element={<PageTransition><Training /></PageTransition>} />
        <Route path="/improve" element={<PageTransition><Improve /></PageTransition>} />
        <Route path="/feed" element={<PageTransition><Feed /></PageTransition>} />
        <Route path="/portfolio" element={<PageTransition><Portfolio /></PageTransition>} />
        <Route path="/messages" element={<PageTransition><Messages /></PageTransition>} />
        <Route path="/premium" element={<PageTransition><Premium /></PageTransition>} />
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
