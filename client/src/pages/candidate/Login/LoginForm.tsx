import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch } from "@/store/hooks";
import { loginStart, loginSuccess, loginFailure } from "@/store/authSlice";
import { login } from "../../../api/candidate/auth.api";
import { toUserMessage } from "../../../utils/toUserMessage";
import type { LoginRequest } from "../../../types/candidate/auth";

import Button from "../../../components/candidate/ui/Button";
import Input from "../../../components/candidate/ui/Input";
import PasswordInput from "../../../components/candidate/ui/PasswordInput";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const redirectTarget = (location.state as { from?: { pathname?: string; search?: string; hash?: string } } | null)?.from;
  const destination = redirectTarget?.pathname
    ? `${redirectTarget.pathname}${redirectTarget.search ?? ""}${redirectTarget.hash ?? ""}`
    : "/candidate/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginRequest) => {
    setServerError(null);
    dispatch(loginStart());

    try {
const response = await login({
        email: values.email,
        password: values.password,
      });

      const token = response.token ?? response.accessToken;
      if (!token) {
        throw new Error("Login succeeded but no token was returned.");
      }

      const candidateUser = response.candidate ?? response.user;

      dispatch(
        loginSuccess({
          user: { ...candidateUser, role: "candidate" },
          token,
        })
      );

      navigate(destination, { replace: true });
    } catch (error) {
      const message = toUserMessage(error, "Unable to sign in. Please check your credentials and try again.");

      setServerError(message);
      dispatch(loginFailure(message));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError && (
        <div className="rounded-2xl border border-red-600 bg-red-600 p-4 text-sm text-white">
          {serverError}
        </div>
      )}

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
          <p className="mt-1 text-sm text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <PasswordInput
          placeholder="Enter your password"
          {...register("password", {
            required: "Password is required.",
          })}
        />

        {errors.password && (
          <p className="mt-1 text-sm text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" loading={isSubmitting}>
        Sign In
      </Button>
    </form>
  );
}
