interface mensgemProps{
    type:"success"|"error"|null;
    mensagem:string
}   

export default function Mensagem({type,mensagem}:mensgemProps){
    return(
        <div className="aboslute ">
            <div className={type == "success" ?
            "absolute top-[10%] left-[45%] bg-green-500 text-gray-50 p-5 rounded-md opacity-90 font-bold text-center ":
            type =="error" ?
            "absolute top-[10%] left-[45%] bg-red-500 text-gray-50 p-5 rounded-md opacity-90 font-bold text-center "
            :""}>
                <p>{mensagem}</p>
            </div>
        </div>
    )
}