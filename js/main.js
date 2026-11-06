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
    ScrollTrigger.config({ ignoreMobileResize: true });
    gsap.defaults({ force3D: true });

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

    // 3g. Dual Opposite Scroll-Scrubbed Filmstrips (GPU 3D Accelerated for iPhone/iPad)
    const filmstripLeft = document.getElementById('filmstripLeft');
    const filmstripRight = document.getElementById('filmstripRight');

    if (filmstripLeft) {
      gsap.fromTo(filmstripLeft,
        { xPercent: 0 },
        {
          xPercent: -20,
          force3D: true,
          ease: 'none',
          scrollTrigger: {
            trigger: '.scroll-filmstrips',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            fastScrollEnd: true
          }
        }
      );
    }

    if (filmstripRight) {
      gsap.fromTo(filmstripRight,
        { xPercent: -20 },
        {
          xPercent: 0,
          force3D: true,
          ease: 'none',
          scrollTrigger: {
            trigger: '.scroll-filmstrips',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            fastScrollEnd: true
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
  let userGeoCoords = null;
  const btnOpenMap = document.getElementById('btnOpenMap');
  const locMainText = document.getElementById('locMainText');
  const locSubText = document.getElementById('locSubText');

  // Modal elements
  const mapModal = document.getElementById('mapModal');
  const mapModalBackdrop = document.getElementById('mapModalBackdrop');
  const mapModalClose = document.getElementById('mapModalClose');
  const mapBtnConfirm = document.getElementById('mapBtnConfirm');
  const mapBtnCurrentLoc = document.getElementById('mapBtnCurrentLoc');

  let leafletMap = null;
  let mapMarker = null;
  const defaultPueblaCoords = [19.0414, -98.2063]; // Centro Puebla / Tlaxcala

  function openMapPicker() {
    if (!mapModal) return;
    mapModal.style.display = 'flex';
    mapModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const initialPos = userGeoCoords ? [userGeoCoords.lat, userGeoCoords.lng] : defaultPueblaCoords;

    if (!leafletMap && typeof L !== 'undefined') {
      leafletMap = L.map('interactiveMap', {
        center: initialPos,
        zoom: 13,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(leafletMap);

      mapMarker = L.marker(initialPos, { draggable: true }).addTo(leafletMap);
      mapMarker.bindPopup('<b>Lugar del evento</b><br>Arrastra o toca para cambiar').openPopup();

      mapMarker.on('dragend', () => {
        const p = mapMarker.getLatLng();
        mapMarker.bindPopup(`<b>Punto seleccionado</b><br>${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}`).openPopup();
      });

      leafletMap.on('click', (e) => {
        mapMarker.setLatLng(e.latlng);
        mapMarker.bindPopup(`<b>Punto seleccionado</b><br>${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`).openPopup();
      });
    }

    setTimeout(() => {
      if (leafletMap) {
        leafletMap.invalidateSize();
        if (userGeoCoords) {
          leafletMap.setView([userGeoCoords.lat, userGeoCoords.lng], 14);
          if (mapMarker) mapMarker.setLatLng([userGeoCoords.lat, userGeoCoords.lng]);
        }
      }
    }, 200);
  }

  function closeMapPicker() {
    if (!mapModal) return;
    mapModal.style.display = 'none';
    mapModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (btnOpenMap) {
    btnOpenMap.addEventListener('click', openMapPicker);
  }

  if (mapModalClose) mapModalClose.addEventListener('click', closeMapPicker);
  if (mapModalBackdrop) mapModalBackdrop.addEventListener('click', closeMapPicker);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mapModal && mapModal.style.display === 'flex') {
      closeMapPicker();
    }
  });

  if (mapBtnCurrentLoc) {
    mapBtnCurrentLoc.addEventListener('click', () => {
      if (!navigator.geolocation) {
        alert('La geolocalización no está disponible en este dispositivo.');
        return;
      }
      mapBtnCurrentLoc.textContent = 'Obteniendo GPS...';
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          mapBtnCurrentLoc.textContent = '📍 Mi ubicación actual';
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          if (leafletMap && mapMarker) {
            leafletMap.setView([lat, lng], 15);
            mapMarker.setLatLng([lat, lng]);
            mapMarker.bindPopup('<b>Tu ubicación actual</b>').openPopup();
          }
        },
        (err) => {
          mapBtnCurrentLoc.textContent = '📍 Mi ubicación actual';
          console.warn('GPS error:', err);
          alert('No se pudo obtener la ubicación actual. Puedes navegar en el mapa y tocar donde será tu evento.');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }

  if (mapBtnConfirm) {
    mapBtnConfirm.addEventListener('click', () => {
      if (mapMarker) {
        const pos = mapMarker.getLatLng();
        userGeoCoords = {
          lat: pos.lat.toFixed(6),
          lng: pos.lng.toFixed(6)
        };
        if (locMainText) locMainText.textContent = '✓ Ubicación fijada en el mapa';
        if (locSubText) locSubText.textContent = `Coordenadas: ${userGeoCoords.lat}, ${userGeoCoords.lng} (Toca para cambiar)`;
        if (btnOpenMap) btnOpenMap.classList.add('is-selected');
      }
      closeMapPicker();
    });
  }

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!userGeoCoords) {
        openMapPicker();
        alert('Por favor selecciona en el mapa el punto donde se realizará tu evento para adjuntarlo a tu cotización.');
        return;
      }

      const eventTypeEl = quoteForm.querySelector('[data-field="evento"] .chip.is-selected');
      const eventType = eventTypeEl ? eventTypeEl.getAttribute('data-value') : 'Evento especial';

      const selectedServices = Array.from(quoteForm.querySelectorAll('[data-field="servicios"] .chip.is-selected'))
        .map(c => c.getAttribute('data-value'));
      const servicesStr = selectedServices.length > 0 ? selectedServices.join(', ') : 'Carpas y Mobiliario';

      const guests = document.getElementById('guestCount')?.value || '10 a 50 personas';
      const mapUrl = `https://maps.google.com/?q=${userGeoCoords.lat},${userGeoCoords.lng}`;

      const textLines = [
        'Hola Oasis Eventos, me gustaría solicitar una cotización:',
        '',
        `- Tipo de evento: ${eventType}`,
        `- Servicios requeridos: ${servicesStr}`,
        `- Aforo estimado: ${guests}`,
        `- Ubicación en Google Maps: ${mapUrl}`
      ];

      textLines.push('', 'Quedo atento a su disponibilidad y opciones. Gracias.');

      const waUrl = `https://wa.me/5212224366609?text=${encodeURIComponent(textLines.join('\n'))}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // 12. Mini Gallery / Carousel inside Deck Cards
  function initDeckGalleries() {
    const galleries = document.querySelectorAll('[data-deck-gallery]');
    galleries.forEach((gallery) => {
      const track = gallery.querySelector('[data-deck-gallery-track]');
      const slides = gallery.querySelectorAll('.deck-gallery__slide');
      const prevBtn = gallery.querySelector('[data-deck-gallery-prev]');
      const nextBtn = gallery.querySelector('[data-deck-gallery-next]');
      const dotsContainer = gallery.querySelector('[data-deck-gallery-dots]');
      const counterEl = gallery.querySelector('[data-deck-gallery-counter]');

      if (!track || slides.length === 0) return;

      let currentIndex = 0;
      const totalSlides = slides.length;

      // Generar dots dinámicamente según la cantidad de fotos
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, idx) => {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = `deck-gallery__dot ${idx === 0 ? 'is-active' : ''}`;
          dot.setAttribute('aria-label', `Ver foto ${idx + 1} de ${totalSlides}`);
          dot.addEventListener('click', (e) => {
            e.stopPropagation();
            goToSlide(idx);
          });
          dotsContainer.appendChild(dot);
        });
      }

      function updateActiveState(index) {
        currentIndex = index;
        if (dotsContainer) {
          const dots = dotsContainer.querySelectorAll('.deck-gallery__dot');
          dots.forEach((d, i) => d.classList.toggle('is-active', i === currentIndex));
        }
        if (counterEl) {
          counterEl.textContent = `${currentIndex + 1} / ${totalSlides}`;
        }
      }

      function goToSlide(index) {
        const slideWidth = track.clientWidth;
        track.scrollTo({
          left: index * slideWidth,
          behavior: 'smooth'
        });
        updateActiveState(index);
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const target = (currentIndex - 1 + totalSlides) % totalSlides;
          goToSlide(target);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const target = (currentIndex + 1) % totalSlides;
          goToSlide(target);
        });
      }

      // Sincronizar estado en swipe táctil y scroll
      let scrollTimer;
      track.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          const slideWidth = track.clientWidth;
          if (slideWidth > 0) {
            const newIndex = Math.round(track.scrollLeft / slideWidth);
            if (newIndex !== currentIndex && newIndex >= 0 && newIndex < totalSlides) {
              updateActiveState(newIndex);
            }
          }
        }, 50);
      }, { passive: true });

      // Arrastre con ratón en escritorio
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;
      let hasDragged = false;

      track.addEventListener('mousedown', (e) => {
        isDown = true;
        hasDragged = false;
        track.classList.add('is-dragging');
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
      });

      window.addEventListener('mouseup', () => {
        if (!isDown) return;
        isDown = false;
        track.classList.remove('is-dragging');
        const slideWidth = track.clientWidth;
        if (slideWidth > 0 && hasDragged) {
          const targetIndex = Math.round(track.scrollLeft / slideWidth);
          goToSlide(targetIndex);
        }
      });

      track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.1;
        if (Math.abs(walk) > 4) hasDragged = true;
        track.scrollLeft = scrollLeft - walk;
      });
    });
  }
  initDeckGalleries();
});
