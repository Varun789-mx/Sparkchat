"use client"
import { useEffect, useState } from "react"

const useTheme = () => {
    const [theme, settheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "system");

    const element = document.documentElement;
    const darkquery = window.matchMedia("(prefers-color-scheme: dark)");

    const OnWindowMatch = () => {
        if (localStorage.theme === 'dark' || (!("theme" in localStorage) && darkquery.matches)) {
            element.classList.add("dark");

        } else {
            element.classList.remove("dark");
        }
    }
    useEffect(() => {
        OnWindowMatch()
    }, [])

    useEffect(() => {
        switch (theme) {
            case 'dark':
                element.classList.add('dark');
                localStorage.setItem("theme", 'dark');
                break;
            case 'light':
                element.classList.remove('dark');
                localStorage.setItem("theme", 'light');
                break;
            default:
                localStorage.removeItem("theme");
                OnWindowMatch();
                break;
        }
    }, [theme])

    useEffect(() => {
        const changeHandler = (e:any) => {
            if (!("theme" in localStorage)) {
                if (e.matches) {
                    element.classList.remove("dark");
                }
            }
            darkquery.addEventListener("change", changeHandler);

            return ()=> {
                darkquery.removeEventListener("change", changeHandler);
            };
        }
    }, [])
    return [theme, settheme];
}
export default useTheme;