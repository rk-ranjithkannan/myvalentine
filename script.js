/* ========================================
   💘 VALENTINE'S GAME — INTERACTIVE JS
   ======================================== */

// ============ STATE ============
let currentScreen = 1;
let totalScreens = 7;
let noAttempts = 0;
let unlockedPages = [1, 2]; // start with screen 1 & 2 unlocked
let ytPlayer = null;
let isPlaying = false;
let isPaused = false;
let currentTrackEl = null;
let typewriterTimer = null;

// ============ INIT ============
window.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();
    createHeartShadows();
    initBgCanvas();
    createRosePetals();
    initNoButton();
    initSideNav();
    initEnvelope();
});

// ============ SCREEN NAV ============
function goToScreen(num) {
    if (num < 1 || num > totalScreens) return;
    if (!unlockedPages.includes(num)) return;

    const prev = document.getElementById('screen' + currentScreen);
    const next = document.getElementById('screen' + num);
    if (!prev || !next) return;

    prev.classList.remove('active');
    next.classList.add('active');
    currentScreen = num;

    updateNavDots();

    // Special screen triggers
    if (num === 3) triggerCelebration();
    if (num === 7) startTypewriter();
}

function updateNavDots() {
    document.querySelectorAll('.nav-dot').forEach(d => {
        const s = parseInt(d.dataset.s);
        d.classList.toggle('active', s === currentScreen);
        if (unlockedPages.includes(s)) {
            d.classList.remove('locked');
            d.classList.add('unlocked');
            d.textContent = '';
        }
    });
}

function unlockAllPages() {
    for (let i = 1; i <= totalScreens; i++) {
        if (!unlockedPages.includes(i)) unlockedPages.push(i);
    }
    updateNavDots();
}

// ============ SIDE NAV ============
function initSideNav() {
    document.querySelectorAll('.nav-dot').forEach(d => {
        d.addEventListener('click', () => {
            const s = parseInt(d.dataset.s);
            if (unlockedPages.includes(s)) goToScreen(s);
        });
    });
    updateNavDots();
}

// ============ FLOATING HEARTS ============
function createFloatingHearts() {
    const container = document.getElementById('heartsBg');
    if (!container) return;
    const hearts = ['💕', '❤️', '💗', '💖', '💘', '✨', '🌹', '💝'];
    for (let i = 0; i < 25; i++) {
        const h = document.createElement('div');
        h.className = 'fl-heart';
        h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        h.style.left = Math.random() * 100 + '%';
        h.style.fontSize = (14 + Math.random() * 22) + 'px';
        h.style.animationDuration = (8 + Math.random() * 14) + 's';
        h.style.animationDelay = (Math.random() * 12) + 's';
        container.appendChild(h);
    }
}

// ============ BG CANVAS (particles) ============
function initBgCanvas() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.r = Math.random() * 2 + 0.5;
            this.dx = (Math.random() - 0.5) * 0.4;
            this.dy = (Math.random() - 0.5) * 0.4;
            this.alpha = Math.random() * 0.4 + 0.05;
            this.pulse = Math.random() * Math.PI * 2;
        }
        update() {
            this.x += this.dx;
            this.y += this.dy;
            this.pulse += 0.015;
            if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
        }
        draw() {
            const a = this.alpha + Math.sin(this.pulse) * 0.1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,77,109,${Math.max(0, a)})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}

