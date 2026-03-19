import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import Activation from "./pages/Activation";

// Import des pages manager
import ManagerDashboard from "./pages/Manager/ManagerDashboard";
import VueUnifieeTaches from "./pages/Manager/VueUnifieeTaches";
import GestionTaches from "./pages/Manager/GestionTaches";
import GestionBadges from "./pages/Manager/GestionBadges";
import GestionUtilisateurs from "./pages/Manager/GestionUtilisateurs";
import ConfigurationJira from "./pages/Manager/ConfigurationJira";
import Rapports from "./pages/Manager/Rapports";
import Equipes from "./pages/Manager/Equipes";
// Import des pages employé
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard";
import MesTaches from "./pages/Employee/MesTaches";
import MesBadges from "./pages/Employee/MesBadges";
import MonProfil from "./pages/Employee/MonProfil";



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

      
          <Route path="/login" element={<Login />} />
          <Route path="/activation" element={<Activation />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

      
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute role="manager">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route path="/manager/tasks" element={
            <ProtectedRoute role="manager">
              <VueUnifieeTaches />
            </ProtectedRoute>
          } />
          
          <Route path="/manager/tasks/create" element={
            <ProtectedRoute role="manager">
              <GestionTaches />
            </ProtectedRoute>
          } />
          
          <Route path="/manager/badges" element={
            <ProtectedRoute role="manager">
              <GestionBadges />
            </ProtectedRoute>
          } />
          
          <Route path="/manager/users" element={
            <ProtectedRoute role="manager">
              <GestionUtilisateurs />
            </ProtectedRoute>
          } />
          
          <Route path="/manager/jira" element={
            <ProtectedRoute role="manager">
              <ConfigurationJira />
            </ProtectedRoute>
          } />
          
          <Route path="/manager/reports" element={
            <ProtectedRoute role="manager">
              <Rapports />
            </ProtectedRoute>
          } />
          
          <Route path="/manager/teams" element={
            <ProtectedRoute role="manager">
              <Equipes />
            </ProtectedRoute>
          } />

           

          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute role="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          

           {/* ===== ROUTES EMPLOYÉ ===== */}
          <Route path="/dashboard" element={
            <ProtectedRoute role="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/tasks" element={
            <ProtectedRoute role="employee">
              <MesTaches />
            </ProtectedRoute>
          } />
          
          <Route path="/badges" element={
            <ProtectedRoute role="employee">
              <MesBadges />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute role="employee">
              <MonProfil />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Login/>} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
