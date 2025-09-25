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
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchDetailProduk(id);