// ============ HEART SHADOWS BG ============
function createHeartShadows() {
    const c = document.getElementById('heartShadows');
    if (!c) return;
    const configs = [
        { x:'5%',  y:'10%', sz:'120px', o:0.035, dur:'20s', del:'0s',  rot:'-15deg', mx:'30px',  my:'-40px', blur:'3px',  clr:'rgba(255,77,109,0.45)' },
        { x:'80%', y:'5%',  sz:'90px',  o:0.04,  dur:'25s', del:'3s',  rot:'10deg',  mx:'-25px', my:'-20px', blur:'2px',  clr:'rgba(255,140,170,0.4)' },
        { x:'60%', y:'70%', sz:'150px', o:0.025, dur:'22s', del:'5s',  rot:'20deg',  mx:'40px',  my:'-50px', blur:'5px',  clr:'rgba(255,77,109,0.35)' },
        { x:'15%', y:'75%', sz:'100px', o:0.03,  dur:'18s', del:'2s',  rot:'-25deg', mx:'-20px', my:'-35px', blur:'4px',  clr:'rgba(200,60,100,0.4)' },
        { x:'45%', y:'40%', sz:'180px', o:0.018, dur:'28s', del:'7s',  rot:'5deg',   mx:'50px',  my:'-60px', blur:'8px',  clr:'rgba(255,77,109,0.3)' },
        { x:'90%', y:'50%', sz:'70px',  o:0.045, dur:'15s', del:'1s',  rot:'-10deg', mx:'-15px', my:'-25px', blur:'1px',  clr:'rgba(255,100,140,0.5)' },
        { x:'30%', y:'20%', sz:'110px', o:0.03,  dur:'24s', del:'4s',  rot:'30deg',  mx:'35px',  my:'-45px', blur:'3px',  clr:'rgba(255,77,109,0.4)' },
        { x:'70%', y:'85%', sz:'85px',  o:0.035, dur:'19s', del:'6s',  rot:'-20deg', mx:'-30px', my:'-30px', blur:'2px',  clr:'rgba(220,50,90,0.45)' },
        { x:'50%', y:'8%',  sz:'130px', o:0.022, dur:'26s', del:'8s',  rot:'12deg',  mx:'25px',  my:'-55px', blur:'6px',  clr:'rgba(255,77,109,0.35)' },
        { x:'10%', y:'45%', sz:'95px',  o:0.038, dur:'21s', del:'9s',  rot:'-8deg',  mx:'-40px', my:'-20px', blur:'2px',  clr:'rgba(255,120,160,0.4)' },
    ];
    configs.forEach(cfg => {
        const h = document.createElement('div');
        h.className = 'heart-shadow';
        const halfSz = (parseFloat(cfg.sz) / 3.2) + 'px';
        h.style.cssText = `
            left:${cfg.x};top:${cfg.y};
            --sz:${cfg.sz};--o:${cfg.o};--dur:${cfg.dur};--del:${cfg.del};
            --rot:${cfg.rot};--mx:${cfg.mx};--my:${cfg.my};
            --blur:${cfg.blur};--clr:${cfg.clr};--half-sz:${halfSz};
        `;
        c.appendChild(h);
    });
}

// ============ ROSE PETALS ============
function createRosePetals() {
    const c = document.getElementById('rosePetals');
    if (!c) return;
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'petal';
        p.style.left = Math.random() * 100 + '%';
        p.style.width = (10 + Math.random() * 15) + 'px';
        p.style.height = p.style.width;
        p.style.animationDuration = (6 + Math.random() * 8) + 's';
        p.style.animationDelay = (Math.random() * 10) + 's';
        p.style.opacity = 0.3 + Math.random() * 0.4;
        c.appendChild(p);
    }
}

// ============ ENVELOPE CLICK ============
function initEnvelope() {
    const env = document.getElementById('envelope');
    if (!env) return;
    env.addEventListener('click', () => {
        env.querySelector('.env-flap').style.transform = 'rotateX(180deg)';
        env.querySelector('.env-letter').style.top = '-50px';
        setTimeout(() => goToScreen(2), 1200);
    });
}

