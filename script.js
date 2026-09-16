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

      // Simulate sending feedback
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
});
