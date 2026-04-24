import { Navigate, Outlet } from 'react-router-dom';


const PrivateRoutes = () => {
    const isAuthenticated = true; // Overcode para Saltar el Login 

    
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}


export default PrivateRoutes;