import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Mail, Lock, User, AlertCircle, ArrowLeft, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import OTPInput from '@/components/OTPInput';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOTPStep, setShowOTPStep] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const sendOTP = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email },
      });

      if (error) throw error;

      toast({
        title: "Verification code sent!",
        description: `We've sent a 6-digit code to ${email}. Please check your email.`,
      });

      // For demo purposes - show the OTP in console
      if (data.debug_otp) {
        console.log('Demo OTP:', data.debug_otp);
        toast({
          title: "Demo Mode",
          description: `For testing: Your OTP is ${data.debug_otp}`,
          variant: "default",
        });
      }

      setShowOTPStep(true);
    } catch (error: any) {
      console.error('Send OTP error:', error);
      toast({
        title: "Failed to send verification code",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTPAndCreateAccount = async (otpCode: string) => {
    setOtpLoading(true);
    setOtpError('');
    
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { 
          email, 
          otp: otpCode, 
          password, 
          fullName 
        },
      });

      if (error) throw error;

      toast({
        title: "Account created successfully!",
        description: "You can now sign in with your new account.",
      });

      // Reset form and switch to login
      setShowOTPStep(false);
      setIsLogin(true);
      setEmail('');
      setPassword('');
      setFullName('');
      
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      setOtpError(error.message || 'Verification failed. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && !showOTPStep) {
      // Sign up flow - send OTP first
      await sendOTP();
      return;
    }

    // Login flow
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate('/');
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || "An error occurred during authentication.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Google auth error:', error);
      toast({
        title: "Google Authentication Error",
        description: error.message || "An error occurred with Google authentication.",
        variant: "destructive",
      });
    }
  };

  const goBackToForm = () => {
    setShowOTPStep(false);
    setOtpError('');
  };

  if (showOTPStep && !isLogin) {
    return (
      <PageLayout>
        <SEO 
          title="Verify Email - ChefsCircle"
          description="Enter the verification code sent to your email to complete your ChefsCircle account setup."
        />
        
        <div className="min-h-screen bg-background pt-24 flex items-center justify-center py-12 px-4">
          <motion.div
            className="max-w-md w-full space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-elevated"
                  style={{ background: 'var(--gradient-charcoal)' }}
                >
                  <Mail className="w-7 h-7 text-background" />
                </div>
              </div>
              <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-foreground tracking-tight">
                Check your email
              </h2>
              <p className="text-muted-foreground mt-3 font-light">
                We've sent a 6-digit verification code to
              </p>
              <p className="font-medium text-foreground mt-1">{email}</p>
            </div>

            <div className="premium-card p-8">
              <OTPInput
                onComplete={verifyOTPAndCreateAccount}
                loading={otpLoading}
                error={otpError}
              />

              <div className="mt-6 space-y-3">
                <button
                  onClick={goBackToForm}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-xl text-foreground hover:bg-secondary transition-colors text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign Up
                </button>

                <button
                  onClick={sendOTP}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-accent text-sm transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Resend Code
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEO 
        title={`${isLogin ? 'Sign In' : 'Sign Up'} - ChefsCircle`}
        description={`${isLogin ? 'Sign in to your' : 'Create a'} ChefsCircle account to share recipes and join culinary clubs.`}
      />
      
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center py-12 px-4">
        <motion.div
          className="max-w-md w-full space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-elevated"
                style={{ background: 'var(--gradient-charcoal)' }}
              >
                <ChefHat className="w-7 h-7 text-background" />
              </div>
            </div>
            <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-foreground tracking-tight">
              {isLogin ? 'Welcome back' : (
                <>Join <span className="text-gold-gradient">ChefsCircle</span></>
              )}
            </h2>
            <p className="text-muted-foreground mt-3 font-light">
              {isLogin 
                ? 'Sign in to continue your culinary journey'
                : 'Create your account to share recipes and join clubs'}
            </p>
          </div>

          <div className="premium-card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label htmlFor="fullName" className="block text-xs font-medium text-foreground/70 mb-2 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                      placeholder="Enter your full name"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-foreground/70 mb-2 uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-foreground/70 mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-glow w-full py-3.5 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-all shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Send Verification Code')}
              </button>
            </form>

            <div className="mt-7">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider">
                  <span className="px-3 bg-card text-muted-foreground">Or</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="mt-5 w-full flex justify-center items-center px-4 py-3 border border-border rounded-xl text-foreground hover:bg-secondary transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                {isLogin 
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl p-4 bg-secondary/40 border border-border">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground leading-relaxed">
                <p className="font-medium text-foreground mb-1">Authentication required</p>
                <p>Sign in to share recipes, join clubs, and access all ChefsCircle features.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Auth;
