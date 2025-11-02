"use client"
import { Eye, EyeOff } from "lucide-react";
import { ChangeEvent, FormEvent, FormEventHandler, useState } from "react"
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function Signup() {
const router = useRouter();
const [formData, setFormData] = useState({
    email: "",
    password: "",
});
const [showPassword, setshowPassword] = useState(false);
const [loading, setloading] = useState(false);
const [errors, seterrors] = useState("");

const Handleformdata = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevdata => ({
        ...prevdata,
        [name]: value,
    }))
    console.log(formData,"Inside handle Form data");
    seterrors("");
}
const Handlerform = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    seterrors("");
    setloading(true);
    console.log(formData,"Inside Function");

    if (!formData.email) {
        seterrors("Invalid email")
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
            callbackUrl:"/chat"
        })
        if (signinResult?.error) {
            seterrors(signinResult.error);
            setloading(false);
            return;
        }
        if (signinResult?.ok) {
            router.push("/chat");
            router.refresh();
        }
    } catch (error: any) {
        seterrors(error.message || "Something went wrong");
        setloading(false);
    }

}

return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900 overflow-hidden ">
        {/* Form Box */}
        <div className="flex  md:w-4/5 items-center  justify-center bg-gray-900 space-y-2.5">
            {/* Main Form */}
            <div className="min-w-sm   flex flex-col justify-center lg:w">
                <form onSubmit={Handlerform}>
                    <div className="text-2xl font-bold items-end">
                        Sign in to your account
                        <p className="text-sm font-light text-blue-500">Dream do come true</p>
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
                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-100"
                            onChange={Handleformdata}
                            disabled={loading}
                            required
                            value={formData.email}
                        />
                    </div>

                    <br />
                    <label
                        className="text-sm font-bold"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <div className="w-full relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-100"
                            onChange={Handleformdata}
                            disabled={loading}
                            value={formData.password}
                            required
                        />
                        <button type="button" onClick={() => setshowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white focus:outline-none">
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
                        <span className="text-blue-500 cursor-pointer hover:underline">
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
                        <span className="mx-2 text-gray-400 text-sm">or Sign in with</span>
                        <div className="grow border-t border-gray-500"></div>
                    </div>
                </form>
            </div>
        </div>

        {/* Image Section */}
        <div className="hidden md:block ">
            <img
                className="w-full h-screen"
                src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
                alt="Background"
            />
        </div>

    </div>
)
}