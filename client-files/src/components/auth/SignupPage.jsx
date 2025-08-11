import './LoginPage.css'; // ✅ Use same CSS as LoginPage
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL

function SignupPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Trainer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const signupRes = await axios.post(`${API_URL}/api/auth/signup`, {
        email,
        password,
        role
      });
      alert(signupRes.data.message || "Signup successful!");

      const loginRes = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });
      login(loginRes.data.token);
      navigate("/");

    } catch (err) {
      const message = err.response?.data?.message || "Signup failed";
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Sign Up</h1>
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

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="redirect-login">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
