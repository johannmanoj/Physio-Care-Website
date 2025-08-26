import './LoginPage.css'
import React, { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL

function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Trainer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   setLoading(true);
  //   setError('');

  //   try {
  //     const response = await axios.post(`${API_URL}/api/auth/login`, {
  //       email,
  //       password
  //     });

  //     // Save token in AuthContext
  //     login(response.data.token);
  //     navigate("/");

  //   } catch (err) {
  //     const message = err.response?.data?.message || "Login failed";
  //     setError(message);
  //     alert(message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (event) => {
  event.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password
    });

    // console.log("reqqqqqq", response.data);
    

    // Pass token + role into context
    login(response.data.token, response.data.role, response.data.email, response.data.user_id);

    navigate("/");

  } catch (err) {
    const message = err.response?.data?.message || "Login failed";
    setError(message);
    alert(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Login</h1>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Trainer">Trainer</option>
              <option value="Client">Client</option>
              <option value="Admin">Admin</option>
              <option value="Therapist">Therapist</option>
            </select>
          </div> */}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* <a href="/forgot-password" className="forgot-password">
            Forgot Password
          </a> */}
          {/* <p className="redirect-signup">
            Don’t have an account? <a href="/signup">Sign up here</a>
          </p> */}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
