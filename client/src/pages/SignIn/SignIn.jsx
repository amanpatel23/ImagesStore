import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import axios from 'axios';
import { toast } from 'react-toastify';
import { useValue } from '../../contexts/userContext';
import { useNavigate } from 'react-router-dom';
import styles from './SignIn.module.css';

function SignIn() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const { setUser } = useValue();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('https://imagesstore-backend-api.onrender.com/api/user/signin', {
            email,
            password
        });

        if (response.status === 200) {
            const token = response.data.token;
            const name = response.data.name;
            const userInfo = { name, email, token }
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            setUser(userInfo);
            clearInput();
            toast.success(`Welcome Back ${name}`);
            navigate('/');
        }
    }catch(error) {
        const errorMessage = error.response.data.error;
        toast.error(errorMessage)
    }
  };

  const clearInput = () => {
    setEmail('');
    setPassword('');
  }

  return (
    <div className={styles.signinForm}>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default SignIn;
