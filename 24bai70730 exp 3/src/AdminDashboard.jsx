import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome Admin!</p>
      <p>You have full access to the application.</p>

      <button onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default AdminDashboard;