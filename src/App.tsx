
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPostDetail from "./pages/BlogPostDetail";
import Careers from "./pages/Careers";
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
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPostDetail />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/projects/firecat" element={<FireCatProject />} />
          <Route path="/projects/sport-retail" element={<SportRetailProject />} />
          <Route path="/projects/workwear" element={<WorkwearProject />} />
          <Route path="/tech-details" element={<TechDetails />} />
          <Route path="/development-process" element={<DevelopmentProcess />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
