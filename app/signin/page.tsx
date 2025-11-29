"use client";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import GoogleBtn from "../components/GoogleBtn";
import { signIn } from "next-auth/react";
import GitHubButton from "../components/Githubbtn";
import toast, { Toaster } from "react-hot-toast";

export default function Signup() {
  const router = useRouter();
  const [success, setsuccess] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setshowPassword] = useState(false);
  const [loading, setloading] = useState(false);
  const [errors, seterrors] = useState("");

  const Handleformdata = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevdata) => ({
      ...prevdata,
      [name]: value,
    }));
    seterrors("");
  };
  const Handlerform = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    seterrors("");
    setloading(true);
   
    if (!formData.email) {
      seterrors("Invalid email");
      setloading(false);
      return;
    }
    if (!formData.password) {
      seterrors("Incorrect password");
      setloading(false);
      return;
    }
    try {
      const signinResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl: "/chat",
      });
      if (signinResult?.error) {
        seterrors(signinResult.error);
        toast.error(errors);
        setloading(false);
        setsuccess(false);
        return;
      }
      if (signinResult?.status == 401) {
        setsuccess(false);
      }
      if (signinResult?.ok) {
        router.push("/chat");
        router.refresh();
      }
    } catch (error: any) {
      seterrors(error.message || "Something went wrong");
      setloading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900 overflow-hidden ">
        <div><Toaster/></div>
      {/* Form Box */}

      {/* Main Form */}
      <div className="flex  md:w-3/5 items-center  justify-center bg-gray-900 space-y-2.5">
        <div className="min-w-sm   flex flex-col justify-center lg:w-fit">
          <div className="w-full justify-center align-top">
            {" "}
            {loading && (
              <div className="mt-4 p-3 bg-green-900/50 border border-green-500 rounded-lg flex items-start gap-2 animate-pulse">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <p className="text-sm text-green-200">Signing you in...</p>
              </div>
            )}
          </div>
          <form onSubmit={Handlerform}>
            <div className="text-2xl font-bold items-end">
              Sign in to your account
              <p className="text-sm font-light text-blue-500">
                Dream do come true
              </p>
            </div>
            <br />

            <div className="w-full">
              <label
                className="text-sm font-bold focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-blue-900"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="johndoe@example.com"
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-100"
                onChange={Handleformdata}
                disabled={loading}
                required
                value={formData.email}
              />
            </div>

            <br />
            <label className="text-sm font-bold" htmlFor="password">
              Password
            </label>
            <div className="w-full relative">
              <input
                type={showPassword ? "password" : "text"}
                id="password"
                name="password"
                placeholder="••••••••"
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-100"
                onChange={Handleformdata}
                disabled={loading}
                value={formData.password}
                required
              />
              <button
                type="button"
                onClick={() => setshowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white focus:outline-none"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <br />

            <div className="flex justify-between p-2 ">
              <div className="flex items-center text-sm gap-2 text-gray-200">
                <input
                  id="checkbox"
                  type="checkbox"
                  className="accent-blue-500"
                />
                <span>Remember me</span>
              </div>
              <span className="text-blue-500 text-sm cursor-pointer hover:underline">
                Forget Password
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className=" flex text-sm w-full   disabled:bg-slate-500 justify-center p-2 font-bold rounded-lg bg-blue-600 focus-within:ring-blue-800"
            >
              Sign in
            </button>
            <div className="flex items-center my-6">
              <div className="grow border-t border-blue-600"></div>
              <span className="mx-2 text-gray-400 text-sm">
                or Sign in with
              </span>
              <div className="grow border-t border-gray-500"></div>
            </div>
            <div className="flex justify-evenly p-2 gap-4 ">
              {" "}
              <GoogleBtn />
              <GitHubButton />
            </div>

            <div className="text-center mt-4 text-sm text-gray-400">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-blue-500 hover:underline font-medium"
              >
                Sign up
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
