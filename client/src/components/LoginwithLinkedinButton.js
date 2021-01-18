import React from "react";
import { LinkedIn } from "react-linkedin-login-oauth2";
import axios from "axios";
function LoginwithLinkedinButton() {
    const handleFailure = (response) => {
        console.log(response);
    };
    const handleSuccess = (response) => {
        axios
            .post("http://localhost:4000/api/auth/linkedin", {
                data: { code: response.code },
            })
            .then((response) => {
                console.log(response);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div>
            <LinkedIn
                clientId="78gukwqbrxwsdg"
                onFailure={handleFailure}
                onSuccess={handleSuccess}
                redirectUri="http://localhost:3000/linkedin"
                scope="r_emailaddress,r_liteprofile"
                renderElement={({ onClick, disabled }) => (
                    <button onClick={onClick} disabled={disabled}>
                        Login with LinkedIn
                    </button>
                )}
            />
        </div>
    );
}

export default LoginwithLinkedinButton;
