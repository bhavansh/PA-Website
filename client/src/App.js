import React from "react";
import "./App.css";
import LinkedinLogin from "./components/LoginwithLinkedin";
import LoginGoogle from "./components/Loginwithgoogle";
import LoginFacebook from "./components/LoginwithFacebook";

function App() {
    return (
        <div className="App">
            <LinkedinLogin />
            <LoginGoogle />
            <LoginFacebook />
        </div>
    );
}

export default App;
