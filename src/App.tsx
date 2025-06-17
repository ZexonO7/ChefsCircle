import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import Index from "./pages/Index";
import About from "./pages/About";
import Clubs from "./pages/Clubs";
import Recipes from "./pages/Recipes";
import Courses from "./pages/Courses";
import Library from "./pages/Library";
import QuestionDetail from "./pages/QuestionDetail";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminPortal from "./pages/AdminPortal";
import Settings from "./pages/Settings";
import Blog from "./pages/Blog";
import BlogPostDetail from "./pages/BlogPostDetail";
import TechDetails from "./pages/TechDetails";
import DevelopmentProcess from "./pages/DevelopmentProcess";
import Careers from "./pages/Careers";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import HockeyProject from "./pages/HockeyProject";
import WorkwearProject from "./pages/WorkwearProject";
import SportRetailProject from "./pages/SportRetailProject";
import PetProject from "./pages/PetProject";
import FireCatProject from "./pages/FireCatProject";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/library" element={<Library />} />
            <Route path="/library/question/:id" element={<QuestionDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminPortal />
              </ProtectedRoute>
            } />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPostDetail />} />
            <Route path="/tech-details" element={<TechDetails />} />
            <Route path="/development-process" element={<DevelopmentProcess />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/projects/hockey" element={<HockeyProject />} />
            <Route path="/projects/workwear" element={<WorkwearProject />} />
            <Route path="/projects/sport-retail" element={<SportRetailProject />} />
            <Route path="/projects/pet" element={<PetProject />} />
            <Route path="/projects/firecat" element={<FireCatProject />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
