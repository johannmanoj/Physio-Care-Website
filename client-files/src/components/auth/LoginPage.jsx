import './LoginPage.css'
import React, { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const EMAIL = "test@gmail.com"
  const PASSWORD = "pass"

  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Trainer');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email == EMAIL && password == PASSWORD) {
      const testToken = "abc123";
      login(testToken);
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Login</h1>
        <form onSubmit={handleSubmit} className="login-form">
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

          <div className="form-group">
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
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          <a href="/forgot-password" className="forgot-password">
            Forgot Password
          </a>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;