document.addEventListener('DOMContentLoaded', () => {
  console.log("❤️ Petualangan cinta hari ke-5 dimulai...");

// === ANIMASI TEKS KETIK OTOMATIS ===
function typeText(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  const typing = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typing);
    }
  }, speed);
}
// === FORMAT TANGGAL INDONESIA ===
function formatDate(date) {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Intl.DateTimeFormat('id-ID', options).format(date);
}
  // === MUSIK LATAR ===
  const bgMusic = document.getElementById('bgMusic');
  const musicBtn = document.getElementById('musicControl');

  if (bgMusic && musicBtn) {
    const isMuted = localStorage.getItem('musicMuted') === 'true';
    bgMusic.muted = isMuted;
    musicBtn.innerHTML = isMuted 
      ? '<i class="fas fa-volume-mute"></i>' 
      : '<i class="fas fa-volume-up"></i>';

    musicBtn.addEventListener('click', () => {
      bgMusic.muted = !bgMusic.muted;
      localStorage.setItem('musicMuted', bgMusic.muted.toString());
      musicBtn.innerHTML = bgMusic.muted
        ? '<i class="fas fa-volume-mute"></i>'
        : '<i class="fas fa-volume-up"></i>';
      
      if (!bgMusic.muted && bgMusic.paused) {
        bgMusic.play().catch(e => console.warn("Gagal play audio:", e));
      }
    });
  }

  // === PARTIKEL HATI LATAR BELAKANG ===
  const canvas = document.createElement('canvas');
  canvas.id = 'particleCanvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class HeartParticle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * -canvas.height;
      this.size = Math.random() * 10 + 5;
      this.speed = Math.random() * 2 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.3;
    }
    update() {
      this.y += this.speed;
      if (this.y > canvas.height) {
        this.y = Math.random() * -50;
        this.x = Math.random() * canvas.width;
      }
    }
    draw() {
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = '#e91e63';
      ctx.beginPath();
      const x = this.x, y = this.y, s = this.size;
      ctx.moveTo(x, y + s * 0.3);
      ctx.bezierCurveTo(x, y, x - s * 0.7, y, x - s * 0.7, y + s * 0.3);
      ctx.bezierCurveTo(x - s * 0.7, y + s * 0.6, x, y + s, x, y + s * 0.8);
      ctx.bezierCurveTo(x, y + s, x + s * 0.7, y + s * 0.6, x + s * 0.7, y + s * 0.3);
      ctx.bezierCurveTo(x + s * 0.7, y, x, y, x, y + s * 0.3);
      ctx.fill();
    }
  }

  const particles = [];
  for (let i = 0; i < 30; i++) {
    particles.push(new HeartParticle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // === ANIMASI HATI SAAT KLIK JAWABAN ===
  function createFlyingHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'flying-heart';
    heart.innerHTML = '❤️';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    document.body.appendChild(heart);

    // Animasi
    const angle = (Math.random() - 0.5) * Math.PI; // arah acak
    const distance = 100 + Math.random() * 100;
    const duration = 800 + Math.random() * 400;

    heart.animate([
      { opacity: 0, transform: 'scale(0)' },
      { opacity: 1, transform: 'scale(1)' },
      { 
        opacity: 0, 
        transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * -distance}px) scale(1.5)` 
      }
    ], {
      duration: duration,
      easing: 'cubic-bezier(0.2, 0.8, 0.4, 1)'
    });

    // Hapus setelah animasi
    setTimeout(() => {
      heart.remove();
    }, duration);
  }

  // === NAVIGASI LAYAR ===
  function showScreen(currentId, nextId) {
    const current = document.getElementById(currentId);
    const next = document.getElementById(nextId);
    if (current && next) {
      current.classList.remove('active');
      setTimeout(() => {
        current.classList.add('hidden');
        next.classList.remove('hidden');
        setTimeout(() => {
          next.classList.add('active');
          // Simpan progres
          localStorage.setItem('currentScreen', nextId);
        }, 50);
      }, 500);
    }
  }
  // === EVENT LISTENERS ===
// === TOMBOL MULAI ===
// === TOMBOL MULAI ===
const startBtn = document.getElementById('startBtn');
if (startBtn) {
  startBtn.addEventListener('click', (e) => {
    const partnerName = document.getElementById('partnerName')?.value.trim() || 'Sayang';
    
    // Simpan nama ke localStorage (opsional)
    localStorage.setItem('partnerName', partnerName);
    
    createFlyingHeart(e.clientX, e.clientY);
    showScreen('screen-welcome', 'screen-q1');
    
    if (bgMusic && !bgMusic.muted && bgMusic.paused) {
      bgMusic.play().catch(e => console.warn("Gagal play via Start:", e));
    }
  });
}

  // Navigasi pertanyaan
 // === NAVIGASI PERTANYAAN DENGAN MOMEN ===
document.querySelectorAll('.option-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    createFlyingHeart(e.clientX, e.clientY);
    
    const nextScreenId = e.target.dataset.next; // misal: "q2"
    const currentScreen = e.target.closest('.screen');
    const currentId = currentScreen.id; // misal: "screen-q1"

    // Tentukan momen berdasarkan pertanyaan saat ini
    let momentId = '';
    if (currentId === 'screen-q1') momentId = 'moment-1';
    else if (currentId === 'screen-q2') momentId = 'moment-2';
    else if (currentId === 'screen-q3') momentId = 'moment-3';
    else if (currentId === 'screen-q4') momentId = 'moment-4';
    else if (currentId === 'screen-q5') momentId = 'moment-5';

    if (momentId) {
      // Tampilkan momen dulu
      showScreen(currentId, momentId);
    } else {
      // Jika tidak ada momen, lanjut langsung
      const nextId = `screen-${nextScreenId}`;
      showScreen(currentId, nextId);
    }
  });
});

// === NAVIGASI DARI MOMEN KE PERTANYAAN BERIKUTNYA ===
document.querySelectorAll('.moment-next').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const nextTarget = e.target.dataset.next; // misal: "q2"
    const currentScreen = e.target.closest('.screen');
    const currentId = currentScreen.id; // misal: "moment-1"

    const nextId = nextTarget === 'proposal' 
      ? 'screen-proposal' 
      : `screen-${nextTarget}`;

    showScreen(currentId, nextId);
  });
});
  // === TOMBOL "YA!" DI LAYAR PROPOSAL ===
  // === TOMBOL "YA!" DI LAYAR PROPOSAL ===
// === TOMBOL "YA!" DI LAYAR PROPOSAL ===
// === TOMBOL "YA!" DI LAYAR PROPOSAL ===
const yesBtn = document.getElementById('yesBtn');
if (yesBtn) {
  yesBtn.addEventListener('click', () => {
    // Animasi confetti
    if (typeof confetti !== 'undefined') {
      confetti({ particleCount: 150, spread: 180, colors: ['#ffafbd', '#ffc3a0', '#d32f2f'] });
      setTimeout(() => confetti({ particleCount: 100, spread: 120 }), 300);
      setTimeout(() => confetti({ particleCount: 80, spread: 100 }), 600);
    }

    // Alihkan ke halaman thank you setelah 1.5 detik
    setTimeout(() => {
      showScreen('screen-proposal', 'screen-thankyou');

      // ✅ Ambil elemen PERTAMA
      const thankYouText = document.getElementById('thankYouText');
      const proposalDate = document.getElementById('proposalDate');
      
      if (thankYouText && proposalDate) {
        // ✅ Ambil nama PASANGAN
        const partnerName = localStorage.getItem('partnerName') || 'Sayang';
        
        // ✅ Tampilkan teks dengan nama
        typeText(thankYouText, `your 'ya', ${partnerName}, is the best gift of my life.`, 60);
        
        // ✅ Tampilkan tanggal
        const now = new Date();
        proposalDate.textContent = `submitted on: ${formatDate(now)}`;
      }
    }, 1500);
  });
}
// === TOMBOL SCREENSHOT ===
const screenshotBtn = document.getElementById('screenshotBtn');
if (screenshotBtn) {
  screenshotBtn.addEventListener('click', () => {
    alert("📱 Tekan tombol screenshot di HP-mu!\n\n" +
          "• Android: Volume Bawah + Power\n" +
          "• iPhone: Side Button + Volume Up\n\n" +
          "Simpan momen ini selamanya! 💖");

   setTimeout(() => {
      showScreen('screen-thankyou', 'screen-ending');
    }, 3000);
 });
}

      // Tamp
    });
  // === TOMBOL WHATSAPP ===
const whatsappBtn = document.getElementById('whatsappBtn');
if (whatsappBtn) {
  whatsappBtn.addEventListener('click', () => {
    const partnerName = localStorage.getItem('partnerName') || 'Sayang';
    const message = encodeURIComponent(
      `❤️ Aku baru saja diconfess oleh seseorang yang luar biasa!\n\n` +
      `"your 'Ya' , ${partnerName}, is the best gift of my life."`
    );
    const url = `https://wa.me/?text=${message}`;
    window.open(url, '_blank');
  });
}
