import { useNavigate } from "react-router-dom";
import api from "../../api";

export function useAuth() {
    const navigate = useNavigate();

    const verifyAuth = async () => {
        try {
            const response = await api.get("/auth", {
                withCredentials: true
            });

            console.log(response.data);
            navigate("/menu");
            return true;

        } catch {
            console.log("Usuário não logado");
            navigate("/login");
            return false;
        }
    };

    return { verifyAuth };
}