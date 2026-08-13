/**
 * ═══════════════════════════════════════════════
 * ⚙️ Main JavaScript — Logic หลักทั้งหมด
 * ═══════════════════════════════════════════════
 * - Navbar scroll effect
 * - Mobile menu toggle
 * - Typing/rotating effect สำหรับ Hero
 * - Intersection Observer สำหรับ scroll animation
 * - Render Projects จาก projects-data.js
 * - Render Experience จาก experience-data.js
 * - Form validation
 */

import projects from './projects-data.js';
import experience from './experience-data.js';

/* ═══════════════════════════════════════════════
   🧭 Navbar — เปลี่ยนพื้นหลังเมื่อ scroll
   ═══════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ═══════════════════════════════════════════════
   📱 Mobile Menu Toggle
   ═══════════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function closeMenu() {
  hamburger.classList.remove('active');
  navLinks.classList.remove('open');
  navOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
  navOverlay.classList.toggle('active');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navOverlay.addEventListener('click', closeMenu);

// ปิดเมนูเมื่อคลิกลิงก์
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* ═══════════════════════════════════════════════
   ⌨️ Typing Effect — สลับข้อความสายงานใน Hero
   ═══════════════════════════════════════════════ */
const roles = [
  'Full Stack Developer',
  'Web Developer',
  'AI Engineer',
  'Data Science',
];

const roleEl = document.getElementById('roleText');
let roleIdx = 0;
let charIdx = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeRole() {
  const current = roles[roleIdx];

  if (isDeleting) {
    roleEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    typingSpeed = 50;
  } else {
    roleEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    typingSpeed = 100;
  }

  // จบการพิมพ์ → รอแล้วเริ่มลบ
  if (!isDeleting && charIdx === current.length) {
    typingSpeed = 2000;
    isDeleting = true;
  }

  // ลบเสร็จ → ไปคำถัดไป
  if (isDeleting && charIdx === 0) {
    isDeleting = false;
    roleIdx = (roleIdx + 1) % roles.length;
    typingSpeed = 500;
  }

  setTimeout(typeRole, typingSpeed);
}

typeRole();

/* ═══════════════════════════════════════════════
   👁️ Intersection Observer — Animation เมื่อ scroll
   ═══════════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // animate ครั้งเดียว
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => observer.observe(el));

/* ═══════════════════════════════════════════════
   🧳 Render Experience Timeline
   ═══════════════════════════════════════════════ */
function renderExperience() {
  const container = document.getElementById('experienceTimeline');
  if (!container) return;

  container.innerHTML = experience
    .map(
      (exp) => `
    <div class="timeline-item reveal">
      <span class="timeline-period">${exp.period}</span>
      <h3 class="timeline-position">${exp.position}</h3>
      <p class="timeline-company">${exp.company}</p>
      <p class="timeline-desc">${exp.description}</p>
      <span class="timeline-stack">${exp.stack.join(' / ')}</span>
    </div>
  `
    )
    .join('');

  // ลงทะเบียน observer ใหม่สำหรับ elements ที่เพิ่งสร้าง
  container.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════
   💼 Render Projects — จาก projects-data.js
   ═══════════════════════════════════════════════ */
function renderProjects() {
  const container = document.getElementById('projectsList');
  if (!container) return;

  container.innerHTML = projects
    .map((proj, i) => {
      const idx = String(i + 1).padStart(2, '0');
      const stackText = proj.stack.join(' / ');

      // สร้างลิงก์เฉพาะเมื่อ URL ไม่ใช่ null
      let links = '';
      if (proj.demoUrl) {
        links += `<a href="${proj.demoUrl}" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> Demo</a>`;
      }
      if (proj.githubUrl) {
        links += `<a href="${proj.githubUrl}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> GitHub</a>`;
      }

      return `
      <article class="project-item reveal">
        <div class="project-header">
          <span class="project-index">${idx}</span>
          <h3 class="project-title">${proj.title}</h3>
        </div>
        <p class="project-desc">${proj.description}</p>
        <div class="project-meta">
          <span class="project-stack">${stackText}</span>
          ${links ? `<div class="project-links">${links}</div>` : ''}
        </div>
      </article>`;
    })
    .join('');

  // ลงทะเบียน observer ใหม่
  container.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}



/* ═══════════════════════════════════════════════
   🚀 Initialize — เริ่มต้นทำงานทั้งหมด
   ═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderExperience();
  renderProjects();
});
