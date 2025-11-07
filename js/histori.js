// ==================== DROPDOWN PROFIL ====================
const panah = document.querySelector(".panah-bawah");
const dropdown = document.getElementById("dropdown");

panah.addEventListener("click", () => {
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
});

window.addEventListener("click", (e) => {
  if (!e.target.closest(".bagian-profil")) {
    dropdown.style.display = "none";
  }
});

// ==================== LOGOUT ====================
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("http://localhost:5000/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (data.statusCode === 200) {
      localStorage.removeItem("profileImage"); // hapus cache foto
      window.location.href = "login.html";
    } else {
      alert(data.message || "Gagal logout");
    }
  } catch (err) {
    console.error(err);
    window.location.href = "login.html";
  }
});

// ==================== FUNGSI UTAMA HEADER ====================
async function loadHeaderProfile() {
  const fotoHeader = document.querySelector(".foto-profil");

  try {
    // 1️⃣ Ambil foto dari localStorage jika ada
    const savedProfileImage = localStorage.getItem("profileImage");
    if (savedProfileImage && fotoHeader) {
      fotoHeader.src = savedProfileImage;
    }

    // 2️⃣ Ambil data user dari server (selalu untuk nama + email)
    const res = await fetch("http://localhost:5000/api/profile", {
      method: "GET",
      credentials: "include",
    });

    if (res.status === 401 || res.status === 403) {
      alert("Silakan login terlebih dahulu!");
      window.location.href = "login.html";
      return;
    }

    const data = await res.json();

    // 3️⃣ Isi nama dan email
    document.querySelector(".nama-pengguna").textContent =
      `${data.user_first_name} ${data.user_last_name}`;
    document.querySelector(".email-pengguna").textContent = data.user_email;

    // 4️⃣ Update foto profil (jika ada perubahan dari server)
    const imageURL = data.user_image
      ? `http://localhost:5000${data.user_image}`
      : "../image/profile.png";

    if (fotoHeader) fotoHeader.src = imageURL;
    localStorage.setItem("profileImage", imageURL);
  } catch (err) {
    console.warn("Gagal memuat data header:", err);
  }
}

// Jalankan setelah halaman siap
document.addEventListener("DOMContentLoaded", loadHeaderProfile);
