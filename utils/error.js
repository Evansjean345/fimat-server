//signup error Function
exports.signupErrors = (err) => {
  let errors = { username: "", email: "", password: "" };
  if (err.message.includes("username")) {
    errors.username = "Nom d'utilisateur incorrect ou déjà pris";
  }
  if (err.message.includes("email")) {
    errors.email = "Email incorrect";
  }
  if (err.message.includes("password")) {
    errors.password = "Le mot de passe doit faire 6 caractères minimum";
  }
  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("username")) {
    errors.username = "Ce nom d'utilisateur est déjà pris";
  }
  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email")) {
    errors.email = "Cet email est déjà enregistré";
  }
  return errors;
};

//login error Fuction
exports.loginErrors = (err) => {
  let errors = { username: " ", email: " ", password: " " };

  if (err.message.includes("username")) {
    errors.username = "Nom d'utilisateur incorrect ou déjà pris";
  }

  if (err.message.includes("email")) {
    errors.email = "Email inconnu";
  }
  if (err.message.includes("password")) {
    errors.password = "Le mot de passe de correspond pas ";
  }
  return errors;
};


