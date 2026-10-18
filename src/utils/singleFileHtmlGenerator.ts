import { ROSE_BASE64, AODAI_BASE64 } from '../assets/themeImagesBase64.ts';

/**
 * Generates a clean, pristine single-file HTML code with 0 stray comments or buttons.
 * Contains all CSS, JS, audio synthesizer, falling petals, and base64 images.
 * Ready to be deployed as index.html on GitHub Pages or double-clicked locally.
 */
export function generateSingleFileHtml(customImageSrc?: string): string {
  const initialImage = customImageSrc && customImageSrc.startsWith('data:') 
    ? customImageSrc 
    : ROSE_BASE64;

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Game Ghép Hình 20/10 - Dành Tặng Cô & Các Bạn Nữ Lớp 12A01</title>
  <meta name="description" content="Trò chơi ghép hình chào mừng Ngày Phụ nữ Việt Nam 20/10 dành riêng cho tập thể Lớp 12A01.">
  
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
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
    ::-webkit-scrollbar { height: 8px; width: 8px; }
    ::-webkit-scrollbar-track { background: #fee2e2; border-radius: 9999px; }
    ::-webkit-scrollbar-thumb { background: #f43f5e; border-radius: 9999px; }
  </style>
</head>
<body class="relative text-gray-800">

  <canvas id="petalCanvas" class="fixed inset-0 pointer-events-none z-10 w-full h-full"></canvas>

  <div class="relative z-20 min-h-screen flex flex-col justify-between p-3 sm:p-5 max-w-5xl mx-auto">
    
    <header class="flex flex-col items-center text-center pt-2 pb-4">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 text-rose-700 text-xs sm:text-sm font-bold shadow-sm border border-rose-200 mb-2">
        <span>🌸</span>
        <span>CHÀO MỪNG NGÀY PHỤ NỮ VIỆT NAM 20/10 - LỚP 12A01</span>
        <span>🌸</span>
      </div>

      <h1 class="font-serif-title text-2xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 tracking-tight leading-tight">
        TRÒ CHƠI GHÉP HÌNH 20/10
      </h1>

      <div class="mt-4 w-full max-w-5xl bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-lg border-2 border-rose-200 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-bold text-rose-800">Chủ đề:</span>
          <button id="themeRoseBtn" class="px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white shadow-sm ring-2 ring-pink-300">
            🌹 Hoa Hồng 12A01
          </button>
          <button id="themeAodaiBtn" class="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200">
            🪷 Cô Giáo Áo Dài
          </button>
          
          <input type="file" id="customFileInput" accept="image/*" class="hidden">
          <button id="customUploadBtn" class="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200">
            📸 Tải Ảnh Riêng
          </button>
        </div>

        <div class="flex items-center gap-1.5 bg-rose-50 p-1 rounded-full border border-rose-200 text-xs font-semibold">
          <span class="text-rose-800 ml-1">Độ khó:</span>
          <button id="grid3x3Btn" class="px-2.5 py-1 rounded-full bg-rose-500 text-white shadow">3x3 (9 ô)</button>
          <button id="grid3x4Btn" class="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200">3x4 (12 ô)</button>
          <button id="grid4x4Btn" class="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200">4x4 (16 ô)</button>
        </div>

        <div class="flex items-center gap-3">
          <div class="text-xs font-bold text-rose-800 flex items-center gap-1">
            <span>⏱️</span>
            <span id="timerDisplay">00:00</span>
          </div>

          <div class="text-xs font-bold text-rose-800">
            🎯 <span id="movesCount">0</span> lượt
          </div>

          <button id="hintBtn" class="px-2.5 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-xs border border-amber-300">
            💡 Gợi Ý
          </button>

          <button id="bgmToggleBtn" class="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1 rounded-full border border-rose-200 text-xs font-bold">
            <span id="discIcon">💿</span>
            <span id="bgmLabel">Nhạc Nền</span>
          </button>

          <button id="resetBtn" class="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded-full shadow text-xs font-bold">
            🔄 Xáo Trộn
          </button>
        </div>
      </div>

      <div class="w-full max-w-5xl mt-3 px-1">
        <div class="flex items-center justify-between text-xs font-bold text-rose-700 mb-1">
          <span>Tiến độ ghép: <span id="progressCount">0/9</span> mảnh</span>
          <span id="progressPercent">0%</span>
        </div>
        <div class="w-full h-2.5 bg-white/80 rounded-full overflow-hidden border border-rose-200 shadow-inner">
          <div id="progressBar" class="h-full bg-gradient-to-r from-pink-400 via-rose-500 to-rose-600 transition-all duration-300 rounded-full" style="width: 0%"></div>
        </div>
      </div>
    </header>

    <div id="toastContainer" class="h-10 flex items-center justify-center mb-2">
      <div id="toastBox" class="hidden text-center py-1.5 px-5 rounded-full text-xs sm:text-sm font-bold shadow transition-all"></div>
    </div>

    <!-- MAIN GAME AREA: 2 PANELS SIDE-BY-SIDE -->
    <main class="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 px-1 items-start">
      
      <!-- PANEL 1: KHUNG GHÉP TRANH -->
      <div class="w-full flex flex-col rounded-3xl bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-xl border-4 border-rose-300 ring-4 ring-pink-100/70">
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-rose-100">
          <div class="flex items-center gap-2">
            <span class="flex h-3 w-3 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <div>
              <h3 class="text-sm sm:text-base font-bold text-rose-900 font-serif-title">
                Khung Ghép Tranh
              </h3>
              <p class="text-[11px] text-rose-600 font-medium">
                Bấm ô hoặc kéo thả mảnh ghép vào
              </p>
            </div>
          </div>

          <span id="unplacedBadge" class="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-700">
            Còn 9 ô trống
          </span>
        </div>

        <div id="puzzleGrid" class="relative w-full aspect-square rounded-2xl overflow-hidden bg-rose-200 shadow-inner grid gap-[3px] p-[3px]">
          <!-- Slots rendered dynamically -->
        </div>

        <div class="mt-3 flex items-center justify-between text-xs text-rose-700">
          <span>👉 Bấm mảnh ghép bên phải rồi bấm vào ô này</span>
          <span id="selectedPieceStatus" class="text-gray-400 font-medium">Chưa chọn mảnh</span>
        </div>
      </div>

      <!-- PANEL 2: KHAY TOÀN BỘ MẢNH GHÉP (HIỂN THỊ ĐẦY ĐỦ, SONG SONG) -->
      <div class="w-full flex flex-col rounded-3xl bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-xl border-3 border-rose-200">
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-rose-100">
          <div class="flex items-center gap-2">
            <span class="p-1.5 rounded-xl bg-rose-500 text-white shadow-sm text-sm">✨</span>
            <div>
              <h3 class="text-sm sm:text-base font-bold text-rose-900 font-serif-title">
                Toàn Bộ Mảnh Ghép (<span id="trayCount">9</span> mảnh)
              </h3>
              <p class="text-[11px] text-rose-600 font-medium">
                Hiển thị đầy đủ tất cả các mảnh ghép
              </p>
            </div>
          </div>

          <button id="deselectBtn" class="hidden text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200">
            Hủy chọn
          </button>
        </div>

        <div id="piecesTray" class="grid gap-2 sm:gap-2.5 p-1">
          <!-- Pieces rendered dynamically -->
        </div>

        <div class="mt-3 pt-2 border-t border-rose-100 flex items-center justify-between text-[11px] text-gray-500">
          <span>🖱️ Kéo thả hoặc bấm chọn mảnh</span>
          <span id="trayFooterInfo" class="font-semibold text-rose-600">Còn 9/9 mảnh</span>
        </div>
      </div>
    </main>

    <!-- Class 12A01 Congratulatory Card -->
    <div class="mx-auto w-full max-w-3xl my-6">
      <div class="rounded-3xl bg-white/90 backdrop-blur-md border-2 border-rose-200 shadow-md overflow-hidden">
        <button id="toggleLetterBtn" class="w-full flex items-center justify-between p-4 text-left bg-gradient-to-r from-rose-50 to-pink-50 hover:bg-rose-100/70 transition-colors">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl">💌</span>
            <span class="font-bold text-sm sm:text-base text-rose-900 font-serif-title">
              Bức Thư Tri Ân & Chúc Mừng 20/10 Gửi Lớp 12A01
            </span>
          </div>
          <span id="letterArrow" class="text-rose-600 font-bold text-lg">▼</span>
        </button>

        <div id="letterContent" class="hidden p-5 sm:p-6 border-t border-rose-100 text-sm leading-relaxed text-gray-700 bg-white/95 space-y-3 font-sans">
          <p class="font-serif-title italic font-bold text-rose-700 text-base">
            Kính gửi Cô và toàn thể các bạn nữ của tập thể 12A01,
          </p>
          <p>
            Nhân ngày Phụ nữ Việt Nam 20/10, chúng em xin gửi đến Cô lời tri ân sâu sắc nhất. Chúc Cô luôn mạnh khỏe, tươi trẻ và hạnh phúc!
          </p>
          <p>
            Gửi đến tất cả các bạn nữ 12A01: Chúc các bạn có một ngày 20/10 thật vui và những nụ cười rạng rỡ nhất. Chúc các bạn luôn tự tin, kiên cường và cố gắng chạm tay đến cánh cửa đại học mơ ước! 🌸💖
          </p>
          <div class="pt-2 text-right font-serif-title font-bold text-rose-600">
            -Tập thể lớp 12A01-
          </div>
        </div>
      </div>
    </div>

    <footer class="mt-4 text-center text-xs text-rose-600 font-medium py-3">
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

  <script>
    const THEME_ROSE = '${ROSE_BASE64}';
    const THEME_AODAI = '${AODAI_BASE64}';
    let currentImageSrc = '${initialImage}';

    let rows = 3;
    let cols = 3;
    let pieces = [];
    let placedMap = {};
    let selectedPieceId = null;
    let draggedPieceId = null;
    let moves = 0;
    let seconds = 0;
    let timerInterval = null;

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
          document.getElementById('bgmLabel').innerText = 'Nhạc Nền';
          document.getElementById('discIcon').classList.remove('animate-spin');
        } else {
          this.bgmPlaying = true;
          document.getElementById('bgmLabel').innerText = 'Đang Bật';
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

    function showToast(text, isError) {
      const box = document.getElementById('toastBox');
      box.innerText = text;
      box.className = 'text-center py-1.5 px-5 rounded-full text-xs sm:text-sm font-bold shadow ' + 
        (isError ? 'bg-rose-100 text-rose-800 border-2 border-rose-400 animate-shake' : 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400');
      box.classList.remove('hidden');
      setTimeout(() => { box.classList.add('hidden'); }, 2200);
    }

    function initGame() {
      placedMap = {};
      selectedPieceId = null;
      draggedPieceId = null;
      moves = 0;
      seconds = 0;
      document.getElementById('movesCount').innerText = '0';
      document.getElementById('timerDisplay').innerText = '00:00';
      document.getElementById('deselectBtn').classList.add('hidden');
      document.getElementById('selectedPieceStatus').innerText = 'Chưa chọn mảnh';
      document.getElementById('victoryModal').classList.add('hidden');

      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        seconds++;
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        document.getElementById('timerDisplay').innerText = m + ':' + s;
      }, 1000);

      const total = rows * cols;
      pieces = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          pieces.push({ id: r * cols + c + 1, row: r, col: c });
        }
      }
      pieces = pieces.sort(() => Math.random() - 0.5);

      renderGrid();
      renderTray();
      updateProgress();
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
        const isPlaced = placedMap[i] === i;
        const slotRow = Math.floor((i - 1) / cols);
        const slotCol = (i - 1) % cols;

        if (isPlaced) {
          slot.className = 'relative flex items-center justify-center overflow-hidden rounded-lg select-none shadow-sm';
          const x = cols > 1 ? (slotCol / (cols - 1)) * 100 : 0;
          const y = rows > 1 ? (slotRow / (rows - 1)) * 100 : 0;
          slot.style.backgroundImage = 'url(' + currentImageSrc + ')';
          slot.style.backgroundSize = (cols * 100) + '% ' + (rows * 100) + '%';
          slot.style.backgroundPosition = x + '% ' + y + '%';
          slot.innerHTML = '<span class="absolute top-1 right-1 text-emerald-500 font-bold text-xs bg-white/80 rounded-full px-1">✓</span>';
        } else {
          slot.className = 'relative flex items-center justify-center transition-all cursor-pointer overflow-hidden rounded-lg select-none bg-white hover:bg-pink-50 border border-dashed border-rose-300 ' +
            (selectedPieceId === i ? 'ring-4 ring-rose-400 bg-rose-50' : '');
          slot.innerHTML = '<div class="flex flex-col items-center justify-center w-full h-full bg-white">' +
            '<span class="text-xl sm:text-2xl md:text-3xl font-extrabold text-rose-400 font-serif-title">' + i + '</span>' +
            '<span class="text-[9px] sm:text-xs text-rose-300 font-medium">Ô ' + i + '</span>' +
            '</div>';
        }

        slot.addEventListener('click', () => handleSlotClick(i));
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
      tray.style.gridTemplateColumns = 'repeat(' + (cols === 4 ? 4 : 3) + ', minmax(0, 1fr))';
      tray.innerHTML = '';
      const unplaced = pieces.filter(p => !Object.values(placedMap).includes(p.id));

      document.getElementById('trayCount').innerText = unplaced.length;
      document.getElementById('unplacedBadge').innerText = unplaced.length > 0 ? ('Còn ' + unplaced.length + ' ô trống') : '🎉 Hoàn tất!';
      document.getElementById('trayFooterInfo').innerText = 'Còn ' + unplaced.length + '/' + (rows * cols) + ' mảnh';

      if (unplaced.length === 0) {
        tray.innerHTML = '<div class="col-span-full py-12 text-center text-emerald-600 font-bold bg-emerald-50 rounded-2xl border border-emerald-300">✨ Tuyệt vời! Bạn đã hoàn thành bức tranh 20/10!</div>';
        return;
      }

      unplaced.forEach(p => {
        const pieceEl = document.createElement('div');
        pieceEl.id = 'piece-' + p.id;
        pieceEl.draggable = true;
        const isSelected = selectedPieceId === p.id;

        pieceEl.className = 'group relative aspect-square rounded-xl cursor-grab overflow-hidden shadow-md border-2 border-rose-200 hover:border-rose-400 transition-all select-none ' + 
          (isSelected ? 'ring-4 ring-rose-500 scale-105 shadow-xl z-10' : 'hover:scale-105 bg-white');

        const xPos = cols > 1 ? (p.col / (cols - 1)) * 100 : 0;
        const yPos = rows > 1 ? (p.row / (rows - 1)) * 100 : 0;
        pieceEl.style.backgroundImage = 'url(' + currentImageSrc + ')';
        pieceEl.style.backgroundSize = (cols * 100) + '% ' + (rows * 100) + '%';
        pieceEl.style.backgroundPosition = xPos + '% ' + yPos + '%';

        pieceEl.innerHTML = isSelected 
          ? '<div class="absolute inset-0 bg-rose-500/25 ring-2 ring-inset ring-rose-500 flex items-center justify-center"><span class="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">Đã chọn</span></div>' 
          : '';

        pieceEl.addEventListener('click', () => {
          AudioEngine.playClick();
          selectedPieceId = isSelected ? null : p.id;
          if (selectedPieceId) {
            document.getElementById('deselectBtn').classList.remove('hidden');
            document.getElementById('selectedPieceStatus').innerText = 'Đang chọn 1 mảnh ghép';
          } else {
            document.getElementById('deselectBtn').classList.add('hidden');
            document.getElementById('selectedPieceStatus').innerText = 'Chưa chọn mảnh';
          }
          renderTray();
          renderGrid();
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
      if (placedMap[slotId]) return;
      if (!selectedPieceId) {
        showToast('👉 Hãy chọn một mảnh ghép ở khay bên phải trước nhé!', true);
        return;
      }
      handleAttempt(selectedPieceId, slotId);
    }

    function handleAttempt(pieceId, slotId) {
      if (placedMap[slotId]) return;
      moves++;
      document.getElementById('movesCount').innerText = moves;

      const slotEl = document.getElementById('slot-' + slotId);

      if (pieceId === slotId) {
        placedMap[slotId] = pieceId;
        selectedPieceId = null;
        document.getElementById('deselectBtn').classList.add('hidden');
        document.getElementById('selectedPieceStatus').innerText = 'Chưa chọn mảnh';

        AudioEngine.playCorrect();
        showToast('✨ Tuyệt vời! Bạn đã ghép đúng vào ô số ' + slotId + '!', false);

        renderGrid();
        renderTray();
        updateProgress();

        if (Object.keys(placedMap).length === rows * cols) {
          triggerVictory();
        }
      } else {
        AudioEngine.playWrong();
        slotEl.classList.add('animate-shake', 'ring-4', 'ring-rose-500', 'bg-rose-100');
        showToast('❌ Mảnh này không thuộc ô số ' + slotId + '! Hãy thử ô khác nhé.', true);
        setTimeout(() => {
          slotEl.classList.remove('animate-shake', 'ring-4', 'ring-rose-500', 'bg-rose-100');
        }, 600);
      }
    }

    function updateProgress() {
      const placed = Object.keys(placedMap).length;
      const total = rows * cols;
      const pct = Math.round((placed / total) * 100);
      document.getElementById('progressCount').innerText = placed + '/' + total;
      document.getElementById('progressPercent').innerText = pct + '%';
      document.getElementById('progressBar').style.width = pct + '%';
    }

    function handleHint() {
      AudioEngine.playClick();
      const total = rows * cols;
      const unplaced = [];
      for (let i = 1; i <= total; i++) {
        if (!placedMap[i]) unplaced.push(i);
      }
      if (unplaced.length === 0) return;
      const target = unplaced[0];
      handleAttempt(target, target);
    }

    function triggerVictory() {
      clearInterval(timerInterval);
      AudioEngine.playVictory();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      setTimeout(() => {
        confetti({ particleCount: 90, angle: 60, spread: 60, origin: { x: 0 } });
        confetti({ particleCount: 90, angle: 120, spread: 60, origin: { x: 1 } });
      }, 300);

      setTimeout(() => {
        document.getElementById('victoryModal').classList.remove('hidden');
      }, 600);
    }

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

    document.getElementById('bgmToggleBtn').addEventListener('click', () => AudioEngine.toggleBGM());
    document.getElementById('resetBtn').addEventListener('click', () => { AudioEngine.playClick(); initGame(); });
    document.getElementById('hintBtn').addEventListener('click', handleHint);
    document.getElementById('deselectBtn').addEventListener('click', () => {
      selectedPieceId = null;
      document.getElementById('deselectBtn').classList.add('hidden');
      document.getElementById('selectedPieceStatus').innerText = 'Chưa chọn mảnh';
      renderTray();
      renderGrid();
    });

    const roseBtn = document.getElementById('themeRoseBtn');
    const aodaiBtn = document.getElementById('themeAodaiBtn');
    roseBtn.addEventListener('click', () => {
      currentImageSrc = THEME_ROSE;
      roseBtn.className = 'px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white shadow-sm ring-2 ring-pink-300';
      aodaiBtn.className = 'px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200';
      initGame();
    });
    aodaiBtn.addEventListener('click', () => {
      currentImageSrc = THEME_AODAI;
      aodaiBtn.className = 'px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white shadow-sm ring-2 ring-pink-300';
      roseBtn.className = 'px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200';
      initGame();
    });

    const customFileInput = document.getElementById('customFileInput');
    document.getElementById('customUploadBtn').addEventListener('click', () => customFileInput.click());
    customFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && event.target.result) {
            currentImageSrc = event.target.result;
            initGame();
          }
        };
        reader.readAsDataURL(file);
      }
    });

    const g3x3 = document.getElementById('grid3x3Btn');
    const g3x4 = document.getElementById('grid3x4Btn');
    const g4x4 = document.getElementById('grid4x4Btn');
    function setGridMode(r, c, activeBtn) {
      rows = r; cols = c;
      [g3x3, g3x4, g4x4].forEach(b => b.className = 'px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200');
      activeBtn.className = 'px-2.5 py-1 rounded-full bg-rose-500 text-white shadow';
      initGame();
    }
    g3x3.addEventListener('click', () => setGridMode(3, 3, g3x3));
    g3x4.addEventListener('click', () => setGridMode(3, 4, g3x4));
    g4x4.addEventListener('click', () => setGridMode(4, 4, g4x4));

    document.getElementById('modalRestartBtn').addEventListener('click', () => { AudioEngine.playClick(); initGame(); });
    document.getElementById('modalConfettiBtn').addEventListener('click', () => {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      AudioEngine.playCorrect();
    });

    const letterContent = document.getElementById('letterContent');
    const letterArrow = document.getElementById('letterArrow');
    document.getElementById('toggleLetterBtn').addEventListener('click', () => {
      const isHidden = letterContent.classList.contains('hidden');
      if (isHidden) {
        letterContent.classList.remove('hidden');
        letterArrow.innerText = '▲';
      } else {
        letterContent.classList.add('hidden');
        letterArrow.innerText = '▼';
      }
    });

    window.addEventListener('DOMContentLoaded', initGame);
  </script>
</body>
</html>`;
}
