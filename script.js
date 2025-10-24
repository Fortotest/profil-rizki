/*
 * Menjalankan semua skrip setelah halaman HTML selesai dimuat.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // Memanggil semua fungsi inisialisasi fitur
    initThemeToggle();        // Fitur Dark Mode (Update: Single Button Logic)
    initSapaanWaktu();        // Fitur Notifikasi Sapaan (Fitur 1 Wajib)
    initGaleriInteraktif();   // Fitur Hover Galeri (Fitur 2 Wajib)
    initValidasiForm();       // Fitur Validasi Form (Fitur 3 Wajib)
    initNavbarScroll();       // Fitur Navbar Hide/Show on Scroll

});


// ===================================================================
// FUNGSI 1: Dark Mode Toggle (DENGAN LOCALSTORAGE - SINGLE BUTTON)
// ===================================================================
function initThemeToggle() {
    // Ambil tombol tema (hanya ada satu ID sekarang)
    const toggleButton = document.getElementById('theme-toggle'); 
    const body = document.body;

    if (!toggleButton) return; // Keluar jika tombol tidak ditemukan

    // --- Fungsi Helper untuk Update Ikon ---
    const updateIcon = (isDarkMode) => {
        const icon = toggleButton.querySelector('i');
        if (icon) {
           icon.className = isDarkMode ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
        }
    };

    // --- Cek LocalStorage saat load ---
    const savedTheme = localStorage.getItem('theme');
    let currentIsDarkMode = false; // Default ke light

    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        currentIsDarkMode = true;
    } else {
        body.classList.remove('dark-mode');
        currentIsDarkMode = false;
    }
    // Update ikon berdasarkan tema yang di-load
    updateIcon(currentIsDarkMode);


    // --- Fungsi Handler untuk Klik Tombol ---
    const handleToggleClick = () => {
        body.classList.toggle('dark-mode');
        currentIsDarkMode = body.classList.contains('dark-mode');
        
        // Simpan tema baru ke LocalStorage
        localStorage.setItem('theme', currentIsDarkMode ? 'dark' : 'light');
        
        // Update ikon
        updateIcon(currentIsDarkMode);
    };

    // --- Tambahkan Event Listener ke tombol ---
    toggleButton.addEventListener('click', handleToggleClick);
}


// ===================================================================
// FITUR 1 WAJIB: Sapaan Otomatis (Notifikasi Judul & Subjudul)
// ===================================================================
function initSapaanWaktu() {
    const sapaanNotif = document.getElementById('sapaan-notif');
    
    if (sapaanNotif) {
        const jamSekarang = new Date().getHours();
        let judulSapaan = "";
        const subJudulSapaan = "Senang Anda berkunjung."; // Subjudul tetap

        if (jamSekarang < 11) { judulSapaan = "Good Morning ☀️"; } 
        else if (jamSekarang < 15) { judulSapaan = "Good Afternoon 🌤️"; } 
        else if (jamSekarang < 18) { judulSapaan = "Good Afternoon 🌥️"; } 
        else { judulSapaan = "Good Evening 🌙"; }

        sapaanNotif.innerHTML = `
            <span class="notif-title">${judulSapaan}</span>
            <span class="notif-subtitle">${subJudulSapaan}</span>
        `;
        
        sapaanNotif.classList.add('show');

        setTimeout(() => { sapaanNotif.classList.remove('show'); }, 3000); 
    }
}


// ===================================================================
// FITUR 2 WAJIB: Gambar Galeri Berubah saat di-hover
// ===================================================================
function initGaleriInteraktif() {
    const semuaKartu = document.querySelectorAll('.work-card');
    
    if (semuaKartu.length > 0) {
        semuaKartu.forEach(kartu => {
            kartu.addEventListener('mouseover', () => { kartu.style.opacity = '0.85'; });
            kartu.addEventListener('mouseout', () => { kartu.style.opacity = '1'; });
        });
    }
}


// ===================================================================
// FITUR 3 WAJIB: Validasi Form (Contact) - DENGAN REDIRECT & LOADING
// ===================================================================
function initValidasiForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        const messageElement = document.getElementById('form-message');
        const submitButton = document.getElementById('submit-button'); 
        const originalButtonText = submitButton.innerHTML; 

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); 

            // === LOADING STATE AKTIF ===
            submitButton.disabled = true; 
            submitButton.innerHTML = `Sending... <i class="bi bi-arrow-clockwise spinner"></i>`; 
            messageElement.innerHTML = ''; 
            messageElement.className = ''; 
            // === AKHIR LOADING STATE ===

            const nama = document.getElementById('nama').value.trim();
            const email = document.getElementById('email').value.trim();
            const pesan = document.getElementById('pesan').value.trim();

            let isValid = true;
            let errorMessage = "";
            let successMessage = "";

            if (nama === "" || email === "" || pesan === "") {
                isValid = false;
                errorMessage = "All fields are required. (Semua field wajib diisi)";
            } else if (!isValidEmail(email)) { 
                isValid = false;
                errorMessage = "Invalid email format. (Format email tidak valid)";
            } else {
                successMessage = "Message sent! Redirecting... (Pesan terkirim! Mengarahkan...)";
            }

            // Simulasi delay
            setTimeout(() => {
                if (isValid) {
                    messageElement.innerHTML = `<i class="bi bi-check-circle-fill"></i> ${successMessage}`;
                    messageElement.className = 'form-message-success';
                    contactForm.reset(); 

                    setTimeout(() => {
                        window.location.href = "https://www.instagram.com/masffadil/";
                    }, 1500); 

                } else {
                    messageElement.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> ${errorMessage}`;
                    messageElement.className = 'form-message-error';
                    
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                }
            }, 500); 

        });
    }
}

/** Fungsi Bantuan Cek Email */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ===================================================================
// FUNGSI BARU: Navbar Hide/Show on Scroll
// ===================================================================
function initNavbarScroll() {
  const navbar = document.getElementById('mainNavbar');
  if (!navbar) return; 

  let lastScrollTop = 0;
  const delta = 5; 
  const navbarHeight = navbar.offsetHeight;

  window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Tambah kondisi: Jangan sembunyikan jika scroll sedikit dari atas
    if (scrollTop < navbarHeight / 2) { 
        navbar.classList.remove('nav-hidden');
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
        return; 
    }

    if (Math.abs(lastScrollTop - scrollTop) <= delta) return;

    if (scrollTop > lastScrollTop) { // Scroll Down
      navbar.classList.add('nav-hidden');
    } else { // Scroll Up
      navbar.classList.remove('nav-hidden');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
  }, false); 
}