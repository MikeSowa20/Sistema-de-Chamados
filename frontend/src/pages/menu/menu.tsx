import { Outlet } from "react-router-dom";

import NavBar from "./componentes/navbar";

export default function Menu(){

    return(
        <div className="flex h-screen w-screen items-center justify-center bg-[#eef2f5] p-4">
            <div className="flex h-[92vh] w-full max-w-7xl flex-col overflow-hidden border border-gray-200 bg-white shadow-xl">
                <NavBar/>
                <div className="flex-1 overflow-y-auto bg-[#f6f8fa] p-4 md:p-6">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}
