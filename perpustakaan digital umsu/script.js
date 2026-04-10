/* ========================================
   PERPUSTAKAAN DIGITAL UMSU — script.js
   SOAL 4: Validasi JavaScript Form
   SOAL 5: Manipulasi DOM Dinamis
   ======================================== */

/* ===================================================
   SOAL 5 — DATA AWAL + FUNGSI DOM DINAMIS
   Data disimpan dalam array of object, min. 4 item
   Tambah / hapus tanpa reload halaman
   =================================================== */

let daftarBuku = [
  { id: 1, judul: 'Pemrograman Web Dasar', penulis: 'Dr. Ahmad Fauzi', harga: 85000 },
  { id: 2, judul: 'Kecerdasan Buatan', penulis: 'Prof. Siti Rahayu', harga: 120000 },
  { id: 3, judul: 'Sistem Basis Data', penulis: 'Ir. Budi Santoso', harga: 95000 },
  { id: 4, judul: 'Jaringan Komputer', penulis: 'Dr. Fitra Lestari', harga: 78000 },
  { id: 5, judul: 'Algoritma & Struktur Data', penulis: 'Dr. Halim Maulana', harga: 110000 },
];
let nextId = 6;

/** Format angka jadi Rupiah */
function formatRupiah(angka) {
  return 'Rp ' + parseInt(angka).toLocaleString('id-ID');
}

/** Render ulang semua item ke DOM */
function renderDaftarBuku() {
  const container = document.getElementById('itemList');
  const counter = document.getElementById('itemCount');

  if (!container) return;

  counter.textContent = daftarBuku.length + ' buku';

  if (daftarBuku.length === 0) {
    container.innerHTML =
      '<div class="empty-state">📭 Belum ada buku dalam katalog. Tambahkan buku di atas.</div>';
    return;
  }

  container.innerHTML = daftarBuku
    .map(
      (buku, index) => `
    <div class="item-row" id="item-${buku.id}">
      <div class="item-num">${index + 1}</div>
      <div class="item-detail">
        <div class="item-judul">📚 ${escapeHTML(buku.judul)}</div>
        <div class="item-penulis">✍️ ${escapeHTML(buku.penulis)}</div>
      </div>
      <div class="item-harga">${formatRupiah(buku.harga)}</div>
      <button class="btn-hapus" onclick="hapusItem(${buku.id})">🗑 Hapus</button>
    </div>
  `
    )
    .join('');
}

/** Tambah item baru tanpa reload */
function tambahItem() {
  const inputJudul = document.getElementById('inputJudul');
  const inputPenulis = document.getElementById('inputPenulis');
  const inputHarga = document.getElementById('inputHarga');

  const judul = inputJudul.value.trim();
  const penulis = inputPenulis.value.trim();
  const harga = parseInt(inputHarga.value);

  // Validasi input tambah buku
  if (!judul) {
    alert('⚠️ Judul buku tidak boleh kosong!');
    inputJudul.focus();
    return;
  }
  if (!penulis) {
    alert('⚠️ Nama penulis tidak boleh kosong!');
    inputPenulis.focus();
    return;
  }
  if (!harga || harga <= 0) {
    alert('⚠️ Harga harus berupa angka positif!');
    inputHarga.focus();
    return;
  }

  // Tambahkan ke array
  daftarBuku.push({ id: nextId++, judul, penulis, harga });

  // Reset input
  inputJudul.value = '';
  inputPenulis.value = '';
  inputHarga.value = '';

  // Render ulang
  renderDaftarBuku();
  inputJudul.focus();
}

/** Hapus item berdasarkan id tanpa reload */
function hapusItem(id) {
  const buku = daftarBuku.find((b) => b.id === id);
  if (!buku) return;

  if (confirm(`Yakin ingin menghapus "${buku.judul}"?`)) {
    daftarBuku = daftarBuku.filter((b) => b.id !== id);
    renderDaftarBuku();
  }
}

/** Escape HTML untuk keamanan XSS */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ===================================================
   SOAL 4 — VALIDASI JAVASCRIPT FORM PEMINJAMAN
   - Field wajib tidak boleh kosong
   - Format email valid
   - Minimal satu field angka (nomor HP) harus positif
   - Pesan error informatif di bawah setiap field
   =================================================== */

/** Tampilkan pesan error di bawah field */
function showError(fieldId, message) {
  const errEl = document.getElementById('err-' + fieldId);
  const inputEl = document.getElementById(fieldId) || document.querySelector(`[name="${fieldId}"]`);

  if (errEl) errEl.textContent = message;
  if (inputEl) {
    inputEl.classList.remove('valid');
    inputEl.classList.add('invalid');
  }
}

/** Hapus pesan error dan beri tanda valid */
function clearError(fieldId) {
  const errEl = document.getElementById('err-' + fieldId);
  const inputEl = document.getElementById(fieldId) || document.querySelector(`[name="${fieldId}"]`);

  if (errEl) errEl.textContent = '';
  if (inputEl) {
    inputEl.classList.remove('invalid');
    inputEl.classList.add('valid');
  }
}

