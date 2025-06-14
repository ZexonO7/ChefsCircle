
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPostDetail from "./pages/BlogPostDetail";
import Careers from "./pages/Careers";
import Clubs from "./pages/Clubs";
import Recipes from "./pages/Recipes";
import Courses from "./pages/Courses";
import Library from "./pages/Library";
import Auth from "./pages/Auth";
import AdminPortal from "./pages/AdminPortal";
import FireCatProject from "./pages/FireCatProject";
import SportRetailProject from "./pages/SportRetailProject";
import WorkwearProject from "./pages/WorkwearProject";
import TechDetails from "./pages/TechDetails";
import DevelopmentProcess from "./pages/DevelopmentProcess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPostDetail />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminPortal />
              </ProtectedRoute>
            } />
            <Route path="/clubs" element={
              <ProtectedRoute>
                <Clubs />
              </ProtectedRoute>
            } />
            <Route path="/recipes" element={
              <ProtectedRoute>
                <Recipes />
              </ProtectedRoute>
            } />
            <Route path="/courses" element={<Courses />} />
            <Route path="/library" element={<Library />} />
            <Route path="/projects/firecat" element={<FireCatProject />} />
            <Route path="/projects/sport-retail" element={<SportRetailProject />} />
            <Route path="/projects/workwear" element={<WorkwearProject />} />
            <Route path="/tech-details" element={<TechDetails />} />
            <Route path="/development-process" element={<DevelopmentProcess />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
