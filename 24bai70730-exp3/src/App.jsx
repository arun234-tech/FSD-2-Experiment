import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [error, setError] = useState("");

  // Login function
  const handleLogin = (e) => {
    e.preventDefault();

    // Mock credentials
    if (username === "admin" && password === "1234") {
      
      // Simulated JWT token
      const header = btoa(
        JSON.stringify({
          alg: "HS256",
          typ: "JWT",
        })
      );

      const payload = btoa(
        JSON.stringify({
          username: username,
          role: "admin",
        })
      );

      const signature = "mock-signature";

      const mockToken = `${header}.${payload}.${signature}`;

      // Store token in localStorage
      localStorage.setItem("token", mockToken);

      setToken(mockToken);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // Decode JWT
  const getUserData = () => {
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.log("Invalid token");
      return null;
    }
  };

  const userData = getUserData();

  return (
    <div className="container">
      <div className="card">
        <h1>JWT Authentication</h1>

        {!token ? (
          <>
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button type="submit">Login</button>
            </form>

            {error && <p className="error">{error}</p>}

            <div className="demo">
              <p>Demo Credentials</p>
              <p>
                Username: <b>admin</b>
              </p>
              <p>
                Password: <b>1234</b>
              </p>
            </div>
          </>
        ) : (
          <>
            <h2>Login Successful</h2>

            <div className="user-info">
              <p>
                <strong>Username:</strong> {userData?.username}
              </p>

              <p>
                <strong>Role:</strong> {userData?.role}
              </p>

              <p>
                <strong>Authentication:</strong> JWT
              </p>
            </div>

            <button onClick={handleLogout}>Logout</button>

            <div className="token-box">
              <h3>JWT Token</h3>
              <p>{token}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;