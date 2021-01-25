import React from "react";
import FacebookLogin from "react-facebook-login";
import axios from "axios";

function LoginwithFacebook() {
    const responseFacebook = (response) => {
        console.log(response);
        axios({
            method: "POST",
            url: "http://localhost:4000/api/user/login/facebook",
            data: {
                accessToken: response.accessToken,
                userID: response.userID,
            },
        })
            .then((response) => {
                console.log(response);
            })
            .catch((err) => console.log(err));
    };

    return (
        <div>
            <FacebookLogin
                appId="1793279934167709"
                autoLoad={false}
                // onClick={componentClicked}
                callback={responseFacebook}
            />
        </div>
    );
}

export default LoginwithFacebook;
