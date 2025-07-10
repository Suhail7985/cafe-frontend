import "./Register.css";
import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
  const [user, setUser] = useState({});
  const [login, setLogin] = useState({});
  const [error, setError] = useState();
  const [loginError, setLoginError] = useState(); // ✅ added missing state

  const handleSubmit = async () => {
    try {

      const url = `${API_URL}/api/users/register`;
      const result = await axios.post(url, user);
      setError("Data saved successfully");
    } catch (err) {
      console.error(err); // ✅ fixed
      setError("Something went wrong");
    }
  };

  const handleLogin = async () => {
    try {
      const url = `${API_URL}/api/users/login`;
      const result = await axios.post(url, login);
      setLoginError("Welcome");
    } catch (err) {
      console.error(err);
      setLoginError("Something went wrong");
    }
  };

  return (
    <div className="App-Register-Row">
      <div>
        <h2>Register Form</h2>
        {error}
        <p>
          <input
            type="text"
            onChange={(e) => setUser({ ...user, firstname: e.target.value })}
            placeholder="First Name"
          />
        </p>

        <p>
          <input
            type="text"
            onChange={(e) => setUser({ ...user, lastname: e.target.value })}
            placeholder="Last Name"
          />
        </p>

        <p>
          <input
            type="text"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Email Address"
          />
        </p>

        <p>
          <input
            type="text"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Password"
          />
        </p>

        <button onClick={handleSubmit}>Submit</button>
      </div>
      <div>
        <h2>Login</h2>
        {loginError && (
          <p style={{ color: loginError.startsWith("✅") ? "green" : "red" }}>
            {loginError}
          </p>
        )}
        <p>
          <input
            type="text"
            placeholder="Email Address"
            value={login.email || ""}
            onChange={(e) => setLogin({ ...login, email: e.target.value })}
          />
        </p>
        <p>
          <input
            type="password"
            placeholder="Password"
            value={login.password || ""}
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
          />
        </p>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}
