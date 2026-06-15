// Config
const API_BASE_URL = 'https://api.6767111.xyz';

// State management
let currentStep = 1;
let sessionToken = null;
let discordId = null;
let discordUsername = null;
let selectedNick = '';
let initialLoad = true;
let transitionTimeout = null;

// Particle effect on background
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particlesArray = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;

        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
    }
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    const count = Math.floor((canvas.width * canvas.height) / 12000);
    for (let i = 0; i < count; i++) {
        particlesArray.push(new Particle());
    }
}
initParticles();

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// Confetti effect helper
// Confetti effect helper - premium Minecraft XP-style glowing particle burst
function triggerConfetti() {
    const confettiCanvas = document.getElementById('confetti');
    const confettiCtx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const colors = ['#ffb703', '#ffc300', '#10b981', '#34d399', '#ffffff'];
    const particles = [];

    // Position burst around the center of the screen/card
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.45;

    class XpParticle {
        constructor() {
            this.x = centerX;
            this.y = centerY;
            this.radius = Math.random() * 4 + 2; // diameter 4px to 12px
            this.color = colors[Math.floor(Math.random() * colors.length)];

            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 11 + 5;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed - Math.random() * 3; // slight upward bias

            this.opacity = 1;
            this.fade = Math.random() * 0.015 + 0.01;
            this.gravity = 0.14;
            this.friction = 0.96;
        }
        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;

            this.x += this.vx;
            this.y += this.vy;

            this.opacity -= this.fade;
        }
        draw() {
            confettiCtx.save();
            confettiCtx.globalAlpha = Math.max(this.opacity, 0);

            // Draw glowing circular particle
            confettiCtx.shadowBlur = 10;
            confettiCtx.shadowColor = this.color;
            confettiCtx.fillStyle = this.color;

            confettiCtx.beginPath();
            confettiCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            confettiCtx.fill();

            confettiCtx.restore();
        }
    }

    for (let i = 0; i < 90; i++) {
        particles.push(new XpParticle());
    }

    let animationId;
    function animate() {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        let active = false;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            if (p.opacity > 0) {
                p.update();
                p.draw();
                active = true;
            }
        }

        if (active) {
            animationId = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(animationId);
            confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
    }
    animate();
}

// 🕹️ Synthesized 8-bit Sound Effects (Web Audio API)
let audioCtx = null;

function play8bitSound(type) {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const now = audioCtx.currentTime;

        if (type === 'click') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

            osc.start(now);
            osc.stop(now + 0.08);
        }
        else if (type === 'error') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.setValueAtTime(120, now + 0.25);

            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

            osc.start(now);
            osc.stop(now + 0.25);
        }
        else if (type === 'levelup') {
            // Sequence of 2 high-pitch chimes (G6 and C7) matching Minecraft XP ding
            const chime1 = audioCtx.createOscillator();
            const gain1 = audioCtx.createGain();
            chime1.connect(gain1);
            gain1.connect(audioCtx.destination);

            chime1.type = 'sine';
            chime1.frequency.setValueAtTime(1567.98, now); // G6
            gain1.gain.setValueAtTime(0.15, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            chime1.start(now);
            chime1.stop(now + 0.35);

            const chime2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            chime2.connect(gain2);
            gain2.connect(audioCtx.destination);

            chime2.type = 'sine';
            chime2.frequency.setValueAtTime(2093.00, now + 0.08); // C7
            gain2.gain.setValueAtTime(0.18, now + 0.08);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

            chime2.start(now + 0.08);
            chime2.stop(now + 0.45);
        }
        else if (type.startsWith('note-')) {
            const frequencies = [523.25, 587.33, 659.25, 783.99, 1046.50]; // C5, D5, E5, G5, C6 (Pentatonic Scale)
            const idx = parseInt(type.split('-')[1]);
            const freq = frequencies[idx - 1] || 523.25;

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            osc.start(now);
            osc.stop(now + 0.35);
        }
        else if (type === 'poof') {
            // White noise buffer for smoke poof
            const bufferSize = audioCtx.sampleRate * 0.15; // 0.15s
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 600; // block break style thud

            const gain = audioCtx.createGain();

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

            noise.start(now);
            noise.stop(now + 0.15);
        }
        else if (type === 'hover') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(550, now);
            osc.frequency.setValueAtTime(700, now + 0.02);

            gain.gain.setValueAtTime(0.04, now); // quiet interface feedback tick
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

            osc.start(now);
            osc.stop(now + 0.05);
        }
    } catch (err) {
        console.warn('Web Audio API is not supported or was blocked:', err);
    }
}

