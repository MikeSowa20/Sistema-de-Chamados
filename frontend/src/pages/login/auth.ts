import { useNavigate } from "react-router-dom";
import api from "../../api";

export function useAuth() {
    const navigate = useNavigate();

    const verifyAuth = async (redirectAuthenticated = false) => {
        try {
            const response = await api.get("/auth", {
                withCredentials: true
            });

            console.log(response.data);
            if (redirectAuthenticated) {
                navigate("/menu");
            }

            return response.data;

        } catch {
            console.log("Usuário não logado");
            navigate("/login");
            return false;
        }
    };

    return { verifyAuth };
}