// ============ NO BUTTON DODGE ============
function initNoButton() {
    const btnNo = document.getElementById('btnNo');
    const btnYes = document.getElementById('btnYes');
    const msgEl = document.getElementById('attemptMsg');
    const teddy = document.getElementById('teddy');
    const mouth = document.getElementById('teddyMouth');
    const plea = document.getElementById('plea');
    if (!btnNo) return;

    const messages = [
        "Haha, try again! 😝",
        "Nope! Not happening! 🙅",
        "You really want to click No? 🥺",
        "The No button is scared of you! 😂",
        "It ran away! Try the YES! 💕",
        "Even the button says YES 😍",
        "Okay, now just click Yes! 💖",
        "Fine... the No button gave up. Say YES! 🤣",
        "The button is hiding... accept it! 💝",
        "You can't say No to love! ❤️",
    ];

    const pleaMessages = [
        "Please? 🥺💕",
        "Pretty please? 🥹",
        "I'll be so happy... 😢",
        "Come on, say yes! 💖",
        "My heart is waiting... 💓",
    ];

    function dodgeNo(e) {
        e.preventDefault();
        e.stopPropagation();
        noAttempts++;

        // Add dodging class for fixed positioning after first click
        btnNo.classList.add('dodging');

        // Calculate safe area for movement
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const btnW = btnNo.offsetWidth;
        const btnH = btnNo.offsetHeight;
        const margin = 20;

        // Random position within viewport
        let rx, ry;
        if (noAttempts <= 3) {
            // Stay near center area first few times
            rx = (vw * 0.2) + Math.random() * (vw * 0.6 - btnW);
            ry = (vh * 0.3) + Math.random() * (vh * 0.5 - btnH);
        } else {
            // Go anywhere on screen
            rx = margin + Math.random() * (vw - btnW - margin * 2);
            ry = margin + Math.random() * (vh - btnH - margin * 2);
        }

        btnNo.style.left = rx + 'px';
        btnNo.style.top = ry + 'px';

        // Add a little rotation for fun
        const rotAngle = (Math.random() - 0.5) * 30;
        const scale = Math.max(0.35, 1 - noAttempts * 0.07);
        btnNo.style.transform = `scale(${scale}) rotate(${rotAngle}deg)`;

        // Grow the Yes button
        const growClass = 'g' + Math.min(noAttempts, 5);
        btnYes.className = 'btn-yes ' + growClass;

        // Set message
        if (msgEl) {
            msgEl.textContent = messages[Math.min(noAttempts - 1, messages.length - 1)];
        }

        // Teddy sad face
        if (teddy) teddy.classList.add('sad');
        if (mouth) mouth.classList.add('sad');

        // Update plea
        if (plea && noAttempts <= pleaMessages.length) {
            plea.textContent = pleaMessages[noAttempts - 1];
        }

        // After many attempts, hide the No button
        if (noAttempts >= 8) {
            btnNo.style.opacity = '0';
            btnNo.style.pointerEvents = 'none';
            if (msgEl) msgEl.textContent = "The No button gave up! Only YES remains! 💖";
        }
    }

    btnNo.addEventListener('click', dodgeNo);
    btnNo.addEventListener('touchstart', dodgeNo, { passive: false });
}

// ============ YES HANDLER ============
function handleYes() {
    const teddy = document.getElementById('teddy');
    const mouth = document.getElementById('teddyMouth');
    if (teddy) {
        teddy.classList.remove('sad');
        teddy.classList.add('happy');
    }
    if (mouth) mouth.classList.remove('sad');

    unlockAllPages();

    setTimeout(() => goToScreen(3), 600);
}

// ============ CELEBRATION ============
function triggerCelebration() {
    createConfetti();
    createFireworks();
    createHeartShower();
}

function createConfetti() {
    const c = document.getElementById('confetti');
    if (!c) return;
    c.innerHTML = '';
    const colors = ['#ff4d6d', '#ffd700', '#ff8fa3', '#00e676', '#448aff', '#e040fb', '#ffb3c1', '#69f0ae'];
    const shapes = ['▮', '●', '◆', '★', '♥'];
    for (let i = 0; i < 80; i++) {
        const p = document.createElement('span');
        p.className = 'confetti-p';
        p.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        p.style.left = Math.random() * 100 + '%';
        p.style.color = colors[Math.floor(Math.random() * colors.length)];
        p.style.fontSize = (8 + Math.random() * 14) + 'px';
        p.style.animationDuration = (2 + Math.random() * 3) + 's';
        p.style.animationDelay = (Math.random() * 2.5) + 's';
        c.appendChild(p);
    }
    // Cleanup
    setTimeout(() => { if (c) c.innerHTML = ''; }, 7000);
}

