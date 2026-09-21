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
    if (inputPara) {
        if (para) {
            inputPara.value = para;
        } else if (destEl && destEl.textContent.includes('Noelia')) {
            inputPara.value = 'Noelia';
        }
    }
    if (inputDe) {
        if (de) {
            inputDe.value = de;
        } else if (remEl && remEl.textContent.includes('Jonathan')) {
            inputDe.value = 'Jonathan';
        }
    }
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
   3. MÚSICA AMBIENTAL (WEB AUDIO SINTETIZADOR)
   Melodía dulce y primaveral sin dependencias
   =============================================== */
let audioCtx = null;
let isPlaying = false;
let musicInterval = null;

const SPRING_NOTES = [
    // Frecuencias para una melodía suave de primavera (C Major / Pentatónica brillante)
    261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25
];

const MELODY_SEQUENCE = [
    { note: 2, dur: 0.5 }, { note: 3, dur: 0.5 }, { note: 4, dur: 0.8 },
    { note: 3, dur: 0.4 }, { note: 2, dur: 0.6 }, { note: 1, dur: 0.4 },
    { note: 0, dur: 1.0 }, { note: 2, dur: 0.5 }, { note: 4, dur: 0.5 },
    { note: 5, dur: 1.2 }, { note: 4, dur: 0.5 }, { note: 3, dur: 0.8 },
    { note: 2, dur: 0.6 }, { note: 0, dur: 1.4 }
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
            musicBtn.innerHTML = '<span>🔊</span> Pausar Música';
            musicBtn.classList.add('active');
            showToast('🎵 Música de primavera activada');
        } else {
            stopMelody();
            isPlaying = false;
            musicBtn.innerHTML = '<span>🎵</span> Música';
            musicBtn.classList.remove('active');
        }
    });
}

function playTone(freq, duration) {
    if (!audioCtx || audioCtx.state !== 'running') return;
    
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        // Forma de onda suave (sine / triangle) tipo celesta / campana
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        // Envolvente de volumen (ataque rápido y decaimiento suave)
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.warn('Audio note error:', e);
    }
}

function startMelody() {
    let step = 0;
    
    function tick() {
        if (!isPlaying) return;
        const current = MELODY_SEQUENCE[step % MELODY_SEQUENCE.length];
        const freq = SPRING_NOTES[current.note];
        playTone(freq, current.dur);

        step++;
        const nextTime = (current.dur + 0.2) * 1000;
        musicInterval = setTimeout(tick, nextTime);
    }

    tick();
}

function stopMelody() {
    if (musicInterval) {
        clearTimeout(musicInterval);
        musicInterval = null;
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
    const whatsappBtn = document.getElementById('btn-whatsapp');
    
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
            .replace('index.html', '')
            .replace('personal.html', '')
            .replace('especial.html', '') + 'especial.html';
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

    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            const url = buildUrl();
            const paraText = inputPara && inputPara.value.trim() ? ` para ti, ${inputPara.value.trim()}` : '';
            const shareText = encodeURIComponent(`🌻 ¡Te envío esta flor amarilla especial${paraText}! Mírala aquí: ${url}`);
            window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
            modal.classList.remove('visible');
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
