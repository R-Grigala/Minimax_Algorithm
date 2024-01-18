import Cookies from 'universal-cookie';
import './App.css';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { useEffect } from 'react';


function App() {
  const cookies = new Cookies();
  const token = cookies.get("token");

  useEffect(() => {
    // Perform actions when a token is present
    if (token) {
      const userId = cookies.get("userId");
      const username = cookies.get("username");
      const firstName = cookies.get("firstName");
      const lastName = cookies.get("lastName");
      const hashedPassword = cookies.get("hashedPassword");

      // Log user information
      console.log({
        userId,
        username,
        firstName,
        lastName,
        hashedPassword,
      });
    }
  }, [token]);

  return (
    <div className="App">
      <SignUp />
      <Login />
    </div>
  );
}

export default App;