// Multi-step navigation logic with Y-axis 3D slide transitions
// Multi-step navigation logic with fluid horizontal carousel transitions
async function setStep(stepNum, direction = 'next') {
    const cardContainer = document.querySelector('.card-container');
    const cardSlider = document.getElementById('card-slider');
    if (!cardContainer || !cardSlider) return;

    const cards = Array.from(cardSlider.querySelectorAll('.card'));
    const activeCard = cardSlider.querySelector('.card.active') || cards[0];

    let targetCard;
    if (stepNum === 'error') {
        targetCard = document.getElementById('step-error');
    } else {
        targetCard = document.getElementById(`step-${stepNum}`);
    }

    if (!targetCard) return;

    const targetIndex = cards.indexOf(targetCard);
    if (targetIndex === -1) return;

    currentStep = stepNum;

    if (transitionTimeout) {
        clearTimeout(transitionTimeout);
        transitionTimeout = null;
    }

    if (initialLoad) {
        // Instant update without transition on first load
        cardContainer.style.transition = 'none';
        cardSlider.style.transition = 'none';
        cards.forEach(c => c.style.transition = 'none');

        cards.forEach(c => {
            c.classList.remove('active');
            if (c !== targetCard) {
                c.classList.add('collapsed');
            } else {
                c.classList.remove('collapsed');
            }
        });
        targetCard.classList.add('active');

        cardSlider.style.transform = `translateX(-${targetIndex * 100}%)`;

        // Measure and set container height instantly
        const targetHeight = targetCard.offsetHeight;
        cardContainer.style.height = `${targetHeight}px`;

        // Force reflow
        cardContainer.offsetHeight;

        // Re-enable transitions on next tick
        setTimeout(() => {
            cardContainer.style.transition = '';
            cardSlider.style.transition = '';
            cards.forEach(c => c.style.transition = '');
            cardContainer.style.height = 'auto';
            cardContainer.style.overflow = 'visible';
        }, 50);

        initialLoad = false;
    } else {
        if (activeCard && activeCard !== targetCard) {
            play8bitSound('click');

            // Smoothly autoscroll the card container into the viewport center
            cardContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Temporarily expand the target card to measure its natural content height
            targetCard.classList.remove('collapsed');

            const currentHeight = activeCard.offsetHeight;
            const targetHeight = targetCard.offsetHeight;

            // Set overflow to hidden and fix height to current card height to start transition
            cardContainer.style.overflow = 'hidden';
            cardContainer.style.height = `${currentHeight}px`;

            // Force reflow to commit current height style before transition
            cardContainer.offsetHeight;

            // Start transitions
            cardContainer.style.height = `${targetHeight}px`;
            cardSlider.style.transform = `translateX(-${targetIndex * 100}%)`;

            cards.forEach(c => c.classList.remove('active'));
            targetCard.classList.add('active');

            // Wait for 600ms transition to complete
            transitionTimeout = setTimeout(() => {
                // Collapse all inactive cards so they don't stretch the flexbox container height
                cards.forEach(c => {
                    if (c !== targetCard) {
                        c.classList.add('collapsed');
                    }
                });

                cardContainer.style.height = 'auto';
                cardContainer.style.overflow = 'visible';
                transitionTimeout = null;
            }, 600);
        }
    }

    // Update progress bar width
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        let percent = 25;
        if (stepNum === 2) percent = 50;
        if (stepNum === 3) percent = 75;
        if (stepNum === 4 || stepNum === 5) percent = 100;
        if (stepNum !== 'error') {
            progressFill.style.width = `${percent}%`;
        }
    }

    // Update active class on progress indicators
    if (stepNum !== 'error') {
        document.querySelectorAll('.progress-steps .step').forEach(step => {
            const stepVal = parseInt(step.getAttribute('data-step'));
            if (stepVal <= stepNum) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    // Autofocus Minecraft nickname input when landing on Step 2
    if (stepNum === 2) {
        const input = document.getElementById('mc-nick-input');
        if (input) {
            setTimeout(() => {
                input.focus();
            }, 50);
        }
    }
}


// Navigation helpers for nickname correction
function goBackToNick() {
    if (rulesTimerInterval) {
        clearInterval(rulesTimerInterval);
    }
    // Reset timer state
    document.getElementById('rules-timer').style.opacity = '1';
    const timerFill = document.getElementById('timer-fill');
    if (timerFill) timerFill.setAttribute('stroke-dasharray', '0, 100');
    const timerText = document.getElementById('timer-text');
    if (timerText) timerText.textContent = RULE_READ_TIME;
    const acceptBtn = document.getElementById('btn-accept-rules');
    if (acceptBtn) acceptBtn.disabled = true;
    const lockIcon = document.getElementById('btn-lock');
    if (lockIcon) lockIcon.style.display = 'inline-block';
    const firefly = document.getElementById('rules-firefly');
    if (firefly) firefly.style.opacity = '0';
    document.querySelectorAll('.rule-item').forEach(item => item.classList.remove('active'));

    setStep(2, 'prev');
}

function goBackToNickDirectly() {
    const prevError = document.getElementById('inline-verify-error');
    if (prevError) prevError.remove();
    document.getElementById('verify-error-actions').style.display = 'none';

    setStep(2, 'prev');
}

// 🏆 Minecraft Advancement Unlocked Toast Banner
function showMinecraftToast(title, description, icon = '🏆') {
    const existing = document.getElementById('mc-achievement-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'mc-achievement-toast';
    toast.className = 'minecraft-toast';

    toast.innerHTML = `
        <div class="toast-icon-container">${icon}</div>
        <div class="toast-text">
            <span class="toast-title">${title}</span>
            <span class="toast-desc">${description}</span>
        </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
        play8bitSound('levelup');
    }, 300);

    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 600);
    }, 5500);
}


// Minecraft block break click particles
function setupBlockBreakParticles() {
    document.addEventListener('click', (e) => {
        if (!e.target.closest('button') && !e.target.closest('.copyable') && !e.target.closest('.source-option') && !e.target.closest('.tab-btn')) {
            return;
        }

        const particleCount = 14 + Math.floor(Math.random() * 8);
        const colors = ['#553c23', '#866043', '#3c2d1e', '#ffb703', '#5865f2'];

        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            p.className = 'block-particle';

            p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            p.style.left = `${e.clientX}px`;
            p.style.top = `${e.clientY}px`;

            document.body.appendChild(p);

            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 100 + 30;
            const targetX = Math.cos(angle) * speed;
            const targetY = Math.sin(angle) * speed + (Math.random() * 30 + 15);

            setTimeout(() => {
                p.style.transform = `translate(${targetX}px, ${targetY}px) scale(0)`;
                p.style.opacity = '0';
            }, 10);

            setTimeout(() => p.remove(), 600);
        }
    });
}

// Discord Auth handler
async function startDiscordLogin() {
    try {
        const btn = document.getElementById('btn-discord-login');
        if (btn) btn.disabled = true;

        const res = await fetch(`${API_BASE_URL}/api/whitelist/discord-url`);
        const data = await res.json();

        if (data.success && data.url) {
            window.location.href = data.url;
        } else {
            throw new Error('Nelze načíst přihlašovací odkaz.');
        }
    } catch (err) {
        showError(err.message || 'Chyba při komunikaci s API.');
    }
}

// App lifecycle init
window.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const hasLoginSuccess = params.get('login_success');
    const paramToken = params.get('token');
    const paramError = params.get('error');

    // Clean URL
    if (hasLoginSuccess || paramError) {
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check errors
    if (paramError) {
        if (paramError === 'not_in_guild') {
            const inviteUrl = params.get('invite') || 'https://discord.gg/875027587477409862';
            showDiscordInviteError(inviteUrl);
        } else if (paramError === 'joined_too_recently') {
            const minutesLeft = params.get('minutes_left') || '30';
            showError(`Na našem Discord serveru musíš být alespoň 30 minut, než se můžeš zapsat na whitelist. Počkej prosím ještě ${minutesLeft} minut.`);
        } else {
            showError('Ověření přes Discord selhalo.');
        }
        return;
    }

    // Load token
    sessionToken = paramToken || localStorage.getItem('whitelist_token');

    // Setup button block-break particles and rules clicking
    setupBlockBreakParticles();
    setupInputListeners();
    setupRulesClicking();

    if (sessionToken) {
        localStorage.setItem('whitelist_token', sessionToken);
        await verifyUserSession();
    } else {
        setStep(1);
    }
});

// Verify token on backend
async function verifyUserSession() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/whitelist/me`, {
            headers: {
                'Authorization': `Bearer ${sessionToken}`
            }
        });

        if (res.status === 401 || res.status === 403) {
            // Invalid token
            localStorage.removeItem('whitelist_token');
            sessionToken = null;
            setStep(1);
            return;
        }

        const data = await res.json();
        if (data.success) {
            discordId = data.discordId;
            discordUsername = data.discordUsername;

            // Fill step 2 UI details
            const avatar = document.getElementById('discord-avatar');
            const nameSpan = document.getElementById('discord-name');
            if (avatar) avatar.src = data.discordAvatar || 'https://cdn.discordapp.com/embed/avatars/0.png';
            if (nameSpan) nameSpan.textContent = discordUsername;

            // Check if already has whitelist
            if (data.alreadyWhitelisted) {
                showSuccessState(true, data.existingNick);
            } else {
                setStep(2);
                showMinecraftToast('Dosažen pokrok!', 'Účet Discord propojen!', '💬');
            }
        } else {
            throw new Error(data.message || 'Nepodařilo se ověřit uživatele.');
        }
    } catch (err) {
        showError(err.message);
    }
}

// Custom Dropdown for source select
function toggleSourceDropdown() {
    const dropdown = document.getElementById('custom-source-select');
    if (dropdown) {
        dropdown.classList.toggle('open');
    }
}

function selectSourceTile(tileElement) {
    const val = tileElement.getAttribute('data-value');

    // Set value in the hidden input for compatibility
    const select = document.getElementById('mc-source-select');
    if (select) {
        select.value = val;
        select.dispatchEvent(new Event('change'));
    }

    // Toggle selected class on tiles
    const grid = document.getElementById('source-grid');
    if (grid) {
        grid.querySelectorAll('.source-tile').forEach(tile => {
            tile.classList.remove('selected');
        });
        tileElement.classList.add('selected');
        play8bitSound('click');

        // Spawn small gold sparkles on selection
        const rect = tileElement.getBoundingClientRect();
        spawnSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
}

let selectedSource = '';

// Set up listeners for MC Nick input and discovery source selection
function setupInputListeners() {
    const input = document.getElementById('mc-nick-input');
    const select = document.getElementById('mc-source-select');
    const previewImg = document.getElementById('mc-head-img');
    const placeholder = document.getElementById('mc-head-placeholder');
    const validation = document.getElementById('nick-validation');
    const submitBtn = document.getElementById('btn-submit-nick');
    const sourceGroup = document.querySelector('.source-select-group');

    if (!input || !select) return;

    // Reset visibility state on startup
    if (sourceGroup) {
        sourceGroup.classList.remove('visible');
    }

    let debounceTimeout;
    let nickIsValid = false;
    let revealTimeout = null;

    function checkFormState() {
        const sourceVal = select.value;
        if (nickIsValid && sourceVal) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }

        if (nickIsValid) {
            if (sourceGroup && !sourceGroup.classList.contains('visible') && !revealTimeout) {
                revealTimeout = setTimeout(() => {
                    sourceGroup.classList.add('visible');
                    revealTimeout = null;
                }, 300); // smooth slide-out delay
            }
        } else {
            if (revealTimeout) {
                clearTimeout(revealTimeout);
                revealTimeout = null;
            }
            if (sourceGroup) {
                sourceGroup.classList.remove('visible');
            }
        }
    }

    select.addEventListener('change', checkFormState);

    input.addEventListener('input', () => {
        const val = input.value.trim();
        clearTimeout(debounceTimeout);
        nickIsValid = false;
        submitBtn.disabled = true;

        if (!val) {
            previewImg.style.display = 'none';
            placeholder.style.display = 'block';
            placeholder.textContent = '?';
            validation.textContent = '';
            checkFormState();
            return;
        }

        const validRegex = /^[a-zA-Z0-9_]{3,16}$/.test(val);

        if (!validRegex) {
            validation.textContent = '❌ Nick může obsahovat jen písmena, čísla a podtržítko (3-16 znaků)';
            validation.className = 'nick-validation error';
            previewImg.style.display = 'none';
            placeholder.style.display = 'block';
            placeholder.textContent = '❌';
            checkFormState();
            return;
        }

        validation.textContent = '⏳ Kontroluji nick...';
        validation.className = 'nick-validation';

        debounceTimeout = setTimeout(async () => {
            // First check if nick is whitelisted in DB or whitelist.json
            try {
                const checkRes = await fetch(`${API_BASE_URL}/api/whitelist/check-nick?nick=${val}`, {
                    headers: {
                        'Authorization': `Bearer ${sessionToken}`
                    }
                });
                const checkData = await checkRes.json();

                if (checkData.success && !checkData.available) {
                    previewImg.style.display = 'none';
                    placeholder.style.display = 'block';
                    placeholder.textContent = '❌';
                    validation.textContent = `❌ ${checkData.message}`;
                    validation.className = 'nick-validation error';
                    nickIsValid = false;
                    checkFormState();
                    return;
                }
            } catch (err) {
                console.warn('[WHITELIST] Availability check failed:', err);
            }

            // Update head preview
            previewImg.src = `https://mc-heads.net/avatar/${val}/100`;
            previewImg.onload = () => {
                previewImg.style.display = 'block';
                placeholder.style.display = 'none';
                validation.textContent = '✅ Nick je volný a připravený';
                validation.className = 'nick-validation valid';
                nickIsValid = true;
                checkFormState();
            };
            previewImg.onerror = () => {
                previewImg.style.display = 'none';
                placeholder.style.display = 'block';
                placeholder.textContent = '?';
                validation.textContent = '❌ Selhalo načtení skinu';
                validation.className = 'nick-validation error';
                nickIsValid = true; // still allow submission if Mojang is down
                checkFormState();
            };
        }, 400);
    });
}

// Handle MC nick confirmation
function submitNick() {
    const input = document.getElementById('mc-nick-input');
    const select = document.getElementById('mc-source-select');
    if (!input || !select) return;
    selectedNick = input.value.trim();
    selectedSource = select.value;
    setStep(3, 'next');
    startRulesTimer();

    showMinecraftToast('Dosažen pokrok!', 'Přezdívka nastavena!', '🎮');
}

// State variables for automatic rules progression
let rulesTimerInterval = null;
let activeRuleIndex = 0;
const RULE_READ_TIME = 3; // seconds per rule

// Automated rules sequence and progress indicator
function startRulesTimer() {
    // Clear any existing timer interval
    if (rulesTimerInterval) {
        clearInterval(rulesTimerInterval);
        rulesTimerInterval = null;
    }

    const timerFill = document.getElementById('timer-fill');
    const timerText = document.getElementById('timer-text');
    const acceptBtn = document.getElementById('btn-accept-rules');
    const lockIcon = document.getElementById('btn-lock');
    const firefly = document.getElementById('rules-firefly');

    if (!timerFill || !acceptBtn) return;

    // Reset read and active status and restore original rule icons
    const icons = {
        '1': '🚫',
        '2': '💎',
        '3': '🏠',
        '4': '💬',
        '5': '🤬'
    };
    document.querySelectorAll('.rule-item').forEach(item => {
        item.classList.remove('read');
        item.classList.remove('active');
        const ruleIdx = item.getAttribute('data-rule');
        const iconSpan = item.querySelector('.rule-icon');
        if (iconSpan && icons[ruleIdx]) {
            iconSpan.textContent = icons[ruleIdx];
        }
    });

    acceptBtn.disabled = true;
    if (lockIcon) lockIcon.style.display = 'inline-block';

    const rulesTimer = document.getElementById('rules-timer');
    if (rulesTimer) rulesTimer.style.opacity = '1';

    activeRuleIndex = 0;
    activateRule(activeRuleIndex);
}

// Activates and counts down a single rule by index
function activateRule(index) {
    if (rulesTimerInterval) {
        clearInterval(rulesTimerInterval);
        rulesTimerInterval = null;
    }

    const ruleItems = document.querySelectorAll('.rule-item');
    const totalRules = ruleItems.length;

    if (index >= totalRules) {
        // All rules successfully read!
        const acceptBtn = document.getElementById('btn-accept-rules');
        const lockIcon = document.getElementById('btn-lock');
        if (acceptBtn) acceptBtn.disabled = false;
        if (lockIcon) lockIcon.style.display = 'none';

        const timerLabel = document.querySelector('.timer-label');
        if (timerLabel) timerLabel.textContent = 'Pravidla přečtena! 🎉';

        const rulesTimer = document.getElementById('rules-timer');
        if (rulesTimer) rulesTimer.style.opacity = '0.3';

        const timerFill = document.getElementById('timer-fill');
        if (timerFill) timerFill.setAttribute('stroke-dasharray', '100, 100');
        const timerText = document.getElementById('timer-text');
        if (timerText) timerText.textContent = '✅';

        play8bitSound('levelup');
        triggerConfetti();
        showMinecraftToast('Výzva splněna!', 'Pravidla přečtena! 📜', '📜');

        const firefly = document.getElementById('rules-firefly');
        if (firefly) firefly.style.opacity = '0';
        return;
    }

    // Set up active state
    ruleItems.forEach((item, idx) => {
        if (idx === index) {
            item.classList.add('active');
            item.classList.remove('read');
        } else if (idx < index) {
            item.classList.add('read');
            item.classList.remove('active');
        } else {
            item.classList.remove('active');
            item.classList.remove('read');
        }
    });

    // Move guide firefly to the newly active rule item
    updateRulesFirefly();

    const timerLabel = document.querySelector('.timer-label');
    if (timerLabel) {
        timerLabel.textContent = `Čtení pravidla ${index + 1} z ${totalRules}...`;
    }

    const timerFill = document.getElementById('timer-fill');
    const timerText = document.getElementById('timer-text');

    let elapsed = 0;
    const intervalMs = 30; // update every 30ms for buttery-smooth progress animation

    if (timerText) {
        timerText.textContent = RULE_READ_TIME;
    }
    if (timerFill) {
        timerFill.setAttribute('stroke-dasharray', '0, 100');
    }

    rulesTimerInterval = setInterval(() => {
        elapsed += intervalMs / 1000;

        const t = Math.min(elapsed / RULE_READ_TIME, 1);
        // MrBeast ad-style progress curve where the speed (velocity) starts at 0,
        // peaks early (around 12.5% of the duration), and then decays in a long tail.
        // Mathematically, this is the integral of the rate curve: v(t) = c * t * (1 - t)^7
        // Resulting in: p(t) = 1 + 8 * (1 - t)^9 - 9 * (1 - t)^8
        const easedT = 1 + 8 * Math.pow(1 - t, 9) - 9 * Math.pow(1 - t, 8);
        const percentage = easedT * 100;

        if (timerFill) {
            timerFill.setAttribute('stroke-dasharray', `${percentage}, 100`);
        }

        const timeLeft = Math.max(Math.ceil(RULE_READ_TIME - elapsed), 0);
        if (timerText) {
            timerText.textContent = timeLeft;
        }

        if (elapsed >= RULE_READ_TIME) {
            clearInterval(rulesTimerInterval);
            rulesTimerInterval = null;

            // Confirm current rule
            const currentItem = ruleItems[index];
            if (currentItem) {
                currentItem.classList.remove('active');
                currentItem.classList.add('read');
                const iconSpan = currentItem.querySelector('.rule-icon');
                if (iconSpan) iconSpan.textContent = '✅';

                play8bitSound(`note-${index + 1}`);

                // Spawn sparkles on this rule
                const rect = currentItem.getBoundingClientRect();
                spawnEpicSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
            }

            // Proceed to the next rule
            activeRuleIndex = index + 1;
            activateRule(activeRuleIndex);
        }
    }, intervalMs);
}

// Move guide firefly to the currently active rule item
function updateRulesFirefly() {
    const firefly = document.getElementById('rules-firefly');
    const activeItem = document.querySelector('.rule-item.active');

    if (activeItem && firefly) {
        const rect = activeItem.getBoundingClientRect();
        const containerRect = activeItem.parentElement.getBoundingClientRect();
        const topPos = rect.top - containerRect.top + rect.height / 2 - 3;
        const leftPos = rect.left - containerRect.left - 15;

        firefly.style.opacity = '1';
        firefly.style.top = `${topPos}px`;
        firefly.style.left = `${leftPos}px`;
    } else {
        if (firefly) firefly.style.opacity = '0';
    }
}

// Attaches hover cursor configuration (no longer clickable)
function setupRulesClicking() {
    document.querySelectorAll('.rule-item').forEach(item => {
        item.style.cursor = 'default';
        // Hover and click listeners removed to make step non-interactive
    });
}

// Spawns epic fireworks-style burst of sparkles in a circle
function spawnEpicSparkles(x, y) {
    const colors = ['#ffb703', '#ff9f1c', '#10b981', '#34d399', '#ffffff'];
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'sparkle-particle';
        p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;

        p.style.width = '6px';
        p.style.height = '6px';

        document.body.appendChild(p);

        const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 110 + 60;
        const targetX = Math.cos(angle) * speed;
        const targetY = Math.sin(angle) * speed;

        setTimeout(() => {
            p.style.transform = `translate(${targetX}px, ${targetY}px) scale(0)`;
            p.style.opacity = '0';
        }, 10);

        setTimeout(() => p.remove(), 600);
    }
}

