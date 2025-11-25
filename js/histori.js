const API_BASE_URL = window.API_ORIGIN || 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', () => {
  loadHistori();
});

// ========================================================
// LOAD HISTORI
// ========================================================
async function loadHistori() {
  const tableBody = document.getElementById('histori-table-body');

  try {
    const res = await fetch(`${API_BASE_URL}/api/histori`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (!res.ok) {
      tableBody.innerHTML =
        `<tr><td colspan="7" style="text-align:center;">Gagal memuat data</td></tr>`;
      return;
    }

    const data = await res.json();
    renderTable(data);

  } catch (err) {
    tableBody.innerHTML =
      `<tr><td colspan="7" style="text-align:center;">Tidak bisa terhubung ke server</td></tr>`;
  }
}

// ========================================================
// RENDER TABEL
// ========================================================
function renderTable(data) {
  const tbody = document.getElementById("histori-table-body");
  tbody.innerHTML = "";

  data.forEach(item => {
    const tanggal = new Date(item.tanggal).toLocaleDateString("id-ID");
    const harga = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(item.harga);

    const buktiUI = item.buktiupload
      ? `${item.buktiupload}`
      : `
         <label class="btn-upload">
            <i class="bi bi-upload"></i> Upload
            <input type="file" hidden onchange="handleUpload(${item.idpembelian}, this)">
         </label>
        `;


    const row = `
      <tr>
        <td>${tanggal}</td>
        <td>${item.namaProduk || "-"}</td>
        <td>${harga}</td>
        <td>${item.status}</td>
        <td>${item.metodepembayaran}</td>
        <td>${buktiUI}</td>
        <td>-</td>
      </tr>
    `;

    tbody.innerHTML += row;
  });
}


async function handleUpload(idpembelian, inputFile) {
  const file = inputFile.files[0];
  if (!file) return alert("Pilih file dulu!");

  const formData = new FormData();
  formData.append("bukti", file);

  try {
    const res = await fetch(`${API_BASE_URL}/api/upload-bukti/${idpembelian}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: formData
    });

    const json = await res.json();

    if (json.success) {
      alert("Upload bukti berhasil!");
      loadHistori(); // refresh
    } else {
      alert(json.message);
    }
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan server saat upload");
  }
}

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

window.handleUpload = handleUpload;

