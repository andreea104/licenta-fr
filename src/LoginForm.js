import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom'; 
import './LoginForm.modules.css'

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [parola, setPassword] = useState('');
  const [rol, setRole] = useState(10); 

  const { login } = useAuth();
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:7146/api/auth/login', {
        email,
        parola,
        rol,
      });

      // Salvăm token-ul JWT în localStorage și setăm starea de autentificare în true
      login(response.data.token, response.data.UserId);

      const decodedToken = JSON.parse(atob(response.data.token.split('.')[1]));
      const userId = decodedToken.UserId;

      // Redirect
      switch (rol) {
        case 10:
          window.location.href = `/admin/${userId}`;
          break;
        case 20:
          window.location.href = `/medic/${userId}`;
          break;
        case 30:
          window.location.href = `/pacient/${userId}`;
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Autentificare eșuată!', error);
    }
  };

  return (
    <div className="login-bckg">
      <div className="login-form-container">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Parolă:</label>
            <input
              type="password"
              value={parola}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Rol:</label>
            <select
              value={rol}
              onChange={(e) => setRole(parseInt(e.target.value))}
            >
              <option value={10}>Admin</option>
              <option value={20}>Medic</option>
              <option value={30}>Pacient</option>
            </select>
          </div>
          <button class="custom-button" type="submit">Autentificare</button>
        </form>
      </div>
    </div>
  );
  
};

export default LoginForm;
