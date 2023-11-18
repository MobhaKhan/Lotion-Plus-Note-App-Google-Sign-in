import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function App({ onLogin }) {
    const [user, setUser] = useState(null);

    const login = useGoogleLogin({
      onSuccess: (codeResponse) => {
        setUser(codeResponse);
        //localStorage.setItem("accessToken", codeResponse.access_token);
      },
      onError: (error) => console.log('Login Failed:', error),
    });

    useEffect(() => {
        //const accessToken = localStorage.getItem("accessToken");
      if (user) {
        axios
          .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: 'application/json',
            },
          })
          .then((res) => {
            onLogin && onLogin(res.data); // invoke onLogin callback with user profile
          })
          .catch((err) => console.log(err));
      }
    }, [user, onLogin]);
  
    return (
      <div>
        <header>
          <aside>
            <button id="menu-button">
              &#9776;
            </button>
          </aside>
          <div id="app-header">
            <h1>
              Lotion
            </h1>
            <h6 id="app-motto">Like Notion, but worse.</h6>
          </div>
          <aside>&nbsp;</aside>
        </header>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <button
                onClick={login}
                style={{
                    display: "flex",
                    alignItems: "center",
                    fontFamily: "verdana",
                    fontSize: "18px",
                    border: "2px solid #ccc",
                    borderRadius: "5px",
                    padding: "10px 20px",
                    cursor: "pointer",
                    outline: "none",
                }}>
                <p>Sign in to Lotion with</p>
                <img src="https://res.cloudinary.com/dfuasp6oi/image/upload/v1679436161/google_dwxgkt.png" alt="Google" style={{ height: "20px", width: "20px", marginLeft: "10px", verticalAlign: "middle" }} />
            </button>
        </div>
      </div>
    );
  }
  

export default App;
