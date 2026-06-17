import { useEffect, useState } from "react";
import api from "../../../api";

export default function useVerifyAdmin() {
    const [loading, setLoading] = useState(true);
    const [logado, setLogado] = useState(true);
    const [permissao, setPermissao] = useState<string | null>(null);
    const [nome,setNome] =useState<string>();
    const [id,setId] = useState<number>()

    useEffect(() => {
        const verificarAdmin = async () => {
            try {
                const response = await api.get("/auth");
                setPermissao(response.data.permissao);
                setNome(response.data.nome)
                setId(response.data.user_id)
                console.log(response.data.user_id)
            } catch (error) {
                console.error(error);
                setLogado(false);
            } finally {
                setLoading(false);
            }
        };

        verificarAdmin();
    }, []);

    return {
        loading,
        logado,
        permissao,
        nome,
        id,
        isAdmin: permissao === "admin",
    };
}