// Accept rules button handler
function acceptRules() {
    setStep(4, 'next');
    runVerificationSteps();

    showMinecraftToast('Dosažen pokrok!', 'Pravidla přijata!', '📜');
}

// Satisfying animated check validation steps
async function runVerificationSteps() {
    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    const prevError = document.getElementById('inline-verify-error');
    if (prevError) prevError.remove();
    document.getElementById('verify-error-actions').style.display = 'none';

    // Reset classes
    document.querySelectorAll('.verify-step').forEach(step => {
        step.className = 'verify-step';
        step.querySelector('.verify-status').textContent = '';
    });

    // Step 1: Discord account
    const vs1 = document.getElementById('vs-1');
    vs1.classList.add('current');
    await delay(1200);
    vs1.classList.remove('current');
    vs1.classList.add('done');
    vs1.querySelector('.verify-status').textContent = '✅';

    // Step 2: Discord guild membership
    const vs2 = document.getElementById('vs-2');
    vs2.classList.add('current');
    await delay(1200);
    vs2.classList.remove('current');
    vs2.classList.add('done');
    vs2.querySelector('.verify-status').textContent = '✅';

    // Step 3: Server whitelist database check
    const vs3 = document.getElementById('vs-3');
    vs3.classList.add('current');
    await delay(1200);

    // Call submit whitelist request to backend API
    try {
        const response = await fetch(`${API_BASE_URL}/api/whitelist/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionToken}`
            },
            body: JSON.stringify({
                minecraftNick: selectedNick,
                discoverySource: selectedSource
            })
        });

        const data = await response.json();

        if (response.status === 409) {
            vs3.classList.remove('current');
            vs3.classList.add('failed');
            vs3.querySelector('.verify-status').textContent = '❌';

            // Add detailed message inline
            const errLabel = document.createElement('div');
            errLabel.id = 'inline-verify-error';
            errLabel.style.color = 'var(--error-color)';
            errLabel.style.fontSize = '13.5px';
            errLabel.style.marginTop = '12px';
            errLabel.style.fontWeight = '600';
            errLabel.style.textAlign = 'center';
            errLabel.textContent = data.message;
            vs3.parentElement.appendChild(errLabel);

            // Show error action buttons
            document.getElementById('verify-error-actions').style.display = 'flex';
            play8bitSound('error');
            return;
        }

        if (!response.ok) {
            throw new Error(data.message || 'Registrace na whitelist selhala.');
        }

        // Whitelist DB check done
        vs3.classList.remove('current');
        vs3.classList.add('done');
        vs3.querySelector('.verify-status').textContent = '✅';

        // Step 4: Adding to whitelist
        const vs4 = document.getElementById('vs-4');
        vs4.classList.add('current');
        await delay(1200);
        vs4.classList.remove('current');
        vs4.classList.add('done');
        vs4.querySelector('.verify-status').textContent = '✅';

        // Step 5: Synchronizing roles and prefixes
        const vs5 = document.getElementById('vs-5');
        if (vs5) {
            vs5.classList.add('current');
            await delay(1500);
            vs5.classList.remove('current');
            vs5.classList.add('done');
            vs5.querySelector('.verify-status').textContent = '✅';
        }

        // Success transition
        await delay(500);
        showSuccessState(false, selectedNick);

    } catch (error) {
        vs3.classList.remove('current');
        vs3.classList.add('failed');
        vs3.querySelector('.verify-status').textContent = '❌';

        const errLabel = document.createElement('div');
        errLabel.id = 'inline-verify-error';
        errLabel.style.color = 'var(--error-color)';
        errLabel.style.fontSize = '13.5px';
        errLabel.style.marginTop = '12px';
        errLabel.style.fontWeight = '600';
        errLabel.style.textAlign = 'center';
        errLabel.textContent = error.message;
        vs3.parentElement.appendChild(errLabel);

        document.getElementById('verify-error-actions').style.display = 'flex';
        play8bitSound('error');
    }
}

