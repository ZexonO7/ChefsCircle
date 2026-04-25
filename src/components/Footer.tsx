import { ArrowRight, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("newsletter-subscribe", {
        body: { email },
      });
      if (error) throw error;
      toast({
        title: "Success!",
        description: data.message || "Please check your email to verify your subscription.",
      });
      setEmail("");
    } catch (error: any) {
      console.error("Error subscribing to newsletter:", error);
      toast({
        title: "Error",
        description: error.message || "There was a problem subscribing. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer
      id="contact"
      className="relative grain bg-foreground text-background pt-16 pb-8 w-full overflow-hidden"
    >
      {/* Subtle gold ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] rounded-full opacity-[0.06] blur-3xl"
        style={{ background: "var(--gradient-gold)" }}
      />

      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-background/10">
          <div className="sm:col-span-2 lg:col-span-2">
            <h2 className="font-playfair text-3xl font-semibold tracking-tight mb-4">
              Chefs<span className="text-gold-gradient">Circle</span>
            </h2>
            <p className="text-background/70 mb-5 text-sm leading-relaxed max-w-md">
              The exclusive online culinary club for passionate home cooks and aspiring chefs.
              Master techniques, connect with kindred palates, and elevate every plate.
            </p>
            <p className="text-background/50 text-xs uppercase tracking-[0.2em] mb-6">
              Where passion meets flavor
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.linkedin.com/company/chefscircle/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ChefsCircle on LinkedIn"
                className="w-10 h-10 rounded-full border border-background/15 flex items-center justify-center text-background/70 hover:text-background hover:border-accent/60 hover:bg-background/5 transition-all duration-500"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold mb-5 text-background uppercase tracking-[0.2em]">
              Community
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-background/70 hover:text-background transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/clubs"
                  className="text-background/70 hover:text-background transition-colors text-sm"
                >
                  Join Clubs
                </Link>
              </li>
              <li>
                <Link
                  to="/membership"
                  className="text-background/70 hover:text-background transition-colors text-sm"
                >
                  Membership
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-background/70 hover:text-background transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold mb-5 text-background uppercase tracking-[0.2em]">
              Stay Connected
            </h3>
            <p className="text-background/60 text-sm mb-4 leading-relaxed">
              Quiet dispatches from the kitchen — new courses, recipes, and stories.
            </p>
            <form className="space-y-3" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 text-sm bg-background/5 border border-background/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 text-background placeholder-background/40 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className="btn-glow w-full px-4 py-3 text-sm font-medium bg-background text-foreground rounded-xl hover:bg-background/90 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Subscribing..."
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-background/40 text-xs">
            © {new Date().getFullYear()} ChefsCircle. Crafted with care.
          </p>
          <div className="flex space-x-6">
            <Link
              to="/privacy-policy"
              className="text-xs text-background/40 hover:text-background transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/about"
              className="text-xs text-background/40 hover:text-background transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
