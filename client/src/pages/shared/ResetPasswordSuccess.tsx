import { useNavigate } from "react-router-dom";

import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";

export const ResetPasswordSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4 sm:p-6">
      <Card className="w-full max-w-md p-6 sm:p-8 text-center">
        <div className="mb-8">
          <div className="mb-5 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">Password reset successful</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your password has been successfully reset. Please sign in with your new password.
          </p>
        </div>
        <Button className="w-full" onClick={() => navigate("/login")} size="lg">
          Sign in
        </Button>
      </Card>
    </main>
  );
};
