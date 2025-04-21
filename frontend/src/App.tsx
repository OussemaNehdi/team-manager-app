import React, { useEffect, useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Make a request to the backend to get the "Hello World" message
    fetch('http://localhost:3000')
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div className="App">
      <h1>Your task is : {message}</h1>
    </div>
  );
}

export default App;
