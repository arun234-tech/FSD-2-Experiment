import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    let role = "";

    if (username === "admin" && password === "admin123") {
      role = "Admin";
    } else if (username === "editor" && password === "editor123") {
      role = "Editor";
    } else if (username === "viewer" && password === "viewer123") {
      role = "Viewer";
    } else {
      alert("Invalid username or password");
      return;
    }

    const token = btoa(
      JSON.stringify({
        username,
        role,
      })
    );

    localStorage.setItem("jwtToken", token);
    localStorage.setItem("userRole", role);

    navigate("/dashboard");
  };

  return (
    <div>
      <h1>JWT Authentication & RBAC</h1>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;