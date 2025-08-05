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
        
        <div className="min-h-screen bg-chef-warm-ivory pt-20 flex items-center justify-center py-12 px-4">
          <motion.div
            className="max-w-md w-full space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-chef-royal-blue rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-chef-warm-ivory" />
                </div>
              </div>
              <h2 className="chef-heading-xl text-chef-charcoal">
                Check Your Email
              </h2>
              <p className="chef-body text-chef-charcoal/70 mt-2">
                We've sent a 6-digit verification code to
              </p>
              <p className="font-semibold text-chef-royal-blue">{email}</p>
            </div>

            <div className="chef-card p-8">
              <OTPInput
                onComplete={verifyOTPAndCreateAccount}
                loading={otpLoading}
                error={otpError}
              />

              <div className="mt-6 space-y-4">
                <button
                  onClick={goBackToForm}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-chef-royal-blue/20 rounded-xl text-chef-charcoal hover:bg-chef-royal-blue/5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign Up
                </button>

                <button
                  onClick={sendOTP}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 text-chef-royal-blue hover:text-chef-royal-blue/80 text-sm"
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
      
      <div className="min-h-screen bg-chef-warm-ivory pt-20 flex items-center justify-center py-12 px-4">
        <motion.div
          className="max-w-md w-full space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-chef-royal-blue rounded-full flex items-center justify-center">
                <ChefHat className="w-8 h-8 text-chef-warm-ivory" />
              </div>
            </div>
            <h2 className="chef-heading-xl text-chef-charcoal">
              {isLogin ? 'Welcome Back' : 'Join ChefsCircle'}
            </h2>
            <p className="chef-body text-chef-charcoal/70 mt-2">
              {isLogin 
                ? 'Sign in to your account to continue your culinary journey'
                : 'Create your account to start sharing recipes and joining clubs'
              }
            </p>
          </div>

          <div className="chef-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-chef-charcoal mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chef-charcoal/40 w-5 h-5" />
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-chef-royal-blue/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-chef-royal-blue"
                      placeholder="Enter your full name"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-chef-charcoal mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chef-charcoal/40 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-chef-royal-blue/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-chef-royal-blue"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-chef-charcoal mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chef-charcoal/40 w-5 h-5" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-chef-royal-blue/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-chef-royal-blue"
                    placeholder="Enter your password"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full chef-button-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Send Verification Code')}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-chef-royal-blue/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-chef-warm-ivory text-chef-charcoal/60">Or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="mt-4 w-full flex justify-center items-center px-4 py-3 border border-chef-royal-blue/20 rounded-xl text-chef-charcoal hover:bg-chef-royal-blue/5 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
                className="text-chef-royal-blue hover:text-chef-royal-blue/80 text-sm font-medium"
              >
                {isLogin 
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </div>

          <div className="chef-card p-4 bg-chef-royal-blue/5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-chef-royal-blue flex-shrink-0 mt-0.5" />
              <div className="text-sm text-chef-charcoal/70">
                <p className="font-medium text-chef-charcoal mb-1">Authentication Required</p>
                <p>You need to sign in to share recipes, join clubs, and access all ChefsCircle features.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Auth;
