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

const registerBtn = document.querySelector(".sign-up button");

registerBtn.addEventListener("click", async () => {
  const firstName = document.querySelector(
    ".sign-up input[placeholder='First Name']"
  ).value;
  const lastName = document.querySelector(
    ".sign-up input[placeholder='Last Name']"
  ).value;
  const email = document.querySelector(".sign-up input[type='email']").value;
  const password = document.querySelector(
    ".sign-up input[type='password']"
  ).value;

  try {
    const res = await fetch("http://localhost:5000/auth/userRegister", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_first_name: firstName,
        user_last_name: lastName,
        user_email: email,
        user_password: password,
      }),
    });

    const data = await res.json();

    if (data.statusCode === 200) {
      alert(data.message);
      window.location.href = "login.html";
    } else if (data.statusCode === 400) {
      alert(data.message);
    } else if (data.statusCode === 409) {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan server.");
  }
});

const loginBtn = document.querySelector(".sign-in button");

loginBtn.addEventListener("click", async () => {
  const email = document.querySelector(".sign-in input[type='email']").value;
  const password = document.querySelector(
    ".sign-in input[type='password']"
  ).value;

  try {
    const res = await fetch("http://localhost:5000/auth/userLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_email: email,
        user_password: password,
      }),
      credentials: "include",
    });

    const data = await res.json();

    if (data.statusCode === 200) {
      alert(data.message);
      window.location.href = "filelist.html";
    } else if (data.statusCode === 400) {
      alert(data.message);
    } else if (data.statusCode === 401) {
      alert(data.message);
    } else if (data.statusCode === 404) {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan server.");
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:5000/auth/checkLogin", {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      window.location.href = "filelist.html";
    }
  } catch (err) {
    console.log("Belum login atau token tidak valid");
  }
});
