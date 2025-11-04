// =======================
// SWITCH FORM LOGIN <-> SIGN UP
// =======================
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

// =======================
// SIGN UP / REGISTER
// =======================
const registerBtn = document.querySelector(".sign-up button");

registerBtn.addEventListener("click", async () => {
  const firstName = document.querySelector(
    ".sign-up input[placeholder='First Name']"
  ).value.trim();
  const lastName = document.querySelector(
    ".sign-up input[placeholder='Last Name']"
  ).value.trim();
  const email = document.querySelector(".sign-up input[type='email']").value.trim();
  const phone = document.getElementById("phone").value.trim(); // ✅ Ambil nomor HP
  const password = document.querySelector(
    ".sign-up input[type='password']"
  ).value.trim();

  // Validasi input dasar
  if (!firstName || !lastName || !email || !password || !phone) {
    return alert("Semua field wajib diisi!");
  }

  // ✅ Validasi format nomor handphone (boleh +62 atau 08, panjang 9–15 digit)
  const phoneRegex = /^(\+62|0)[0-9]{8,13}$/;
  if (!phoneRegex.test(phone)) {
    return alert("Nomor handphone tidak valid! Gunakan format 08xxx atau +628xxx");
  }

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
        user_phone: phone, // ✅ kirim ke backend
      }),
    });

    const data = await res.json();

    if (data.statusCode === 200) {
      alert(data.message);
      // ✅ setelah register, balik ke halaman login
      container.classList.remove("sign-up-mode");
    } else if (data.statusCode === 400 || data.statusCode === 409) {
      alert(data.message);
    } else {
      alert("Terjadi kesalahan saat registrasi.");
    }
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan server.");
  }
});

// =======================
// LOGIN USER
// =======================
const loginBtn = document.querySelector(".sign-in button");

loginBtn.addEventListener("click", async () => {
  const email = document.querySelector(".sign-in input[type='email']").value.trim();
  const password = document.querySelector(".sign-in input[type='password']").value.trim();

  if (!email || !password) {
    return alert("Email dan password wajib diisi!");
  }

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
    } else if ([400, 401, 404].includes(data.statusCode)) {
      alert(data.message);
    } else {
      alert("Terjadi kesalahan saat login.");
    }
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan server.");
  }
});

// =======================
// AUTO REDIRECT JIKA SUDAH LOGIN
// =======================
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
