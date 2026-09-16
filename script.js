/**
 * AN JENG — PERSONAL PORTFOLIO INTERACTION ENGINE
 * Vanilla ES6+, High-performance, Accessible
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Ambient Cursor Light Tracking
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  // 2. Sticky Navbar Glass Effect
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 3. Mobile Navigation Menu Toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close mobile menu when clicking any nav link
    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // 4. ScrollSpy Active Nav Link Highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));

  // 5. Dynamic Footer Year
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // 6. Project Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease';
            card.style.opacity = '1';
          }, 10);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 7. Project Case Studies & Modal
  const projectData = {
    'nexus-ai': {
      category: 'AI & Autonomous Agents',
      title: 'NexusAI Agent Studio',
      overview: 'A full-cycle platform enabling engineering teams to visually compose, test, and deploy multi-agent LLM systems with step-by-step state checkpointing and automatic retry strategies.',
      architecture: 'Engineered a modular execution engine with Python FastAPI backend and Next.js frontend. Implemented bidirectional WebSocket channels to stream sub-agent execution logs, token usage, and latency metrics in real time. Deployed sandboxed tool executors via Docker containers.',
      outcomes: 'Decreased enterprise agent workflow prototyping time from 2 weeks to 1 day. Sustained concurrent orchestration for 100+ active agents with sub-200ms message dispatch overhead.',
      codeUrl: 'https://github.com'
    },
    'hyperscale-vector': {
      category: 'Distributed Systems & AI',
      title: 'HyperScale Vector Lake',
      overview: 'A high-throughput distributed vector database and similarity search engine crafted for low-latency retrieval-augmented generation (RAG) at scale.',
      architecture: 'Written in Rust with Python PyTorch bindings. Uses an optimized HNSW graph algorithm combined with inverted file quantization (IVF-PQ) and AVX-512 SIMD vector math. Features a custom Raft consensus implementation for zero-downtime cluster scaling.',
      outcomes: 'Achieved p99 retrieval latency under 15ms across 10 million 1536-dimensional embeddings, outperforming stock indexes by 3.2x while cutting RAM footprint by 45%.',
      codeUrl: 'https://github.com'
    },
    'aura-design': {
      category: 'Frontend & UI Systems',
      title: 'Aura Design System',
      overview: 'An open-source, accessible React design system created specifically for data-intensive developer tools and enterprise dashboards.',
      architecture: 'Constructed using TypeScript, CSS Variables, and Radix UI primitives. Ensures 100% WCAG 2.1 AA compliance with zero CSS-in-JS runtime tax. Packaged with extensive Storybook stories and automated visual regression test suites.',
      outcomes: 'Gained over 4,500 GitHub stars and 50,000+ monthly npm installs. Adopted as the core frontend standard across 8 high-growth venture-backed startups.',
      codeUrl: 'https://github.com'
    },
    'pulse-ops': {
      category: 'Observability & DevOps',
      title: 'PulseOps Real-Time Telemetry',
      overview: 'Next-generation cloud telemetry engine providing automated time-series anomaly detection and root-cause analysis across distributed microservices.',
      architecture: 'Distributed Go agents stream system metrics and traces to an Apache Kafka cluster, which are ingested into ClickHouse at 250k events/sec. An asynchronous Python ML pipeline calculates dynamic adaptive alert thresholds.',
      outcomes: 'Proactively flagged 98% of critical infrastructure bottlenecks an average of 12 minutes before user-facing error rates breached SLA limits.',
      codeUrl: 'https://github.com'
    }
  };

  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalOverview = document.getElementById('modalOverview');
  const modalArchitecture = document.getElementById('modalArchitecture');
  const modalOutcomes = document.getElementById('modalOutcomes');
  const modalCodeBtn = document.getElementById('modalCodeBtn');

  const openProjectModal = (projectId) => {
    const data = projectData[projectId];
    if (!data) return;

    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalOverview.textContent = data.overview;
    modalArchitecture.textContent = data.architecture;
    modalOutcomes.textContent = data.outcomes;
    modalCodeBtn.href = data.codeUrl;

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.project-details-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = btn.getAttribute('data-project-target');
      openProjectModal(target);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && projectModal.classList.contains('open')) {
        closeProjectModal();
      }
    });
  }

  // 8. Toast Notifications
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout = null;

  const showToast = (message) => {
    if (!toast) return;
    toastMessage.textContent = message;
    toast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  };

  // 9. Copy Email Address Utility
  const emailText = 'an.jeng.eng@gmail.com';
  const copyEmail = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailText);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = emailText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      showToast('Email copied to clipboard: ' + emailText);
    } catch (err) {
      showToast('Contact: ' + emailText);
    }
  };

  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', copyEmail);
  }

  const copyEmailQuickBtn = document.getElementById('copyEmailQuickBtn');
  if (copyEmailQuickBtn) {
    copyEmailQuickBtn.addEventListener('click', copyEmail);
  }

  // 10. Contact Form Submission Simulation
  const contactForm = document.getElementById('contactForm');
  const formSubmitBtn = document.getElementById('formSubmitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const message = document.getElementById('formMessage').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.');
        return;
      }

      const originalBtnText = formSubmitBtn.innerHTML;
      formSubmitBtn.disabled = true;
      formSubmitBtn.innerHTML = '<span>Sending Message...</span>';

      setTimeout(() => {
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = originalBtnText;
        contactForm.reset();
        showToast(`Thank you, ${name}! Your message has been sent to An.`);
      }, 900);
    });
  }

  // ==========================================================================
  // BONUS FEATURES IMPLEMENTATION
  // ==========================================================================

  // 11. 🌅 Dynamic Greeting, 🔄 12H/24H Clock, 🌍 Timezone & 📋 Copy Timestamp
  const initLiveClock = () => {
    const greetingPill = document.getElementById('timeGreetingPill');
    const greetingIcon = document.getElementById('timeGreetingIcon');
    const greetingText = document.getElementById('timeGreetingText');
    const clockDisplay = document.getElementById('liveClockDisplay');
    const toggleClockFormatBtn = document.getElementById('toggleClockFormatBtn');
    const timezoneText = document.getElementById('timezoneText');
    const copyTimestampBtn = document.getElementById('copyTimestampBtn');

    // Detect visitor timezone
    try {
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezoneText && detectedTimezone) {
        timezoneText.textContent = detectedTimezone;
      }
    } catch (e) {
      if (timezoneText) timezoneText.textContent = 'UTC';
    }

    // Load or set 12H / 24H mode
    let is24Hour = localStorage.getItem('user_clock_24h') === 'true';

    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      // Update Dynamic Greeting based on current hour
      if (greetingIcon && greetingText) {
        if (hours >= 5 && hours < 12) {
          greetingIcon.textContent = '🌅';
          greetingText.textContent = 'Good Morning';
        } else if (hours >= 12 && hours < 18) {
          greetingIcon.textContent = '☀️';
          greetingText.textContent = 'Good Afternoon';
        } else {
          greetingIcon.textContent = '🌙';
          greetingText.textContent = 'Good Evening';
        }
      }

      // Format time
      if (clockDisplay) {
        if (is24Hour) {
          const displayHours = String(hours).padStart(2, '0');
          clockDisplay.textContent = `${displayHours}:${minutes}:${seconds}`;
          if (toggleClockFormatBtn) toggleClockFormatBtn.textContent = '24H';
        } else {
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const displayHours = hours % 12 || 12;
          clockDisplay.textContent = `${String(displayHours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
          if (toggleClockFormatBtn) toggleClockFormatBtn.textContent = '12H';
        }
      }
    };

    // Toggle 12H / 24H click event
    if (toggleClockFormatBtn) {
      toggleClockFormatBtn.addEventListener('click', () => {
        is24Hour = !is24Hour;
        localStorage.setItem('user_clock_24h', is24Hour);
        updateClock();
        showToast(`Clock switched to ${is24Hour ? '24-Hour' : '12-Hour (AM/PM)'} format.`);
      });
    }

    // Copy Timestamp button
    if (copyTimestampBtn) {
      copyTimestampBtn.addEventListener('click', async () => {
        const nowIso = new Date().toISOString();
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(nowIso);
          } else {
            const tempInput = document.createElement('input');
            tempInput.value = nowIso;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
          }
          showToast(`Copied ISO timestamp: ${nowIso}`);
        } catch (err) {
          showToast(`Timestamp: ${nowIso}`);
        }
      });
    }

    updateClock();
    setInterval(updateClock, 1000);
  };
  initLiveClock();

  // 12. ✏️ Editable Profile with 💾 localStorage Persistence
  const initProfileEditor = () => {
    const toggleEditProfileBtn = document.getElementById('toggleEditProfileBtn');
    const resetProfileBtn = document.getElementById('resetProfileBtn');
    const editableTargets = document.querySelectorAll('.editable-target');
    const navLogoSpan = document.querySelector('#navLogo span');

    const defaultProfile = {
      name: 'An Jeng',
      role: 'Senior Full-Stack & AI Systems Engineer',
      location: 'San Francisco Bay Area / Global Remote',
      bio: 'I specialize in designing and shipping products at the intersection of <strong>distributed backend systems</strong>, <strong>modern reactive frontends</strong>, and <strong>autonomous AI agent architectures</strong>.'
    };

    // Load custom profile if saved in localStorage
    const loadSavedProfile = () => {
      try {
        const saved = localStorage.getItem('user_portfolio_profile');
        if (saved) {
          const profileData = JSON.parse(saved);
          editableTargets.forEach((target) => {
            const field = target.getAttribute('data-field');
            if (profileData[field]) {
              if (field === 'bio') {
                target.innerHTML = profileData[field];
              } else {
                target.textContent = profileData[field];
              }
            }
          });
          if (profileData.name && navLogoSpan) {
            navLogoSpan.textContent = profileData.name;
          }
        }
      } catch (err) {
        console.warn('Could not load profile from localStorage', err);
      }
    };
    loadSavedProfile();

    let isEditing = false;

    if (toggleEditProfileBtn) {
      toggleEditProfileBtn.addEventListener('click', () => {
        isEditing = !isEditing;

        if (isEditing) {
          document.body.classList.add('editing-profile');
          editableTargets.forEach((target) => {
            target.contentEditable = 'true';
          });
          toggleEditProfileBtn.innerHTML = '💾 Save Profile';
          showToast('Editing mode activated! Click on Name, Role, Location, or Bio to edit.');
        } else {
          document.body.classList.remove('editing-profile');
          const updatedProfile = { ...defaultProfile };

          editableTargets.forEach((target) => {
            target.contentEditable = 'false';
            const field = target.getAttribute('data-field');
            if (field === 'bio') {
              updatedProfile[field] = target.innerHTML;
            } else {
              updatedProfile[field] = target.textContent.trim();
            }
          });

          if (updatedProfile.name && navLogoSpan) {
            navLogoSpan.textContent = updatedProfile.name;
          }

          localStorage.setItem('user_portfolio_profile', JSON.stringify(updatedProfile));
          toggleEditProfileBtn.innerHTML = '✏️ Edit Profile';
          showToast('Profile successfully saved to localStorage!');
        }
      });
    }

    if (resetProfileBtn) {
      resetProfileBtn.addEventListener('click', () => {
        localStorage.removeItem('user_portfolio_profile');
        editableTargets.forEach((target) => {
          const field = target.getAttribute('data-field');
          if (defaultProfile[field]) {
            if (field === 'bio') {
              target.innerHTML = defaultProfile[field];
            } else {
              target.textContent = defaultProfile[field];
            }
          }
          target.contentEditable = 'false';
        });

        if (navLogoSpan) {
          navLogoSpan.textContent = defaultProfile.name;
        }

        isEditing = false;
        document.body.classList.remove('editing-profile');
        if (toggleEditProfileBtn) {
          toggleEditProfileBtn.innerHTML = '✏️ Edit Profile';
        }
        showToast('Profile reset to original defaults.');
      });
    }
  };
  initProfileEditor();

  // 13. 🎨 Theme Mode: Sleek Obsidian vs. Cyberpunk 2077 Neon
  const initThemeSwitcher = () => {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const themeLabel = document.getElementById('themeLabel');

    const applyTheme = (theme) => {
      if (theme === 'cyberpunk') {
        document.body.classList.add('theme-cyberpunk');
        if (themeIcon) themeIcon.textContent = '🔥';
        if (themeLabel) themeLabel.textContent = 'Cyberpunk';
      } else {
        document.body.classList.remove('theme-cyberpunk');
        if (themeIcon) themeIcon.textContent = '🎨';
        if (themeLabel) themeLabel.textContent = 'Sleek';
      }
    };

    const savedTheme = localStorage.getItem('user_portfolio_theme') || 'sleek';
    applyTheme(savedTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const isCurrentCyberpunk = document.body.classList.contains('theme-cyberpunk');
        const nextTheme = isCurrentCyberpunk ? 'sleek' : 'cyberpunk';
        applyTheme(nextTheme);
        localStorage.setItem('user_portfolio_theme', nextTheme);
        showToast(`Theme switched to ${nextTheme === 'cyberpunk' ? 'Cyberpunk 2077 Neon' : 'Sleek Obsidian'}.`);
      });
    }
  };
  initThemeSwitcher();

  // 14. 🌌 Interactive Canvas Particle Constellation Background
  const initParticleBackground = () => {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = -9999;
    let mouseY = -9999;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 30 : 65;
    const maxDistance = isMobile ? 80 : 120;
    const mouseRadius = 130;

    const particles = [];

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 1.8 + 1;
        this.baseAlpha = Math.random() * 0.45 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Mouse repulsion / interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseRadius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouseRadius - dist) / mouseRadius;
          this.x -= Math.cos(angle) * force * 2;
          this.y -= Math.sin(angle) * force * 2;
        }
      }

      draw() {
        const isCyber = document.body.classList.contains('theme-cyberpunk');
        ctx.fillStyle = isCyber ? `rgba(252, 238, 10, ${this.baseAlpha})` : `rgba(0, 240, 255, ${this.baseAlpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const connectParticles = () => {
      const isCyber = document.body.classList.contains('theme-cyberpunk');
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.18;
            ctx.strokeStyle = isCyber ? `rgba(255, 0, 85, ${alpha})` : `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    let animationFrameId = null;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseout', () => {
      mouseX = -9999;
      mouseY = -9999;
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animate();
      }
    });
  };
  initParticleBackground();
});
