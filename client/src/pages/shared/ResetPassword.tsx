import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Spinner } from "@/components/admin/ui/spinner";
import { staffResetPassword } from "@/api/shared/auth";
import { getErrorMessage } from "@/utils/admin/http-error";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ResetPasswordFormValues): Promise<void> => {
    if (!token) {
      setError("root", { message: "Invalid or missing reset token. Please request a new reset link." });
      return;
    }

    try {
      await staffResetPassword(token, values.newPassword);
      navigate("/reset-password/success");
    } catch (error) {
      setError("root", {
        message: getErrorMessage(error, "Reset link is invalid or has expired. Please request a new one."),
      });
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4 sm:p-6">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="mb-8">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.974a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-blue-600">HireHelp</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Reset your password</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Enter your new password below to complete the reset process.
          </p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">New password</span>
            <Input autoComplete="new-password" placeholder="Enter new password" type="password" {...register("newPassword")} />
            <span className="block min-h-5 text-xs text-red-600">{errors.newPassword?.message}</span>
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Confirm password</span>
            <Input autoComplete="new-password" placeholder="Confirm new password" type="password" {...register("confirmPassword")} />
            <span className="block min-h-5 text-xs text-red-600">{errors.confirmPassword?.message}</span>
          </label>
          {errors.root?.message && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
              {errors.root.message}
            </p>
          )}
          <Button className="w-full" disabled={isSubmitting} size="lg" type="submit">
            {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Resetting password</> : "Reset password"}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Request a new reset link
          </button>
        </div>
      </Card>
    </main>
  );
};
