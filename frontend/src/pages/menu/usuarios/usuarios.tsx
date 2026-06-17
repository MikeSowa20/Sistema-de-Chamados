import api from "../../../api"
import { useEffect, useState } from "react"
import axios from "axios";
import Mensagem from "../../../commum/mensagem";
import Loading from "../../../commum/loading";

interface Usuario {
    id: number;
    nome: string;
    email: string;
    permissao: string;
}

export default function Usuarios() {

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [mensagem, setMensagem] = useState("");
    const [type, setType] = useState<"success" | "error" | null>(null);

    useEffect(() => {
        const carregarUsuario = async () => {
            setLoading(true)
            try {
                const response = await api.get("/menu/usuarios");
                if (Array.isArray(response.data)) {
                    setUsuarios(response.data)
                } else {
                    setType(response.data.type)
                    setMensagem(response.data.mensagem)
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const data = error.response?.data;
                    setType(data?.type ?? "error")
                    setMensagem(data?.mensagem ?? "Erro ao carregar usuários")
                }
                console.error(error)
            } finally {
                setLoading(false)
            }
        };

        carregarUsuario();
    }, [])

    useEffect(() => {
        console.log(usuarios)
    }, [usuarios])

    useEffect(() => {
        if (!mensagem) return;

        const intervalo = setTimeout(() => {
            setMensagem("")
            setType(null)
        }, 3000);

        return () => clearTimeout(intervalo);
    }, [mensagem])

    const MudarPermissao = (id:number) => {
            const atualizarUsuario = async () => {
                try {
                    const response = await api.put(`/menu/usuarios/${id}`)
                    const id_atualizado = response.data
                    setType(id_atualizado.type)
                    setMensagem(id_atualizado.mensagem)
                    setUsuarios(prev => 
                        prev.map(usuarios =>
                            usuarios.id === id_atualizado.id ?
                            { ...usuarios, permissao: id_atualizado.permissao }
                            : usuarios
                        )
                    )
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        const data = error.response?.data;
                        setType(data?.type ?? "error")
                        setMensagem(data?.mensagem ?? "Erro ao alterar permissão")
                    }
                    console.error(error)
                };
            }
            atualizarUsuario()
    }

    return (
        <div>
            {loading && <Loading />}
            {mensagem && <Mensagem
                mensagem={mensagem}
                type={type}
            />}
            <div className="bg-gray-800 w-full flex justify-between p-3 text-amber-500 font-bold">
                <p>Usuario</p>
                <p>E-mail</p>
                <p>Permissões</p>
            </div>
            {usuarios.map((usuario, index) => (
                <div key={usuario.id} className={index % 2 === 0 ? "bg-gray-300 w-full flex justify-between p-2" : "bg-gray-200 w-full flex justify-between p-2"}>
                    <p className="font-bold">{usuario.nome}</p>
                    <p>{usuario.email}</p>
                    {usuario.permissao == "user" ?
                        <div className="flex gap-5">
                            <p className="bg-gray-800 text-amber-500 p-1 cursor-pointer font-bold">User</p>
                            <p className="cursor-pointer p-1 transition-colors hover:bg-gray-600 hover:text-amber-500" onClick={() => MudarPermissao(usuario.id)}>Admin</p>
                        </div>
                        :
                        <div className="flex gap-5">
                            <p className="cursor-pointer p-1 transition-colors hover:bg-gray-600 hover:text-amber-500" onClick={(()=>MudarPermissao(usuario.id))}>User</p>
                            <p className="bg-gray-800 text-amber-500 p-1 cursor-pointer font-bold">Admin</p>
                        </div>}
                </div>
            ))}
        </div>
    )
}
