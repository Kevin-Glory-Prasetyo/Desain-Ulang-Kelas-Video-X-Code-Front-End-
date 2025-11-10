// Pilih metode pembayaran
const paymentMethods = document.querySelectorAll('.payment-method');
let selectedPaymentMethod = null;

paymentMethods.forEach(method => {
    method.addEventListener('click', function() {
        // Hapus seleksi sebelumnya
        paymentMethods.forEach(m => {
            m.style.borderColor = '#ddd';
            m.style.backgroundColor = 'white';
        });
        
        // Tambahkan seleksi baru
        this.style.borderColor = '#ffffffff';
        this.style.backgroundColor = '#e3f2fd';
        
        selectedPaymentMethod = this.querySelector('span').textContent;
    });
});

// Fungsi proses pembayaran
function processPayment() {
    const checkbox = document.getElementById('agree');
    
    if (!checkbox.checked) {
        alert('Mohon setujui Persyaratan Layanan dan Kebijakan Privasi terlebih dahulu.');
        return;
    }
    
    if (!selectedPaymentMethod) {
        alert('Silakan pilih metode pembayaran terlebih dahulu.');
        return;
    }
    
    // Simulasi proses pembayaran
    const btnPayment = document.querySelector('.btn-payment');
    const originalText = btnPayment.textContent;
    
    btnPayment.textContent = 'Memproses...';
    btnPayment.disabled = true;
    btnPayment.style.opacity = '0.6';
    
    setTimeout(() => {
        alert(`Pembayaran dengan ${selectedPaymentMethod} berhasil diproses!\n\nTotal: Rp 202.000,00`);
        btnPayment.textContent = originalText;
        btnPayment.disabled = false;
        btnPayment.style.opacity = '1';
        
        // Reset form
        checkbox.checked = false;
        paymentMethods.forEach(m => {
            m.style.borderColor = '#ddd';
            m.style.backgroundColor = 'white';
        });
        selectedPaymentMethod = null;
    }, 2000);
}

// Format angka ke format Rupiah
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

// Animasi smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});