// Copy server IP address helper with satisfying feedback and green sparkles
function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        play8bitSound('levelup');
        triggerConfetti(); // Super epic!

        // Add copied class to trigger green highlight bounce
        element.classList.add('copied');
        element.classList.remove('guide-pulse'); // Remove guide pulse once copied

        // Shake the card container for impact
        const cardContainer = document.querySelector('.card-container');
        if (cardContainer) {
            cardContainer.classList.remove('container-shake');
            cardContainer.offsetHeight; // force reflow
            cardContainer.classList.add('container-shake');
            setTimeout(() => {
                cardContainer.classList.remove('container-shake');
            }, 600);
        }

        // Create a floating feedback tooltip above the element
        const rect = element.getBoundingClientRect();
        const tooltip = document.createElement('div');
        tooltip.className = 'copy-tooltip';
        tooltip.textContent = 'IP Zkopírována! 📋';

        // Position fixed coordinates relative to viewport
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 18}px`;
        document.body.appendChild(tooltip);

        // Spawn epic circular sparkles firework explosion
        spawnEpicSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
        // Additional secondary burst of sparkles
        setTimeout(() => {
            spawnEpicSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }, 150);

        // Highlight version row target after copy completes
        const versionVal = document.getElementById('server-version');
        if (versionVal && !versionVal.classList.contains('version-highlight')) {
            setTimeout(() => {
                versionVal.classList.add('version-highlight');
                const vRect = versionVal.getBoundingClientRect();
                spawnEpicSparkles(vRect.left + vRect.width / 2, vRect.top + vRect.height / 2);
                play8bitSound('levelup');
            }, 450);
        }

        // Clean up copied class and tooltip after delay
        setTimeout(() => {
            element.classList.remove('copied');
        }, 1200);

        setTimeout(() => {
            tooltip.classList.add('fade-out');
            setTimeout(() => tooltip.remove(), 400);
        }, 1000);

        // Trigger secondary flying guide to show "Dozvědět se více" after copy
        setTimeout(() => {
            triggerFlyingGuide('btn-learn-more', 'Jak hrát? 📖', 50);
        }, 1500);
    });
}


// Show success view
function showSuccessState(alreadyExists = false, nick = '') {
    // Reset version highlight state initially
    const versionVal = document.getElementById('server-version');
    if (versionVal) {
        versionVal.classList.remove('version-highlight');
    }

    setStep(5, 'next');
    const title = document.getElementById('result-title');
    const desc = document.getElementById('result-desc');

    if (alreadyExists) {
        title.textContent = 'Už jsi na whitelistu!';
        desc.textContent = `Tvoje registrace pro nick "${nick}" je aktivní. Můžeš se ihned připojit.`;
        showMinecraftToast('Výzva splněna!', 'Aktivní whitelist!');
    } else {
        title.textContent = 'Vítej na serveru!';
        desc.textContent = `Tvůj nick "${nick}" byl úspěšně přidán na whitelist.`;
        triggerConfetti();
        showMinecraftToast('Výzva splněna!', 'Přidán na whitelist!');
    }

    // Trigger flying guide targeting the IP address first!
    setTimeout(() => {
        triggerFlyingGuide('server-ip', 'Zkopíruj IP! 📡', 40, () => {
            const ipVal = document.getElementById('server-ip');
            if (ipVal) {
                ipVal.classList.add('guide-pulse');
            }
        });
    }, 600);
}

// Flying guide firefly animation logic targeting any element
function triggerFlyingGuide(targetId, bubbleText, bubbleOffset = 50, callback = null) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    setTimeout(() => {
        // Create firefly container
        const firefly = document.createElement('div');
        firefly.className = 'flying-guide';
        document.body.appendChild(firefly);

        // Spawn position (offscreen left, mid-height)
        const startX = -60;
        const startY = window.innerHeight * 0.3 + Math.random() * 100;

        // Target position center
        const rect = targetElement.getBoundingClientRect();
        const targetX = rect.left + rect.width / 2;
        const targetY = rect.top + rect.height / 2;
        const duration = 2200; // wobbly 2.2 seconds flight speed
        const startTime = performance.now();

        let lastX = startX;
        let lastY = startY;

        function animate(time) {
            const progress = (time - startTime) / duration;
            if (progress >= 1) {
                // Collision!
                firefly.remove();

                // Create ripple element inside targetElement
                const ripple = document.createElement('div');
                ripple.className = 'btn-ripple';
                ripple.style.width = '240px';
                ripple.style.height = '240px';
                ripple.style.left = '50%';
                ripple.style.top = '50%';
                targetElement.appendChild(ripple);

                // Add classes for glow and shake
                targetElement.classList.add('button-hit-shake');
                if (targetElement.classList.contains('btn')) {
                    targetElement.classList.add('btn-glow-active');
                }

                // Animate ripple scale and fade
                requestAnimationFrame(() => {
                    ripple.style.transform = 'translate(-50%, -50%) scale(2.8)';
                    ripple.style.opacity = '0';
                });

                // Spawn comic-style bubble
                if (bubbleText) {
                    const bubble = document.createElement('div');
                    bubble.className = 'collision-bubble';
                    bubble.textContent = bubbleText;
                    bubble.style.left = `${targetX}px`;
                    bubble.style.top = `${targetY - bubbleOffset}px`;
                    document.body.appendChild(bubble);
                    setTimeout(() => bubble.remove(), 1200);
                }

                // Spawn sparkles
                spawnSparkles(targetX, targetY);

                // Cleanup ripple and shake class after completion
                setTimeout(() => {
                    targetElement.classList.remove('button-hit-shake');
                    if (targetElement.id !== 'btn-learn-more') {
                        targetElement.classList.remove('btn-glow-active');
                    }
                    ripple.remove();
                }, 800);

                if (callback) callback();
                return;
            }

            // Clumsy wobbly trajectory + loop-de-loop!
            const baseX = startX + (targetX - startX) * progress;
            const baseY = startY + (targetY - startY) * progress;

            // 1. Clumsy sine wobble
            const wobble = Math.sin(progress * Math.PI * 5) * 25;
            let x = baseX;
            let y = baseY + wobble;

            // 2. Loop-de-loop between progress 0.35 and 0.65
            if (progress > 0.35 && progress < 0.65) {
                const loopT = (progress - 0.35) / 0.30;
                const loopAngle = loopT * Math.PI * 2;
                const loopRadius = 55;
                x += Math.sin(loopAngle) * loopRadius;
                y += (-Math.cos(loopAngle) + 1) * loopRadius;
            }

            // Calculate flight angle (direction vector)
            const dx = x - lastX;
            const dy = y - lastY;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            firefly.style.left = `${x}px`;
            firefly.style.top = `${y}px`;
            firefly.style.transform = `rotate(${angle}deg)`;

            lastX = x;
            lastY = y;

            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    }, 400);
}


// Spawn sparkle explosion particles on impact
function spawnSparkles(x, y) {
    for (let i = 0; i < 24; i++) {
        const p = document.createElement('div');
        p.className = 'sparkle-particle';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        document.body.appendChild(p);

        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 90 + 30;
        const targetX = Math.cos(angle) * dist;
        const targetY = Math.sin(angle) * dist;

        setTimeout(() => {
            p.style.transform = `translate(${targetX}px, ${targetY}px) scale(0)`;
            p.style.opacity = '0';
        }, 50);

        setTimeout(() => {
            p.remove();
        }, 900);
    }
}

// Sparkle XP fireflies flying to target elements
function flyEnergyParticle(startX, startY, targetElement) {
    const particle = document.createElement('div');
    particle.className = 'energy-particle';
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    document.body.appendChild(particle);

    const startTime = performance.now();
    const duration = 280 + Math.random() * 120; // Snappy 0.28s to 0.40s flight time

    // Arc path offsets
    const rect = targetElement.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    const midX = (startX + targetX) / 2;
    const midY = (startY + targetY) / 2;
    const offsetX = (Math.random() - 0.5) * 120;
    const offsetY = -60 - Math.random() * 80;
    const cpX = midX + offsetX;
    const cpY = midY + offsetY;

    function animate(time) {
        const elapsed = time - startTime;
        const t = Math.min(elapsed / duration, 1);

        // Dynamically compute target in case of resize/scrolling during transit
        const currentRect = targetElement.getBoundingClientRect();
        const curTargetX = currentRect.left + currentRect.width / 2;
        const curTargetY = currentRect.top + currentRect.height / 2;

        // Quadratic Bezier interpolation
        const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * cpX + t * t * curTargetX;
        const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * cpY + t * t * curTargetY;

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();

            // Light up target element
            targetElement.classList.remove('energy-target-dimmed');
            targetElement.classList.add('gold-flash');

            // Spawn gold sparkles explosion
            spawnSparkles(curTargetX, curTargetY);

            // Trigger 8-bit XP/click chime sound
            play8bitSound('click');

            setTimeout(() => {
                targetElement.classList.remove('gold-flash');
            }, 800);
        }
    }
    requestAnimationFrame(animate);
}

// Spreads energy particles to all gold elements in selected tutorial section
function triggerTutorialEnergy(sourceElement, containerSelector) {
    if (!sourceElement) return;

    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Target elements: step numbers, strong tags, map links
    const targets = Array.from(container.querySelectorAll('.step-num, strong, .btn-map-link'));
    if (targets.length === 0) return;

    const sourceRect = sourceElement.getBoundingClientRect();
    const startX = sourceRect.left + sourceRect.width / 2;
    const startY = sourceRect.top + sourceRect.height / 2;

    // Dim all elements first
    targets.forEach(target => {
        target.classList.add('energy-target-dimmed');
    });

    // Fire flying fireflies sequentially (very quick 30ms stagger)
    targets.forEach((target, index) => {
        setTimeout(() => {
            flyEnergyParticle(startX, startY, target);
        }, index * 30);
    });
}

// Sparkle XP fireflies flying from tutorial elements back to the Learn More button
function flyEnergyParticleReverse(startX, startY, targetButton) {
    const particle = document.createElement('div');
    particle.className = 'energy-particle';
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    document.body.appendChild(particle);

    const startTime = performance.now();
    const duration = 280 + Math.random() * 120; // 0.28s to 0.40s flight time

    // Arc path offsets to targetButton
    const rect = targetButton.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    const midX = (startX + targetX) / 2;
    const midY = (startY + targetY) / 2;
    const offsetX = (Math.random() - 0.5) * 120;
    const offsetY = -60 - Math.random() * 80;
    const cpX = midX + offsetX;
    const cpY = midY + offsetY;

    function animate(time) {
        const elapsed = time - startTime;
        const t = Math.min(elapsed / duration, 1);

        // Dynamically compute target in case of scrolling
        const currentRect = targetButton.getBoundingClientRect();
        const curTargetX = currentRect.left + currentRect.width / 2;
        const curTargetY = currentRect.top + currentRect.height / 2;

        // Quadratic Bezier interpolation
        const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * cpX + t * t * curTargetX;
        const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * cpY + t * t * curTargetY;

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();

            // Highlight target button and make it gold
            targetButton.classList.add('gold-flash');
            targetButton.classList.add('btn-glow-active');

            // Spawn gold sparkles explosion on target button
            spawnSparkles(curTargetX, curTargetY);

            // Trigger 8-bit click chime
            play8bitSound('click');

            setTimeout(() => {
                targetButton.classList.remove('gold-flash');
            }, 800);
        }
    }
    requestAnimationFrame(animate);
}

// Spreads energy particles from elements back to Learn More button
function triggerTutorialEnergyReverse(targetButton, containerSelector) {
    if (!targetButton) return;

    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Find all targets in the active tutorial pane
    const activePane = container.querySelector('.tab-pane.active') || container;
    const sources = Array.from(activePane.querySelectorAll('.step-num, strong, .btn-map-link'));
    if (sources.length === 0) return;

    // Fire flying fireflies sequentially back to the button
    sources.forEach((source, index) => {
        const rect = source.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        setTimeout(() => {
            flyEnergyParticleReverse(startX, startY, targetButton);

            // Remove dimmed and gold flash styles from tutorial elements
            source.classList.remove('energy-target-dimmed');
            source.classList.remove('gold-flash');
        }, index * 30);
    });
}

// Show error panel view
function showError(message) {
    // Hide progress bar container
    const progressContainer = document.getElementById('progress-container');
    if (progressContainer) progressContainer.style.display = 'none';

    // Show error card
    const errorDesc = document.getElementById('error-desc');
    if (errorDesc) errorDesc.textContent = message;

    setStep('error', 'next');
}

// Show specific Discord invite error view
function showDiscordInviteError(inviteUrl) {
    const progressContainer = document.getElementById('progress-container');
    if (progressContainer) progressContainer.style.display = 'none';

    const errorTitle = document.getElementById('error-title');
    const errorDesc = document.getElementById('error-desc');

    if (errorTitle) errorTitle.textContent = 'Nejsi na našem Discordu!';
    if (errorDesc) {
        errorDesc.innerHTML = 'Pro zápis na whitelist musíš být členem našeho Discord serveru.<br>Připoj se pomocí tlačítka níže a poté to zkus znovu!';
    }

    const existingInviteBtn = document.getElementById('btn-error-invite');
    if (existingInviteBtn) existingInviteBtn.remove();

    const inviteBtn = document.createElement('a');
    inviteBtn.id = 'btn-error-invite';
    inviteBtn.className = 'btn btn-discord';
    inviteBtn.href = inviteUrl;
    inviteBtn.target = '_blank';
    inviteBtn.style.marginTop = '15px';
    inviteBtn.style.marginBottom = '15px';
    inviteBtn.style.textDecoration = 'none';
    inviteBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 71 55" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px; vertical-align: middle;">
            <path d="M60.1 4.9A58.5 58.5 0 0045.4.2a.2.2 0 00-.2.1 40.7 40.7 0 00-1.8 3.7 54 54 0 00-16.2 0A26.4 26.4 0 0025.4.3a.2.2 0 00-.2-.1 58.4 58.4 0 00-14.7 4.6.2.2 0 00-.1.1A60 60 0 00.4 43.5a.2.2 0 00.1.2 58.8 58.8 0 0017.7 9 .2.2 0 00.3-.1 42 42 0 003.6-5.9.2.2 0 00-.1-.3 38.8 38.8 0 01-5.5-2.6.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 42 42 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .3 36.4 36.4 0 01-5.5 2.7.2.2 0 00-.1.3 47.2 47.2 0 003.6 5.9.2.2 0 00.3 0A58.6 58.6 0 0070.5 43.7a.2.2 0 00.1-.1 59.7 59.7 0 00-10.5-38.7zM23.7 35.7c-3.3 0-6.1-3.1-6.1-6.8s2.7-6.8 6.1-6.8 6.1 3.1 6.1 6.8-2.7 6.8-6.1 6.8zm22.6 0c-3.3 0-6.1-3.1-6.1-6.8s2.7-6.8 6.1-6.8 6.1 3.1 6.1 6.8-2.7 6.8-6.1 6.8z" />
        </svg>
        Připojit se na Discord server
    `;

    const errorCard = document.getElementById('step-error');
    const cardContent = errorCard.querySelector('.card-content');
    const retryBtn = cardContent.querySelector('button');
    cardContent.insertBefore(inviteBtn, retryBtn);

    setStep('error', 'next');
}

