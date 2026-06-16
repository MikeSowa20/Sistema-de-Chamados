interface ButtomProps{
    text?:string
    type?:"button" | "submit" | "reset";
    onClick?:(e:React.MouseEvent<HTMLButtonElement>) => void
    className?:string
    disable?:boolean
}

export default function Buttom({text,type,onClick,className, disable}:ButtomProps){
    return(
        <div>
            <button
                type={type}
                onClick={onClick}
                disabled={disable}
                className={`px-5 py-2 bg-gray-700 text-gray-50 cursor-pointer transition-colors hover:bg-gray-600 ${className}`}
            >
                {text}
            </button>
        </div>
    )
}