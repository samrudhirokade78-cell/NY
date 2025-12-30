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
  const cx =
