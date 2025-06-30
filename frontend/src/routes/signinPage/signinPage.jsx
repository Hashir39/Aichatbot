import { SignIn } from "@clerk/clerk-react";
import './signinpage.css'

const signinPage = () => {
  return (
    <div className="signInPage">
      <SignIn path="/sign-in" signUpUrl="/sign-up"
       forceRedirectUrl="/dashboard"/> 
    </div> //login k baad dashboard per ajao direct
  )
}

export default signinPage