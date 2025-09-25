// --- Ambil data user saat login ---
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

    if (res.ok) {
      const namaPengguna = document.querySelector(".nama-pengguna");
      const emailPengguna = document.querySelector(".email-pengguna");

      namaPengguna.textContent =
        data.user.first_name + " " + data.user.last_name;
      emailPengguna.textContent = data.user.email;

      console.log("Data user:", data.user);
    } else {
      alert(data.message || "Terjadi kesalahan");
    }
  } catch (err) {
    console.error("Fetch gagal:", err);
    window.location.href = "login.html";
  }
});

// --- Logout ---
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
      window.location.href = "login.html";
    } else {
      alert(data.message || "Gagal logout");
    }
  } catch (err) {
    console.error(err);
    window.location.href = "login.html";
  }
});

// --- Ambil & tampilkan produk dari database ---
const fileContainer = document.getElementById("file-container");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageNumbersContainer = document.getElementById("pageNumbers");

let currentPage = 1;
let totalPages = 1;
const videosPerPage = 6;

// Ambil produk dari API
async function loadProducts(page = 1) {
  try {
    const res = await fetch(
      `http://localhost:5000/api/products?page=${page}&limit=${videosPerPage}`,
      { credentials: "include" }
    );
    console.log("Status : ",res.status)
    const result = await res.json();
    console.log("Result : ",result)

    currentPage = result.currentPage;
    totalPages = result.totalPages;

    renderProducts(result.data);
    updatePaginationControls();
  } catch (err) {
    console.error("Gagal ambil produk:", err);
    fileContainer.innerHTML = "<p>Gagal memuat produk</p>";
  }
}

// Render produk ke halaman
function renderProducts(products) {
  fileContainer.innerHTML = "";
  products.forEach((p) => {
    const fileCard = document.createElement("div");
    fileCard.className = "file-card";
    fileCard.innerHTML = `
      <img src="http://localhost:5000${p.gambarProduk}" alt="${p.namaProduk}" />
      <h3>${p.namaProduk}</h3>
      <p class="file-date">${new Date(p.tanggal).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}</p>
      <p class="file-price">Rp ${p.harga.toLocaleString("id-ID")}</p>
      <a href="#">Buy</a>
    `;
    fileContainer.appendChild(fileCard);
  });
}


// Update pagination
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

// --- Initial render ---
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});

// --- Dropdown profil ---
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
