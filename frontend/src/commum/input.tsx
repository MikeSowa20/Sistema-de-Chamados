import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa6";

interface InputProps {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeHolder?: string;
    type?: string;
    label: string;
    icon?: any;
}

export default function Input({ value, onChange, placeHolder, type, label, icon }: InputProps) {

    const [eye,setEye] = useState(false)

    if (type == "password") {
        return (
            <div className="space-y-1">
                <label htmlFor="input" className="text-sm font-bold text-gray-800">{label}</label>
                <div className="relative flex">
                    <input
                        className="w-full border border-gray-300 bg-white px-3 py-2 pr-10 text-gray-900 focus:border-teal-700 focus:outline-0"
                        id="input"
                        onChange={onChange}
                        value={value}
                        placeholder={placeHolder}
                        type={eye ? 'text' : 'password'}

                    />

                    <span 
                        className="absolute right-3 top-3 text-gray-500 hover:cursor-pointer hover:text-gray-900" 
                        onClick={()=>setEye(!eye)}
                    >
                        {eye ? <FaEye />: <FaEyeSlash />}
                    </span>
                </div>

            </div>
        )
    }
    return (
        <div className="space-y-1">
            <label htmlFor="input" className="text-sm font-bold text-gray-800">{label}</label>
            <div className="relative flex">
                <input
                    className="w-full border border-gray-300 bg-white px-3 py-2 pr-10 text-gray-900 focus:border-teal-700 focus:outline-0"
                    id="input"
                    onChange={onChange}
                    value={value}
                    placeholder={placeHolder}
                    type={type}
                />

                <span className="absolute right-3 top-3 text-gray-500">
                    {icon}
                </span>
            </div>

        </div>
    )
}
