import Input from "../../commum/input"
import Buttom from "../../commum/buttom";
import { FaHeadset, FaUser} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../commum/loading";
import Mensagem from "../../commum/mensagem";
import api from "../../api";
import axios from "axios";
import { useAuth } from "./auth";

export default function Login(){

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [loading,setLoading] = useState(false);
    const [mensagem,setMensagem] = useState("");
    const [type, setType] = useState<"success"|"error"|null>(null)
    const navigate = useNavigate();

    const handleSubmit = async (e:any) => {
        e.preventDefault()
        setLoading(true)
        try{
            const response = await api.post("/login",{
                email: email.trim().toLowerCase(),
                password: password,
            });
            const data = response.data
            setType(data.type)
            setMensagem(data.mensagem)
            navigate("/menu")
        }catch(error){
            if (axios.isAxiosError(error)) {
                const data = error.response?.data;
                setType(data?.type ?? "error");
                setMensagem(data?.mensagem ?? "Erro ao realizar login");
        }}
    }
    const handleRegister = () =>{
        navigate("/register")
    }

    const { verifyAuth } = useAuth();
    useEffect(() => {
        verifyAuth(true);
    }, []);
    
    useEffect(()=>{
        setLoading(false)
        let intervalo = setTimeout(() => {
            setLoading(false)
            setMensagem("")
            setType(null)
            clearInterval(intervalo)
        }, 3000);
    },[mensagem])

    return(
        <div className="flex min-h-screen items-center justify-center bg-[#eef2f5] p-4">
            {loading && <Loading/>}
            {mensagem && <Mensagem
                mensagem={mensagem}
                type={type}
            />}
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
                        <h2 className="text-3xl font-bold">Acesse sua fila de suporte com clareza.</h2>
                        <p className="mt-3 max-w-md text-sm leading-6 text-teal-50">
                            Abra chamados, acompanhe respostas e mantenha o histórico de atendimento em um fluxo simples.
                        </p>
                    </div>
                </div>
                <div className="flex w-full flex-col justify-center px-6 py-10 md:col-span-2 md:px-10">
                    <p className="text-sm font-bold text-teal-700">Bem-vindo</p>
                    <h1 className="text-3xl font-bold text-gray-950">Login</h1>
                    <div className="mt-8 space-y-4">
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
                    <p className="mt-4 text-sm text-gray-600">
                        Caso não tenha um usuario criado, 
                        <span className="cursor-pointer p-1 font-bold text-teal-700 hover:text-teal-900"
                            onClick={handleRegister}>
                            registre-se.
                        </span>
                    </p>
                    <div className="flex justify-end pt-8">
                        <Buttom
                            text="Login"
                            onClick={(e) => handleSubmit(e)}
                            className="bg-teal-700 hover:bg-teal-800"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
