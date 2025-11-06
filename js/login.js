// =======================
// SWITCH FORM LOGIN <-> SIGN UP
// =======================
const container = document.getElementById("container");
const toSignUp = document.getElementById("toSignUp");
const toLogin = document.getElementById("toLogin");

// --- TAMBAHAN: Selector untuk alur Forgot Password ---
const toForgotPassword = document.getElementById("toForgotPassword");

// Mengambil form dan tombol untuk alur forgot password
const forgotPasswordForm = document.querySelector(".forgot-password");
const verifyEmailForm = document.querySelector(".verify-email");
const changePasswordForm = document.querySelector(".change-password");

// Tombol-tombol di alur baru
const sendOtpButton = forgotPasswordForm.querySelector("button");
const verifyButton = document.getElementById("verify-btn");
const changePasswordButton = changePasswordForm.querySelector("button");

// --- TAMBAHAN BARU: Variabel global untuk menyimpan email ---
let userEmailForReset = "";
// --- AKHIR TAMBAHAN ---

toSignUp.addEventListener("click", (e) => {
  e.preventDefault();
  container.classList.add("sign-up-mode");
  // --- TAMBAHAN: Pastikan mode lain non-aktif ---
  container.classList.remove("forgot-password-mode");
  container.classList.remove("verify-email-mode");
  container.classList.remove("change-password-mode");
});

toLogin.addEventListener("click", (e) => {
  e.preventDefault();
  // --- PERBAIKAN: Hapus semua mode lain untuk kembali ke login ---
  container.classList.remove("sign-up-mode");
  container.classList.remove("forgot-password-mode");
  container.classList.remove("verify-email-mode");
  container.classList.remove("change-password-mode");
});

// --- MODIFIKASI: Logika Alur Forgot Password ---
// =======================
// FORGOT PASSWORD FLOW
// =======================
if (toForgotPassword) {
  toForgotPassword.addEventListener("click", (e) => {
    e.preventDefault();
    // Tampilkan form forgot password
    container.classList.add("forgot-password-mode");
    // Sembunyikan form lain jika aktif
    container.classList.remove("sign-up-mode");
  });
}

if (sendOtpButton) {
  // --- MODIFIKASI: Dibuat async untuk handle API call (walau sekarang di-komen) ---
  sendOtpButton.addEventListener("click", async (e) => {
    e.preventDefault();

    // --- TAMBAHAN: Ambil dan simpan email ---
    const email = forgotPasswordForm
      .querySelector("input[type='email']")
      .value.trim();
    if (!email) {
      return alert("Email wajib diisi!");
    }
    // Simpan email di variabel global
    userEmailForReset = email;
    // --- AKHIR TAMBAHAN ---

    // TODO: Tambahkan logika fetch API /auth/forgotPassword di sini
    // Contoh:
    // try {
    //   const res = await fetch("http://localhost:5000/auth/forgotPassword", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ user_email: userEmailForReset }),
    //   });
    //   const data = await res.json();
    //   if (data.statusCode === 200) {
    //     alert(data.message || "OTP telah dikirim ke email Anda.");
    //     container.classList.add("verify-email-mode");
    //     container.classList.remove("forgot-password-mode");
    //   } else {
    //     alert(data.message || "Gagal mengirim OTP.");
    //   }
    // } catch (err) {
    //   alert("Terjadi kesalahan server saat mengirim OTP.");
    // }

    // Untuk testing frontend, kita lanjut saja:
    alert("Simulasi: Mengirim OTP ke " + userEmailForReset);
    container.classList.add("verify-email-mode");
    container.classList.remove("forgot-password-mode");
  });
}

if (verifyButton) {
  verifyButton.addEventListener("click", async (e) => {
    e.preventDefault();
    // TODO: Tambahkan logika fetch API /auth/verifyOtp di sini
    // Anda mungkin perlu mengirim OTP dan userEmailForReset
    console.log("Memverifikasi OTP...");
    alert("Logika verifikasi OTP belum terhubung ke backend.");

    // Pindah ke layar change password
    container.classList.add("change-password-mode");
    container.classList.remove("verify-email-mode");
  });
}

