
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import PageLoadingWrapper from "@/components/PageLoadingWrapper";
import Index from "./pages/Index";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import BlogPostDetail from "./pages/BlogPostDetail";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Clubs from "./pages/Clubs";
import Library from "./pages/Library";
import Recipes from "./pages/Recipes";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import AdminPortal from "./pages/AdminPortal";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TechDetails from "./pages/TechDetails";
import DevelopmentProcess from "./pages/DevelopmentProcess";
import NotFound from "./pages/NotFound";
import IngredientsToRecipes from "./pages/IngredientsToRecipes";
import Contact from "./pages/Contact";
import RecipeDetail from "./pages/RecipeDetail";
import Membership from "./pages/Membership";
import CulinaryJourney from "./pages/CulinaryJourney";
import QuestionDetail from "./pages/QuestionDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <PageLoadingWrapper>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPostDetail />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/clubs" element={<Clubs />} />
              <Route path="/library" element={<Library />} />
              <Route path="/library/question/:id" element={<QuestionDetail />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/ingredients-to-recipes" element={<IngredientsToRecipes />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<AdminPortal />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/tech-details" element={<TechDetails />} />
              <Route path="/development-process" element={<DevelopmentProcess />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/recipes/:id" element={<RecipeDetail />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/culinary-journey" element={<CulinaryJourney />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageLoadingWrapper>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
