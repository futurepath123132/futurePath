import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Universities from "./pages/Universities";
import UniversityDetail from "./pages/UniversityDetail";
import Scholarships from "./pages/Scholarships";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminUniversities from "./pages/AdminUniversities";
import AdminScholarships from "./pages/AdminScholarships";
import AdminScraper from "./pages/AdminScraper";
import NotFound from "./pages/NotFound";
import { useTheme } from "./hooks/use-theme"; // hook we created earlier
import "./index.css";
import BottomBar from "./components/BottomBar"; // import it at the top
import AuthCallback from "./pages/AuthCallback";
import ResetPassword from "./pages/ResetPassword";
import ConfirmEmail from "./pages/ConfirmEmail";
import ChangePassword from "./pages/ChangePassword";
import ScholarshipDetail from "./pages/ScholarshipDetail";
import Feedback from "./pages/Feedback";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminUsers from "./pages/AdminUsers";

const queryClient = new QueryClient();

const App = () => {
  const { theme } = useTheme();

  return (
    <div className="transition-colors duration-500 bg-background text-foreground min-h-screen">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/universities" element={<Universities />} />
                <Route path="/universities/:id" element={<UniversityDetail />} />
                <Route path="/scholarships/:id" element={<ScholarshipDetail />} />

                <Route path="/scholarships" element={<Scholarships />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/universities" element={<AdminUniversities />} />
                <Route path="/admin/scholarships" element={<AdminScholarships />} />
                <Route path="/admin/scraper" element={<AdminScraper />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/feedback" element={<Feedback />} />

                <Route path="*" element={<NotFound />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                <Route path="/confirm-email" element={<ConfirmEmail />} />
                <Route path="/change-password" element={<ChangePassword />} />

              </Routes>
              <BottomBar />

            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
};

export default App;
