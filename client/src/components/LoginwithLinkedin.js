import React from "react";
import { LinkedInPopUp } from "react-linkedin-login-oauth2";

// import { render } from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginwithLinkedinButton from "./LoginwithLinkedinButton";

function LoginwithLinkedin() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/linkedin" component={LinkedInPopUp} />
                <Route path="/" component={LoginwithLinkedinButton} />
            </Switch>
        </BrowserRouter>
    );
}

export default LoginwithLinkedin;
