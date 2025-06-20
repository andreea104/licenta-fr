import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext'; // Importați AuthProvider și useAuth
import LoginForm from './LoginForm';
import AdminPage from './admin/AdminPage';
import PacientPage from './pacient/PacientPage';
import MedicPage from './medic/MedicPage';
import TotiPacientiiPage from './TotiPacientiiPage';
import DetaliiPacientPage from './DetaliiPacientPage';
import StatusDentarPage from './StatusDentarPage';
import RadiografiiPage from './RadiografiiPage';
import ConsultatiiViitoarePage from './ConsultatiiViitoarePage.js';
import IstoricConsultatiiPage from './IstoricConsultatiiPage.js'

const ProtectedRoutes = () => {
  const auth = useAuth(); // Preiați contextul AuthProvider
  const jwt = localStorage.getItem('jwt');
  const decodedJwt = jwt && JSON.parse(atob(jwt.split('.')[1]));
  const userId = decodedJwt && decodedJwt.userId;

  return (
    <Routes>
      <Route
        path="/admin"
        element={auth.isAuthenticated ? <AdminPage userId={userId} /> : <Navigate to="/login" />}
      />
      <Route
        path="/pacient"
        element={auth.isAuthenticated ? <PacientPage userId={userId} /> : <Navigate to="/login" />}
      />
      <Route
        path="/medic"
        element={auth.isAuthenticated ? <MedicPage userId={userId} /> : <Navigate to="/login" />}
      />
      <Route path="/*" element={<Navigate to="/login" />} /> {/* Redirecționează orice altă cale către /login */}
    </Routes>
  );
};

const App = () => {
  const jwt = localStorage.getItem('jwt');
  const decodedJwt = jwt && JSON.parse(atob(jwt.split('.')[1]));
  const userId = decodedJwt && decodedJwt.userId;
  return (
    <AuthProvider>
      <Router>
        <div>
          

          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/pacient/:pacientId" element={<PacientPage />} />
            <Route path="/pacient/:pacientId/consultatii-viitoare" element={<ConsultatiiViitoarePage />} />
            <Route path="/pacient/:pacientId/istoric-consultatii" element={<IstoricConsultatiiPage />} />
            <Route path="/admin/*" element={<AdminPage />} />
            <Route path="/medic/:userId" element={<MedicPage />} />
            <Route path="/medic/:userId/toti-pacientii" element={<TotiPacientiiPage />} />
            <Route path="/medic/:userId/toti-pacientii/:pacientId/vezi-detalii" element={<DetaliiPacientPage />} />
            <Route path="/medic/:userId/toti-pacientii/:pacientId/status-dentar" element = {<StatusDentarPage/>}/>
            <Route path="/medic/:userId/toti-pacientii/:pacientId/radiografii" element = {<RadiografiiPage/>}/>
            <Route path="/" element={<ProtectedRoutes />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
