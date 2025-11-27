import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    userType: 'doctor'
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempted:', credentials);
    alert(`Login attempted for ${credentials.userType}: ${credentials.username}`);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="text-center mb-4">Clinical System Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="userType" className="form-label">User Type</label>
            <select
              className="form-select"
              id="userType"
              name="userType"
              value={credentials.userType}
              onChange={handleChange}
            >
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="admin">Administrator</option>
              <option value="patient">Patient</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;