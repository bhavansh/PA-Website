import React from "react";
import GitHubLogin from "react-github-login";
import axios from "axios";

function LoginwithGithub() {
    const onSuccess = (response) => {
        console.log(response);
        axios({
            method: "POST",
            url: "http://localhost:4000/api/user/login/github",
            data: { code: response.code },
        })
            .then((response) => {
                console.log(response);
            })
            .catch((err) => console.log(err));
    };
    const onFailure = (response) => console.error(response);
    return (
        <GitHubLogin
            clientId="69ab3843cec73ec55290"
            onSuccess={onSuccess}
            onFailure={onFailure}
            scope={"read:user,user:email"}
            redirectUri="http://localhost:3000"
        />
    );
}

export default LoginwithGithub;
