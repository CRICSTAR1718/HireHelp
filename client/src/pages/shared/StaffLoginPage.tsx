import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, ShieldCheck, Eye, EyeOff, FileText, Users, BarChart3, Brain, Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { z } from "zod";

import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Spinner } from "@/components/admin/ui/spinner";
import { useAuth } from "@/hooks/shared/useAuth";
import { getErrorMessage } from "@/utils/admin/http-error";
import { FeatureCard, SecurityCard } from "@/components/shared";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const StaffLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [bgImageLoaded, setBgImageLoaded] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Lazy load background image
  useEffect(() => {
    const img = new Image();
    img.src = '/images/login-bg.png';
    img.onload = () => setBgImageLoaded(true);
  }, []);

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    try {
      await login(values);
    } catch (error) {
      setError("root", { message: getErrorMessage(error, "Unable to sign in. Please try again.") });
    }
  };

  const features = [
    { icon: Brain, title: 'AI Resume Screening', description: 'Smart candidate filtering' },
    { icon: Users, title: 'Interview Management', description: 'Streamlined scheduling' },
    { icon: Building2, title: 'Talent Pool', description: 'Build your pipeline' },
    { icon: BarChart3, title: 'Hiring Analytics', description: 'Data-driven decisions' },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex w-full max-w-[1920px] mx-auto">
        {/* Left Panel - Information */}
        <div className="hidden lg:flex lg:w-[35%] xl:w-[35%] 2xl:w-[30%] flex-col bg-gradient-to-br from-white via-blue-50/30 to-white p-6 xl:p-8 2xl:p-12">
          {/* Logo */}
          <div className="mb-6 lg:mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/20">
              <ShieldCheck className="h-7 w-7" aria-hidden="true" />
            </div>
            <p className="mt-4 text-sm font-semibold text-blue-600">HireHelp</p>
          </div>

          {/* Heading */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-tight">
              Your Hiring,<br />
              <span className="text-blue-600">Handled.</span>
            </h1>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              An AI-powered recruitment platform that streamlines every step of your hiring process.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="mb-6 lg:mb-8 space-y-2">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          {/* Security Card */}
          <div className="mb-auto">
            <SecurityCard />
          </div>

          {/* Footer */}
          <div className="mt-6 lg:mt-8 flex flex-wrap gap-4 text-xs text-slate-500">
            <button className="hover:text-blue-600 transition-colors">Privacy Policy</button>
            <span>•</span>
            <button className="hover:text-blue-600 transition-colors">Terms of Service</button>
            <span>•</span>
            <button className="hover:text-blue-600 transition-colors">Support</button>
          </div>
        </div>

      {/* Right Panel - Login */}
      <div className="flex-1 relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
        {/* Background Image with Blur */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/images/login-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(3px)',
            transform: 'scale(1.03)',
          }}
          aria-hidden="true"
        />
        
        {/* Subtle Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(rgba(20,35,80,0.18), rgba(20,35,80,0.12))',
          }}
          aria-hidden="true"
        />

        {/* Login Card */}
        <div className="relative w-full max-w-md mx-auto z-10">
          <Card className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/20 border border-white/20 p-6 sm:p-8 md:p-10 w-full">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30">
                <ShieldCheck className="h-8 w-8" aria-hidden="true" />
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
              <p className="mt-2 text-sm text-slate-600">Access your recruitment workspace.</p>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    type="email"
                    className="w-full"
                    {...register("email")}
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="block min-h-5 text-xs text-red-600" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    className="w-full pr-10"
                    {...register("password")}
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="block min-h-5 text-xs text-red-600" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Error Message */}
              {errors.root?.message && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
                  {errors.root.message}
                </p>
              )}

              {/* Submit Button */}
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/30"
                disabled={isSubmitting}
                size="lg"
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign in
                  </>
                )}
              </Button>
            </form>

            {/* Help Text */}
            <p className="mt-6 text-center text-xs text-slate-500">
              Use your recruiter, interviewer, or admin credentials to continue.
            </p>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
};