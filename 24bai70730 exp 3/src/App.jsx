import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Unauthorized from "./Unauthorized";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "./AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Editor", "Viewer"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;