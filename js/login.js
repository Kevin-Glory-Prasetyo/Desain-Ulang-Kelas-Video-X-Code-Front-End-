// =======================
// SWITCH FORM LOGIN <-> SIGN UP
// =======================
const container = document.getElementById("container");
const toSignUp = document.getElementById("toSignUp");
const toLogin = document.getElementById("toLogin");
const toForgotPassword = document.getElementById("toForgotPassword");

// --- FORM ELEMENTS ---
const forgotPasswordForm = document.querySelector(".forgot-password");
const verifyEmailForm = document.querySelector(".verify-email");
const changePasswordForm = document.querySelector(".change-password");

// --- BUTTONS ---
const sendOtpButton = forgotPasswordForm.querySelector("button");
const verifyButton = document.getElementById("verify-btn");
const changePasswordButton = changePasswordForm.querySelector("button");

// --- VARIABEL GLOBAL ---
let userEmailForReset = "";
let resetToken = "";

// =======================
// SWITCH LOGIN / SIGNUP
// =======================
toSignUp.addEventListener("click", (e) => {
  e.preventDefault();
  container.classList.add("sign-up-mode");
  container.classList.remove("forgot-password-mode", "verify-email-mode", "change-password-mode");
});

toLogin.addEventListener("click", (e) => {
  e.preventDefault();
  container.classList.remove("sign-up-mode", "forgot-password-mode", "verify-email-mode", "change-password-mode");
});

// =======================
// FORGOT PASSWORD FLOW
// =======================
if (toForgotPassword) {
  toForgotPassword.addEventListener("click", (e) => {
    e.preventDefault();
    container.classList.add("forgot-password-mode");
    container.classList.remove("sign-up-mode", "verify-email-mode", "change-password-mode");
  });
}

// === Step 1: Kirim OTP ke email ===
if (sendOtpButton) {
  sendOtpButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = forgotPasswordForm.querySelector("input[type='email']").value.trim();
    if (!email) return alert("Email wajib diisi!");

    try {
      const res = await fetch("http://localhost:5000/auth/password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Kode OTP telah dikirim ke email Anda.");
        userEmailForReset = email;
        container.classList.add("verify-email-mode");
        container.classList.remove("forgot-password-mode");
      } else {
        alert(data.message || "Gagal mengirim OTP.");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim OTP. Periksa koneksi server.");
    }
  });
}

// === Step 2: Verifikasi kode OTP ===
if (verifyButton) {
  verifyButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const otpInputs = document.querySelectorAll(".otp-input");
    const code = Array.from(otpInputs).map((input) => input.value.trim()).join("");

    if (code.length !== 4) return alert("Kode OTP harus 4 digit!");
    if (!userEmailForReset) return alert("Email belum diisi!");

    try {
      const res = await fetch("http://localhost:5000/auth/password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmailForReset, code }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Kode OTP benar. Silakan ubah password Anda.");
        resetToken = data.reset_token;
        container.classList.add("change-password-mode");
        container.classList.remove("verify-email-mode");
      } else {
        alert(data.message || "Kode OTP salah atau kadaluarsa.");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal verifikasi kode OTP.");
    }
  });
}

// === Step 3: Simpan password baru ===
if (changePasswordButton) {
  changePasswordButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const newPassword = changePasswordForm.querySelector("input[placeholder='New Password']").value.trim();
    const confirmPassword = changePasswordForm.querySelector("input[placeholder='Confirm New Password']").value.trim();

    if (!newPassword || !confirmPassword)
      return alert("Password baru dan konfirmasi wajib diisi!");
    if (newPassword !== confirmPassword)
      return alert("Password tidak cocok!");
    if (!resetToken)
      return alert("Token reset tidak ditemukan. Ulangi proses dari awal!");

    try {
      const res = await fetch("http://localhost:5000/auth/password/set-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reset_token: resetToken,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Password berhasil diubah. Silakan login kembali.");
        resetToken = "";
        userEmailForReset = "";
        container.classList.remove("change-password-mode", "verify-email-mode", "forgot-password-mode");
      } else {
        alert(data.message || "Gagal mengubah password.");
      }
    } catch (err) {
      console.error(err);
      alert("Kesalahan server saat menyimpan password baru.");
    }
  });
}

// =======================
// SIGN UP / REGISTER
// =======================
const registerBtn = document.querySelector(".sign-up button");

registerBtn.addEventListener("click", async () => {
  const firstName = document.querySelector(".sign-up input[placeholder='First Name']").value.trim();
  const lastName = document.querySelector(".sign-up input[placeholder='Last Name']").value.trim();
  const email = document.querySelector(".sign-up input[type='email']").value.trim();
  const password = document.querySelector(".sign-up input[type='password']").value.trim();
  const phoneInput = document.querySelector(".sign-up input[placeholder='No Handphone']");
  const phone = phoneInput ? phoneInput.value.trim() : "";

  if (!firstName || !lastName || !email || !password || !phone) {
    return alert("Semua field wajib diisi!");
  }

  const phoneRegex = /^(\+62|0)[0-9]{8,13}$/;
  if (!phoneRegex.test(phone)) {
    return alert("Nomor handphone tidak valid! Gunakan format 08xxx atau +628xxx");
  }

  try {
    const res = await fetch("http://localhost:5000/auth/userRegister", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_first_name: firstName,
        user_last_name: lastName,
        user_email: email,
        user_password: password,
        user_phone: phone,
      }),
    });

    const data = await res.json();

    if (data.statusCode === 200) {
      alert(data.message);
      container.classList.remove("sign-up-mode");
    } else {
      alert(data.message || "Terjadi kesalahan saat registrasi.");
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_email: email, user_password: password }),
      credentials: "include",
    });

    const data = await res.json();

    if (data.statusCode === 200) {
      alert(data.message);
      window.location.href = "filelist.html";
    } else {
      alert(data.message || "Gagal login. Periksa email dan password Anda.");
    }
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan server.");
  }
});

// =======================
// LOGIKA AUTO-TAB OTP
// =======================
const otpInputs = document.querySelectorAll(".otp-input");
otpInputs.forEach((input, index) => {
  input.addEventListener("keyup", (e) => {
    if (["ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) return;
    if (e.key !== "Backspace" && input.value.length === 1 && index < otpInputs.length - 1) {
      otpInputs[index + 1].focus();
    }
    if (e.key === "Backspace" && index > 0 && input.value.length === 0) {
      otpInputs[index - 1].focus();
    }
  });

  input.addEventListener("paste", (e) => {
    e.preventDefault();
    const pasteData = (e.clipboardData || window.clipboardData).getData("text").slice(0, otpInputs.length);
    pasteData.split("").forEach((char, i) => {
      if (otpInputs[i]) otpInputs[i].value = char;
    });
    otpInputs[Math.min(otpInputs.length - 1, pasteData.length - 1)].focus();
  });
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
