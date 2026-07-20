import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { forgotPassword, verifyResetOtp, resetPassword, resendOtp } from "../../../api/candidate/auth.api";
import Button from "../../../components/candidate/ui/Button";
import Input from "../../../components/candidate/ui/Input";
import PasswordInput from "../../../components/candidate/ui/PasswordInput";

type Step = "email" | "otp" | "newPassword";

interface ForgotPasswordForm {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const handleEmailSubmit = async (values: ForgotPasswordForm) => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await forgotPassword(values.email);
      setEmail(values.email);
      setSuccess("OTP sent to your email. Please check your inbox.");
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (values: ForgotPasswordForm) => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await verifyResetOtp(email, values.otp);
      setSuccess("OTP verified. Please set your new password.");
      setStep("newPassword");
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (values: ForgotPasswordForm) => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await resetPassword(email, values.newPassword);
      setSuccess("Password reset successfully. Redirecting to login...");
      setTimeout(() => {
        navigate("/candidate/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;

    setError(null);
    setLoading(true);

    try {
      await resendOtp(email, "PASSWORD_RESET");
      setSuccess("New OTP sent to your email.");
      setCooldown(60);
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError("Please wait before requesting another OTP.");
        setCooldown(60);
        const timer = setInterval(() => {
          setCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(err.message || "Failed to resend OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/95 p-10 shadow-2xl shadow-slate-950/40 sm:p-12">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
      <div className="relative z-10 space-y-10">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.32em] text-blue-400">
            {step === "email" ? "Forgot Password" : step === "otp" ? "Verify OTP" : "Reset Password"}
          </p>
          <h1 className="text-4xl font-bold text-white">
            {step === "email" ? "Reset your password" : step === "otp" ? "Enter verification code" : "Set new password"}
          </h1>
          <p className="max-w-xl text-slate-400">
            {step === "email" 
              ? "Enter your email address and we'll send you a verification code to reset your password."
              : step === "otp"
              ? `Enter the 6-digit code sent to ${email}`
              : "Create a strong password for your account."
            }
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-200">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit(step === "email" ? handleEmailSubmit : step === "otp" ? handleOtpSubmit : handlePasswordSubmit)} className="space-y-5">
          {step === "email" && (
            <div>
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                className="bg-slate-950"
                {...register("email", {
                  required: "Email is required.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-rose-400">{errors.email.message}</p>
              )}
            </div>
          )}

          {step === "otp" && (
            <div>
              <Input
                label="Verification Code"
                type="text"
                placeholder="Enter 6-digit code"
                className="bg-slate-950"
                maxLength={6}
                {...register("otp", {
                  required: "OTP is required.",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "Please enter a valid 6-digit code",
                  },
                })}
              />
              {errors.otp && (
                <p className="mt-1 text-sm text-rose-400">{errors.otp.message}</p>
              )}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={cooldown > 0 || loading}
                className="mt-2 text-sm text-blue-400 hover:text-blue-300 disabled:text-slate-500"
              >
                {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
              </button>
            </div>
          )}

          {step === "newPassword" && (
            <>
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-300">New Password</label>
                <PasswordInput
                  placeholder="Enter new password"
                  {...register("newPassword", {
                    required: "New password is required.",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-rose-400">{errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-300">Confirm Password</label>
                <PasswordInput
                  placeholder="Confirm new password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password.",
                    validate: (value) => value === newPassword || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-rose-400">{errors.confirmPassword.message}</p>
                )}
              </div>
            </>
          )}

          <Button type="submit" loading={loading}>
            {step === "email" ? "Send OTP" : step === "otp" ? "Verify OTP" : "Reset Password"}
          </Button>
        </form>

        <p className="text-center text-slate-400">
          Remember your password?{" "}
          <button
            onClick={() => navigate("/candidate/login")}
            className="text-blue-400 hover:text-blue-300"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
