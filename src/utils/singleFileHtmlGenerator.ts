/**
 * Generates a complete, single-file HTML code containing all HTML, CSS, and JavaScript.
 * Ready for the user to copy or download as an independent .html file.
 */

export function generateSingleFileHtml(imageSrc: string): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Game Ghép Hình 20/10 - Lớp 12A01</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Canvas Confetti CDN -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap" rel="stylesheet">
  
  <style>
    body {
      font-family: 'Montserrat', sans-serif;
      overflow-x: hidden;
      background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fdf2f8 100%);
      min-height: 100vh;
    }
    .font-serif-title {
      font-family: 'Playfair Display', serif;
    }
    .font-cursive {
      font-family: 'Dancing Script', cursive;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px) rotate(-1deg); }
      40% { transform: translateX(8px) rotate(1deg); }
      60% { transform: translateX(-6px); }
      80% { transform: translateX(6px); }
    }
    @keyframes greenGlow {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      50% { box-shadow: 0 0 25px 8px rgba(16, 185, 129, 0.9); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .animate-shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    .animate-green-glow {
      animation: greenGlow 0.8s ease-out;
    }
    /* Custom scrollbar */
    ::-webkit-scrollbar { height: 8px; width: 8px; }
    ::-webkit-scrollbar-track { background: #fee2e2; border-radius: 9999px; }
    ::-webkit-scrollbar-thumb { background: #f43f5e; border-radius: 9999px; }
  </style>
</head>
<body class="relative text-gray-800">

  <!-- Background Animated Petals & Sparkles Canvas -->
  <canvas id="petalCanvas" class="fixed inset-0 pointer-events-none z-10 w-full h-full"></canvas>

  <!-- Main Container -->
  <div class="relative z-20 min-h-screen flex flex-col justify-between p-3 sm:p-6 max-w-4xl mx-auto">
    
    <!-- Top Header Bar -->
    <header class="flex flex-col items-center text-center pt-2 pb-4">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs sm:text-sm font-bold shadow-sm border border-rose-200 mb-2">
        <span>🌸</span>
        <span>CHÀO MỪNG NGÀY PHỤ NỮ VIỆT NAM 20/10</span>
        <span>🌸</span>
      </div>

      <h1 class="font-serif-title text-2xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 tracking-tight leading-tight">
        TRÒ CHƠI GHÉP HÌNH 20/10
      </h1>

      <!-- Music & Controls Bar -->
      <div class="mt-4 flex flex-wrap items-center justify-center gap-3">
        <button id="bgmToggleBtn" class="flex items-center gap-2 bg-white/90 hover:bg-white text-rose-700 px-4 py-2 rounded-full shadow-md border border-rose-200 text-xs sm:text-sm font-bold transition-transform active:scale-95">
          <span id="discIcon" class="inline-block">💿</span>
          <span id="bgmLabel">Bật Nhạc Nền</span>
        </button>

        <div class="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-full shadow-md border border-rose-200 text-xs font-semibold text-rose-800">
          <span>Lưới:</span>
          <button id="grid3x3Btn" class="px-2.5 py-1 rounded-full bg-rose-500 text-white shadow">3x3 (9 ô)</button>
          <button id="grid3x4Btn" class="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200">3x4 (12 ô)</button>
        </div>

        <button id="previewBtn" class="bg-white/90 hover:bg-white text-rose-700 px-3 py-2 rounded-full shadow-md border border-rose-200 text-xs font-semibold">
          👁️ Xem ảnh mẫu
        </button>

        <button id="resetBtn" class="bg-rose-100 hover:bg-rose-200 text-rose-800 px-3 py-2 rounded-full shadow-md border border-rose-300 text-xs font-bold">
          🔄 Xáo Trộn Lại
        </button>
      </div>
    </header>

    <!-- Alert / Toast Banner -->
    <div id="toastContainer" class="h-10 flex items-center justify-center mb-2">
      <div id="toastBox" class="hidden text-center py-1.5 px-5 rounded-full text-xs sm:text-sm font-bold shadow transition-all"></div>
    </div>

    <!-- Puzzle Board Frame -->
    <main class="flex flex-col items-center">
      <div class="w-full max-w-md sm:max-w-lg bg-white/90 backdrop-blur-md p-3 sm:p-5 rounded-3xl shadow-2xl border-4 border-rose-300 ring-4 ring-pink-100/50">
        <!-- Target Grid -->
        <div id="puzzleGrid" class="relative w-full aspect-square rounded-2xl overflow-hidden bg-rose-200 shadow-inner grid gap-[3px] p-[3px]">
          <!-- Slots rendered dynamically -->
        </div>
      </div>

      <!-- Tray Container -->
      <div class="w-full max-w-2xl mt-5 bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl border-3 border-rose-200">
        <div class="flex items-center justify-between pb-2 mb-2 border-b border-rose-100">
          <div class="flex items-center gap-2 text-rose-900 font-bold text-sm">
            <span>✨</span>
            <span>Khay Mảnh Ghép (<span id="remainingCount">9</span> mảnh còn lại)</span>
          </div>
          <span class="text-[11px] text-rose-600 font-medium">Bấm chọn mảnh rồi bấm vào ô số, hoặc kéo thả!</span>
        </div>

        <div id="piecesTray" class="flex items-center gap-3 overflow-x-auto py-2 px-1 min-h-[90px]">
          <!-- Pieces rendered dynamically -->
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="mt-6 text-center text-xs text-rose-500 font-medium py-3">
      Tập thể Lớp 12A01 chúc một nửa thế giới luôn xinh đẹp, rạng rỡ và hạnh phúc! 💖
    </footer>
  </div>

  <!-- Victory Celebration Modal -->
  <div id="victoryModal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div class="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-rose-50 via-pink-50 to-amber-50 p-6 sm:p-8 shadow-2xl border-4 border-rose-300 text-center">
      <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white text-3xl shadow-lg ring-4 ring-pink-200 mb-3 animate-bounce">
        🏆
      </div>
      <h2 class="text-2xl sm:text-3xl font-extrabold text-rose-900 font-serif-title">
        XUẤT SẮC HOÀN THÀNH!
      </h2>
      <p class="text-xs sm:text-sm text-rose-700 mt-1 font-medium">
        Bạn đã hoàn thành bức tranh 20/10 một cách hoàn hảo!
      </p>

      <!-- Exact Required Message Card -->
      <div class="my-5 p-5 bg-white/95 rounded-2xl border-2 border-rose-300 shadow-md text-left space-y-3 text-xs sm:text-sm text-gray-800 leading-relaxed font-sans">
        <div class="text-[11px] font-bold text-rose-500 uppercase tracking-widest text-center mb-1">💌 LỜI CHÚC YÊU THƯƠNG 💌</div>
        <p class="font-serif-title font-bold text-rose-700 text-sm sm:text-base">
          Kính gửi Cô và toàn thể các bạn nữ của tập thể 12A01,
        </p>
        <p>
          Nhân ngày Phụ nữ Việt Nam 20/10, chúng em xin gửi đến Cô lời tri ân sâu sắc nhất. Chúc Cô luôn mạnh khỏe, tươi trẻ và hạnh phúc!
        </p>
        <p>
          Gửi đến tất cả các bạn nữ 12A01: Chúc các bạn có một ngày 20/10 thật vui và những nụ cười rạng rỡ nhất. Chúc các bạn luôn tự tin, kiên cường và cố gắng chạm tay đến cánh cửa đại học mơ ước! 🌸💖
        </p>
        <p class="pt-2 text-right font-serif-title font-bold text-rose-600">
          -Tập thể lớp 12A01-
        </p>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-3">
        <button id="modalConfettiBtn" class="px-5 py-2.5 rounded-full bg-pink-100 hover:bg-pink-200 text-rose-700 font-bold text-sm border border-pink-300">
          🎉 Bắn Pháo Hoa
        </button>
        <button id="modalRestartBtn" class="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg ring-2 ring-rose-300">
          🔄 Chơi Lại Ngay
        </button>
      </div>
    </div>
  </div>

  <!-- Preview Modal -->
  <div id="previewModal" class="fixed inset-0 z-50 hidden flex flex-col items-center justify-center p-4 bg-black/85 cursor-pointer">
    <img id="previewImage" src="${imageSrc}" class="max-h-[80vh] max-w-[90vw] rounded-2xl shadow-2xl border-2 border-white/60">
    <p class="mt-3 text-white text-sm font-semibold">Bấm vào bất kỳ đâu để đóng ảnh mẫu</p>
  </div>

  <script>
    // --- Configuration & State ---
    const IMAGE_URL = '${imageSrc}';
    let rows = 3;
    let cols = 3;
    let pieces = [];
    let placedMap = {}; // slotId -> pieceId
    let selectedPieceId = null;
    let draggedPieceId = null;

    // --- Audio Synthesizer (Zero External File Dependencies) ---
    const AudioEngine = {
      ctx: null,
      bgmPlaying: false,
      bgmTimeout: null,
      init() {
        if (!this.ctx) {
          this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      },
      playClick() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(); osc.stop(this.ctx.currentTime + 0.06);
      },
      playCorrect() {
        this.init();
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const t = this.ctx.currentTime + i * 0.07;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t);
          gain.gain.setValueAtTime(0.18, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
          osc.connect(gain); gain.connect(this.ctx.destination);
          osc.start(t); osc.stop(t + 0.45);
        });
      },
      playWrong() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = this.ctx.currentTime;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, t);
        osc.frequency.linearRampToValueAtTime(170, t + 0.25);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(t); osc.stop(t + 0.3);
      },
      playVictory() {
        this.init();
        [[523, 659, 783], [587, 739, 880], [659, 830, 987], [783, 987, 1318]].forEach((chord, i) => {
          const t = this.ctx.currentTime + i * 0.3;
          chord.forEach(f => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, t);
            gain.gain.setValueAtTime(0.15, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + (i === 3 ? 1.5 : 0.4));
            osc.connect(gain); gain.connect(this.ctx.destination);
            osc.start(t); osc.stop(t + (i === 3 ? 1.6 : 0.45));
          });
        });
      },
      toggleBGM() {
        this.init();
        if (this.bgmPlaying) {
          this.bgmPlaying = false;
          if (this.bgmTimeout) clearTimeout(this.bgmTimeout);
          document.getElementById('bgmLabel').innerText = 'Bật Nhạc Nền';
          document.getElementById('discIcon').classList.remove('animate-spin');
        } else {
          this.bgmPlaying = true;
          document.getElementById('bgmLabel').innerText = 'Nhạc Nền Đang Bật';
          document.getElementById('discIcon').classList.add('animate-spin');
          this.playBgmLoop();
        }
      },
      playBgmLoop() {
        if (!this.bgmPlaying) return;
        const notes = [
          { f: 523.25, d: 0.4, p: 0.45 }, { f: 587.33, d: 0.4, p: 0.45 },
          { f: 659.25, d: 0.7, p: 0.8 }, { f: 783.99, d: 0.4, p: 0.45 },
          { f: 659.25, d: 0.5, p: 0.6 }, { f: 523.25, d: 0.7, p: 0.85 },
          { f: 440.00, d: 0.4, p: 0.45 }, { f: 523.25, d: 0.4, p: 0.45 },
          { f: 587.33, d: 0.8, p: 0.9 }, { f: 523.25, d: 0.5, p: 0.6 },
          { f: 392.00, d: 0.8, p: 1.0 }
        ];
        let idx = 0;
        const tick = () => {
          if (!this.bgmPlaying) return;
          const cur = notes[idx % notes.length];
          const t = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(cur.f, t);
          gain.gain.setValueAtTime(0.07, t);
          gain.gain.exponentialRampToValueAtTime(0.0005, t + cur.d);
          osc.connect(gain); gain.connect(this.ctx.destination);
          osc.start(t); osc.stop(t + cur.d + 0.05);
          idx++;
          this.bgmTimeout = setTimeout(tick, cur.p * 1000);
        };
        tick();
      }
    };

    // --- Toast Notifications ---
    function showToast(text, isError) {
      const box = document.getElementById('toastBox');
      box.innerText = text;
      box.className = 'text-center py-1.5 px-5 rounded-full text-xs sm:text-sm font-bold shadow ' + 
        (isError ? 'bg-rose-100 text-rose-800 border-2 border-rose-400 animate-shake' : 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400');
      box.classList.remove('hidden');
      setTimeout(() => { box.classList.add('hidden'); }, 2000);
    }

    // --- Game Logic ---
    function initGame() {
      placedMap = {};
      selectedPieceId = null;
      draggedPieceId = null;
      const total = rows * cols;
      pieces = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          pieces.push({ id: r * cols + c + 1, row: r, col: c });
        }
      }

      // Shuffle pieces
      pieces = pieces.sort(() => Math.random() - 0.5);

      renderGrid();
      renderTray();
      document.getElementById('victoryModal').classList.add('hidden');
    }

    function renderGrid() {
      const grid = document.getElementById('puzzleGrid');
      grid.style.gridTemplateColumns = 'repeat(' + cols + ', minmax(0, 1fr))';
      grid.style.gridTemplateRows = 'repeat(' + rows + ', minmax(0, 1fr))';
      grid.innerHTML = '';

      const total = rows * cols;
      for (let i = 1; i <= total; i++) {
        const slot = document.createElement('div');
        slot.id = 'slot-' + i;
        slot.dataset.slotId = i;
        slot.className = 'relative flex items-center justify-center transition-all duration-200 cursor-pointer overflow-hidden rounded-lg select-none bg-white border border-dashed border-rose-300 hover:bg-pink-50';
        
        // Slot content: Clean white paper with clear sequence number
        slot.innerHTML = '<div class="flex flex-col items-center justify-center w-full h-full bg-white">' +
          '<span class="text-xl sm:text-2xl md:text-3xl font-extrabold text-rose-400 font-serif-title">' + i + '</span>' +
          '<span class="text-[9px] sm:text-xs text-rose-300 font-medium">Ô ' + i + '</span>' +
          '</div>';

        // Slot click handler
        slot.addEventListener('click', () => handleSlotClick(i));

        // Drag & drop handlers
        slot.addEventListener('dragover', (e) => e.preventDefault());
        slot.addEventListener('drop', (e) => {
          e.preventDefault();
          const pId = parseInt(e.dataTransfer.getData('text/plain') || draggedPieceId, 10);
          if (pId) handleAttempt(pId, i);
        });

        grid.appendChild(slot);
      }
    }

    function renderTray() {
      const tray = document.getElementById('piecesTray');
      tray.innerHTML = '';
      const unplaced = pieces.filter(p => !Object.values(placedMap).includes(p.id));
      document.getElementById('remainingCount').innerText = unplaced.length;

      if (unplaced.length === 0) {
        tray.innerHTML = '<div class="w-full text-center text-emerald-600 font-bold py-2">✨ Đã ghép xong toàn bộ các mảnh!</div>';
        return;
      }

      unplaced.forEach(p => {
        const pieceEl = document.createElement('div');
        pieceEl.id = 'piece-' + p.id;
        pieceEl.draggable = true;
        pieceEl.className = 'group relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl cursor-grab overflow-hidden shadow-md border-2 border-rose-200 hover:border-rose-400 transition-all select-none ' + 
          (selectedPieceId === p.id ? 'ring-4 ring-rose-500 scale-105 shadow-xl' : 'hover:scale-105');

        const xPos = cols > 1 ? (p.col / (cols - 1)) * 100 : 0;
        const yPos = rows > 1 ? (p.row / (rows - 1)) * 100 : 0;
        pieceEl.style.backgroundImage = 'url(' + IMAGE_URL + ')';
        pieceEl.style.backgroundSize = (cols * 100) + '% ' + (rows * 100) + '%';
        pieceEl.style.backgroundPosition = xPos + '% ' + yPos + '%';

        pieceEl.addEventListener('click', () => {
          AudioEngine.playClick();
          selectedPieceId = selectedPieceId === p.id ? null : p.id;
          renderTray();
        });

        pieceEl.addEventListener('dragstart', (e) => {
          draggedPieceId = p.id;
          e.dataTransfer.setData('text/plain', p.id);
        });

        tray.appendChild(pieceEl);
      });
    }

    function handleSlotClick(slotId) {
      AudioEngine.playClick();
      if (placedMap[slotId]) return; // already solved
      if (!selectedPieceId) {
        showToast('👉 Hãy chọn một mảnh ghép từ khay bên dưới trước nhé!', true);
        return;
      }
      handleAttempt(selectedPieceId, slotId);
    }

    function handleAttempt(pieceId, slotId) {
      if (placedMap[slotId]) return;
      const slotEl = document.getElementById('slot-' + slotId);

      if (pieceId === slotId) {
        // Correct match!
        placedMap[slotId] = pieceId;
        selectedPieceId = null;
        AudioEngine.playCorrect();
        showToast('✨ Tuyệt vời! Bạn đã ghép đúng ô số ' + slotId + '!', false);

        // Fill slot with sliced piece image
        const targetPiece = pieces.find(p => p.id === pieceId);
        const xPos = cols > 1 ? (targetPiece.col / (cols - 1)) * 100 : 0;
        const yPos = rows > 1 ? (targetPiece.row / (rows - 1)) * 100 : 0;
        slotEl.style.backgroundImage = 'url(' + IMAGE_URL + ')';
        slotEl.style.backgroundSize = (cols * 100) + '% ' + (rows * 100) + '%';
        slotEl.style.backgroundPosition = xPos + '% ' + yPos + '%';
        slotEl.innerHTML = '<span class="absolute top-1 right-1 text-emerald-500 font-bold text-xs bg-white/80 rounded-full px-1">✓</span>';
        slotEl.classList.remove('bg-white', 'hover:bg-pink-50', 'border-dashed');
        slotEl.classList.add('animate-green-glow', 'ring-4', 'ring-emerald-400');

        setTimeout(() => {
          slotEl.classList.remove('animate-green-glow', 'ring-4', 'ring-emerald-400');
        }, 800);

        renderTray();

        // Check victory
        if (Object.keys(placedMap).length === rows * cols) {
          triggerVictory();
        }
      } else {
        // Wrong match!
        AudioEngine.playWrong();
        slotEl.classList.add('animate-shake', 'ring-4', 'ring-rose-500', 'bg-rose-100');
        showToast('❌ Bạn đã ghép sai rồi! Hãy thử lại nhé.', true);
        setTimeout(() => {
          slotEl.classList.remove('animate-shake', 'ring-4', 'ring-rose-500', 'bg-rose-100');
        }, 600);
      }
    }

    function triggerVictory() {
      AudioEngine.playVictory();
      // Multi-salvo confetti
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      setTimeout(() => {
        confetti({ particleCount: 100, angle: 60, spread: 60, origin: { x: 0 } });
        confetti({ particleCount: 100, angle: 120, spread: 60, origin: { x: 1 } });
      }, 300);

      setTimeout(() => {
        document.getElementById('victoryModal').classList.remove('hidden');
      }, 700);
    }

    // --- Petals Canvas Background ---
    (function initPetals() {
      const cvs = document.getElementById('petalCanvas');
      const ctx = cvs.getContext('2d');
      let w = cvs.width = window.innerWidth;
      let h = cvs.height = window.innerHeight;
      window.addEventListener('resize', () => {
        w = cvs.width = window.innerWidth;
        h = cvs.height = window.innerHeight;
      });

      const colors = ['#f43f5e', '#fb7185', '#fda4af', '#e11d48', '#ff80bf'];
      const petals = Array.from({ length: 45 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 10 + Math.random() * 15,
        speedY: 0.8 + Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 1.2,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.4 + Math.random() * 0.5
      }));

      function loop() {
        ctx.clearRect(0, 0, w, h);
        petals.forEach(p => {
          p.y += p.speedY;
          p.x += Math.sin(p.y * 0.01) * 0.8 + p.speedX;
          p.rot += p.rotSpeed;
          if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w; }
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(p.size / 2, -p.size / 3, p.size, -p.size / 2, p.size * 0.9, 0);
          ctx.bezierCurveTo(p.size, p.size / 2, p.size / 2, p.size / 3, 0, 0);
          ctx.fill();
          ctx.restore();
        });
        requestAnimationFrame(loop);
      }
      loop();
    })();

    // --- Controls Listeners ---
    document.getElementById('bgmToggleBtn').addEventListener('click', () => AudioEngine.toggleBGM());
    document.getElementById('resetBtn').addEventListener('click', () => { AudioEngine.playClick(); initGame(); });
    document.getElementById('modalRestartBtn').addEventListener('click', () => { AudioEngine.playClick(); initGame(); });
    document.getElementById('modalConfettiBtn').addEventListener('click', () => {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      AudioEngine.playCorrect();
    });

    // Preview
    const prevModal = document.getElementById('previewModal');
    document.getElementById('previewBtn').addEventListener('click', () => { prevModal.classList.remove('hidden'); });
    prevModal.addEventListener('click', () => { prevModal.classList.add('hidden'); });

    // Grid selection
    document.getElementById('grid3x3Btn').addEventListener('click', function() {
      rows = 3; cols = 3;
      this.className = 'px-2.5 py-1 rounded-full bg-rose-500 text-white shadow';
      document.getElementById('grid3x4Btn').className = 'px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200';
      initGame();
    });
    document.getElementById('grid3x4Btn').addEventListener('click', function() {
      rows = 3; cols = 4;
      this.className = 'px-2.5 py-1 rounded-full bg-rose-500 text-white shadow';
      document.getElementById('grid3x3Btn').className = 'px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200';
      initGame();
    });

    // Start game on load
    window.addEventListener('DOMContentLoaded', initGame);
  </script>
</body>
</html>`;
}
