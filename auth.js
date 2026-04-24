// SIGNUP
function signup(){
  const user = {
    name: signupName.value,
    email: signupEmail.value,
    pass: signupPass.value
  };

  localStorage.setItem("artsyUser", JSON.stringify(user));
  localStorage.setItem("loggedIn", "true");

  alert("Account created!");
  window.location.href = "index.html";
}

// LOGIN
function login(){
  const savedUser = JSON.parse(localStorage.getItem("artsyUser"));

  if(!savedUser){
    alert("No account found. Please sign up first.");
    return;
  }

  if(loginEmail.value === savedUser.email && loginPass.value === savedUser.pass){
    localStorage.setItem("loggedIn","true");
    alert("Login successful!");
    window.location.href="index.html";
  } else {
    alert("Wrong email or password");
  }
}

// LOGOUT
function logout(){
  localStorage.removeItem("loggedIn");
  window.location.href="index.html";
}