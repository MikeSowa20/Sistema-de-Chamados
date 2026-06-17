import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import Loading from "../../../commum/loading";
import useVerifyAdmin from "./verify_admin";

interface AdminRouteProps {
    children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
    const { loading, logado, isAdmin } = useVerifyAdmin();

    if (loading) {
        return <Loading />;
    }

    if (!logado) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/menu/chamados" replace />;
    }

    return <>{children}</>;
}
