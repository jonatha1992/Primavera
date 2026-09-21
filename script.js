/**
 * Primavera & Flores Amarillas
 * Lógica compartida para interactividad, personalización, música y dedicatorias
 */

document.addEventListener('DOMContentLoaded', () => {
    initPersonalization();
    initInteractions();
    initMusic();
    initModal();
    initPageTransitions();
});

/* ===============================================
   TRANSICIONES SUAVES ENTRE PÁGINAS
   =============================================== */
function initPageTransitions() {
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('javascript')) {
            return;
        }

        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.add('page-transitioning');
            setTimeout(() => {
                window.location.href = href;
            }, 260);
        });
    });
}

/* ===============================================
   1. PERSONALIZACIÓN MEDIANTE URL
   =============================================== */
function initPersonalization() {
    const urlParams = new URLSearchParams(window.location.search);
    const para = urlParams.get('para');
    const de = urlParams.get('de');
    const msg = urlParams.get('msg');

    const destEl = document.getElementById('destinatario');
    const remEl = document.getElementById('remitente');
    const msgEl = document.getElementById('mensaje-texto');
    const inputPara = document.getElementById('input-para');
    const inputDe = document.getElementById('input-de');
    const inputMsg = document.getElementById('input-msg');

    if (destEl && para) {
        destEl.textContent = `Para ${para} 💛`;
    }
    if (remEl && de) {
        remEl.textContent = `Con todo mi amor, ${de} ✨`;
    }
    if (msgEl && msg) {
        msgEl.innerHTML = escapeHtml(msg).replace(/\n/g, '<br>');
    }

    // Pre-cargar valores en los campos del modal si existen
    if (inputPara && para) inputPara.value = para;
    if (inputDe && de) inputDe.value = de;
    if (inputMsg) {
        if (msg) {
            inputMsg.value = msg;
        }
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* ===============================================
   2. INTERACTIVIDAD (DESTIELLOS Y PÉTALOS AL CLIC)
   =============================================== */
function initInteractions() {
    const flower = document.querySelector('.sunflower');
    
    // Al tocar o hacer clic en la flor o la pantalla
    document.addEventListener('pointerdown', (e) => {
        // Evitar generar chispas si se hace clic dentro del modal o botones
        if (e.target.closest('.interactive-control, .modal-card, button, input, textarea, a')) {
            return;
        }
        createSparkleBurst(e.clientX, e.clientY);
    });

    if (flower) {
        flower.style.cursor = 'pointer';
        flower.addEventListener('click', (e) => {
            const rect = flower.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            createFlowerPulse(flower);
            for (let i = 0; i < 15; i++) {
                createSparkleBurst(centerX, centerY);
            }
        });
    }
}

function createFlowerPulse(flower) {
    flower.animate([
        { transform: 'scale(1) rotate(0deg)' },
        { transform: 'scale(1.08) translateY(-6px) rotate(2deg)' },
        { transform: 'scale(0.96) translateY(2px) rotate(-1.5deg)' },
        { transform: 'scale(1.02) rotate(0.8deg)' },
        { transform: 'scale(1) rotate(0deg)' }
    ], {
        duration: 750,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    });
}

function createSparkleBurst(x, y) {
    const symbols = ['✨', '💛', '🌼', '⭐', '🌸'];
    const count = 5 + Math.floor(Math.random() * 4);

    for (let i = 0; i < count; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'tap-sparkle';
        sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 40 + Math.random() * 80;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity - 30; // Tendencia a flotar hacia arriba
        
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.setProperty('--tx', `${tx}px`);
        sparkle.style.setProperty('--ty', `${ty}px`);
        sparkle.style.setProperty('--rot', `${(Math.random() - 0.5) * 60}deg`);

        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 1200);
    }
}

/* ===============================================
   3. MÚSICA: "FLORES AMARILLAS" (FLORICIENTA)
   Arreglo especial tipo cajita musical / celesta
   =============================================== */
let audioCtx = null;
let isPlaying = false;
let musicTimeout = null;

const NOTES = {
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, Fs5: 739.99, G5: 783.99, A5: 880.00
};

// Melodía completa del estribillo de "Flores Amarillas" (Floricienta)
const FLORES_AMARILLAS = [
    // "Él la es-ta-ba es-pe-ran-do" (G)
    { f: NOTES.B4, bass: NOTES.G3, dur: 0.32, wait: 0.34 },
    { f: NOTES.B4, dur: 0.22, wait: 0.24 },
    { f: NOTES.B4, dur: 0.22, wait: 0.24 },
    { f: NOTES.B4, dur: 0.22, wait: 0.24 },
    { f: NOTES.C5, dur: 0.26, wait: 0.28 },
    { f: NOTES.B4, bass: NOTES.D4, dur: 0.45, wait: 0.48 },
    { f: NOTES.A4, dur: 0.24, wait: 0.26 },
    { f: NOTES.G4, dur: 0.36, wait: 0.40 },

    // "con u-na flor a-ma-ri-lla" (Em)
    { f: NOTES.G4, bass: NOTES.E3, dur: 0.26, wait: 0.28 },
    { f: NOTES.A4, dur: 0.26, wait: 0.28 },
    { f: NOTES.B4, dur: 0.36, wait: 0.38 },
    { f: NOTES.G4, bass: NOTES.B3, dur: 0.55, wait: 0.58 },
    { f: NOTES.Fs4, dur: 0.24, wait: 0.26 },
    { f: NOTES.G4, dur: 0.24, wait: 0.26 },
    { f: NOTES.E4, dur: 0.45, wait: 0.48 },
    { f: NOTES.D4, dur: 0.45, wait: 0.50 },

    // "El-la lo es-ta-ba so-ñan-do" (C)
    { f: NOTES.A4, bass: NOTES.C3, dur: 0.32, wait: 0.34 },
    { f: NOTES.A4, dur: 0.22, wait: 0.24 },
    { f: NOTES.A4, dur: 0.22, wait: 0.24 },
    { f: NOTES.A4, dur: 0.22, wait: 0.24 },
    { f: NOTES.B4, dur: 0.26, wait: 0.28 },
    { f: NOTES.A4, bass: NOTES.E4, dur: 0.45, wait: 0.48 },
    { f: NOTES.G4, dur: 0.24, wait: 0.26 },
    { f: NOTES.Fs4, dur: 0.36, wait: 0.38 },
    { f: NOTES.E4, dur: 0.36, wait: 0.40 },

    // "con la luz en su pu-pi-la" (D)
    { f: NOTES.Fs4, bass: NOTES.D3, dur: 0.26, wait: 0.28 },
    { f: NOTES.G4, dur: 0.26, wait: 0.28 },
    { f: NOTES.A4, dur: 0.36, wait: 0.38 },
    { f: NOTES.B4, bass: NOTES.A3, dur: 0.30, wait: 0.32 },
    { f: NOTES.A4, dur: 0.30, wait: 0.32 },
    { f: NOTES.G4, dur: 0.30, wait: 0.32 },
    { f: NOTES.Fs4, dur: 0.36, wait: 0.38 },
    { f: NOTES.G4, bass: NOTES.G3, dur: 0.65, wait: 0.72 },

    // "Y el a-ma-ri-llo del sol" (G)
    { f: NOTES.B4, bass: NOTES.G3, dur: 0.32, wait: 0.34 },
    { f: NOTES.B4, dur: 0.22, wait: 0.24 },
    { f: NOTES.B4, dur: 0.22, wait: 0.24 },
    { f: NOTES.B4, dur: 0.22, wait: 0.24 },
    { f: NOTES.C5, dur: 0.26, wait: 0.28 },
    { f: NOTES.B4, bass: NOTES.D4, dur: 0.45, wait: 0.48 },
    { f: NOTES.A4, dur: 0.24, wait: 0.26 },
    { f: NOTES.G4, dur: 0.36, wait: 0.40 },

    // "i-lu-mi-na-ba la es-qui-na" (Em)
    { f: NOTES.G4, bass: NOTES.E3, dur: 0.26, wait: 0.28 },
    { f: NOTES.A4, dur: 0.26, wait: 0.28 },
    { f: NOTES.B4, dur: 0.36, wait: 0.38 },
    { f: NOTES.G4, bass: NOTES.B3, dur: 0.55, wait: 0.58 },
    { f: NOTES.Fs4, dur: 0.24, wait: 0.26 },
    { f: NOTES.G4, dur: 0.24, wait: 0.26 },
    { f: NOTES.E4, dur: 0.45, wait: 0.48 },
    { f: NOTES.D4, dur: 0.45, wait: 0.50 },

    // "Lo sen-tí-a tan cer-ca-no" (C)
    { f: NOTES.A4, bass: NOTES.C3, dur: 0.32, wait: 0.34 },
    { f: NOTES.A4, dur: 0.22, wait: 0.24 },
    { f: NOTES.A4, dur: 0.22, wait: 0.24 },
    { f: NOTES.A4, dur: 0.22, wait: 0.24 },
    { f: NOTES.B4, dur: 0.26, wait: 0.28 },
    { f: NOTES.A4, bass: NOTES.E4, dur: 0.45, wait: 0.48 },
    { f: NOTES.G4, dur: 0.24, wait: 0.26 },
    { f: NOTES.Fs4, dur: 0.36, wait: 0.38 },
    { f: NOTES.E4, dur: 0.36, wait: 0.40 },

    // "lo sen-tí-a des-de siem-pre..." (D)
    { f: NOTES.Fs4, bass: NOTES.D3, dur: 0.26, wait: 0.28 },
    { f: NOTES.G4, dur: 0.26, wait: 0.28 },
    { f: NOTES.A4, dur: 0.36, wait: 0.38 },
    { f: NOTES.B4, bass: NOTES.A3, dur: 0.30, wait: 0.32 },
    { f: NOTES.A4, dur: 0.30, wait: 0.32 },
    { f: NOTES.G4, dur: 0.30, wait: 0.32 },
    { f: NOTES.Fs4, dur: 0.36, wait: 0.38 },
    { f: NOTES.G4, bass: NOTES.G3, dur: 0.65, wait: 0.72 },

    // "Y no te-mí-a per-der" (C)
    { f: NOTES.E5, bass: NOTES.C3, dur: 0.34, wait: 0.36 },
    { f: NOTES.E5, dur: 0.28, wait: 0.30 },
    { f: NOTES.E5, dur: 0.28, wait: 0.30 },
    { f: NOTES.E5, dur: 0.28, wait: 0.30 },
    { f: NOTES.D5, dur: 0.34, wait: 0.36 },
    { f: NOTES.C5, dur: 0.34, wait: 0.36 },

    // "ja-más su a-mor..." (G/B)
    { f: NOTES.D5, bass: NOTES.B3, dur: 0.48, wait: 0.50 },
    { f: NOTES.D5, dur: 0.28, wait: 0.30 },
    { f: NOTES.D5, dur: 0.28, wait: 0.30 },
    { f: NOTES.C5, dur: 0.28, wait: 0.30 },
    { f: NOTES.B4, bass: NOTES.G3, dur: 0.65, wait: 0.70 },

    // "Él la es-ta-ba es-pe-ran-do" (Am)
    { f: NOTES.C5, bass: NOTES.A3, dur: 0.34, wait: 0.36 },
    { f: NOTES.C5, dur: 0.28, wait: 0.30 },
    { f: NOTES.C5, dur: 0.28, wait: 0.30 },
    { f: NOTES.B4, dur: 0.28, wait: 0.30 },
    { f: NOTES.A4, dur: 0.34, wait: 0.36 },
    { f: NOTES.B4, dur: 0.34, wait: 0.36 },

    // "con u-na flor a-ma-ri-lla! ✨" (D7 -> G)
    { f: NOTES.C5, bass: NOTES.D3, dur: 0.34, wait: 0.36 },
    { f: NOTES.B4, dur: 0.28, wait: 0.30 },
    { f: NOTES.A4, dur: 0.28, wait: 0.30 },
    { f: NOTES.B4, dur: 0.28, wait: 0.30 },
    { f: NOTES.A4, dur: 0.34, wait: 0.36 },
    { f: NOTES.G4, bass: NOTES.G3, dur: 1.10, wait: 1.50 }
];

function initMusic() {
    const musicBtn = document.getElementById('btn-music');
    if (!musicBtn) return;

    musicBtn.addEventListener('click', () => {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        if (!isPlaying) {
            startMelody();
            isPlaying = true;
            musicBtn.innerHTML = '<span>🔊</span> Flores Amarillas';
            musicBtn.classList.add('active');
            showToast('🌻 "Flores Amarillas" de Floricienta sonando 🎵');
        } else {
            stopMelody();
            isPlaying = false;
            musicBtn.innerHTML = '<span>🎵</span> Música';
            musicBtn.classList.remove('active');
        }
    });
}

function playTone(freq, duration, isBass = false) {
    if (!audioCtx || audioCtx.state !== 'running' || !freq) return;
    
    try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = isBass ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        if (isBass) {
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.3);
        } else {
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.14, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.15);

            // Brillo tipo celesta/cajita de música
            const overtone = audioCtx.createOscillator();
            const overGain = audioCtx.createGain();
            overtone.type = 'sine';
            overtone.frequency.setValueAtTime(freq * 2, now);
            overGain.gain.setValueAtTime(0, now);
            overGain.gain.linearRampToValueAtTime(0.04, now + 0.015);
            overGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.6);
            overtone.connect(overGain);
            overGain.connect(audioCtx.destination);
            overtone.start(now);
            overtone.stop(now + duration);
        }

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + duration + 0.3);
    } catch (e) {
        console.warn('Audio note error:', e);
    }
}

