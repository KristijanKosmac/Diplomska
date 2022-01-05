export default function userValidation(email: string, password: string) {
  let emailError = "";
  let passwordError = "";
  const emailRegex = /\S+@\S+\.\S+/;
  const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,64}$/;
  if (email.length > 100 || !emailRegex.test(email)) {
    emailError = "Your email is not valid";
  }
  if (!passwordRegex.test(password)) {
    passwordError = "Your password must contain numbers, lowercase and uppercase letters and have a minimum length of 8";
  }

  return {
    errors: {
      email: emailError,
      password: passwordError,
    },
    valid: !emailError && !passwordError,
  };
}
