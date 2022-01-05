export default function passwordValidation(newPassword: string, confirmPassword: string) {
  let newPasswordError = "";
  let confirmPasswordError = "";
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
  
  return {
    error: { newPasswordError, confirmPasswordError },
    valid: !newPasswordError && !confirmPasswordError,
  };
}
