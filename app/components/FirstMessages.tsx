import { Sparkle } from "lucide-react";

export default function FirstMessage() {
    return (
        <div className=" flex p-3 rounded-xl my-auto justify-center items-center  flex-col bg-neutral-800">
            <div className="p-4 m-2 rounded-full bg-emerald-400">
                <Sparkle className="w-7 h-7 text-white" />
            </div>
            <div className="flex justify-center flex-col items-center">
                <p className="font-bold text-gray-200 text-2xl md:4xl">
                    {" "}
                    How can i help you today ?
                </p>
                <p className="text-gray-300 font-sm text-center">
                    Choose various models to get your desired output
                </p>
            </div>
            <div className="w-full flex justify-center gap-5 p-3 ">
                <div className="w-full h-32 p-3 rounded-lg border-orange-500 bg-neutral-800 hover:border-orange-500/40 transition-all text-center  text-lg text-gray-300 ">
                    <p className="text-md font-bold  text-white ">
                        Code generation
                    </p>
                    <p className=" align-middle text-sm font-light text-orange-300">
                        generate code solve bugs and other styling issues
                    </p>
                </div>

                <div className="w-full h-32 p-3 rounded-lg border-orange-500/20 bg-neutral-800 hover:border-orange-500/40 transition-all text-center  text-lg text-gray-300 ">
                    <p className="text-lg font-bold  text-white ">
                        Text summaraization
                    </p>
                    <p className="align-middle font-light text-sm text-orange-300">
                        create summaries and understand better
                    </p>
                </div>

                <div className="w-full h-32 p-3 rounded-lg border-orange-500/20 bg-neutral-800 hover:border-orange-500/40 transition-all text-center  text-lg text-gray-300 ">
                    <p className="text-lg font-bold  text-white ">Chat</p>
                    <p className=" align-middle font-light text-sm text-orange-300">
                        Multiple models for better conversation results
                    </p>
                </div>
            </div>
        </div>
    )
}