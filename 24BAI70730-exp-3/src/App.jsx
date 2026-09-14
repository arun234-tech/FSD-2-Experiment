import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ViewerPage from './pages/ViewerPage';
import EditorPage from './pages/EditorPage';
import AdminPanel from './pages/AdminPanel';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Experiment 1: everything below requires a valid session */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="viewer" element={<ViewerPage />} />

            {/* Experiment 2: role-gated routes */}
            <Route element={<RoleBasedRoute allowedRoles={['Editor', 'Admin']} />}>
              <Route path="editor" element={<EditorPage />} />
            </Route>

            <Route element={<RoleBasedRoute allowedRoles={['Admin']} />}>
              <Route path="admin" element={<AdminPanel />} />
            </Route>

            <Route path="unauthorized" element={<Unauthorized />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
