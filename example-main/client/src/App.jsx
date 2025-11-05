import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import StoresList from './pages/StoresList.jsx';
import StoreDetails from './pages/StoreDetails.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import OwnerDashboard from './pages/OwnerDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import NavBar from './components/NavBar.jsx';

export default function App() {
  return (
    <div>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/stores" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/stores" element={<ProtectedRoute><StoresList /></ProtectedRoute>} />
          <Route path="/stores/:id" element={<ProtectedRoute><StoreDetails /></ProtectedRoute>} />

          <Route path="/dashboard/user" element={<ProtectedRoute roles={["USER"]}><UserDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/owner" element={<ProtectedRoute roles={["OWNER"]}><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/admin" element={<ProtectedRoute roles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />

          <Route path="*" element={<div style={{ padding: 24 }}><h2>404 - Page not found</h2><Link to="/stores">Go Home</Link></div>} />
        </Routes>
      </div>
    </div>
  );
}
