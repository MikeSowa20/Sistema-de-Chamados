interface mensgemProps{
    type:"success"|"error"|null;
    mensagem:string
}   

export default function Mensagem({type,mensagem}:mensgemProps){
    return(
        <div className="fixed left-1/2 top-5 z-[80] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2">
            <div className={type == "success" ?
            "border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800 shadow-lg":
            type =="error" ?
            "border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800 shadow-lg"
            :""}>
                <p>{mensagem}</p>
            </div>
        </div>
    )
}
