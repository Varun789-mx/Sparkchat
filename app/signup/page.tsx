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
    const Handlerform = () => {
    }

    return (
        // background
        <div className="w-full h-screen  flex  ">
            {/* formbox */}
            <div className="flex w-3/5 items-center justify-center bg-gray-900 ">
                {/* Main form */}
                <div className="text-2xl min-w-sm flex flex-col  justify-center ">
                    <div className="text-2xl font-bold items-end   ">
                        Sign in to your account
                        <p className="text-sm font-light text-blue-500 ">Dream do come true</p>
                    </div>
                    <br />
                    <div className="w-full">
                        <label className="text-sm font-bold " htmlFor="email">Email</label>
                        <input type="text" className="bg-gray-50 border-0 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-0" onChange={Handlerform} value={formData.username} />
                    </div>
                  <br/>
                    <div className="w-full">
                        <label className="text-sm font-bold " htmlFor="email">Password</label>
                        <input type="text" className="bg-gray-50 border-0 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-0" onChange={Handlerform} value={formData.username} />
                    </div>
                    <br/>
                    <div className="flex text-sm justify-center p-2 font-bold bg-blue-500 w- rounded-lg hover:bg-blue-600">
                        <button type="button">
                           Sign in
                        </button>
                    </div>
                </div>
            </div>
            <div className="h-screen">
                <img className="w-full h-screen" src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80" />  </div>
        </div>
    )
}
