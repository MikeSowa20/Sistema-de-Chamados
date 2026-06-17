import { FaChartBar, FaHeadset, FaSignOutAlt, FaTicketAlt, FaUserAlt, FaUsersCog } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import api from "../../../api";
import useVerifyAdmin from "../hook/verify_admin";

export default function NavBar(){
    const navigate = useNavigate();
    const { isAdmin } = useVerifyAdmin();

    const handleLogout = async () => {
        try {
            await api.post("/logout");
        } catch (error) {
            console.error(error);
        } finally {
            navigate("/login");
        }
    }

    return(
        <header className="border-b border-gray-200 bg-white">
            <nav className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                <Link to="/menu/chamados" className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center bg-teal-700 text-white">
                        <FaHeadset />
                    </div>
                    <div>
                        <p className="text-base font-bold text-gray-950">Central de Chamados</p>
                        <p className="text-xs text-gray-500">Atendimento e suporte</p>
                    </div>
                </Link>

                <div className="flex flex-wrap items-center gap-2">
                    <NavLink
                        to="/menu/chamados"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 text-sm font-bold transition-colors ${isActive ? "bg-teal-50 text-teal-800" : "text-gray-600 hover:bg-gray-100 hover:text-gray-950"}`
                        }
                    >
                        <FaTicketAlt />
                        Chamados
                    </NavLink>

                    {isAdmin && (
                        <NavLink
                            to="/menu/dashboard"
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-3 py-2 text-sm font-bold transition-colors ${isActive ? "bg-teal-50 text-teal-800" : "text-gray-600 hover:bg-gray-100 hover:text-gray-950"}`
                            }
                        >
                            <FaChartBar />
                            Dashboard
                        </NavLink>
                    )}

                    {isAdmin && (
                        <NavLink
                            to="/menu/usuarios"
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-3 py-2 text-sm font-bold transition-colors ${isActive ? "bg-teal-50 text-teal-800" : "text-gray-600 hover:bg-gray-100 hover:text-gray-950"}`
                            }
                        >
                            <FaUsersCog />
                            Usuários
                        </NavLink>
                    )}
                </div>

                <div className="flex items-center justify-between gap-3 md:justify-end">
                    <div className="flex h-9 w-9 items-center justify-center border border-gray-200 bg-gray-50 text-gray-700">
                        <FaUserAlt />
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex cursor-pointer items-center gap-2 bg-gray-950 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-teal-800"
                    >
                        <FaSignOutAlt />
                        Logout
                    </button>
                </div>
            </nav>
        </header>
    )
}
