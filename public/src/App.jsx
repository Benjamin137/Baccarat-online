// Impartar navegacion
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Baccarat from './screens/baccarat';
import Login from './screens/login';
import PrivateRoutes from './utils/privateRoutes';




const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
         <Route path="/login" element={<Login />} />
         {/* Rutas privadas */}
         <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Baccarat />} />
         </Route>
      </Routes>
    </Router>
  );
}


export default App;