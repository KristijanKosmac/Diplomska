export default function forgotPasswordValidation(newPassword: string, confirmPassword: string, code: string, email: string) {
    let newPasswordError = "";
    let confirmPasswordError = "";
    let emailError = "";
    let codeError = ""
    const emailRegex = /\S+@\S+\.\S+/;
   
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,64}$/;
  
    if (!passwordRegex.test(newPassword)) {
      newPasswordError =
        "Your password must contain numbers, lowercase and uppercase letters and have a minimum length of 8";
    }

    if (!confirmPassword) {
      confirmPasswordError =
        "Your must confirm the password";
    } else if(newPassword !== confirmPassword) {
      confirmPasswordError = "Confirmed password must be same as new password!"
    } 

    if (email.length > 100 || !emailRegex.test(email)) {
        emailError = "Your email is not valid";
    }

    if (!code) {
        codeError = "Code is required"
    }

    return {
      error: { newPasswordError, confirmPasswordError, emailError, codeError },
      valid: !newPasswordError && !confirmPasswordError && !codeError && !emailError
    };
  }
  