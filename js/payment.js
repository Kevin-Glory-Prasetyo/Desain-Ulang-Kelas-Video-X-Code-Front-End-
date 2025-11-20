
// Ambil semua elemen header accordion
// const accordionHeaders = document.querySelectorAll('.accordion-header');
// accordionHeaders.forEach(header => {
//     header.addEventListener('click', () => {
//         const accordionItem = header.parentElement;
//         accordionItem.classList.toggle('active');

//     });
// });


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

// ==================== VALIDASI CHECKBOX (BARU) ====================
// Ambil elemennya
const termsCheck = document.getElementById('terms-check');
const buyButton = document.querySelector('.buy-button');

// Fungsi untuk mengecek status & update tombol
function validateTerms() {
  // Tombol akan disabled (mati) JIKA checkbox TIDAK dicentang
  buyButton.disabled = !termsCheck.checked;
}

// 1. Jalankan fungsi saat halaman pertama kali dimuat
// (Ini akan mengecek apakah checkbox-nya 'checked' dari awal)
validateTerms();

// 2. Tambahkan listener 'change' pada checkbox
termsCheck.addEventListener('change', validateTerms);


// Payment Detail Produk 
const API_ORIGIN = "http://localhost:5000"; // <- pastikan ini sesuai server Anda (port 5000)

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function formatRupiah(number) {
  if (number == null || isNaN(number)) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(number));
}

function formatNumberPlain(number) {
  if (number == null || isNaN(number)) return "-";
  return Number(number).toLocaleString("id-ID");
}

function showError(message) {
  const summary = document.querySelector(".summary-column");
  if (summary) {
    summary.innerHTML = `<div class="white-card"><p style="color: #c00;">${message}</p></div>`;
  } else {
    alert(message);
  }
}

async function loadProductDetail() {
  const id = getQueryParam("id");
  if (!id) {
    showError("Produk tidak ditemukan (parameter id kosong).");
    return;
  }

  // PENTING: gunakan API_ORIGIN supaya fetch ke backend port 5000 (bukan ke 5501)
  const url = `${API_ORIGIN}/api/products/${encodeURIComponent(id)}`;

  try {
    console.log("Fetching product from:", url);
    const res = await fetch(url, { credentials: "include" });

    // Debug: lihat status di console bila gagal
    if (!res.ok) {
      console.warn("Response status:", res.status, await res.text().catch(() => ""));
      if (res.status === 404) {
        showError("Produk tidak ditemukan (404).");
      } else {
        showError(`Gagal memuat produk (HTTP ${res.status}).`);
      }
      return;
    }

    const product = await res.json();

    // DOM elements
    const imgEl = document.querySelector(".product-image");
    const titleEl = document.querySelector(".product-title");
    const metaEl = document.querySelector(".product-meta");
    const priceEl = document.querySelector(".product-price");

    // price summary elements (by class)
    const priceHargaEl = document.querySelector(".price-harga");
    const priceFeeEl = document.querySelector(".price-fee");
    const priceTotalEl = document.querySelector(".price-total");

    // Use gambarUrl if backend provides it
    const gambar = product.gambarUrl || product.gambarProduk || "/image/produk.jpg";
    if (imgEl) imgEl.src = gambar;
    if (titleEl) titleEl.textContent = product.namaProduk || "-";

    const jumlah = product.jumlahmateri ?? product.jumlahMateri ?? "-";
    const durasi = product.durasimateri ?? product.durasi ?? "-";
    if (metaEl) metaEl.textContent = `${jumlah} Materi | ${durasi}`;
    const harga = Number(product.harga ?? 0);
    if (priceEl) priceEl.textContent = formatRupiah(harga);

    // fee 1% (ubah sesuai kebutuhan)
    const fee = Math.round(harga * 0.01);
    const total = harga + fee;

    if (priceHargaEl) priceHargaEl.textContent = formatRupiah(harga);
    if (priceFeeEl) priceFeeEl.textContent = formatRupiah(fee);
    if (priceTotalEl) priceTotalEl.textContent = formatRupiah(total);

    // fallback: jika struktur price-summary lain, update whole container
    const priceSummaryContainer = document.querySelector(".price-summary");
    if (priceSummaryContainer && (!priceHargaEl || !priceFeeEl || !priceTotalEl)) {
      priceSummaryContainer.innerHTML = `
        <div class="price-line"><span>Harga</span><span class="price-harga">${formatRupiah(harga)}</span></div>
        <div class="price-line"><span>Fee</span><span class="price-fee">${formatRupiah(fee)}</span></div>
        <hr class="divider">
        <div class="price-line total"><span>Total</span><span class="price-total">${formatRupiah(total)}</span></div>
      `;
    }

    // Terms / buy button logic
    const termsCheckbox = document.getElementById("terms-check");
    const buyButton = document.querySelector(".buy-button");
    if (termsCheckbox && buyButton) {
      const updateButton = () => {
        buyButton.disabled = !termsCheckbox.checked;
      };
      termsCheckbox.addEventListener("change", updateButton);
      updateButton();
    }
    if (buyButton) {
      buyButton.addEventListener("click", () => {
        window.location.href = `panduanpembayaran.html`;
      });
    }
  } catch (err) {
    console.error("Error fetching product:", err);
    showError("Terjadi kesalahan saat memuat produk. Silakan coba lagi.");
  }
}

document.addEventListener("DOMContentLoaded", loadProductDetail);