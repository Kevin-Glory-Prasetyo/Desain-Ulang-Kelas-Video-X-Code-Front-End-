
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




const fileData = [
  {
    img: "../image/Pixiv Fantasia T 01 4K.png",
    alt: "Video1",
    title:
      "Backup data secara otomatis di proxmox (VM, files & database) untuk keamanan data",
    date: "18 Januari 2025",
    price: "Rp 50.000,00",
  },
  {
    img: "../image/foto1.jpg",
    alt: "Video2",
    title:
      "Belajar Mikrotik untuk Pemula – Konfigurasi Dasar untuk Kebutuhan Jaringan Komputer",
    date: "10 Mei 2025",
    price: "Rp 75.000,00",
  },
  {
    img: "../image/Pixiv Fantasia T 02 4K.png",
    alt: "Video3",
    title: "Download belajar freebsd dan security hardening",
    date: "",
    price: "Rp 50.000,00",
  },
  {
    img: "../image/foto1.jpg",
    alt: "Video4",
    title: "Essential Hacking Web CMS Hacking & Security (WordPress & Joomla)",
    date: "5 Oktober 2024",
    price: "Rp 50.000,00",
  },
  {
    img: "../image/foto1.jpg",
    alt: "Video5",
    title: "Ethical Hacking & Exploit Development",
    date: "22 November 2024",
    price: "Rp 200.000,00",
  },
  {
    img: "../image/foto1.jpg",
    alt: "Video6",
    title: "Ethical Hacking dan Eksplorasi Kerentanan dalam OWASP Top 10",
    date: "27 Desember 2024",
    price: "Rp 150.000,00",
  },
  {
    img: "../image/foto1.jpg",
    alt: "Video7",
    title: "Ethical Web Application Hacking & Security V2",
    date: "1 November 2024",
    price: "Rp 100.000,00",
  },
  {
    img: "../image/foto1.jpg",
    alt: "Video8",
    title: "Membangun Apache Web Server dengan keamanan yang optimal V2",
    date: "16 Mei 2025",
    price: "Rp 75.000,00",
  },
  {
    img: "../image/foto1.jpg",
    alt: "Video9",
    title:
      "Membangun Infrastruktur Modern Berbasis HTTPS Reverse Proxy dengan Proxmox",
    date: "Mei 2025",
    price: "Rp 75.000,00",
  },
  {
    img: "../image/foto1.jpg",
    alt: "Video10",
    title: "Membangun Server Monolith dengan Docker dengan cepat dan mudah",
    date: "",
    price: "Rp 75.000,00",
  },
  {
    img: "../image/foto1.jpg",
    alt: "Video11",
    title:
      "Membangun layanan server dengan platform PHP modern menggunakan FrankenPHP v2",
    date: "19 April 2025",
    price: "Rp 75.000,00",
  },
  {
    img: "../image/foto1.jpg",
    alt: "Video12",
    title: "Nessus & Eksploitasi Kerentanan di Sistem & Aplikasi",
    date: "Mei 2025",
    price: "Rp 75.000,00",
  },
  {
    img: "../image/foto1.jpg",
    alt: "Video13",
    title: "Proxmox Virtual Environment (Proxmox VE) untuk kebutuhan server",
    date: "31 Januari 2025",
    price: "Rp 150.000,00",
  },
  {
    img: "../image/foto1.jpg",
    alt: "Video14",
    title:
      "Webinar Membangun Layanan Internet Kantor dengan Keamanan Maksimal menggunakan Mikrotik RouterOS v7",
    date: "29 Agustus 2024",
    price: "Rp 35.000,00",
  },
  {
    img: "../image/foto1.jpg",
    alt: "Video15",
    title: "Webinar X-code – Ethical network hacking & Security V2",
    date: "10 September 2024",
    price: "Rp 75.000,00",
  },
  {
    img: "../image/foto1.jpg",
    alt: "Video16",
    title: "Windows Hacking & Security",
    date: "",
    price: "Rp 50.000,00",
  },
];

// Pagination logic
const videosPerPage = 6;
let currentPage = 1;
const totalPages = Math.ceil(fileData.length / videosPerPage);

const fileContainer = document.getElementById("file-container");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageNumbersContainer = document.getElementById("pageNumbers");

function displayVideos(page) {
  fileContainer.innerHTML = "";
  const startIndex = (page - 1) * videosPerPage;
  const endIndex = startIndex + videosPerPage;
  const paginatedVideos = fileData.slice(startIndex, endIndex);

  paginatedVideos.forEach((file) => {
    const fileCard = document.createElement("div");
    fileCard.className = "file-card";
    fileCard.innerHTML = `
                    <img src="${file.img}" alt="${file.alt}" />
                    <h3>${file.title}</h3>
                    <p class="file-date">${file.date}</p>
                    <p class="file-price">${file.price}</p>
                    <a href="#">Buy</a>
                `;
    fileContainer.appendChild(fileCard);
  });
  updatePaginationControls();
}

function updatePaginationControls() {
  pageNumbersContainer.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.innerText = i;
    pageBtn.className = `page-btn ${i === currentPage ? "active" : ""}`;
    pageBtn.addEventListener("click", () => {
      currentPage = i;
      displayVideos(currentPage);
    });
    pageNumbersContainer.appendChild(pageBtn);
  }
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayVideos(currentPage);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    displayVideos(currentPage);
  }
});

// Initial render
document.addEventListener("DOMContentLoaded", () => {
  displayVideos(currentPage);
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





