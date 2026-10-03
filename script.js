// Siapkan file audio di awal
const bgm = new Audio('lagu.mp3');

// Otomatis stop di menit 02:09 biar suara alien di akhir gak keputar
bgm.addEventListener('timeupdate', () => {
  if (bgm.currentTime >= 129) {
    bgm.pause();
  }
});

// Navigation function
function nextPage(pageId) {
    // 1. Fade out current active page
    const activePage = document.querySelector('.page.active');
    if (activePage) {
        activePage.classList.remove('active');
        setTimeout(() => {
            activePage.classList.add('hidden');
        }, 400); // match CSS transition duration
    }

    // 2. Fade in target page
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.remove('hidden');
        // slight delay to ensure display:block takes effect before triggering transition
        setTimeout(() => {
            target.classList.add('active');
        }, 20);
    }

    // Page specific initializations
    if (pageId === 'page4') {
        initBalloons();
    }
}

// Confetti for Page 1->2 transition
function startConfetti() {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        }));
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        }));
    }, 250);
}

// Blow candle interaction
document.querySelector('.candle').addEventListener('click', blowCandle);
// Removed .flame listener to prevent double triggering via event bubbling

let blowCount = 0;
function blowCandle(e) {
    if (e) e.stopPropagation();
    const flame = document.querySelector('.flame');
    const instruction = document.getElementById('blow-instruction');

    if (flame.classList.contains('out')) return;

    blowCount++;

    if (blowCount === 1) {
        // Prank: make it wild instead of blowing out
        flame.classList.add('wild');
        instruction.innerHTML = 'Tiupnya kurang kenceng, coba klik sekali lagi 💨';
        instruction.style.color = '#ffaa00';
    } else if (blowCount === 2) {
        // Actually blow it out
        flame.classList.remove('wild');
        flame.classList.add('out');
        instruction.style.display = 'none';

        // === TAMBAHKAN 2 BARIS INI ===
        bgm.currentTime = 38; // langsung lompat ke detik 38 lewatin intro alien
        bgm.play();

        // Show confetti and next button
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            zIndex: 100
        });

        const btnPage3 = document.getElementById('btn-page3');
        btnPage3.classList.remove('hidden');
    }
}

// Envelope interaction
let envelopeOpened = false;
function openEnvelope() {
    if (!envelopeOpened) {
        document.querySelector('.envelope').classList.add('open');
        document.querySelector('.click-instruction').style.display = 'none';
        envelopeOpened = true;

        setTimeout(() => {
            document.getElementById('btn-page4').classList.remove('hidden');

            // Pop some confetti when opening letter
            confetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#d4af37', '#fef0a0']
            });
        }, 800);
    }
}

// Balloon popping interaction
let poppedCount = 0;
const totalBalloons = 8;
const colors = ['#d4af37', '#e5e4e2', '#fdfbfb', '#b76e79', '#f3e5ab', '#c5a059'];

function initBalloons() {
    const container = document.getElementById('balloons-container');
    container.innerHTML = '';
    container.style.display = 'flex';
    const page4Title = document.querySelector('#page4 h1');
    if (page4Title) page4Title.style.display = 'block';
    poppedCount = 0;
    document.getElementById('final-message').classList.add('hidden');

    for (let i = 0; i < totalBalloons; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        const color = colors[i % colors.length];

        // Set CSS variable for color
        balloon.style.setProperty('--balloon-color', color);

        // Random animation delay
        balloon.style.animationDelay = `${Math.random() * 2}s`;

        balloon.addEventListener('click', function (e) {
            if (!this.classList.contains('popped')) {
                this.classList.add('popped');

                // Small pop confetti at balloon location
                const rect = this.getBoundingClientRect();
                const x = (rect.left + rect.width / 2) / window.innerWidth;
                const y = (rect.top + rect.height / 2) / window.innerHeight;

                confetti({
                    particleCount: 30,
                    spread: 50,
                    origin: { x, y },
                    colors: [color],
                    zIndex: 100
                });

                poppedCount++;
                if (poppedCount === totalBalloons) {
                    setTimeout(() => {
                        container.style.display = 'none';
                        const page4Title = document.querySelector('#page4 h1');
                        if (page4Title) page4Title.style.display = 'none';
                        document.getElementById('final-message').classList.remove('hidden');
                        startConfetti(); // Big celebration
                    }, 500);
                }
            }
        });

        container.appendChild(balloon);
    }
}

// Dodging Button logic
let hoverCount = 0;
let lastDodgeTime = 0;

function dodgingButton(e) {
    const now = Date.now();
    if (now - lastDodgeTime < 300) return; // Prevent double trigger from touch+click
    lastDodgeTime = now;

    const btn = document.getElementById('btn-page4');
    
    if (hoverCount >= 3) return;
    
    hoverCount++;
    
    if (hoverCount === 1) {
        btn.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * -60 - 30}px)`;
        btn.innerText = "Eits gak kena 😜";
    } else if (hoverCount === 2) {
        btn.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 60 + 30}px)`;
        btn.innerText = "Yee maksa banget";
    } else if (hoverCount === 3) {
        btn.style.transform = "translate(0, 0)";
        btn.innerText = "Yaudah nih klik 🙄";
    }
}

function handleBtnPage4Click() {
    if (hoverCount >= 3) {
        nextPage('page4');
    } else {
        dodgingButton();
    }
}