// Reset app
function resetApp() {
    // Remove inline verify error label if exists
    const prevError = document.getElementById('inline-verify-error');
    if (prevError) prevError.remove();

    const existingInviteBtn = document.getElementById('btn-error-invite');
    if (existingInviteBtn) existingInviteBtn.remove();

    const errorTitle = document.getElementById('error-title');
    if (errorTitle) errorTitle.textContent = 'Něco se nepovedlo';

    // Reset progress container display
    const progressContainer = document.getElementById('progress-container');
    if (progressContainer) progressContainer.style.display = '';

    // Reset spinners
    document.querySelectorAll('.verify-step').forEach(step => {
        step.className = 'verify-step';
        const status = step.querySelector('.verify-status');
        if (status) status.textContent = '';
    });
    const rulesTimer = document.getElementById('rules-timer');
    if (rulesTimer) rulesTimer.style.opacity = '1';

    // Verify session again or redirect to start
    if (sessionToken) {
        verifyUserSession();
    } else {
        setStep(1, 'prev');
    }
}

// Toggle tutorial visibility
// Toggle tutorial visibility with smooth container height transitions
function toggleTutorial() {
    const container = document.getElementById('tutorial-container');
    const btn = document.getElementById('btn-learn-more');
    if (!container || !btn) return;

    btn.classList.remove('btn-glow-active');

    const cardContainer = document.querySelector('.card-container');
    const currentHeight = cardContainer.offsetHeight;

    // Fixed height during unfolding animation
    cardContainer.style.height = `${currentHeight}px`;
    cardContainer.style.overflow = 'hidden';
    cardContainer.offsetHeight; // force reflow

    if (container.style.display === 'none' || container.classList.contains('closing')) {
        // OPENING
        container.classList.remove('closing');
        container.style.display = 'block';
        btn.textContent = 'Skrýt návod 📖';

        play8bitSound('click');

        // Wait 350ms so particles fly while unfolding and hit right as it completes
        setTimeout(() => {
            triggerTutorialEnergy(btn, '#pane-claim');
        }, 350);

        // Scroll to the tutorial container smoothly
        setTimeout(() => {
            container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);

        // Measure targeted scroll height and animate to it
        const targetHeight = cardContainer.scrollHeight;
        cardContainer.style.height = `${targetHeight}px`;

        setTimeout(() => {
            cardContainer.style.height = 'auto';
            cardContainer.style.overflow = 'visible';
        }, 600);
    } else {
        // CLOSING
        container.classList.add('closing');
        btn.textContent = 'Dozvědět se více (Jak hrát?) 📖';

        play8bitSound('poof');
        spawnSmokePoof(container);

        // Trigger particles flying BACK to the button!
        triggerTutorialEnergyReverse(btn, '#tutorial-container');

        // Measure targeted shrink height by temporarily hiding display
        container.style.display = 'none';
        const targetHeight = cardContainer.offsetHeight;
        container.style.display = 'block';
        cardContainer.offsetHeight; // force reflow

        cardContainer.style.height = `${targetHeight}px`;

        // Wait for fold animation to complete (400ms) before setting display none
        setTimeout(() => {
            if (container.classList.contains('closing')) {
                container.style.display = 'none';
                container.classList.remove('closing');
                cardContainer.style.height = 'auto';
                cardContainer.style.overflow = 'visible';
            }
        }, 400);
    }
}

// Spawn blocky smoke particles on close
function spawnSmokePoof(element) {
    const rect = element.getBoundingClientRect();
    const particleCount = 18 + Math.floor(Math.random() * 8);

    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'smoke-particle';

        const size = Math.random() * 6 + 6;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;

        const x = rect.left + Math.random() * rect.width;
        const y = rect.bottom - 12;
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;

        document.body.appendChild(p);

        const targetX = (Math.random() - 0.5) * 80;
        const targetY = -35 - Math.random() * 45;

        setTimeout(() => {
            p.style.transform = `translate(${targetX}px, ${targetY}px) scale(0.2)`;
            p.style.opacity = '0';
        }, 10);

        setTimeout(() => p.remove(), 700);
    }
}

