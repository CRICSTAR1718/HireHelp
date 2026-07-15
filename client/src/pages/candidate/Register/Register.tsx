import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useAppDispatch } from "@/store/hooks";
import { loginStart, loginSuccess, loginFailure } from "@/store/authSlice";
import { register } from "../../../api/candidate/auth.api";
import type { RegisterRequest } from "../../../types/candidate/auth";

import Card from "../../../components/candidate/ui/Card";
import Button from "../../../components/candidate/ui/Button";
import Input from "../../../components/candidate/ui/Input";
import PasswordInput from "../../../components/candidate/ui/PasswordInput";

type RegisterFormValues = RegisterRequest & {
    confirmPassword: string;
};

export default function Register() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register: registerField,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            phone: "",
            confirmPassword: "",
        },
    });

    const password = watch("password");

    async function onSubmit(values: RegisterFormValues) {
        setServerError(null);
        dispatch(loginStart());

        try {
            const { confirmPassword, ...payload } = values;

            const response = await register(payload);
            const token = response.token ?? response.accessToken;
            const candidateUser = response.candidate ?? response.user;

            dispatch(
                loginSuccess({
                    user: { ...candidateUser, role: "candidate" },
                    token: token ?? "",
                }),
            );

            navigate("/candidate/dashboard");
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Registration failed. Please try again.";

            setServerError(message);
            dispatch(loginFailure(message));
        }
    }

    return (
        <Card>
            <h1 className="mb-2 text-3xl font-bold">Create Account</h1>

            <p className="mb-8 text-gray-500">Join HireHelp today.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {serverError && (
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                        {serverError}
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <Input
                            label="First Name"
                            placeholder="Enter your first name"
                            {...registerField("firstName", {
                                required: "First name is required.",
                            })}
                        />
                        {errors.firstName && (
                            <p className="mt-1 text-sm text-rose-400">
                                {errors.firstName.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Input
                            label="Last Name"
                            placeholder="Enter your last name"
                            {...registerField("lastName", {
                                required: "Last name is required.",
                            })}
                        />
                        {errors.lastName && (
                            <p className="mt-1 text-sm text-rose-400">
                                {errors.lastName.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <Input
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        {...registerField("email", {
                            required: "Email is required.",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email address.",
                            },
                        })}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-rose-400">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <Input
                        label="Phone (Optional)"
                        placeholder="Enter your phone number"
                        {...registerField("phone")}
                    />
                </div>

                <div>
                    <PasswordInput
                        placeholder="Create a password"
                        {...registerField("password", {
                            required: "Password is required.",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters.",
                            },
                        })}
                    />

                    <div className="-mt-4 mb-1 text-sm text-slate-300">Password</div>

                    {errors.password && (
                        <p className="mt-1 text-sm text-rose-400">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <div>
                    <PasswordInput
                        placeholder="Confirm your password"
                        {...registerField("confirmPassword", {
                            required: "Please confirm your password.",
                            validate: (value) =>
                                value === password || "Passwords do not match.",
                        })}
                    />

                    <div className="-mt-4 mb-1 text-sm text-slate-300">
                        Confirm Password
                    </div>

                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-rose-400">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                <Button type="submit" loading={isSubmitting}>
                    Register
                </Button>
            </form>

            <p className="mt-6 text-center">
                Already have an account?{" "}
                <Link to="/candidate" className="font-semibold text-blue-600">
                    Login
                </Link>
            </p>
        </Card>
    );
}