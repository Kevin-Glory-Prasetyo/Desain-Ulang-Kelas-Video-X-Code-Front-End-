// ==================== PREVIEW FOTO PROFIL ====================
document.getElementById("user_image").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    document.getElementById("profile-preview").src = URL.createObjectURL(file);
  }
});

// ==================== DROPDOWN PROFIL ====================
const panah = document.querySelector(".panah-bawah");
const dropdown = document.getElementById("dropdown");

panah.addEventListener("click", () => {
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
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
      credentials: "include", // penting agar cookie ikut dikirim
    });
    const data = await res.json();
    if (data.statusCode === 200) {
      // hapus cache foto lokal
      localStorage.removeItem("profileImage");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Gagal logout");
    }
  } catch (err) {
    console.error(err);
    window.location.href = "login.html";
  }
});

// ==================== AMBIL DATA PROFIL DARI DATABASE ====================
async function loadProfile() {
  try {
    const res = await fetch("http://localhost:5000/api/profile", {
      method: "GET",
      credentials: "include", // kirim cookie token ke backend
    });

    if (res.status === 401 || res.status === 403) {
      alert("Silakan login terlebih dahulu!");
      window.location.href = "login.html";
      return;
    }

    if (!res.ok) throw new Error("Gagal memuat data profil");

    const data = await res.json();

    // Isi kolom form otomatis
    document.getElementById("user_first_name").value = data.user_first_name || "";
    document.getElementById("user_last_name").value = data.user_last_name || "";
    document.getElementById("user_email").value = data.user_email || "";
    document.getElementById("user_phone").value = data.user_phone || "";

    // Update header nama & email
    document.querySelector(".nama-pengguna").textContent = `${data.user_first_name} ${data.user_last_name}`;
    document.querySelector(".email-pengguna").textContent = data.user_email;

    // Update bagian atas kartu profil
    document.querySelector(".user-details h3").textContent = `${data.user_first_name} ${data.user_last_name}`;
    document.querySelector(".user-details p").textContent = data.user_email;

    // Update foto profil (preview + header)
    const profilePreview = document.getElementById("profile-preview");
    const fotoHeader = document.querySelector(".foto-profil");
    const imageURL = data.user_image
      ? `http://localhost:5000${data.user_image}`
      : "../image/profile.png";

    profilePreview.src = imageURL;
    if (fotoHeader) fotoHeader.src = imageURL;

    // Simpan ke localStorage agar halaman lain konsisten
    localStorage.setItem("profileImage", imageURL);
  } catch (err) {
    console.error(err);
    alert("Gagal mengambil data profil");
  }
}

document.addEventListener("DOMContentLoaded", loadProfile);

// ==================== UPDATE PROFIL ====================
document.getElementById("editProfileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("user_first_name", document.getElementById("user_first_name").value);
  formData.append("user_last_name", document.getElementById("user_last_name").value);
  formData.append("user_phone", document.getElementById("user_phone").value);

  // jika ada gambar baru
  const imageFile = document.getElementById("user_image").files[0];
  if (imageFile) formData.append("user_image", imageFile);

  // jika user ingin ganti password
  const newPassword = document.getElementById("user_password").value;
  if (newPassword) formData.append("new_password", newPassword);

  try {
    const res = await fetch("http://localhost:5000/api/profile/update", {
      method: "PUT",
      credentials: "include", // kirim cookie token juga
      body: formData,
    });

    if (res.status === 401 || res.status === 403) {
      alert("Sesi kamu sudah habis, silakan login kembali");
      window.location.href = "login.html";
      return;
    }

    const result = await res.json();
    alert(result.message || "Profil berhasil diperbarui");

    // Update header foto langsung tanpa reload halaman
    if (imageFile) {
      const newImageURL = URL.createObjectURL(imageFile);
      const fotoHeader = document.querySelector(".foto-profil");
      const preview = document.getElementById("profile-preview");

      if (fotoHeader) fotoHeader.src = newImageURL;
      if (preview) preview.src = newImageURL;

      localStorage.setItem("profileImage", newImageURL);
    }

    // Refresh data profil dari server
    loadProfile();
  } catch (err) {
    console.error(err);
    alert("Gagal memperbarui profil");
  }
});

// ==================== UPDATE FOTO PROFIL HEADER SAAT PAGE DIMUAT ====================
document.addEventListener("DOMContentLoaded", () => {
  const savedProfileImage = localStorage.getItem("profileImage");
  if (savedProfileImage) {
    const fotoHeader = document.querySelector(".foto-profil");
    if (fotoHeader) {
      fotoHeader.src = savedProfileImage;
    }
  }
});
