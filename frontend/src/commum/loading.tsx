export default function Loading(){
    return(
        <div className="min-h-screen min-w-screen fixed bg-white opacity-80 top-0 left-0"> 
            <div className="opacity-100 fixed top-[50%] left-[50%]">
                <div className="w-10 h-10 border-3 border-black border-t-transparent rounded-full animate-spin" />
            </div>
        </div>
    )
}