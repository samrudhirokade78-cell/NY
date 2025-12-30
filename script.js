// Get elements
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const headline = document.getElementById('headline');
const targetLabel = document.getElementById('targetLabel');
const celebrateBtn = document.getElementById('celebrateBtn');
const shareBtn = document.getElementById('shareBtn');

const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext ? canvas.getContext('2d') : null;
let particles = [];

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function getNextNewYear(){
  const now = new Date();
  const year = now.getFullYear();
  return new Date(year + 1, 0, 1, 0, 0, 0);
}

let target = getNextNewYear();
targetLabel.textContent = `Hosted by Samrudhi Rokade • Target: ${target.toLocaleString()}`;

function updateCountdown(){
  const now = new Date();
  const diff = target - now;

  if (diff <= 0){
    daysEl.textContent = '0';
    hoursEl.textContent = '0';
    minutesEl.textContent = '0';
    secondsEl.textContent = '0';
    headline.textContent = '🎆 Happy New Year! 🎆';
    launchConfetti(200);
    // Set next year's target so countdown continues
    target = getNextNewYear();
    targetLabel.textContent = `Hosted by Samrudhi Rokade • Target: ${target.toLocaleString()}`;
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  daysEl.textContent = d;
  hoursEl.textContent = String(h).padStart(2,'0');
  minutesEl.textContent = String(m).padStart(2,'0');
  secondsEl.textContent = String(s).padStart(2,'0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Simple confetti particle system
function random(min, max){ return Math.random() * (max - min) + min; }
const colors = ['#ff4d6d','#ffd166','#06d6a0','#4d96ff','#c77cff'];

function spawnParticle(x, y){
  particles.push({
    x: x,
    y: y,
    vx: random(-6,6),
    vy: random(-10,-2),
    size: random(6,12),
    color: colors[Math.floor(Math.random()*colors.length)],
    rot: random(0, 360),
    vr: random(-8,8),
    life: 0,
    ttl: random(60, 120)
  });
}

function launchConfetti(amount = 120){
  if (!ctx) return;
  const cx = canvas.width / 2;
  const cy = canvas.height / 3;
  for (let i=0;i<amount;i++){
    const angle = random(-Math.PI/2 - 0.8, -Math.PI/2 + 0.8);
    const radius = random(0, canvas.width * 0.2);
    const sx = cx + Math.cos(angle) * radius + random(-80,80);
    const sy = cy + random(-40,40);
    spawnParticle(sx, sy);
  }

  // Stop after a while by letting particles naturally disappear
  if (!animating) {
    animating = true;
    requestAnimationFrame(animate);
  }
}

let animating = false;
function animate(){
  if (!ctx) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for (let i = particles.length - 1; i >= 0; i--){
    const p = particles[i];
    p.life++;
    p.vy += 0.25; // gravity
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rot * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6);
    ctx.restore();

    // remove if offscreen or life exceeded
    if (p.y > canvas.height + 50 || p.life > p.ttl) {
      particles.splice(i,1);
    }
  }

  if (particles.length > 0) {
    requestAnimationFrame(animate);
  } else {
    animating = false;
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }
}

// button interactions
celebrateBtn.addEventListener('click', () => {
  launchConfetti(180);
});

shareBtn.addEventListener('click', async () => {
  // try Web Share API
  const shareData = {
    title: 'Happy New Year — Samrudhi Rokade',
    text: `Join Samrudhi Rokade in counting down to ${target.getFullYear()} — let's celebrate together!`,
    url: window.location.href
  };
  if (navigator.share) {
    try { await navigator.share(shareData); } catch(e) { /* ignore */ }
  } else {
    // fallback: copy link
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } catch (e){
      alert('Share not supported — copy the page link to share.');
    }
  }
});

// small accessibility: pressing anywhere on countdown launches confetti
document.querySelector('.countdown').addEventListener('click', () => launchConfetti(80));