// Switch active tab in tutorial
// Switch active tab in tutorial with container height transition
function switchTab(tabId) {
    const cardContainer = document.querySelector('.card-container');
    const currentHeight = cardContainer.offsetHeight;

    cardContainer.style.height = `${currentHeight}px`;
    cardContainer.style.overflow = 'hidden';
    cardContainer.offsetHeight; // force reflow

    // Update tab button classes
    const tabs = document.querySelectorAll('.tutorial-tabs .tab-btn');
    let activeBtn = null;
    tabs.forEach(btn => {
        if (btn.getAttribute('onclick').includes(tabId)) {
            btn.classList.add('active');
            activeBtn = btn;
        } else {
            btn.classList.remove('active');
        }
    });

    // Update tab pane visibility
    const panes = document.querySelectorAll('.tutorial-content .tab-pane');
    panes.forEach(pane => {
        if (pane.id === `pane-${tabId}`) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });

    // Measure new target height and animate to it
    const targetHeight = cardContainer.scrollHeight;
    cardContainer.style.height = `${targetHeight}px`;

    setTimeout(() => {
        cardContainer.style.height = 'auto';
        cardContainer.style.overflow = 'visible';
    }, 600);

    // Fire energy particles from tab button to elements inside the active pane
    if (activeBtn) {
        triggerTutorialEnergy(activeBtn, `#pane-${tabId}`);
    }
}


