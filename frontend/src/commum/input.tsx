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
            <div>
                <label htmlFor="input" className="text-gray-900">{label}:</label>
                <div className="flex relative">
                    <input
                        className="w-full border-b border-gray-400 focus:outline-0 pt-1"
                        id="input"
                        onChange={onChange}
                        value={value}
                        placeholder={placeHolder}
                        type={eye ? 'text' : 'password'}

                    />

                    <span 
                        className="absolute top-2 right-0 text-gray-500 text-md, hover:cursor-pointer" 
                        onClick={()=>setEye(!eye)}
                    >
                        {eye ? <FaEye />: <FaEyeSlash />}
                    </span>
                </div>

            </div>
        )
    }
    return (
        <div>
            <label htmlFor="input" className="text-gray-900">{label}:</label>
            <div className="flex relative">
                <input
                    className="w-full border-b border-gray-400 focus:outline-0 pt-1"
                    id="input"
                    onChange={onChange}
                    value={value}
                    placeholder={placeHolder}
                    type={type}
                />

                <span className="absolute top-2 right-0 text-gray-500 text-md">
                    {icon}
                </span>
            </div>

        </div>
    )
}