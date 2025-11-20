document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:5000/produk/detailproduk", {
      method: "GET",
      credentials: "include",
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = "login.html";
      return;
    }

    const data = await res.json();

    if (res.ok && data.user) {
      const namaPengguna = document.querySelector(".nama-pengguna");
      const emailPengguna = document.querySelector(".email-pengguna");

      namaPengguna.textContent = `${data.user.first_name} ${data.user.last_name}`;
      emailPengguna.textContent = data.user.email;

      console.log("Data user:", data.user);
    } else {
      alert(data.message || "Terjadi kesalahan");
    }
  } catch (err) {
    console.error("Fetch gagal:", err);
    window.location.href = "login.html";
  }

  // ==================== FOTO PROFIL HEADER ====================
  const fotoHeader = document.querySelector(".foto-profil");
  const savedProfileImage = localStorage.getItem("profileImage");

  // 1️⃣ Ambil dari localStorage lebih dulu
  if (savedProfileImage && fotoHeader) {
    fotoHeader.src = savedProfileImage;
  } else {
    // 2️⃣ Jika belum ada, ambil dari server (data terbaru)
    try {
      const resProfile = await fetch("http://localhost:5000/api/profile", {
        method: "GET",
        credentials: "include",
      });

      if (resProfile.ok) {
        const dataProfile = await resProfile.json();
        const imageURL = dataProfile.user_image
          ? `http://localhost:5000${dataProfile.user_image}`
          : "../image/profile.png";

        if (fotoHeader) fotoHeader.src = imageURL;
        localStorage.setItem("profileImage", imageURL);
      }
    } catch (err) {
      console.warn("Gagal memuat foto profil header:", err);
    }
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

// ==================== DETAIL PRODUK ====================
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function fetchDetailProduk(id) {
  try {
    const res = await fetch(`http://localhost:5000/produk/detailproduk/${id}`);
    if (!res.ok) throw new Error("Gagal ambil detail produk");

    const data = await res.json();
    const produk = data.data;

    const judulProduk = document.querySelector(".judulProduk h3");
    const informasiProduk = document.querySelector(".informasiProduk p");
    const hargaProduk = document.querySelector(".aksi-pembelian .harga");
    const gambarProduk = document.querySelector(".gambarProduk img");

    if (judulProduk) judulProduk.textContent = produk.namaProduk;
    if (informasiProduk) informasiProduk.textContent = produk.deskripsi;
    if (hargaProduk)
      hargaProduk.textContent = `Rp ${produk.harga.toLocaleString("id-ID")}`;
    if (gambarProduk) gambarProduk.src = `../${produk.gambarProduk}`;

    const materi = produk.materi.split(",");
    const skill = produk.skill.split(",");

    const checklistMateri = document.getElementById("checklist-materi");
    const checklistSkill = document.getElementById("checklist-skill");

    materi.forEach((m) => {
      const li = document.createElement("li");
      li.textContent = m.trim();
      checklistMateri.appendChild(li);
    });

    skill.forEach((s) => {
      const li = document.createElement("li");
      li.textContent = s.trim();
      checklistSkill.appendChild(li);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchDetailProduk(id);

// Redirect Tombol Beli ke Payment 
(function () {
  // fungsi helper ready
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(() => {
    try {
      // gunakan id yang sudah didefinisikan sebelumnya di file ini
      if (!id) return;

      // fungsi attach dengan retry kecil, karena tombol mungkin dibuat/manipulasi oleh script lain
      const attach = () => {
        const tombol = document.querySelector(".tombol-beli");
        if (!tombol) {
          // coba lagi sampai 50 kali (50 * 50ms = 2500ms)
          if ((attach._tries = (attach._tries || 0) + 1) < 50) {
            setTimeout(attach, 50);
          }
          return;
        }

        // pastikan listener hanya dipasang sekali
        if (tombol._hasBuyListener) return;
        tombol._hasBuyListener = true;

        tombol.addEventListener("click", (e) => {
          e.preventDefault();
          // redirect ke payment.html dengan query param id
          window.location.href = `payment.html?id=${encodeURIComponent(id)}`;
        });
      };

      attach();
    } catch (err) {
      // jangan ganggu fungsi lain jika error
      console.warn("Buy-redirect error:", err);
    }
  });
})();