if (changePasswordButton) {
  // --- MODIFIKASI: Implementasi penuh ---
  changePasswordButton.addEventListener("click", async (e) => {
    e.preventDefault();

    // 1. Ambil input password
    const newPassword = changePasswordForm
      .querySelector("input[placeholder='New Password']")
      .value.trim();
    const confirmPassword = changePasswordForm
      .querySelector("input[placeholder='Confirm New Password']")
      .value.trim();

    // 2. Validasi input
    if (!newPassword || !confirmPassword) {
      return alert("Password baru dan konfirmasi password wajib diisi!");
    }
    if (newPassword !== confirmPassword) {
      return alert("Password baru dan konfirmasi password tidak cocok!");
    }
    if (!userEmailForReset) {
      // Ini seharusnya tidak terjadi jika alurnya benar
      return alert(
        "Email pengguna tidak ditemukan. Harap ulangi proses dari awal."
      );
    }

    // 3. Kirim ke backend (mirip login/register)
    try {
      // Pastikan endpoint Anda sesuai, misal: /auth/resetPassword
      const res = await fetch("http://localhost:5000/auth/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: userEmailForReset, // Kirim email yang disimpan
          new_password: newPassword, // Kirim password baru
        }),
      });

      const data = await res.json();

      if (data.statusCode === 200) {
        alert(data.message || "Password berhasil diubah. Silakan login.");

        // 4. Balik ke halaman login (sesuai request)
        container.classList.remove("change-password-mode");
        // Pastikan semua mode lain juga bersih
        container.classList.remove("sign-up-mode");
        container.classList.remove("forgot-password-mode");
        container.classList.remove("verify-email-mode");

        // Reset email global setelah selesai
        userEmailForReset = "";
      } else {
        alert(data.message || "Terjadi kesalahan saat mengubah password.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server.");
    }
  });
  // --- AKHIR MODIFIKASI ---
}
// --- AKHIR MODIFIKASI ---

// =======================
// SIGN UP / REGISTER
// =======================
const registerBtn = document.querySelector(".sign-up button");

registerBtn.addEventListener("click", async () => {
  const firstName = document
    .querySelector(".sign-up input[placeholder='First Name']")
    .value.trim();
  const lastName = document
    .querySelector(".sign-up input[placeholder='Last Name']")
    .value.trim();
  const email = document
    .querySelector(".sign-up input[type='email']")
    .value.trim();
  const phone = document.getElementById("phone").value.trim(); // ✅ Ambil nomor HP
  const password = document
    .querySelector(".sign-up input[type='password']")
    .value.trim();

  // Validasi input dasar
  if (!firstName || !lastName || !email || !password || !phone) {
    return alert("Semua field wajib diisi!");
  }

  // ✅ Validasi format nomor handphone (boleh +62 atau 08, panjang 9–15 digit)
  const phoneRegex = /^(\+62|0)[0-9]{8,13}$/;
  if (!phoneRegex.test(phone)) {
    return alert(
      "Nomor handphone tidak valid! Gunakan format 08xxx atau +628xxx"
    );
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
  const email = document
    .querySelector(".sign-in input[type='email']")
    .value.trim();
  const password = document
    .querySelector(".sign-in input[type='password']")
    .value.trim();

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

// --- TAMBAHAN: Logika Auto-Tab untuk Input OTP ---
// =======================
// LOGIKA AUTO-TAB OTP
// =======================
const otpInputs = document.querySelectorAll(".otp-input");

otpInputs.forEach((input, index) => {
  input.addEventListener("keyup", (e) => {
    // Jika tombol panah, Backspace, atau Tab, jangan lakukan apa-apa
    if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Tab") {
      return;
    }

    // Logika pindah ke input berikutnya
    if (
      e.key !== "Backspace" &&
      input.value.length === 1 &&
      index < otpInputs.length - 1
    ) {
      otpInputs[index + 1].focus();
    }

    // Logika pindah ke input sebelumnya saat Backspace
    if (e.key === "Backspace" && index > 0 && input.value.length === 0) {
      otpInputs[index - 1].focus();
    }
  });

  input.addEventListener("paste", (e) => {
    e.preventDefault();
    const pasteData = (e.clipboardData || window.clipboardData)
      .getData("text")
      .slice(0, otpInputs.length);
    pasteData.split("").forEach((char, i) => {
      if (otpInputs[i]) {
        otpInputs[i].value = char;
      }
    });
    // Fokus ke input terakhir setelah paste
    otpInputs[Math.min(otpInputs.length - 1, pasteData.length - 1)].focus();
  });
});
// --- AKHIR TAMBAHAN ---

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