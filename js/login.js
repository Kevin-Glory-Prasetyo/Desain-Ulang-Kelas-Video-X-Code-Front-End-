// =====================================================
// SWITCH FORM LOGIN <-> SIGN UP
// =====================================================
const container = document.getElementById("container");
const toSignUp = document.getElementById("toSignUp");
const toLogin = document.getElementById("toLogin");
const toForgotPassword = document.getElementById("toForgotPassword");

// Form terkait flow forgot-password
const forgotPasswordForm = document.querySelector(".forgot-password");
const verifyEmailForm = document.querySelector(".verify-email");
const changePasswordForm = document.querySelector(".change-password");

// Tombol
const sendOtpButton = forgotPasswordForm?.querySelector("button");
const verifyButton = document.getElementById("verify-btn");
const changePasswordButton = changePasswordForm?.querySelector("button");

// Variabel global email untuk reset password
let userEmailForReset = "";

// =====================================================
// MODE SWITCHING (Login <-> Signup)
// =====================================================
toSignUp?.addEventListener("click", (e) => {
  e.preventDefault();
  container.classList.add("sign-up-mode");
  container.classList.remove("forgot-password-mode", "verify-email-mode", "change-password-mode");
});

toLogin?.addEventListener("click", (e) => {
  e.preventDefault();
  container.classList.remove("sign-up-mode", "forgot-password-mode", "verify-email-mode", "change-password-mode");
});

// =====================================================
// FORGOT PASSWORD FLOW
// =====================================================
toForgotPassword?.addEventListener("click", (e) => {
  e.preventDefault();
  container.classList.add("forgot-password-mode");
  container.classList.remove("sign-up-mode");
});

// Step 1 — Send OTP
sendOtpButton?.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = forgotPasswordForm.querySelector("input[type='email']").value.trim();
  if (!email) return alert("Email wajib diisi!");

  userEmailForReset = email;

  alert("Simulasi: OTP dikirim ke " + userEmailForReset);
  container.classList.add("verify-email-mode");
  container.classList.remove("forgot-password-mode");
});

// Step 2 — Verify OTP
verifyButton?.addEventListener("click", async (e) => {
  e.preventDefault();

  alert("Logika verifikasi OTP belum dihubungkan ke backend.");

  container.classList.add("change-password-mode");
  container.classList.remove("verify-email-mode");
});

// Step 3 — Change Password
changePasswordButton?.addEventListener("click", async (e) => {
  e.preventDefault();

  const newPassword = changePasswordForm.querySelector("input[placeholder='New Password']").value.trim();
  const confirmPassword = changePasswordForm.querySelector("input[placeholder='Confirm New Password']").value.trim();

  if (!newPassword || !confirmPassword) return alert("Semua field wajib diisi!");
  if (newPassword !== confirmPassword) return alert("Password tidak cocok!");
  if (!userEmailForReset) return alert("Email tidak ditemukan. Ulangi proses.");

  try {
    const res = await fetch("http://localhost:5000/auth/resetPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_email: userEmailForReset,
        new_password: newPassword,
      }),
    });

    const data = await res.json();

    if (data.statusCode === 200) {
      alert(data.message || "Password berhasil diubah.");

      container.classList.remove("change-password-mode", "sign-up-mode", "forgot-password-mode", "verify-email-mode");
      userEmailForReset = "";
    } else alert(data.message || "Gagal mengubah password.");

  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan server.");
  }
});

// =====================================================
// SIGN UP / REGISTER
// =====================================================
const registerBtn = document.querySelector(".sign-up button");

registerBtn?.addEventListener("click", async () => {
  const firstName = document.querySelector(".sign-up input[placeholder='First Name']").value.trim();
  const lastName = document.querySelector(".sign-up input[placeholder='Last Name']").value.trim();
  const email = document.querySelector(".sign-up input[type='email']").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.querySelector(".sign-up input[type='password']").value.trim();

  if (!firstName || !lastName || !email || !password || !phone)
    return alert("Semua field wajib diisi!");

  const phoneRegex = /^(\+62|0)[0-9]{8,13}$/;
  if (!phoneRegex.test(phone)) return alert("Format nomor handphone salah!");

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
    } else alert(data.message || "Gagal melakukan registrasi.");

  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan server.");
  }
});

// =====================================================
// LOGIN USER
// =====================================================
const loginBtn = document.querySelector(".sign-in button");

loginBtn?.addEventListener("click", async () => {
  const email = document.querySelector(".sign-in input[type='email']").value.trim();
  const password = document.querySelector(".sign-in input[type='password']").value.trim();

  if (!email || !password) return alert("Email dan password wajib diisi!");

  try {
    const res = await fetch("http://localhost:5000/auth/userLogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_email: email, user_password: password }),
      credentials: "include", // penting untuk kirim cookie token
    });

    const data = await res.json();

    if (data.statusCode === 200) {
      // simpan token jika backend memberikan token (opsional)
      if (data.token) localStorage.setItem("token", data.token);

      alert(data.message);
      window.location.href = "filelist.html";
    } else {
      alert(data.message || "Login gagal.");
    }

  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan server.");
  }
});

// =====================================================
// AUTO-REDIRECT JIKA SUDAH LOGIN
// =====================================================
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:5000/auth/checkLogin", {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) window.location.href = "filelist.html";

  } catch {
    console.log("Belum login atau token invalid.");
  }
});

// =====================================================
// OTP Auto-tab Input
// =====================================================
const otpInputs = document.querySelectorAll(".otp-input");

otpInputs.forEach((input, index) => {
  input.addEventListener("keyup", (e) => {
    if (["ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) return;

    if (e.key !== "Backspace" && input.value.length === 1 && index < otpInputs.length - 1)
      otpInputs[index + 1].focus();

    if (e.key === "Backspace" && index > 0 && input.value === "")
      otpInputs[index - 1].focus();
  });

  input.addEventListener("paste", (e) => {
    e.preventDefault();
    const pasteText = e.clipboardData.getData("text").slice(0, otpInputs.length);

    pasteText.split("").forEach((char, i) => {
      if (otpInputs[i]) otpInputs[i].value = char;
    });

    otpInputs[Math.min(otpInputs.length - 1, pasteText.length - 1)].focus();
  });
});
