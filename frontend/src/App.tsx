import { BrowserRouter,Route,Routes, Navigate } from "react-router-dom"

{/* Rotas */}
import Login from "./pages/login/login"
import Register from "./pages/login/register"
import Menu from "./pages/menu/menu"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/menu" element={<Menu/>}/>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
