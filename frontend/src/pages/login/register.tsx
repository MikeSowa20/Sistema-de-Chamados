import Input from "../../commum/input"
import Buttom from "../../commum/buttom";
import Loading from "../../commum/loading";
import Mensagem from "../../commum/mensagem";
import { FaHeadset, FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nome, setNome] = useState("");
    const [loading, setLoading] = useState(false);
    const [mensagem,setMensagem] = useState("");
    const [type, setType] = useState<"success" | "error" | null>(null);
    const navigate = useNavigate()

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await api.post("/register", {
                nome : nome.trim(),
                email : email.trim().toLowerCase(),
                password: password
            });
            console.log(response.data);
            setType("success")
            setMensagem("Usuario criado com sucesso!!")
            navigate("/login")
        } catch(error){
            setType("error")
            if (axios.isAxiosError(error)) {
                const data = error.response?.data;
                setMensagem(data?.mensagem ?? "Houve algum erro ao criar o usuario!!")
            } else {
                setMensagem("Houve algum erro ao criar o usuario!!")
            }
            console.error(error);
        }
    }

    useEffect(()=>{
        setLoading(false)
        let intervalo = setInterval(() => {
            setMensagem("")
            clearInterval(intervalo)
        }, 3000);
    }, [mensagem])

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#eef2f5] p-4">
            <div className="grid min-h-[620px] w-full max-w-5xl overflow-hidden border border-gray-200 bg-white shadow-xl md:grid-cols-5">
                <div className="hidden bg-teal-700 p-10 text-white md:col-span-3 md:flex md:flex-col md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center bg-white text-teal-700">
                            <FaHeadset />
                        </div>
                        <div>
                            <p className="text-lg font-bold">Central de Chamados</p>
                            <p className="text-sm text-teal-50">Atendimento organizado para toda a equipe</p>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold">Crie seu acesso e acompanhe seus chamados.</h2>
                        <p className="mt-3 max-w-md text-sm leading-6 text-teal-50">
                            Registre suas solicitações, responda ao atendimento e mantenha tudo documentado.
                        </p>
                    </div>
                </div>
                <div className="flex w-full flex-col justify-center px-6 py-10 md:col-span-2 md:px-10">
                    <p className="text-sm font-bold text-teal-700">Novo acesso</p>
                    <h1 className="text-3xl font-bold text-gray-950">Registrar-se</h1>
                    <div className="mt-8 space-y-4">
                        <Input
                            placeHolder="Insira o seu nome"
                            type="text"
                            label="Nome"
                            icon={<FaUser />}
                            value={nome}
                            onChange={((e) => setNome(e.target.value))}
                        />
                        <Input
                            placeHolder="Insira o seu e-mail"
                            type="email"
                            label="E-mail"
                            icon={<FaUser />}
                            value={email}
                            onChange={((e) => setEmail(e.target.value))}
                        />
                        <Input
                            placeHolder="Insira a sua senha"
                            type="password"
                            label="Senha"
                            value={password}
                            onChange={((e) => setPassword(e.target.value))}
                        />
                    </div>
                    <div className="flex justify-end pt-8">
                        <Buttom
                            text="Registrar-se"
                            onClick={(e) => handleSubmit(e)}
                            className="bg-teal-700 hover:bg-teal-800"
                        />  
                    </div>
                    {loading && <Loading/>}
                    {mensagem && <Mensagem
                        type={type}
                        mensagem={mensagem}
                    />}
                    
                </div>
            </div>
        </div>
    )
}
