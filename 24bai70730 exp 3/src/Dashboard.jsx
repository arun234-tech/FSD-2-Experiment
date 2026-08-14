import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("jwtToken");

  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  if (!token) {
    navigate("/");
    return null;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Welcome!</h2>

      <p>
        Your Role: <strong>{role}</strong>
      </p>

      {role === "Admin" && (
        <>
          <button onClick={() => navigate("/admin")}>
            Admin Dashboard
          </button>

          <br /><br />
        </>
      )}

      {(role === "Admin" || role === "Editor") && (
        <>
          <button>Edit Content</button>

          <br /><br />
        </>
      )}

      {role === "Viewer" && (
        <p>You have view-only access.</p>
      )}

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;