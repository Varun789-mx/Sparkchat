"use client"
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react"

export default function Signup() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmpassword: "",
    });
    const [showPassword, setshowPassword] = useState(false);
    const [loading, setloading] = useState(false);
    
    const Handlerform = (e: any) => {
        const { name, value } = e.target;
        setFormData(prevdata => ({
            ...prevdata,
            [name]: value,
        }))
    }

    return (
        <div className="w-full h-screen flex">
            {/* Form Box */}
            <div className="flex w-3/5 items-center justify-center bg-gray-900 space-y-2.5">
                {/* Main Form */}
                <div className="min-w-sm flex flex-col justify-center">
                    <div className="text-2xl font-bold items-end">
                        Sign in to your account
                        <p className="text-sm font-light text-blue-500">Dream do come true</p>
                    </div>

                    <br />

                    <div className="w-full">
                        <label 
                            className="text-sm font-bold focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-blue-500" 
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input 
                            type="text" 
                            id="email" 
                            name="email" 
                            className="bg-gray-700  border-0 text-white text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-0" 
                            onChange={Handlerform} 
                            value={formData.email} 
                        />
                    </div>

                    <br />

                    <div className="w-full">
                        <label 
                            className="text-sm font-bold" 
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input 
                            type="text" 
                            id="password" 
                            name="password" 
                            className="bg-gray-700  border-0 text-white text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-0" 
                            onChange={Handlerform} 
                            value={formData.password} 
                        />
                        <button type="button" onClick={()=>setshowPassword(!showPassword)} className="ocus:outline-none dark:text-gray-300 px-2">
                        {showPassword?<Eye/>:<EyeOff/>}
                        </button> 
                    </div>

                    <br />

                    <div className="flex justify-between p-2">
                        <div className="flex items-center text-sm gap-2 text-gray-200">
                            <input 
                                value={formData.password} 
                                id="password" 
                                name="password" 
                                type="checkbox" 
                                className="accent-blue-500" 
                            />
                            <span>Remember me</span>
                        </div>
                        <span className="text-blue-500 cursor-pointer hover:underline">
                            Forget Password
                        </span>
                    </div>

                    <div className="flex text-sm justify-center p-2 font-bold rounded-lg bg-blue-500 hover:bg-blue-600 focus-within:bg-blue-600">
                        <button 
                            type="button" 
                            className="hover:bg-blue-600 focus-within:bg-blue-600"
                        >
                            Sign in
                        </button>
                    </div>
                </div>
            </div>

            {/* Image Section */}
            <div className="h-screen">
                <img 
                    className="w-full h-screen" 
                    src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80" 
                    alt="Background"
                />
            </div>
        </div>
    )
}