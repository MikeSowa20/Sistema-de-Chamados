import Input from "../../commum/input"
import Buttom from "../../commum/buttom";
import { FaUser} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../commum/loading";
import Mensagem from "../../commum/mensagem";
import api from "../../api";
import axios from "axios";

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
                email: email,
                password: password,
            });
            const data = response.data
            setType(data.type)
            setMensagem(data.mensagem)
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
        <div className="flex justify-center items-center min-h-screen ">
            {loading && <Loading/>}
            {mensagem && <Mensagem
                mensagem={mensagem}
                type={type}
            />}
            <div className="w-[60vw] h-[70vh] bg-gray-100 shadow-xl grid grid-cols-5">
                <div className="col-span-3 w-full h-full">

                </div>
                <div className="col-span-2 border-l border-gray-200 shadow-xl w-full h-full px-10 py-20">
                    <h1 className="text-3xl text-gray-900 font-bold">Login</h1>
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
                    <p className="text-sm text-gray-800">
                        Caso não tenha um usuario criado, 
                        <span className="text-blue-800 cursor-pointer hover:text-blue-600 p-1"
                            onClick={handleRegister}>
                            registre-se.
                        </span>
                    </p>
                    <div className="flex justify-end pt-8">
                        <Buttom
                            text="Login"
                            onClick={(e) => handleSubmit(e)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}