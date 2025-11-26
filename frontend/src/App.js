import React, { useState } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';

function App() {
  return (
    <div className="App">
      <div className="container-fluid">
        <LoginForm />
      </div>
    </div>
  );
}

export default App;