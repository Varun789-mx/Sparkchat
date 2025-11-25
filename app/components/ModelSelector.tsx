import { MODELS } from "@/models/constants";
import { useEffect, useState } from "react";

export const ModelSelector = () => {
    const [selectedmodel, setselectedmodel] = useState("");

    const HandleModelSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const modelId = e.target.value;
        setselectedmodel(modelId);
        localStorage.setItem("modelId", modelId);
    };

    useEffect(() => {
        const SavedModel = localStorage.getItem("modelId");
        if (SavedModel) {
            setselectedmodel(SavedModel);
        } else {
            const DefaultModel = "google/gemini-2.5-flash";
            setselectedmodel(DefaultModel);
            localStorage.setItem("modelId", DefaultModel);
        }
    }, [selectedmodel])
    return (
        <select
            value={selectedmodel}
            onChange={HandleModelSelect}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-400  scroll-smooth text-sm font-medium focus:outline-none focus:border-gray-600/50 hover:bg-gray-800/70 transition-all cursor-pointer"
        >
            {MODELS.map((opt) => (
                <option
                    key={opt.id}
                    value={opt.id}
                    className="bg-gray-900 text-gray-500"
                >
                    {opt.name} {opt.isPremium ? "👑" : ""}
                </option>
            ))}
        </select>
    );
};