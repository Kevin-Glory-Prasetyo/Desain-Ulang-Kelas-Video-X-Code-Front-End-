// ==================== AMBIL DATA USER SAAT LOGIN ====================
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:5000/auth/filelist", {
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
  // Ambil dari localStorage (jika sudah tersimpan saat edit profile)
  const savedProfileImage = localStorage.getItem("profileImage");
  if (savedProfileImage) {
    const fotoHeader = document.querySelector(".foto-profil");
    if (fotoHeader) {
      fotoHeader.src = savedProfileImage;
    }
  } else {
    // Jika belum ada di localStorage, ambil dari API profil
    try {
      const resProfile = await fetch("http://localhost:5000/api/profile", {
        method: "GET",
        credentials: "include",
      });
      if (resProfile.ok) {
        const dataProfile = await resProfile.json();
        const fotoHeader = document.querySelector(".foto-profil");
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

  // ==================== LOAD PRODUK SAAT HALAMAN SIAP ====================
  loadProducts();
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
      localStorage.removeItem("profileImage"); // bersihkan cache foto
      window.location.href = "login.html";
    } else {
      alert(data.message || "Gagal logout");
    }
  } catch (err) {
    console.error(err);
    window.location.href = "login.html";
  }
});

// ==================== AMBIL & TAMPILKAN PRODUK DARI DATABASE ====================
const fileContainer = document.getElementById("file-container");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageNumbersContainer = document.getElementById("pageNumbers");

let currentPage = 1;
let totalPages = 1;
const videosPerPage = 6;

async function loadProducts(page = 1) {
  try {
    const res = await fetch(
      `http://localhost:5000/api/products?page=${page}&limit=${videosPerPage}`,
      { credentials: "include" }
    );
    console.log("Status:", res.status);
    const result = await res.json();
    console.log("Result:", result);

    if (!res.ok) throw new Error(result.message || "Gagal mengambil data produk");

    currentPage = result.currentPage;
    totalPages = result.totalPages;

    renderProducts(result.data);
    updatePaginationControls();
  } catch (err) {
    console.error("Gagal ambil produk:", err);
    fileContainer.innerHTML = "<p>Gagal memuat produk</p>";
  }
}

function renderProducts(products) {
  fileContainer.innerHTML = "";
  products.forEach((p) => {
    const fileCard = document.createElement("div");
    fileCard.className = "file-card";
    fileCard.innerHTML = `
      <img src="../${p.gambarProduk}" alt="${p.namaProduk}" />
      <h3>${p.namaProduk}</h3>
      <p class="file-date">${new Date(p.tanggal).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}</p>
      <p class="file-price">Rp ${p.harga.toLocaleString("id-ID")}</p>
      <a href="detailproduk.html?id=${p.id}">Buy</a>
    `;
    fileContainer.appendChild(fileCard);
  });
}

function updatePaginationControls() {
  pageNumbersContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.innerText = i;
    pageBtn.className = `page-btn ${i === currentPage ? "active" : ""}`;
    pageBtn.addEventListener("click", () => {
      loadProducts(i);
    });
    pageNumbersContainer.appendChild(pageBtn);
  }

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  prevBtn.onclick = () => {
    if (currentPage > 1) loadProducts(currentPage - 1);
  };

  nextBtn.onclick = () => {
    if (currentPage < totalPages) loadProducts(currentPage + 1);
  };
}

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