function createFireworks() {
    const f = document.getElementById('fireworks');
    if (!f) return;
    f.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            const fw = document.createElement('div');
            fw.style.cssText = `
                position:absolute;
                left:${15 + Math.random() * 70}%;
                top:${10 + Math.random() * 50}%;
                width:6px;height:6px;
                border-radius:50%;
                background:#ffd700;
                box-shadow:0 0 20px #ffd700;
                animation:fwBurst .8s ease-out forwards;
            `;
            f.appendChild(fw);

            // Burst particles
            for (let j = 0; j < 12; j++) {
                const sp = document.createElement('div');
                const angle = (j / 12) * Math.PI * 2;
                const dist = 40 + Math.random() * 60;
                const colors = ['#ff4d6d', '#ffd700', '#ff8fa3', '#69f0ae', '#e040fb'];
                sp.style.cssText = `
                    position:absolute;
                    left:${parseFloat(fw.style.left)}%;
                    top:${parseFloat(fw.style.top)}%;
                    width:4px;height:4px;
                    border-radius:50%;
                    background:${colors[j % colors.length]};
                    box-shadow:0 0 6px ${colors[j % colors.length]};
                    transition:all .8s ease-out;
                    opacity:1;
                `;
                f.appendChild(sp);
                requestAnimationFrame(() => {
                    sp.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
                    sp.style.opacity = '0';
                });
            }
        }, i * 500);
    }
    setTimeout(() => { if (f) f.innerHTML = ''; }, 6000);
}

function createHeartShower() {
    const s = document.getElementById('heartShower');
    if (!s) return;
    s.innerHTML = '';
    for (let i = 0; i < 30; i++) {
        const h = document.createElement('span');
        h.className = 'confetti-p';
        h.textContent = ['❤️', '💕', '💖', '💗', '💝'][Math.floor(Math.random() * 5)];
        h.style.left = Math.random() * 100 + '%';
        h.style.fontSize = (14 + Math.random() * 18) + 'px';
        h.style.animationDuration = (3 + Math.random() * 3) + 's';
        h.style.animationDelay = (Math.random() * 3) + 's';
        s.appendChild(h);
    }
}

// ============ YOUTUBE PLAYER ============
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('ytPlayer', {
        height: '1',
        width: '1',
        playerVars: {
            autoplay: 0,
            controls: 0,
            showinfo: 0,
            modestbranding: 1,
            rel: 0,
        },
        events: {
            onStateChange: onPlayerStateChange,
        }
    });
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        isPlaying = false;
        isPaused = false;
        updatePlayerUI(false);
    }
}

function playSong(trackEl, title, artist, videoId) {
    // Mark active track
    document.querySelectorAll('.track').forEach(t => t.classList.remove('active'));
    trackEl.classList.add('active');
    currentTrackEl = trackEl;

    // Update info
    document.getElementById('piTitle').textContent = title;
    document.getElementById('piArtist').textContent = artist;

    // Play
    if (ytPlayer && ytPlayer.loadVideoById) {
        ytPlayer.loadVideoById(videoId);
        isPlaying = true;
        isPaused = false;
        updatePlayerUI(true);
    }
}

function togglePause() {
    if (!ytPlayer) return;
    if (isPaused) {
        ytPlayer.playVideo();
        isPaused = false;
        isPlaying = true;
        updatePlayerUI(true);
    } else {
        ytPlayer.pauseVideo();
        isPaused = true;
        isPlaying = false;
        updatePlayerUI(false);
    }
}

