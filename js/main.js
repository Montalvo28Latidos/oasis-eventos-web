/**
 * OASIS EVENTOS — Bespoke Scroll Choreography & Interactive Controller
 * Continuous scroll-scrubbed motion for Mobile & Desktop via GSAP ScrollTrigger
 */

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');

  // =========================================================================
  // 1. NAVBAR & SCROLL PROGRESS BAR
  // =========================================================================
  let ticking = false;

  function onScrollUpdate() {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    if (scrollProgress) {
      scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    if (navbar) {
      if (scrollY > 40) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScrollUpdate);
      ticking = true;
    }
  }, { passive: true });

  onScrollUpdate();

  // =========================================================================
  // 2. MOBILE MENU DRAWER
  // =========================================================================
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('[data-close-drawer]');

  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // =========================================================================
  // 3. GSAP & SCROLLTRIGGER CONTINUOUS CHOREOGRAPHY
  // =========================================================================
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // 3a. Initial Hero Entrance
    gsap.fromTo('.reveal-hero',
      { y: 34, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.15,
        stagger: 0.14,
        ease: 'power3.out',
        delay: 0.1
      }
    );

    // 3b. Hero Scroll-Scrubbed Expansion & Multi-Plane Parallax (Works on Phone & PC!)
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6
      }
    });

    heroTl
      .to('#heroStage', {
        inset: '0px',
        borderRadius: '0px',
        ease: 'none'
      }, 0)
      .to('#heroBg', {
        yPercent: 16,
        scale: 1.12,
        ease: 'none'
      }, 0)
      .to('#heroContent', {
        yPercent: -28,
        opacity: 0.15,
        ease: 'none'
      }, 0)
      .to('#heroFloatLeft', {
        yPercent: -95,
        rotation: -14,
        ease: 'none'
      }, 0)
      .to('#heroFloatRight', {
        yPercent: -115,
        rotation: 14,
        ease: 'none'
      }, 0);

    // 3c. Kinetic Background Watermark Text in Services Section
    document.querySelectorAll('[data-kinetic-text]').forEach((el) => {
      gsap.to(el, {
        xPercent: -28,
        ease: 'none',
        scrollTrigger: {
          trigger: '.services-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        }
      });
    });

    // 3d. Generic Editorial Headers (.gs-reveal)
    gsap.utils.toArray('.gs-reveal').forEach((el) => {
      gsap.fromTo(el,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // 3e. Services Section: Staggered Fade-Up + Inner Image Parallax on Scroll
    gsap.fromTo('.service-card',
      { y: 70, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top 84%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Inner photo parallax inside each service card as you scroll past on mobile/desktop
    gsap.utils.toArray('.service-card').forEach((card) => {
      const img = card.querySelector('.service-card__img-wrap img');
      if (img) {
        gsap.fromTo(img,
          { yPercent: -8, scale: 1.14 },
          {
            yPercent: 8,
            scale: 1.06,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      }
    });

    // 3f. 3D Stacking Deck Cards on Scroll + Live Progress Bar + Parallax Detail Inset (Both Mobile & Desktop!)
    const deckCards = gsap.utils.toArray('[data-deck-card]');
    deckCards.forEach((card, index) => {
      const inner = card.querySelector('.deck-card__inner');
      const mainImg = card.querySelector('.deck-card__main-img');
      const insetBox = card.querySelector('[data-deck-inset]');
      const progressBar = card.querySelector('[data-deck-progress]');

      // 1. Subtle zoom-out reveal on main high-res image as card enters viewport
      if (mainImg) {
        gsap.fromTo(mainImg,
          { scale: 1.12 },
          {
            scale: 1.0,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'top top',
              scrub: true
            }
          }
        );
      }

      // 2. Floating secondary detail inset drifts upward in counter-parallax (Works on Phone & PC!)
      if (insetBox) {
        gsap.fromTo(insetBox,
          { y: 28 },
          {
            y: -18,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              end: 'bottom top',
              scrub: 0.5
            }
          }
        );
      }

      // 3. Live horizontal gold progress bar across the top of each card as you scroll through it
      if (progressBar) {
        gsap.fromTo(progressBar,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 75%',
              end: 'bottom 25%',
              scrub: 0.3
            }
          }
        );
      }

      // 4. If not the last card, scale down and dim in 3D as the next card slides over it
      if (index < deckCards.length - 1 && inner) {
        gsap.to(inner, {
          scale: 0.92,
          opacity: 0.38,
          y: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: deckCards[index + 1],
            start: 'top 85%',
            end: 'top 15%',
            scrub: true
          }
        });
      }
    });

    // 3g. Dual Opposite Scroll-Scrubbed Filmstrips
    const filmstripLeft = document.getElementById('filmstripLeft');
    const filmstripRight = document.getElementById('filmstripRight');

    if (filmstripLeft) {
      gsap.to(filmstripLeft, {
        xPercent: -24,
        ease: 'none',
        scrollTrigger: {
          trigger: '.scroll-filmstrips',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        }
      });
    }

    if (filmstripRight) {
      gsap.fromTo(filmstripRight,
        { xPercent: -24 },
        {
          xPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.scroll-filmstrips',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5
          }
        }
      );
    }

    // 3h. Portfolio Gallery Items Staggered Curtain Reveal + Scroll Parallax
    gsap.fromTo('.portfolio-item',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#portfolioGrid',
          start: 'top 85%'
        }
      }
    );
  }

  // =========================================================================
  // 4. PORTFOLIO CATEGORY FILTERING
  // =========================================================================
  const filterPills = document.querySelectorAll('.filter-pill');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const filter = pill.getAttribute('data-filter');

      filterPills.forEach(p => {
        p.classList.remove('is-active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('is-active');
      pill.setAttribute('aria-selected', 'true');

      portfolioItems.forEach((item) => {
        const category = item.getAttribute('data-category');
        const matches = filter === 'all' || category === filter;
        if (matches) {
          item.classList.remove('is-hidden');
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(item, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' });
          }
        } else {
          item.classList.add('is-hidden');
        }
      });

      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  });

  // =========================================================================
  // 5. LIGHTBOX FULLSCREEN VIEWER
  // =========================================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxWaBtn = document.getElementById('lightboxWaBtn');

  portfolioItems.forEach((item) => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src');
      const caption = item.getAttribute('data-caption') || '';
      if (!lightbox || !lightboxImg) return;

      lightboxImg.src = src;
      lightboxImg.alt = caption;
      if (lightboxCaption) lightboxCaption.textContent = caption;
      if (lightboxWaBtn) {
        const msg = `Hola Oasis Eventos, vi en su sitio web el montaje de "${caption}" y me gustaría cotizar algo similar para mi evento.`;
        lightboxWaBtn.href = `https://wa.me/5212224366609?text=${encodeURIComponent(msg)}`;
      }

      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeDrawer();
    }
  });

  // =========================================================================
  // 6. EDITORIAL WHATSAPP QUOTE BUILDER (Clean Text, No AI Emojis)
  // =========================================================================
  const chipSelectors = document.querySelectorAll('.chip-selector');
  chipSelectors.forEach((group) => {
    const isMulti = group.classList.contains('chip-selector--multi');
    const chips = group.querySelectorAll('.chip');

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        if (isMulti) {
          chip.classList.toggle('is-selected');
        } else {
          chips.forEach(c => c.classList.remove('is-selected'));
          chip.classList.add('is-selected');
        }
      });
    });
  });

  const quoteForm = document.getElementById('whatsappQuoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const eventTypeEl = quoteForm.querySelector('[data-field="evento"] .chip.is-selected');
      const eventType = eventTypeEl ? eventTypeEl.getAttribute('data-value') : 'Evento especial';

      const selectedServices = Array.from(quoteForm.querySelectorAll('[data-field="servicios"] .chip.is-selected'))
        .map(c => c.getAttribute('data-value'));
      const servicesStr = selectedServices.length > 0 ? selectedServices.join(', ') : 'Carpas y Mobiliario';

      const guests = document.getElementById('guestCount')?.value || '100 a 200 invitados';
      const place = document.getElementById('eventPlace')?.value.trim() || 'Puebla / Tlaxcala';

      const text = [
        'Hola Oasis Eventos, me gustaría solicitar una cotización:',
        '',
        `- Tipo de evento: ${eventType}`,
        `- Servicios requeridos: ${servicesStr}`,
        `- Aforo estimado: ${guests}`,
        `- Ubicación: ${place}`,
        '',
        'Quedo atento a su disponibilidad y opciones. Gracias.'
      ].join('\n');

      const waUrl = `https://wa.me/5212224366609?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }
});
