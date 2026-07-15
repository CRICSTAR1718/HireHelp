import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Spinner } from "@/components/admin/ui/spinner";
import { useAuth } from "@/hooks/shared/useAuth";
import { getErrorMessage } from "@/utils/admin/http-error";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const StaffLoginPage = () => {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    try {
      await login(values);
    } catch (error) {
      setError("root", { message: getErrorMessage(error, "Unable to sign in. Please try again.") });
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4 sm:p-6">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="mb-8">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white"><ShieldCheck className="h-6 w-6" /></div>
          <p className="text-sm font-medium text-blue-600">HireHelp</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Sign in to HireHelp</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Use your recruiter, interviewer, or admin credentials to continue.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Email address</span><Input autoComplete="email" placeholder="you@company.com" type="email" {...register("email")} /><span className="block min-h-5 text-xs text-red-600">{errors.email?.message}</span></label>
          <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Password</span><Input autoComplete="current-password" placeholder="Enter your password" type="password" {...register("password")} /><span className="block min-h-5 text-xs text-red-600">{errors.password?.message}</span></label>
          {errors.root?.message && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{errors.root.message}</p>}
          <Button className="w-full" disabled={isSubmitting} size="lg" type="submit">
            {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Signing in</> : <><LogIn className="mr-2 h-4 w-4" />Sign in</>}
          </Button>
        </form>
      </Card>
    </main>
  );
};