import { useNavigate, useLocation } from "react-router-dom";

import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";

export const ResetPasswordSentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your email";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4 sm:p-6">
      <Card className="w-full max-w-md p-6 sm:p-8 text-center">
        <div className="mb-8">
          <div className="mb-5 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">Check your email</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            We've sent a password reset link to <span className="font-medium text-slate-900">{email}</span>
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            The link will expire in 30 minutes. Please check your inbox and spam folder.
          </p>
        </div>
        <div className="space-y-3">
          <Button className="w-full" onClick={() => navigate("/login")} size="lg">
            Back to sign in
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => navigate("/forgot-password")}
            size="lg"
          >
            Resend email
          </Button>
        </div>
      </Card>
    </main>
  );
};
