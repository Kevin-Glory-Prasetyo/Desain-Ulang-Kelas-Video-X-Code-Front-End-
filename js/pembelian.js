// js/histori.js
document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#histori-table-body'); // sesuaikan id tbody
  const token = localStorage.getItem('token');

  async function loadHistori() {
    try {
      const res = await fetch('/api/pembelian/user', {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      const json = await res.json();
      if (!res.ok) {
        console.error(json);
        return;
      }
      renderTable(json.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  function renderTable(rows) {
    tableBody.innerHTML = '';
    rows.forEach(row => {
      const tr = document.createElement('tr');

      const tanggal = new Date(row.tanggal).toLocaleDateString('id-ID');
      tr.innerHTML = `
        <td>${tanggal}</td>
        <td>${row.namaProduk || '-'}</td>
        <td>Rp${row.harga?.toLocaleString('id-ID') || '0'}</td>
        <td><span class="status-badge">${row.status}</span></td>
        <td>${row.metodepembayaran}</td>
        <td class="upload-cell" data-id="${row.idpembelian}"></td>
        <td class="download-cell">${row.buktiupload ? '<a href="'+row.buktiupload+'" target="_blank">Preview</a>' : ''}</td>
      `;

      // handle upload cell
      const uploadCell = tr.querySelector('.upload-cell');
      if (!row.buktiupload) {
        const uploadBtn = document.createElement('button');
        uploadBtn.textContent = 'Upload bukti pembayaran';
        uploadBtn.className = 'btn-upload';
        uploadBtn.addEventListener('click', () => openFileDialog(row.idpembelian, uploadCell));
        uploadCell.appendChild(uploadBtn);
      } else {
        const img = document.createElement('img');
        img.src = row.buktiupload;
        img.style.maxWidth = '120px';
        uploadCell.appendChild(img);
      }

      tableBody.appendChild(tr);
    });
  }

  function openFileDialog(idpembelian, cell) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => uploadFile(idpembelian, input.files[0], cell);
    input.click();
  }

  async function uploadFile(idpembelian, file, cell) {
    if (!file) return;
    const form = new FormData();
    form.append('bukti', file);

    try {
      const res = await fetch(`/api/pembelian/${idpembelian}/upload`, {
        method: 'POST',
        headers: { Authorization: token ? `Bearer ${token}` : '' },
        body: form
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.message || 'Upload gagal');
        return;
      }
      // replace cell content with preview
      cell.innerHTML = '';
      const img = document.createElement('img');
      img.src = json.buktiupload;
      img.style.maxWidth = '120px';
      cell.appendChild(img);

      // optionally update status cell text in the same row
      const tr = cell.closest('tr');
      const statusCell = tr.querySelector('td:nth-child(4) .status-badge');
      if (statusCell) statusCell.textContent = 'Menunggu Verifikasi';
    } catch (err) {
      console.error(err);
      alert('Error upload');
    }
  }

  loadHistori();
});