// Reset whitelisted nick on backend and go back to step 2
async function resetWhitelistedNick() {
    const btn = document.getElementById('btn-success-correct-nick');
    if (!btn) return;

    if (!confirm('Opravdu si přeješ opravit přezdívku? Budeš odebrán z whitelistu.')) {
        return;
    }

    try {
        btn.disabled = true;
        const originalText = btn.textContent;
        btn.textContent = 'Odebírám... ⏳';

        const res = await fetch(`${API_BASE_URL}/api/whitelist/reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionToken}`
            }
        });

        const data = await res.json();

        if (data.success) {
            // Reset input values
            const nickInput = document.getElementById('mc-nick-input');
            if (nickInput) {
                nickInput.value = '';
                nickInput.dispatchEvent(new Event('input'));
            }

            // Clear source dropdown selection
            const sourceSelect = document.getElementById('mc-source-select');
            if (sourceSelect) {
                sourceSelect.value = '';
                sourceSelect.dispatchEvent(new Event('change'));
            }

            const triggerText = document.getElementById('source-trigger-text');
            if (triggerText) {
                triggerText.textContent = 'Vyber možnost...';
            }

            const dropdown = document.getElementById('custom-source-select');
            if (dropdown) {
                dropdown.classList.remove('selected');
                dropdown.querySelectorAll('.source-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
            }

            // Hide tutorial if open
            const tutorial = document.getElementById('tutorial-container');
            if (tutorial) {
                tutorial.style.display = 'none';
                const learnMoreBtn = document.getElementById('btn-learn-more');
                if (learnMoreBtn) {
                    learnMoreBtn.textContent = 'Dozvědět se více (Jak hrát?) 📖';
                }
            }

            // Go back to Step 2
            await setStep(2, 'prev');

            showMinecraftToast('Whitelist resetován', 'Můžeš zadat nový nick!', '🔄');
        } else {
            throw new Error(data.message || 'Nepodařilo se resetovat whitelist.');
        }
    } catch (err) {
        alert(err.message || 'Chyba při komunikaci s API.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Opravit přezdívku ✏️';
    }
}

