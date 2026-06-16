import { useEffect } from "react";
import { useAuth } from "../login/auth";

export default function Menu(){

    const { verifyAuth } = useAuth();
    useEffect(() => {
        verifyAuth();
    }, []);

    return(
        <div>
            
        </div>
    )
}