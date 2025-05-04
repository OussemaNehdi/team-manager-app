import React, { useState } from 'react';

interface LoginProps {
  setUserId: (id: number) => void;
}

const Login: React.FC<LoginProps> = ({ setUserId }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  const handleLogin = async () => {
    console.log("Hanld logic fire")
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      console.log("Hanld logic fire")
      if (!response.ok) {
        console.log("Hanld logic fireerror")
        const errorText = await response.text();
        alert(`Error: ${errorText}`);
        return;
      }

      const data = await response.json();
      console.log("Hanld logic firejson")
      console.log(data.id)
      setUserId(data.id);
    } catch (error) {
      console.log("Hanld logic fire catching")
      console.error('Error during login:', error);
      alert('An error occurred during login.');
    }
  };

  return (
    <div>
      <h2>LoginNow</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password" 
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;