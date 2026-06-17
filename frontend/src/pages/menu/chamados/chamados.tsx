
import Loading from "../../../commum/loading";
import useVerifyAdmin from "../hook/verify_admin";
import ChamadosAdmin from "./chamadosAdmin";
import ChamadosUser from "./chamadosUser";

export default function Chamados(){
    const { loading, permissao,nome ,id} = useVerifyAdmin();

    if (loading) {
        return <Loading />;
    }

    return(
        <div>
            {permissao == "admin" ?
            <ChamadosAdmin
                nome={nome}
                user_id={id}
            />:
            <ChamadosUser
                nome={nome}
                user_id={id}
            />}
        </div>
    )
}
