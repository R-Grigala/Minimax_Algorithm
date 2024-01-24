import Cookies from 'universal-cookie';
import './App.css';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { useEffect, useState } from 'react';


function App() {
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [isAuth, setAuth] = useState(false);

  const logOut = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("firstName");
    cookies.remove("lastName");
    cookies.remove("hashedPassword");
    cookies.remove("username");
    setAuth(false);
  }

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

      setAuth(true);
    }
  }, [token]);

  return (
    <div className="App">
      {isAuth ? (
        <button onClick={logOut}>Log Out</button>
      ):(
        <>      
          <SignUp setIsAuth={setAuth}/>
          <Login setIsAuth={setAuth}/>
        </>
      )}

    </div>
  );
}

export default App;
