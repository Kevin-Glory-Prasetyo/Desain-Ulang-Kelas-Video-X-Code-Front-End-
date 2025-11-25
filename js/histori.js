const API_BASE_URL = window.API_ORIGIN || 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', () => {
  if (typeof loadHeaderProfile === "function") loadHeaderProfile();
  loadHistori();
});

async function loadHistori() {
  const tableBody = document.getElementById('histori-table-body');
  
  try {
    const res = await fetch(`${API_BASE_URL}/api/histori`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('token') ? { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        } : {})
      }
    });

    // Handle error response (401 / 403)
    if (res.status === 401 || res.status === 403) {
      alert("Sesi Anda telah habis. Silakan login kembali.");
      window.location.href = "login.html";
      return;
    }

    // Jika bukan 200 OK → tampilkan pesan tanpa membaca body dua kali
    if (!res.ok) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center">
            Gagal memuat data (status ${res.status})
          </td>
        </tr>`;
      return;
    }

    // Baca body hanya sekali
    const json = await res.json();
    console.log("Histori Data:", json);

    renderTable(json);

  } catch (err) {
    console.error("Error loadHistori:", err);
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center">
          Gagal terhubung ke server. Pastikan backend jalan.
        </td>
      </tr>`;
  }
}

function renderTable(data) {
  const tbody = document.getElementById('histori-table-body');
  tbody.innerHTML = "";

  if (!Array.isArray(data) || data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding: 20px;">
          Belum ada riwayat transaksi
        </td>
      </tr>`;
    return;
  }

  data.forEach(item => {
    const tanggal = new Date(item.tanggal).toLocaleDateString('id-ID');
    const harga = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
      .format(item.harga);

    const row = `
      <tr>
        <td>${tanggal}</td>
        <td>${item.namaProduk || '-'}</td>
        <td>${harga}</td>
        <td>${item.status}</td>
        <td>${item.metodepembayaran}</td>
        <td>${item.buktiupload ? 'Sudah Upload' : 'Belum Upload'}</td>
        <td>-</td>
      </tr>`;
    
    tbody.innerHTML += row;
  });
}
