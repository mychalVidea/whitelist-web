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

// Multi-step navigation logic with smooth transition
async function setStep(stepNum) {
    currentStep = stepNum;
    
    const activeCard = document.querySelector('.card.active');
    const targetCard = document.getElementById(`step-${stepNum}`);
    
    if (activeCard && targetCard && activeCard !== targetCard) {
        // Fade out active
        activeCard.classList.add('fade-out');
        await new Promise(r => setTimeout(r, 400));
        activeCard.classList.remove('active', 'fade-out');
        
        // Fade in target
        targetCard.classList.add('fade-in');
        targetCard.classList.add('active');
        await new Promise(r => setTimeout(r, 50));
        targetCard.classList.remove('fade-in');
    } else {
        document.querySelectorAll('.card').forEach(card => card.classList.remove('active'));
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
            showError('Nejsi členem našeho Discord serveru! Nejdříve se připoj na náš Discord server a zkus to znovu.');
        } else {
            showError('Ověření přes Discord selhalo.');
        }
        return;
    }

    // Load token
    sessionToken = paramToken || localStorage.getItem('whitelist_token');

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

// Set up listeners for MC Nick input
function setupInputListeners() {
    const input = document.getElementById('mc-nick-input');
    const previewImg = document.getElementById('mc-head-img');
    const placeholder = document.getElementById('mc-head-placeholder');
    const validation = document.getElementById('nick-validation');
    const submitBtn = document.getElementById('btn-submit-nick');

    if (!input) return;

    let debounceTimeout;

    input.addEventListener('input', () => {
        const val = input.value.trim();
        clearTimeout(debounceTimeout);

        if (!val) {
            previewImg.style.display = 'none';
            placeholder.style.display = 'block';
            placeholder.textContent = '?';
            validation.textContent = '';
            submitBtn.disabled = true;
            return;
        }

        const validRegex = /^[a-zA-Z0-9_]{3,16}$/.test(val);

        if (!validRegex) {
            validation.textContent = '❌ Nick může obsahovat jen písmena, čísla a podtržítko (3-16 znaků)';
            validation.className = 'nick-validation error';
            submitBtn.disabled = true;
            previewImg.style.display = 'none';
            placeholder.style.display = 'block';
            placeholder.textContent = '❌';
            return;
        }

        validation.textContent = '⏳ Kontroluji nick...';
        validation.className = 'nick-validation';
        submitBtn.disabled = true;

        debounceTimeout = setTimeout(() => {
            // Update head preview
            previewImg.src = `https://mc-heads.net/avatar/${val}/100`;
            previewImg.onload = () => {
                previewImg.style.display = 'block';
                placeholder.style.display = 'none';
                validation.textContent = '✅ Správný formát nicku';
                validation.className = 'nick-validation valid';
                submitBtn.disabled = false;
            };
            previewImg.onerror = () => {
                previewImg.style.display = 'none';
                placeholder.style.display = 'block';
                placeholder.textContent = '?';
                validation.textContent = '❌ Selhalo načtení skinu z Mojangu';
                validation.className = 'nick-validation error';
                submitBtn.disabled = false; // still allow submission if Mojang is down
            };
        }, 400);
    });
}

// Handle MC nick confirmation
function submitNick() {
    const input = document.getElementById('mc-nick-input');
    if (!input) return;
    selectedNick = input.value.trim();
    setStep(3);
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
    setStep(4);
    runVerificationSteps();
}

