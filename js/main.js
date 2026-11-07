/**
 * WebStudio — Main JavaScript
 * Lightweight, no dependencies, vanilla ES6+
 */

(() => {
  'use strict';

  // ==========================================================================
  // Mobile Navigation Toggle
  // ==========================================================================
  const initMobileNav = () => {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    if (!toggle || !nav) return;

    const closeNav = () => {
      nav.classList.remove('nav--open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('nav--open');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
        closeNav();
      }
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (nav.classList.contains('nav--open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
        closeNav();
      }
    });
  };

  // ==========================================================================
  // Smooth Scroll for Anchor Links
  // ==========================================================================
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const header = document.querySelector('.header');
          const offset = header ? header.offsetHeight : 0;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      });
    });
  };

  // ==========================================================================
  // Intersection Observer for Scroll Animations
  // ==========================================================================
  const initScrollAnimations = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Elements to animate
    document.querySelectorAll(
      '.section__header, .service-card, .process-step, .case-card, .about__content, .about__team, .contact-form, .contact__info'
    ).forEach((el, i) => {
      el.classList.add('stagger-' + ((i % 6) + 1));
      observer.observe(el);
    });
  };

  // ==========================================================================
  // Form Handling
  // ==========================================================================
  const initContactForm = () => {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const note = form?.querySelector('.form__note');
    if (!form) return;

    form.addEventListener('submit', async e => {
      e.preventDefault();

      if (submitBtn.disabled) return;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Basic validation
      if (!data.name || !data.email || !data.task || !data.consent) {
        showNote('Пожалуйста, заполните все обязательные поля.', 'error');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        showNote('Введите корректный email.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка…';
      showNote('', '');

      try {
        // In production, replace with your actual endpoint
        const response = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          showNote('Спасибо! Мы свяжемся с вами в течение 24 часов.', 'success');
          form.reset();
        } else {
          throw new Error('Server error');
        }
      } catch {
        showNote('Произошла ошибка. Попробуйте ещё раз или напишите на hello@webstudio.example', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить заявку';
      }
    });

    function showNote(message, type) {
      if (!note) return;
      note.textContent = message;
      note.hidden = !message;
      note.className = 'form__note';
      if (type) note.classList.add('form__note--' + type);
    }
  };

  // ==========================================================================
  // Header Shadow on Scroll
  // ==========================================================================
  const initHeaderScroll = () => {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    const threshold = 10;

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > threshold) {
        header.style.boxShadow = 'var(--shadow-md)';
      } else {
        header.style.boxShadow = 'none';
      }
      lastScroll = currentScroll;
    }, { passive: true });
  };

  // ==========================================================================
  // Lazy Load Images (fallback for browsers without native loading="lazy")
  // ==========================================================================
  const initLazyImages = () => {
    if ('loading' in HTMLImageElement.prototype) return;

    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if (!lazyImages.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          if (img.dataset.srcset) img.srcset = img.dataset.srcset;
          img.removeAttribute('loading');
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    lazyImages.forEach(img => observer.observe(img));
  };

  // ==========================================================================
  // Theme Toggle (optional - for demo)
  // ==========================================================================
  const initThemeToggle = () => {
    // Add theme toggle button to header if needed
    // This is a demo feature - remove if not needed
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme) {
      document.documentElement.setAttribute('data-theme', storedTheme);
    } else if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  };

  // ==========================================================================
  // Initialize All
  // ==========================================================================
  const init = () => {
    initMobileNav();
    initSmoothScroll();
    initScrollAnimations();
    initContactForm();
    initHeaderScroll();
    initLazyImages();
    initThemeToggle();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();