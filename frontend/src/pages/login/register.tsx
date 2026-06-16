import Input from "../../commum/input"
import Buttom from "../../commum/buttom";
import Loading from "../../commum/loading";
import Mensagem from "../../commum/mensagem";
import { FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

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
                nome : nome,
                email : email,
                password: password
            });
            console.log(response.data);
            setType("success")
            setMensagem("Usuario criado com sucesso!!")
            navigate("/login")
        } catch(error){
            setType("error")
            setMensagem("Houve algum erro ao criar o usuario!!")
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
        <div className="flex justify-center items-center min-h-screen ">
            <div className="w-[60vw] h-[70vh] bg-gray-100 shadow-xl grid grid-cols-5">
                <div className="col-span-3 w-full h-full">

                </div>
                <div className="col-span-2 border-l border-gray-200 shadow-xl w-full h-full px-10 py-20">
                    <h1 className="text-3xl text-gray-900 font-bold">Registrar-se</h1>
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
                        label="password"
                        value={password}
                        onChange={((e) => setPassword(e.target.value))}
                    />
                    <div className="flex justify-end pt-8">
                        <Buttom
                            text="Registrar-se"
                            onClick={(e) => handleSubmit(e)}
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