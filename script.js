// Config
const API_BASE_URL = 'https://api.6767111.xyz';

// State management
let currentStep = 1;
let sessionToken = null;
let discordId = null;
let discordUsername = null;
let selectedNick = '';

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
function triggerConfetti() {
    const confettiCanvas = document.getElementById('confetti');
    const confettiCtx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    let colors = ['#ffb703', '#5865f2', '#10b981', '#ffffff', '#ff9f1c'];
    let confettiArray = [];

    class ConfettiPiece {
        constructor() {
            this.x = Math.random() * confettiCanvas.width;
            this.y = Math.random() * -confettiCanvas.height;
            this.size = Math.random() * 8 + 6;
            this.speedX = Math.random() * 4 - 2;
            this.speedY = Math.random() * 5 + 4;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 4 - 2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
        }
        draw() {
            confettiCtx.fillStyle = this.color;
            confettiCtx.save();
            confettiCtx.translate(this.x, this.y);
            confettiCtx.rotate((this.rotation * Math.PI) / 180);
            confettiCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            confettiCtx.restore();
        }
    }

    for (let i = 0; i < 150; i++) {
        confettiArray.push(new ConfettiPiece());
    }

    let animationId;
    function animate() {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        let active = false;
        for (let i = 0; i < confettiArray.length; i++) {
            const piece = confettiArray[i];
            if (piece.y < confettiCanvas.height) {
                piece.update();
                piece.draw();
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
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        const now = audioCtx.currentTime;
        
        if (type === 'click') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
            
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            
            osc.start(now);
            osc.stop(now + 0.08);
        } 
        else if (type === 'error') {
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
    } catch (err) {
        console.warn('Web Audio API is not supported or was blocked:', err);
    }
}

// Multi-step navigation logic with Y-axis 3D slide transitions
async function setStep(stepNum, direction = 'next') {
    const activeCard = document.querySelector('.card.active');
    const targetCard = document.getElementById(`step-${stepNum}`);
    
    currentStep = stepNum;
    
    if (activeCard && targetCard && activeCard !== targetCard) {
        // Clear active tilt transform before swiping
        activeCard.style.transform = '';
        
        const outClass = direction === 'next' ? 'slide-out-left' : 'slide-out-right';
        const inClass = direction === 'next' ? 'slide-in-right' : 'slide-in-left';
        
        play8bitSound('click');
        
        // Ensure both are displayed and positioned correctly for overlapping transition
        // Make the active card absolute so it doesn't push the target card down
        activeCard.style.position = 'absolute';
        activeCard.style.width = '100%';
        activeCard.style.top = '0';
        activeCard.style.left = '0';
        activeCard.style.zIndex = '1';
        
        targetCard.style.position = 'relative';
        targetCard.style.zIndex = '2';
        
        // Start animations simultaneously
        activeCard.classList.add(outClass);
        targetCard.classList.add(inClass, 'active');
        
        await new Promise(r => setTimeout(r, 450));
        
        // Clean up
        activeCard.classList.remove('active', outClass);
        activeCard.style.position = '';
        activeCard.style.width = '';
        activeCard.style.top = '';
        activeCard.style.left = '';
        activeCard.style.zIndex = '';
        
        targetCard.classList.remove(inClass);
        targetCard.style.position = '';
        targetCard.style.zIndex = '';
    } else {
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('active');
            card.style.position = '';
            card.style.width = '';
            card.style.top = '';
            card.style.left = '';
            card.style.zIndex = '';
        });
        if (targetCard) targetCard.classList.add('active');
    }


    // Update progress bar width
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        let percent = 25;
        if (stepNum === 2) percent = 50;
        if (stepNum === 3) percent = 75;
        if (stepNum === 4 || stepNum === 5) percent = 100;
        progressFill.style.width = `${percent}%`;
    }

    // Update active class on progress indicators
    document.querySelectorAll('.progress-steps .step').forEach(step => {
        const stepVal = parseInt(step.getAttribute('data-step'));
        if (stepVal <= stepNum) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
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
    if (timerText) timerText.textContent = '10';
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

// 3D Card Tilt Effect
function setupCardTilt() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const tiltX = (centerY - y) / centerY;
            const tiltY = (x - centerX) / centerX;
            
            const maxTiltAngle = 8;
            const rotateX = (tiltX * maxTiltAngle).toFixed(2);
            const rotateY = (tiltY * maxTiltAngle).toFixed(2);
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
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

    // Setup 3D card perspective tilt and button block-break particles
    setupCardTilt();
    setupBlockBreakParticles();

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
                setupInputListeners();
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

function selectSource(optionElement) {
    const val = optionElement.getAttribute('data-value');
    const emoji = optionElement.querySelector('.source-emoji').textContent;
    const label = optionElement.querySelector('.source-text strong').textContent;

    const triggerText = document.getElementById('source-trigger-text');
    if (triggerText) {
        triggerText.innerHTML = `<span class="source-emoji" style="font-size: 16px; margin-right: 8px;">${emoji}</span>${label}`;
    }

    const select = document.getElementById('mc-source-select');
    if (select) {
        select.value = val;
        select.dispatchEvent(new Event('change'));
    }

    const dropdown = document.getElementById('custom-source-select');
    if (dropdown) {
        dropdown.querySelectorAll('.source-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        optionElement.classList.add('selected');
        dropdown.classList.add('selected');
        dropdown.classList.remove('open');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
    const dropdown = document.getElementById('custom-source-select');
    if (dropdown && !dropdown.contains(event.target)) {
        dropdown.classList.remove('open');
    }
});

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

    // Reset visibility states on setup
    if (sourceGroup) {
        sourceGroup.classList.remove('dropdown-ready');
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
                    setTimeout(() => {
                        if (sourceGroup && sourceGroup.classList.contains('visible')) {
                            sourceGroup.classList.add('dropdown-ready');
                        }
                    }, 500); // Wait for transition max-height to complete
                    revealTimeout = null;
                }, 1000); // 1 second delay after nick becomes valid
            }
        } else {
            if (revealTimeout) {
                clearTimeout(revealTimeout);
                revealTimeout = null;
            }
            if (sourceGroup) {
                sourceGroup.classList.remove('dropdown-ready');
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

        debounceTimeout = setTimeout(() => {
            // Update head preview
            previewImg.src = `https://mc-heads.net/avatar/${val}/100`;
            previewImg.onload = () => {
                previewImg.style.display = 'block';
                placeholder.style.display = 'none';
                validation.textContent = '✅ Správný formát nicku';
                validation.className = 'nick-validation valid';
                nickIsValid = true;
                checkFormState();
            };
            previewImg.onerror = () => {
                previewImg.style.display = 'none';
                placeholder.style.display = 'block';
                placeholder.textContent = '?';
                validation.textContent = '❌ Selhalo načtení skinu z Mojangu';
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
}

// Rules reading countdown & firefly guide logic
let rulesTimerInterval;
function startRulesTimer() {
    const timerFill = document.getElementById('timer-fill');
    const timerText = document.getElementById('timer-text');
    const acceptBtn = document.getElementById('btn-accept-rules');
    const lockIcon = document.getElementById('btn-lock');
    const firefly = document.getElementById('rules-firefly');

    if (!timerFill || !acceptBtn) return;

    let secondsLeft = 10;
    acceptBtn.disabled = true;
    if (lockIcon) lockIcon.style.display = 'inline-block';
    if (firefly) firefly.style.opacity = '0';

    if (rulesTimerInterval) clearInterval(rulesTimerInterval);

    function updateTimer() {
        if (timerText) timerText.textContent = secondsLeft;
        
        // Progress ring fill
        const percentage = ((10 - secondsLeft) / 10) * 100;
        timerFill.setAttribute('stroke-dasharray', `${percentage}, 100`);

        // Highlight bodies and guide firefly every 2 seconds
        // 10s total, 5 rules -> 2 seconds per rule
        const ruleIdx = Math.min(5, Math.floor((10 - secondsLeft) / 2) + 1);
        
        document.querySelectorAll('.rule-item').forEach((item, index) => {
            if (index + 1 === ruleIdx) {
                item.classList.add('active');
                
                // Position the firefly smoothly next to the active rule
                if (firefly) {
                    const rect = item.getBoundingClientRect();
                    const containerRect = item.parentElement.getBoundingClientRect();
                    const topPos = rect.top - containerRect.top + rect.height / 2 - 3;
                    const leftPos = rect.left - containerRect.left - 15;
                    
                    firefly.style.opacity = '1';
                    firefly.style.top = `${topPos}px`;
                    firefly.style.left = `${leftPos}px`;
                }
            } else {
                item.classList.remove('active');
            }
        });

        if (secondsLeft <= 0) {
            clearInterval(rulesTimerInterval);
            acceptBtn.disabled = false;
            if (lockIcon) lockIcon.style.display = 'none';
            document.getElementById('rules-timer').style.opacity = '0.3';
            if (firefly) firefly.style.opacity = '0';
            document.querySelectorAll('.rule-item').forEach(item => item.classList.remove('active'));
        }
        secondsLeft--;
    }

    updateTimer();
    rulesTimerInterval = setInterval(updateTimer, 1000);
}

// Accept rules button handler
function acceptRules() {
    setStep(4, 'next');
    runVerificationSteps();
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

// Copy server IP address helper
function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = element.textContent;
        element.textContent = 'Kopírováno! 📋';
        element.style.color = '#10b981';
        setTimeout(() => {
            element.textContent = originalText;
            element.style.color = '';
        }, 1500);
    });
}

// Show success view
function showSuccessState(alreadyExists = false, nick = '') {
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
    
    // Trigger funny flying guide firefly collision hint
    triggerFlyingGuide();
}

// Flying guide firefly animation logic
function triggerFlyingGuide() {
    const btn = document.getElementById('btn-learn-more');
    if (!btn) return;

    setTimeout(() => {
        // Create firefly container
        const firefly = document.createElement('div');
        firefly.className = 'flying-guide';
        document.body.appendChild(firefly);

        // Spawn position (offscreen left, mid-height)
        const startX = -60;
        const startY = window.innerHeight * 0.3 + Math.random() * 100;

        // Target position (button center)
        const rect = btn.getBoundingClientRect();
        const targetX = rect.left + rect.width / 2;
        const targetY = rect.top + rect.height / 2;

        const duration = 2200; // 2.2 seconds flight
        const startTime = performance.now();

        let lastX = startX;
        let lastY = startY;

        function animate(time) {
            const progress = (time - startTime) / duration;
            if (progress >= 1) {
                // Collision!
                firefly.remove();
                
                // Create ripple element inside button
                const ripple = document.createElement('div');
                ripple.className = 'btn-ripple';
                ripple.style.width = '240px';
                ripple.style.height = '240px';
                ripple.style.left = '50%';
                ripple.style.top = '50%';
                btn.appendChild(ripple);

                // Add classes for glow and shake
                btn.classList.add('button-hit-shake');
                btn.classList.add('btn-glow-active');
                
                // Animate ripple scale and fade
                requestAnimationFrame(() => {
                    ripple.style.transform = 'translate(-50%, -50%) scale(2.8)';
                    ripple.style.opacity = '0';
                });

                // Spawn comic-style bubble
                const bubble = document.createElement('div');
                bubble.className = 'collision-bubble';
                bubble.textContent = 'BÁC!';
                bubble.style.left = `${targetX}px`;
                bubble.style.top = `${targetY - 50}px`;
                document.body.appendChild(bubble);
                setTimeout(() => bubble.remove(), 1000);

                // Spawn sparkles
                spawnSparkles(targetX, targetY);
                
                // Cleanup ripple and shake class after completion
                setTimeout(() => {
                    btn.classList.remove('button-hit-shake');
                    ripple.remove();
                }, 800);

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
    }, 2500);
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
    const duration = 700 + Math.random() * 300; // 0.7s to 1.0s flight time

    // Arc path offsets
    const rect = targetElement.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    const midX = (startX + targetX) / 2;
    const midY = (startY + targetY) / 2;
    const offsetX = (Math.random() - 0.5) * 160;
    const offsetY = -80 - Math.random() * 100;
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

    // Fire flying fireflies sequentially
    targets.forEach((target, index) => {
        setTimeout(() => {
            flyEnergyParticle(startX, startY, target);
        }, index * 80);
    });
}

// Show error panel view
function showError(message) {
    // Hide active step cards
    document.querySelectorAll('.card').forEach(card => card.style.display = 'none');
    
    // Hide progress bar container
    document.getElementById('progress-container').style.display = 'none';

    // Show error card
    const errorCard = document.getElementById('step-error');
    const errorDesc = document.getElementById('error-desc');
    
    if (errorDesc) errorDesc.textContent = message;
    if (errorCard) errorCard.style.display = 'block';
}

// Show specific Discord invite error view
function showDiscordInviteError(inviteUrl) {
    document.querySelectorAll('.card').forEach(card => card.style.display = 'none');
    document.getElementById('progress-container').style.display = 'none';

    const errorCard = document.getElementById('step-error');
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

    const cardContent = errorCard.querySelector('.card-content');
    const retryBtn = cardContent.querySelector('button');
    cardContent.insertBefore(inviteBtn, retryBtn);

    if (errorCard) errorCard.style.display = 'block';
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

    // Reset displays
    document.querySelectorAll('.card').forEach(card => card.style.display = '');
    document.getElementById('progress-container').style.display = '';
    document.getElementById('step-error').style.display = 'none';
    document.getElementById('verify-error-actions').style.display = 'none';
    
    // Reset spinners
    document.querySelectorAll('.verify-step').forEach(step => {
        step.className = 'verify-step';
        step.querySelector('.verify-status').textContent = '';
    });
    document.getElementById('rules-timer').style.opacity = '1';

    // Verify session again or redirect to start
    if (sessionToken) {
        verifyUserSession();
    } else {
        setStep(1);
    }
}

// Toggle tutorial visibility
function toggleTutorial() {
    const container = document.getElementById('tutorial-container');
    const btn = document.getElementById('btn-learn-more');
    if (!container || !btn) return;

    if (container.style.display === 'none') {
        container.style.display = 'block';
        btn.textContent = 'Skrýt návod 📖';
        
        // Wait for unfold animation to complete before running energy particles
        setTimeout(() => {
            triggerTutorialEnergy(btn, '#pane-claim');
        }, 700);

        // Scroll to the tutorial container smoothly
        setTimeout(() => {
            container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    } else {
        container.style.display = 'none';
        btn.textContent = 'Dozvědět se více (Jak hrát?) 📖';
    }
}

// Switch active tab in tutorial
function switchTab(tabId) {
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

