import React from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios'

function LoginGoogle() {

    const responseSuccessGoogle=(response)=>{
        axios({
          method:"POST",
          url:"http://localhost:4000/api/user/logingoogle",
          data:{tokenId:response.tokenId}
        }).then(response=>{
    
          console.log(response.data.message.msgBody)
    
        })
        .catch(err=>console.log(err))
      }
    
      const responseSuccessSignupGoogle=(response)=>{
        axios({
          method:"POST",
          url:"http://localhost:4000/api/user/signupgoogle",
          data:{tokenId:response.tokenId}
        }).then(response=>{
          console.log(response.data.message.msgBody)
    
        })
        .catch(err=>console.log(err))
      }
      
      const responseFailureGoogle=(response)=>{
        console.log(response)
      }
    
    return (
        <div>
            <GoogleLogin
            clientId="client_id_from_google"
            buttonText="Login with google"
            onSuccess={responseSuccessGoogle}
            onFailure={responseFailureGoogle}
            cookiePolicy={'single_host_origin'}
            />
            <GoogleLogin
                clientId="client_id_from_google"
                buttonText="Signup with google"
                onSuccess={responseSuccessSignupGoogle}
                onFailure={responseFailureGoogle}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    );
}

export default LoginGoogle;