function updatePlayerUI(playing) {
    const disc = document.getElementById('disc');
    const arm = document.getElementById('toneArm');
    const eq = document.getElementById('eqBars');
    const pauseBtn = document.getElementById('pauseBtn');

    if (disc) disc.classList.toggle('spin', playing);
    if (arm) arm.classList.toggle('on', playing);
    if (eq) eq.classList.toggle('active', playing);
    if (pauseBtn) {
        pauseBtn.style.display = isPlaying || isPaused ? 'inline-block' : 'none';
        pauseBtn.textContent = isPaused ? '▶ Play' : '⏸ Pause';
    }
}

// ============ TYPEWRITER ============
function startTypewriter() {
    const el = document.getElementById('twText');
    const cursor = document.getElementById('twCursor');
    if (!el) return;

    const text = "You are the most beautiful thing that has ever happened to me. Every second with you is a gift I treasure. I love you more than words could ever express... Happy Valentine's Day, my love! 💕🌹✨";

    el.textContent = '';
    if (cursor) cursor.style.display = 'inline';

    let i = 0;
    clearInterval(typewriterTimer);
    typewriterTimer = setInterval(() => {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typewriterTimer);
            // Hide cursor after done
            setTimeout(() => {
                if (cursor) cursor.style.display = 'none';
            }, 2000);
        }
    }, 45);
}

// ============ RESTART ============
function restart() {
    // Reset state
    noAttempts = 0;
    unlockedPages = [1, 2];
    isPlaying = false;
    isPaused = false;
    currentTrackEl = null;
    clearInterval(typewriterTimer);

    // Reset teddy
    const teddy = document.getElementById('teddy');
    const mouth = document.getElementById('teddyMouth');
    if (teddy) { teddy.classList.remove('sad', 'happy'); }
    if (mouth) { mouth.classList.remove('sad'); }

    // Reset Yes button
    const btnYes = document.getElementById('btnYes');
    if (btnYes) btnYes.className = 'btn-yes';

    // Reset No button
    const btnNo = document.getElementById('btnNo');
    if (btnNo) {
        btnNo.classList.remove('dodging');
        btnNo.style.left = '';
        btnNo.style.top = '';
        btnNo.style.transform = '';
        btnNo.style.opacity = '';
        btnNo.style.pointerEvents = '';
    }

    // Reset messages
    const msg = document.getElementById('attemptMsg');
    if (msg) msg.textContent = '';
    const plea = document.getElementById('plea');
    if (plea) plea.textContent = 'Please say yes... 🥺💕';

    // Reset typewriter
    const tw = document.getElementById('twText');
    if (tw) tw.textContent = '';

    // Reset tracks
    document.querySelectorAll('.track').forEach(t => t.classList.remove('active'));
    document.getElementById('piTitle').textContent = 'Select a song';
    document.getElementById('piArtist').textContent = '—';
    updatePlayerUI(false);
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) pauseBtn.style.display = 'none';

    // Stop YouTube
    if (ytPlayer && ytPlayer.stopVideo) ytPlayer.stopVideo();

    // Go to screen 1
    goToScreen(1);
}

// ============ KEYBOARD NAV ============
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const next = currentScreen + 1;
        if (next <= totalScreens && unlockedPages.includes(next)) goToScreen(next);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const prev = currentScreen - 1;
        if (prev >= 1 && unlockedPages.includes(prev)) goToScreen(prev);
    }
});

// ============ SWIPE / TOUCH NAV ============
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 60) {
        if (diff > 0) {
            // Swipe up → next
            const next = currentScreen + 1;
            if (next <= totalScreens && unlockedPages.includes(next)) goToScreen(next);
        } else {
            // Swipe down → prev
            const prev = currentScreen - 1;
            if (prev >= 1 && unlockedPages.includes(prev)) goToScreen(prev);
        }
    }
}, { passive: true });
