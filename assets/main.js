// Cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0;
let my = 0;
let rx = 0;
let ry = 0;

if (cursor && ring) {
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  }

  animRing();

  document.querySelectorAll('a,button,.skill-card,.project-card,.achievement-item,.cert-card,.media-slot').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      ring.style.width = '60px';
      ring.style.height = '60px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '12px';
      cursor.style.height = '12px';
      ring.style.width = '40px';
      ring.style.height = '40px';
    });
  });
}

// 3D particle canvas
const canvas = document.getElementById('bg-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W;
  let H;
  const particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.z = Math.random() * 1000;
      this.vz = -(Math.random() * 0.5 + 0.2);
      this.r = Math.random() * 1.5 + 0.3;
      this.hue = Math.random() < 0.5 ? 260 : 190;
      this.alpha = Math.random() * 0.6 + 0.1;
    }

    update() {
      this.z += this.vz * 2;
      if (this.z < 1) {
        this.reset();
        this.z = 1000;
      }
    }

    draw() {
      const scale = 1000 / this.z;
      const px = (this.x - W / 2) * scale + W / 2;
      const py = (this.y - H / 2) * scale + H / 2;
      const pr = this.r * scale;
      if (px < -10 || px > W + 10 || py < -10 || py > H + 10) {
        this.reset();
        return;
      }
      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, Math.max(pr, 0.5), 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue},80%,65%,${this.alpha})`;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 180; i += 1) {
    particles.push(new Particle());
  }

  let mouseX = W / 2;
  let mouseY = H / 2;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animCanvas() {
    ctx.clearRect(0, 0, W, H);
    const dx = ((mouseX - W / 2) / W) * 0.5;
    const dy = ((mouseY - H / 2) / H) * 0.5;
    particles.forEach((p) => {
      p.x += dx;
      p.y += dy;
      p.update();
      p.draw();
    });
    requestAnimationFrame(animCanvas);
  }

  animCanvas();
}

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach((reveal) => observer.observe(reveal));
}

// Media gallery
const mediaGrid = document.getElementById('mediaGrid');
if (mediaGrid) {
  const slots = [
    { label: 'Certificate 1', type: 'cert' },
    { label: 'Certificate 2', type: 'cert' },
    { label: 'Certificate 3', type: 'cert' },
    { label: 'Hackathon Photo', type: 'photo' },
    { label: 'Event Photo', type: 'photo' },
    { label: 'Project Screenshot', type: 'project' },
    { label: 'Award Photo', type: 'award' },
    { label: 'Team Photo', type: 'photo' },
  ];

  slots.forEach((slot, i) => {
    const div = document.createElement('div');
    div.className = 'media-slot';
    div.innerHTML = `
      <label>
        <input type="file" accept="image/*,video/*" data-idx="${i}">
        <div class="media-icon">${slot.type === 'cert' ? '📜' : slot.type === 'photo' ? '📸' : slot.type === 'project' ? '💻' : '🏆'}</div>
        <div class="media-type-label">${slot.type}</div>
        <div class="media-text">${slot.label}<br><span style="color:rgba(248,248,255,0.3);font-size:0.7rem;">Click to upload</span></div>
      </label>
    `;
    div.querySelector('input').addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      div.innerHTML = '';
      if (file.type.startsWith('video')) {
        const v = document.createElement('video');
        v.src = url;
        v.autoplay = true;
        v.loop = true;
        v.muted = true;
        v.playsInline = true;
        div.appendChild(v);
      } else {
        const img = document.createElement('img');
        img.src = url;
        img.alt = slot.label;
        div.appendChild(img);
      }
      div.style.border = '2px solid var(--accent)';
      div.style.boxShadow = '0 0 20px rgba(124,58,237,0.3)';
    });
    mediaGrid.appendChild(div);
  });
}
