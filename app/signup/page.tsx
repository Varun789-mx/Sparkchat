"use client";

import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signUpUser } from "@/app/actions/auth";

export default function SignUpPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleFormData = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setError("");
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setLoading(true);

        try {
            console.log("🚀 Starting signup process...");

            // Call the signUpUser server action from auth.ts
            const result = await signUpUser(formData);

            console.log("📝 Signup result:", result);

            if (!result.success) {
                setError(result.error || "Something went wrong");
                setLoading(false);
                return;
            }

        
            setSuccess(true);
            console.log("✅ User created successfully!");

            
            await new Promise((resolve) => setTimeout(resolve, 1000));

            console.log("🔐 Auto-signing in...");

            
            const signInResult = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (signInResult?.error) {
                setError("Account created but failed to sign in. Please sign in manually.");
                setLoading(false);
                // Redirect to signin page after 2 seconds
                setTimeout(() => {
                    router.push("/signin");
                }, 2000);
                return;
            }

            if (signInResult?.ok) {
                console.log("✅ Auto sign-in successful! Redirecting...");
                router.push("/chat");
                router.refresh();
            }
        } catch (err: any) {
            console.error("❌ Signup error:", err);
            setError(err.message || "Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gray-900 overflow-hidden">
            <div className="flex md:w-3/5 w-full items-center justify-center bg-gray-900">
                {/* Main Form */}
                <div className="w-full max-w-md p-8 flex flex-col justify-center">
                    <form onSubmit={handleSubmit}>
                        <div className="text-2xl font-bold text-white">
                            Create your account
                            <p className="text-sm font-light text-blue-500 mt-1">
                                Dreams do come true
                            </p>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-200">{error}</p>
                            </div>
                        )}

                        {/* Success Alert */}
                        {success && (
                            <div className="mt-4 p-3 bg-green-900/50 border border-green-500 rounded-lg flex items-start gap-2 animate-pulse">
                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-green-200">
                                    Account created successfully! Signing you in...
                                </p>
                            </div>
                        )}

                        <div className="mt-6 space-y-4">
                            {/* name Field */}
                            <div className="w-full">
                                <label
                                    className="text-sm font-bold text-white block mb-2"
                                    htmlFor="name"
                                >
                                    name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-100"
                                    onChange={handleFormData}
                                    disabled={loading || success}
                                    value={formData.name}
                                    placeholder="johndoe"
                                    required
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    At least 3 characters
                                </p>
                            </div>

                            {/* Email Field */}
                            <div className="w-full">
                                <label
                                    className="text-sm font-bold text-white block mb-2"
                                    htmlFor="email"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-100"
                                    onChange={handleFormData}
                                    disabled={loading || success}
                                    value={formData.email}
                                    placeholder="johndoe@example.com"
                                    required
                                />
                            </div>

                            {/* Password Field */}
                            <div className="w-full">
                                <label
                                    className="text-sm font-bold text-white block mb-2"
                                    htmlFor="password"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5 pr-10 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-100"
                                        onChange={handleFormData}
                                        disabled={loading || success}
                                        value={formData.password}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        disabled={loading || success}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    At least 6 characters
                                </p>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="w-full">
                                <label
                                    className="text-sm font-bold text-white block mb-2"
                                    htmlFor="confirmPassword"
                                >
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5 pr-10 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-100"
                                        onChange={handleFormData}
                                        disabled={loading || success}
                                        value={formData.confirmPassword}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                                        aria-label={
                                            showConfirmPassword ? "Hide password" : "Show password"
                                        }
                                        disabled={loading || success}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading || success}
                                className="w-full text-sm disabled:bg-slate-500 disabled:cursor-not-allowed justify-center p-2.5 font-bold rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-800 transition-colors mt-6"
                            >
                                {loading
                                    ? "Creating account..."
                                    : success
                                        ? "Success! Redirecting..."
                                        : "Create Account"}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center my-6">
                            <div className="grow border-t border-gray-600"></div>
                            <span className="mx-2 text-gray-400 text-sm">
                                or sign up with
                            </span>
                            <div className="grow border-t border-gray-600"></div>
                        </div>

                        {/* Sign In Link */}
                        <div className="text-center text-sm text-gray-400">
                            Already have an account?{" "}
                            <a
                                href="/signin"
                                className="text-blue-500 hover:underline font-medium"
                            >
                                Sign in
                            </a>
                        </div>
                    </form>
                </div>
            </div>

            {/* Image Section */}
            <div className="hidden md:block ">
                <img
                    className="w-full h-screen object-cover"
                    src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
                    alt="Background"
                />
            </div>
        </div>
    );
}