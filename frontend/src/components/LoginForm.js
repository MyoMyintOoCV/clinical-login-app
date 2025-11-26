import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    userType: 'doctor'
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
      setMessage(`Login successful! Welcome ${response.data.userType}`);
    } catch (error) {
      setMessage('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
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
          
          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {message && (
          <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'} mt-3`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;