/** Validasi format email menggunakan regex */
function isEmailValid(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

/** Validasi seluruh form — return true jika lolos semua */
function validateForm() {
  let isValid = true;

  // 1. Nama Lengkap — wajib, minimal 3 karakter
  const nama = document.getElementById('namaPeminjam').value.trim();
  if (!nama) {
    showError('namaPeminjam', '⚠️ Nama lengkap tidak boleh kosong.');
    isValid = false;
  } else if (nama.length < 3) {
    showError('namaPeminjam', '⚠️ Nama minimal 3 karakter.');
    isValid = false;
  } else {
    clearError('namaPeminjam');
  }

  // 2. Email — wajib + format valid
  const email = document.getElementById('emailPeminjam').value.trim();
  if (!email) {
    showError('emailPeminjam', '⚠️ Alamat email tidak boleh kosong.');
    isValid = false;
  } else if (!isEmailValid(email)) {
    showError('emailPeminjam', '⚠️ Format email tidak valid. Contoh: nama@email.com');
    isValid = false;
  } else {
    clearError('emailPeminjam');
  }

  // 3. Nomor HP — wajib + harus angka positif
  const nomorHP = document.getElementById('nomorHP').value.trim();
  const nomorAngka = parseInt(nomorHP);
  if (!nomorHP) {
    showError('nomorHP', '⚠️ Nomor telepon tidak boleh kosong.');
    isValid = false;
  } else if (isNaN(nomorAngka) || nomorAngka <= 0) {
    showError('nomorHP', '⚠️ Nomor telepon harus berupa angka positif.');
    isValid = false;
  } else if (nomorHP.length < 9 || nomorHP.length > 13) {
    showError('nomorHP', '⚠️ Nomor telepon harus antara 9–13 digit.');
    isValid = false;
  } else {
    clearError('nomorHP');
  }

  // 4. Kategori — wajib dipilih
  const kategori = document.getElementById('kategori').value;
  if (!kategori) {
    showError('kategori', '⚠️ Silakan pilih kategori buku.');
    const sel = document.getElementById('kategori');
    sel.classList.add('invalid');
    isValid = false;
  } else {
    clearError('kategori');
    document.getElementById('kategori').classList.remove('invalid');
    document.getElementById('kategori').classList.add('valid');
  }

  // 5. Judul Buku — wajib
  const judul = document.getElementById('judulBuku').value.trim();
  if (!judul) {
    showError('judulBuku', '⚠️ Judul buku tidak boleh kosong.');
    isValid = false;
  } else {
    clearError('judulBuku');
  }

  // 6. Durasi — wajib pilih salah satu radio
  const durasi = document.querySelector('input[name="durasi"]:checked');
  if (!durasi) {
    showError('durasi', '⚠️ Silakan pilih durasi peminjaman.');
    isValid = false;
  } else {
    const errEl = document.getElementById('err-durasi');
    if (errEl) errEl.textContent = '';
  }

  // 7. Format — wajib pilih minimal satu checkbox
  const formatChecked = document.querySelectorAll('input[name="format"]:checked');
  if (formatChecked.length === 0) {
    showError('format', '⚠️ Pilih minimal satu format buku.');
    isValid = false;
  } else {
    const errEl = document.getElementById('err-format');
    if (errEl) errEl.textContent = '';
  }

  return isValid;
}

/** Real-time validasi saat user mengetik */
function addRealtimeValidation() {
  const namaField = document.getElementById('namaPeminjam');
  const emailField = document.getElementById('emailPeminjam');
  const hpField = document.getElementById('nomorHP');

  if (namaField) {
    namaField.addEventListener('blur', function () {
      const val = this.value.trim();
      if (!val) {
        showError('namaPeminjam', '⚠️ Nama tidak boleh kosong.');
      } else if (val.length < 3) {
        showError('namaPeminjam', '⚠️ Nama minimal 3 karakter.');
      } else {
        clearError('namaPeminjam');
      }
    });
  }

  if (emailField) {
    emailField.addEventListener('blur', function () {
      const val = this.value.trim();
      if (!val) {
        showError('emailPeminjam', '⚠️ Email tidak boleh kosong.');
      } else if (!isEmailValid(val)) {
        showError('emailPeminjam', '⚠️ Format email tidak valid.');
      } else {
        clearError('emailPeminjam');
      }
    });
  }

  if (hpField) {
    hpField.addEventListener('blur', function () {
      const val = this.value.trim();
      const num = parseInt(val);
      if (!val) {
        showError('nomorHP', '⚠️ Nomor HP tidak boleh kosong.');
      } else if (isNaN(num) || num <= 0) {
        showError('nomorHP', '⚠️ Nomor HP harus angka positif.');
      } else {
        clearError('nomorHP');
      }
    });
  }
}

/** Handle submit form */
function handleFormSubmit(e) {
  e.preventDefault();

  if (validateForm()) {
    const successMsg = document.getElementById('successMsg');
    if (successMsg) {
      successMsg.style.display = 'block';
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Reset form setelah 3 detik
    setTimeout(() => {
      document.getElementById('peminjamanForm').reset();
      if (successMsg) successMsg.style.display = 'none';
      // Bersihkan semua class valid/invalid
      document.querySelectorAll('.valid, .invalid').forEach((el) => {
        el.classList.remove('valid', 'invalid');
      });
    }, 3000);
  }
}

/* ===================================================
   NAVBAR TOGGLE (mobile menu)
   =================================================== */
function initNavbar() {
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Tutup menu saat klik link
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
}

/* ===================================================
   INISIALISASI — DOMContentLoaded
   =================================================== */
document.addEventListener('DOMContentLoaded', function () {
  // Init navbar
  initNavbar();

  // SOAL 5: Render data awal katalog buku
  renderDaftarBuku();

  // SOAL 4: Pasang event listener form peminjaman
  const form = document.getElementById('peminjamanForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  // SOAL 4: Validasi real-time
  addRealtimeValidation();

  // Enter key pada input katalog
  const inputJudul = document.getElementById('inputJudul');
  if (inputJudul) {
    inputJudul.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') tambahItem();
    });
  }
});
