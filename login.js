const container = document.getElementById("container");
const toSignUp = document.getElementById("toSignUp");
const toLogin = document.getElementById("toLogin");

toSignUp.addEventListener("click", (e) => {
  e.preventDefault();
  container.classList.add("sign-up-mode");
});

toLogin.addEventListener("click", (e) => {
  e.preventDefault();
  container.classList.remove("sign-up-mode");
});