function startMelody() {
    let step = 0;
    
    function tick() {
        if (!isPlaying) return;
        const current = FLORES_AMARILLAS[step % FLORES_AMARILLAS.length];

        playTone(current.f, current.dur, false);
        if (current.bass) {
            playTone(current.bass, current.dur * 1.2, true);
        }

        step++;
        const nextTime = current.wait * 1000;
        musicTimeout = setTimeout(tick, nextTime);
    }

    tick();
}

function stopMelody() {
    if (musicTimeout) {
        clearTimeout(musicTimeout);
        musicTimeout = null;
    }
}

/* ===============================================
   4. MODAL GENERADOR DE DEDICATORIAS / COMPARTIR
   =============================================== */
function initModal() {
    const openBtns = document.querySelectorAll('.btn-personalizar, #btn-personalizar');
    const modal = document.getElementById('modal-personalizar');
    const closeBtn = document.getElementById('btn-close-modal');
    const copyBtn = document.getElementById('btn-copy-link');
    
    const inputPara = document.getElementById('input-para');
    const inputDe = document.getElementById('input-de');
    const inputMsg = document.getElementById('input-msg');

    if (!modal) return;

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('visible');
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('visible');
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('visible');
        }
    });

    function buildUrl() {
        const baseUrl = window.location.origin + window.location.pathname
            .replace('personal.html', 'index.html')
            .replace('especial.html', 'index.html');
        const params = new URLSearchParams();

        if (inputPara && inputPara.value.trim()) {
            params.set('para', inputPara.value.trim());
        }
        if (inputDe && inputDe.value.trim()) {
            params.set('de', inputDe.value.trim());
        }
        if (inputMsg && inputMsg.value.trim()) {
            params.set('msg', inputMsg.value.trim());
        }

        const queryString = params.toString();
        return queryString ? `${baseUrl}?${queryString}` : baseUrl;
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const url = buildUrl();
            navigator.clipboard.writeText(url).then(() => {
                showToast('🌻 ¡Enlace personalizado copiado!');
                modal.classList.remove('visible');
            }).catch(() => {
                prompt('Copia este enlace para compartir:', url);
            });
        });
    }

}

/* ===============================================
   5. TOAST NOTIFICATION
   =============================================== */
function showToast(message) {
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}
