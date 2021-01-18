import React from "react";
import FacebookLogin from "react-facebook-login";
import axios from "axios";

function LoginwithFacebook() {
    const responseFacebook = (response) => {
        console.log(response);
        axios({
            method: "POST",
            url: "http://localhost:4000/api/user/loginfacebook",
            data: {
                accessToken: response.accessToken,
                userID: response.userID,
            },
        })
            .then((response) => {
                console.log(response.data.message.msgBody);
            })
            .catch((err) => console.log(err));
    };

    return (
        <div>
            <FacebookLogin
                appId="app_id_from_fb"
                autoLoad={false}
                callback={responseFacebook}
            />
        </div>
    );
}

export default LoginwithFacebook;
