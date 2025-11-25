// ==================== KONFIGURASI ====================
const API_ORIGIN = window.API_ORIGIN || "http://localhost:5000"; 

// ==================== UTILITIES ====================
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

function showError(message) {
  const summary = document.querySelector(".summary-column");
  if (summary) {
    summary.innerHTML = `<div class="white-card"><p style="color: #c00;">${message}</p></div>`;
  } else {
    alert(message);
  }
}

// ==================== 1. LOAD PRODUK & HITUNG HARGA ====================
async function loadProductDetail() {
  const id = getQueryParam("id");
  if (!id) {
    showError("Produk tidak ditemukan (parameter id kosong).");
    return;
  }

  try {
    const res = await fetch(`${API_ORIGIN}/api/products/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error("Gagal memuat produk");

    const product = await res.json();

    const titleEl = document.querySelector(".product-title");
    const metaEl  = document.querySelector(".product-meta");
    const imgEl   = document.querySelector(".product-image");

    if (titleEl) titleEl.textContent = product.namaProduk || "-";
    if (metaEl)  metaEl.textContent  = `${product.jumlahmateri || 0} Materi | ${product.durasimateri || "-"}`;

    // 🔧 PERBAIKI BAGIAN INI
    const frontOrigin = window.location.origin; // http://localhost:5501

    if (imgEl) {
      if (product.gambarUrl) {
        // backend sudah kirim "/image/xxx"
        imgEl.src = `${frontOrigin}${product.gambarUrl}`;
      } else if (product.gambarProduk) {
        // fallback: "image/xxx" dari DB
        imgEl.src = `${frontOrigin}/${product.gambarProduk}`;
      } else {
        imgEl.src = "../image/produk.jpg"; // fallback default
      }
    }

    // Hitung Harga
    const harga = Number(product.harga ?? 0);
    const fee   = Math.round(harga * 0.001);
    const total = harga + fee;

    const priceHargaEl = document.querySelector(".price-harga");
    const priceFeeEl   = document.querySelector(".price-fee");
    const priceTotalEl = document.querySelector(".price-total");

    if (priceHargaEl) {
      priceHargaEl.textContent = formatRupiah(harga);
      priceHargaEl.dataset.value = harga;
    }
    if (priceFeeEl) {
      priceFeeEl.textContent = formatRupiah(fee);
    }
    if (priceTotalEl) {
      priceTotalEl.textContent = formatRupiah(total);
      priceTotalEl.dataset.value = total;
    }

  } catch (err) {
    console.error(err);
    showError("Gagal memuat detail produk.");
  }
}


// ==================== 2. PILIH BANK & PANDUAN ====================
function setupBankSelection() {
  const cardBri = document.getElementById('card-bri');
  const cardBca = document.getElementById('card-bca');
  const instructionSection = document.getElementById('instruction-section');
  const guideBri = document.getElementById('guide-bri');
  const guideBca = document.getElementById('guide-bca');

  function resetSelection() {
    if (cardBri) cardBri.classList.remove('active');
    if (cardBca) cardBca.classList.remove('active');
    if (instructionSection) instructionSection.style.display = 'none';
    if (guideBri) guideBri.style.display = 'none';
    if (guideBca) guideBca.style.display = 'none';
  }

  function selectBank(card, guide) {
    resetSelection();
    card.classList.add('active'); // Tambah border biru
    if (instructionSection) instructionSection.style.display = 'block';
    if (guide) guide.style.display = 'block';
  }

  if (cardBri) cardBri.addEventListener('click', () => selectBank(cardBri, guideBri));
  if (cardBca) cardBca.addEventListener('click', () => selectBank(cardBca, guideBca));
}

// ==================== 3. TOMBOL BAYAR (LOGIKA REDIRECT FIX) ====================
function setupPaymentAction() {
  const buyButton = document.querySelector('.buy-button');
  const termsCheck = document.getElementById('terms-check');

  if (termsCheck && buyButton) {
    termsCheck.addEventListener('change', () => {
        buyButton.disabled = !termsCheck.checked;
    });
  }

  if (buyButton) {
    buyButton.addEventListener("click", async (e) => {
        e.preventDefault();

        // 1. Validasi Input
        const selectedCard = document.querySelector('.payment-method-card.active');
        if (!selectedCard) {
            alert("Mohon pilih metode pembayaran (Bank) terlebih dahulu.");
            return;
        }
        const metodePembayaran = selectedCard.getAttribute('data-name'); 
        const productId = getQueryParam("id");
        const priceTotalEl = document.querySelector(".price-total");
        const hargaTotal = priceTotalEl ? priceTotalEl.dataset.value : 0;

        if (!productId || !hargaTotal) {
            alert("Data pesanan tidak valid.");
            return;
        }

        // 2. UI Loading
        buyButton.disabled = true;
        buyButton.textContent = "Memproses...";

        const token = localStorage.getItem('token');

        try {
            // 3. Kirim Request
            const res = await fetch(`${API_ORIGIN}/api/transaksi`, {
                method: "POST",
                credentials: "include", 
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    productId: productId,
                    metodePembayaran: metodePembayaran,
                    harga: hargaTotal
                })
            });

            // 4. LOGIKA REDIRECT LANGSUNG
            if (res.ok) {
                alert("Pesanan Berhasil Dibuat!");
                // Langsung redirect. Jangan menunggu proses lain.
                window.location.href = "historitransaksi.html";
                return; 
            }

            // Handle Error
            const json = await res.json();
            if (res.status === 401 || res.status === 403) {
                alert("Sesi habis. Silakan login kembali.");
                window.location.href = "login.html";
            } else {
                alert(json.message || "Gagal membuat pesanan.");
                buyButton.disabled = false;
                buyButton.textContent = "Bayar";
            }

        } catch (err) {
            console.error("Error:", err);
            alert("Terjadi kesalahan koneksi.");
            buyButton.disabled = false;
            buyButton.textContent = "Bayar";
        }
    });
  }
}

// ==================== INISIALISASI ====================
document.addEventListener("DOMContentLoaded", () => {
  loadProductDetail();
  setupBankSelection();
  setupPaymentAction();
});