// Satisfying animated check validation steps
async function runVerificationSteps() {
    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    // Clear previous inline errors/crosses if any
    const prevError = document.getElementById('inline-verify-error');
    if (prevError) prevError.remove();
    document.getElementById('btn-verify-retry').style.display = 'none';
    
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
            body: JSON.stringify({ minecraftNick: selectedNick })
        });

        const data = await response.json();

        if (response.status === 409) {
            // Already whitelisted - show red cross and restart button directly inside step-4!
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

            // Show retry button
            document.getElementById('btn-verify-retry').style.display = 'block';
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

        document.getElementById('btn-verify-retry').style.display = 'block';
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
    setStep(5);
    const title = document.getElementById('result-title');
    const desc = document.getElementById('result-desc');

    if (alreadyExists) {
        title.textContent = 'Už jsi na whitelistu!';
        desc.textContent = `Tvoje registrace pro nick "${nick}" je aktivní. Můžeš se ihned připojit.`;
    } else {
        title.textContent = 'Vítej na serveru!';
        desc.textContent = `Tvůj nick "${nick}" byl úspěšně přidán na whitelist.`;
        triggerConfetti();
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
                
                // Set the firefly at the hit location for dizzy stage
                const dizzyFirefly = document.createElement('div');
                dizzyFirefly.className = 'flying-guide firefly-dizzy';
                dizzyFirefly.style.left = `${targetX - 4}px`;
                dizzyFirefly.style.top = `${targetY - 20}px`;
                document.body.appendChild(dizzyFirefly);

                btn.classList.add('button-hit-shake');
                btn.classList.add('btn-glow-active');
                
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
                
                // Shake end
                setTimeout(() => {
                    btn.classList.remove('button-hit-shake');
                }, 600);

                // Dizzy orbiting stars
                const stars = [];
                for (let i = 0; i < 3; i++) {
                    const star = document.createElement('div');
                    star.className = 'dizzy-star';
                    star.textContent = '💫';
                    document.body.appendChild(star);
                    stars.push(star);
                }

                let dizzyTime = 0;
                const dizzyInterval = setInterval(() => {
                    dizzyTime += 0.08;
                    const bRect = dizzyFirefly.getBoundingClientRect();
                    const cx = bRect.left + bRect.width / 2;
                    const cy = bRect.top;
                    
                    stars.forEach((star, index) => {
                        const angle = dizzyTime + (index * Math.PI * 2 / 3);
                        const rx = 18;
                        const ry = 6;
                        const sx = cx + Math.cos(angle) * rx;
                        const sy = cy + Math.sin(angle) * ry - 5;
                        star.style.left = `${sx}px`;
                        star.style.top = `${sy}px`;
                        star.style.transform = `translate(-50%, -50%) rotate(${dizzyTime * 80}deg)`;
                    });
                }, 30);

                // Fall down after 1.4 seconds
                setTimeout(() => {
                    clearInterval(dizzyInterval);
                    stars.forEach(s => s.remove());
                    dizzyFirefly.classList.remove('firefly-dizzy');

                    let fallY = targetY - 20;
                    let fallX = targetX - 4;
                    let vy = -3;
                    let vx = -1.5;
                    const gravity = 0.35;
                    let fallRotation = 0;

                    function fall() {
                        vy += gravity;
                        fallX += vx;
                        fallY += vy;
                        fallRotation += 12;

                        dizzyFirefly.style.left = `${fallX}px`;
                        dizzyFirefly.style.top = `${fallY}px`;
                        dizzyFirefly.style.transform = `rotate(${fallRotation}deg) scaleY(-1)`;

                        if (fallY < window.innerHeight + 50) {
                            requestAnimationFrame(fall);
                        } else {
                            dizzyFirefly.remove();
                        }
                    }
                    requestAnimationFrame(fall);
                }, 1400);

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

// Reset app
function resetApp() {
    // Remove inline verify error label if exists
    const prevError = document.getElementById('inline-verify-error');
    if (prevError) prevError.remove();

    // Reset displays
    document.querySelectorAll('.card').forEach(card => card.style.display = '');
    document.getElementById('progress-container').style.display = '';
    document.getElementById('step-error').style.display = 'none';
    document.getElementById('btn-verify-retry').style.display = 'none';
    
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
    tabs.forEach(btn => {
        if (btn.getAttribute('onclick').includes(tabId)) {
            btn.classList.add('active');
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
}
