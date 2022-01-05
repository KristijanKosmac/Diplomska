export default function emailValidation(email: string) {
    let emailError = "";
    const emailRegex = /\S+@\S+\.\S+/;
    if (email.length > 100 || !emailRegex.test(email)) {
      emailError = "Your email is not valid";
    }
      
    return {
        error: emailError,
        valid: !emailError            
    }
}