import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Spinner } from "@/components/admin/ui/spinner";
import { staffForgotPassword } from "@/api/shared/auth";
import { getErrorMessage } from "@/utils/admin/http-error";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordFormValues): Promise<void> => {
    try {
      await staffForgotPassword(values.email);
      navigate("/reset-password/sent", { state: { email: values.email } });
    } catch (error) {
      setError("root", { message: getErrorMessage(error, "Unable to send reset link. Please try again.") });
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4 sm:p-6">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="mb-8">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-blue-600">HireHelp</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Forgot your password?</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Email address</span>
            <Input autoComplete="email" placeholder="you@company.com" type="email" {...register("email")} />
            <span className="block min-h-5 text-xs text-red-600">{errors.email?.message}</span>
          </label>
          {errors.root?.message && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
              {errors.root.message}
            </p>
          )}
          <Button className="w-full" disabled={isSubmitting} size="lg" type="submit">
            {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Sending link</> : "Send reset link"}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Back to sign in
          </button>
        </div>
      </Card>
    </main>
  );
};
