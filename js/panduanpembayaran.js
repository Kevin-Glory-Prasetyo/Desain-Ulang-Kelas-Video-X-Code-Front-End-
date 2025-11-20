document.addEventListener('DOMContentLoaded', function() {
    const guideItems = document.querySelectorAll('.guide-item');

    guideItems.forEach(item => {
        // Tambahkan event listener untuk setiap elemen details (guide-item)
        item.addEventListener('toggle', function() {
            // Cek apakah item saat ini dalam keadaan terbuka
            if (item.open) {
                // Temukan elemen induk terdekat dengan kelas '.column'
                const parentColumn = item.closest('.column');
                // Temukan semua item panduan lain (siblings) dalam kolom tersebut
                const siblings = parentColumn.querySelectorAll('.guide-item');
                
                siblings.forEach(sibling => {
                    // Tutup item lain yang sedang terbuka, kecuali item saat ini
                    if (sibling !== item && sibling.open) {
                        sibling.open = false;
                    }
                });
            }
        });
    });
});