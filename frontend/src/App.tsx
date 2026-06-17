import { BrowserRouter,Route,Routes, Navigate } from "react-router-dom"

{/* Rotas */}
import Login from "./pages/login/login"
import Register from "./pages/login/register"
import Menu from "./pages/menu/menu"
import Usuarios from "./pages/menu/usuarios/usuarios"
import Chamados from "./pages/menu/chamados/chamados"
import Dashboard from "./pages/menu/dashboard/dashboard"
import AdminRoute from "./pages/menu/hook/admin_route"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/menu" element={<Menu/>}>
            <Route index element={<Chamados />} />
            <Route path="chamados" element={<Chamados/>}/>
            <Route path="dashboard" element={
              <AdminRoute>
                <Dashboard/>
              </AdminRoute>
            }/>
            <Route path="usuarios" element={
              <AdminRoute>
                <Usuarios/>
              </AdminRoute>
            }/>
        </Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
