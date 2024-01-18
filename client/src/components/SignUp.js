import React, {useState} from 'react';
import Axios from "axios";
import Cookies from 'universal-cookie';


function SignUp() {
    const cookies = new Cookies();
    const [user, setUser] = useState(null);

    const signUp = () => {
        Axios.post("http://localhost:3001/signup", user)
          .then((res) => {
            // Handle successful signup
            const { token, userId, firstName, lastName, username, hashedPassword } = res.data;
            cookies.set("token", token);
            cookies.set("userId", userId);
            cookies.set("firstName", firstName);
            cookies.set("lastName", lastName);
            cookies.set("username", username);
            cookies.set("hashedPassword", hashedPassword);
          })
          .catch((error) => {
            // Handle signup error
            console.error("Error during signup:", error);
            // Display an error message to the user or handle it in another way
          });
      };

    return (
        <div className='signUp'>
            <label>Sign Up</label>
            <input 
                placeholder='First Name' 
                onChange={(event) => {
                    setUser({...user, firstName: event.target.value});
                }}
            />
            <input 
                placeholder='Last Name' 
                onChange={(event) => {
                    setUser({...user, lastName: event.target.value});
                }}
            />
            <input 
                placeholder='Username' 
                onChange={(event) => {
                    setUser({...user, username: event.target.value});
                }}
            />
            <input 
                placeholder='Password'
                type='password'
                onChange={(event) => {
                    setUser({...user, password: event.target.value});
                }}
            />
            <button onClick={signUp}>Sign Up</button>
        </div>
  );
}

export default SignUp