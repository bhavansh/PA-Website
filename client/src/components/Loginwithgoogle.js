import React from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios'

function LoginGoogle() {

    const responseSuccessGoogle=(response)=>{
      
        axios({
          method:"POST",
          url:"http://localhost:4000/api/user/login/google",
          data:{tokenId:response.tokenId,googleId:response.googleId}
        }).then(response=>{
    
          console.log(response.data.message)
          console.log(response.data.user)
    
        })
        .catch(err=>console.log(err))
      }
    
      const responseFailureGoogle=(response)=>{
        console.log(response)
      }
    
    return (
        <div>
            <GoogleLogin
            clientId="603299777654-ejrbu45mkh8a4n5q0tvlko2c0mj395vi.apps.googleusercontent.com"
            buttonText="Login with google"
            onSuccess={responseSuccessGoogle}
            onFailure={responseFailureGoogle}
            cookiePolicy={'single_host_origin'}
            />
           
        </div>
    );
}

export default LoginGoogle;
