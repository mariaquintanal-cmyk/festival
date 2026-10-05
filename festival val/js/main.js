(function () {
  'use strict';

  const header = document.querySelector('.header');
  const onScrollHeader = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScrollHeader);
  onScrollHeader();

  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  const body = document.body;

  const toggleMenu = () => {
    const isOpen = nav.classList.toggle('is-open');
    hamburger.classList.toggle('is-active', isOpen);
    body.classList.toggle('menu-open', isOpen);
  };

  if (hamburger && nav) {
    hamburger.addEventListener('click', toggleMenu);

    document.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('is-open')) {
          toggleMenu();
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (
        nav.classList.contains('is-open') &&
        !nav.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        toggleMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        toggleMenu();
      }
    });
  }

  const countdownEls = document.querySelectorAll('.countdown');
  if (countdownEls.length) {
    const targetDate = new Date('2027-10-04T17:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        countdownEls.forEach((c) => {
          c.style.justifyContent = 'center';
          c.innerHTML = '<p style="width:100%;text-align:center;color:var(--color-primary);font-weight:700;font-size:1.5rem;margin:0;padding:var(--spacing-md) 0;">¡El festival ha comenzado!</p>';
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      countdownEls.forEach((c) => {
        const d = c.querySelector('[data-unit="days"]');
        const h = c.querySelector('[data-unit="hours"]');
        const m = c.querySelector('[data-unit="minutes"]');
        const s = c.querySelector('[data-unit="seconds"]');
        if (d) d.textContent = String(days).padStart(2, '0');
        if (h) h.textContent = String(hours).padStart(2, '0');
        if (m) m.textContent = String(minutes).padStart(2, '0');
        if (s) s.textContent = String(seconds).padStart(2, '0');
      });
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  const overlay = document.getElementById('modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalEyebrow = document.getElementById('modal-eyebrow');
  const modalBody = document.getElementById('modal-body');
  const modalFooter = document.getElementById('modal-footer');

  const openModal = (data) => {
    if (!overlay) return;
    if (modalTitle) modalTitle.textContent = data.title || '';
    if (modalEyebrow) modalEyebrow.textContent = data.eyebrow || '';
    if (modalBody) modalBody.innerHTML = data.body || '';
    if (modalFooter) modalFooter.innerHTML = data.footer || '';
    overlay.classList.add('is-open');
    body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    body.style.overflow = '';
  };

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.classList.contains('modal__close')) {
        closeModal();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  document.querySelectorAll('[data-artist]').forEach((el) => {
    el.addEventListener('click', () => {
      const name = el.dataset.artist;
      const genre = el.dataset.genre || 'Electrónica / Pop';
      const time = el.dataset.time || '21:00';
      const day = el.dataset.day || 'Día 1';
      const stage = el.dataset.stage || 'Main Stage';
      const bio = el.dataset.bio || 'Artista internacional con gran trayectoria. Presentará sus mayores éxitos en un show inolvidable lleno de energía y producción visual impresionante.';

      openModal({
        eyebrow: `${day} · ${time}`,
        title: name,
        body: `
          <p style="margin-bottom:1.25rem;color:var(--color-muted);font-size:0.95rem;line-height:1.7;">${bio}</p>
          <div class="modal__info">
            <div class="modal__info-item">
              <div class="modal__info-label">Escenario</div>
              <div class="modal__info-value">${stage}</div>
            </div>
            <div class="modal__info-item">
              <div class="modal__info-label">Género</div>
              <div class="modal__info-value">${genre}</div>
            </div>
            <div class="modal__info-item">
              <div class="modal__info-label">Duración</div>
              <div class="modal__info-value">90 min</div>
            </div>
            <div class="modal__info-item">
              <div class="modal__info-label">Horario</div>
              <div class="modal__info-value">${time}</div>
            </div>
          </div>
        `,
        footer: `
          <button class="btn btn-primary" onclick="closeModalGlobal && closeModalGlobal()">Cerrar</button>
          <a href="tickets.html" class="btn btn-outline">Comprar Entradas</a>
        `
      });
    });
  });

  window.closeModalGlobal = closeModal;

  document.querySelectorAll('[data-ticket]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const name = el.dataset.ticket;
      const price = el.dataset.price || '---';
      const features = (el.dataset.features || 'Acceso al festival').split('|');

      const list = features
        .map((f) => `<li class="ticket-card__feature">${f.trim()}</li>`)
        .join('');

      openModal({
        eyebrow: 'Entrada seleccionada',
        title: name,
        body: `
          <div style="text-align:center;margin-bottom:1.5rem;">
            <div style="font-family:var(--font-display);font-size:3rem;font-weight:900;background:var(--gradient-btn);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;">
              ${price}
            </div>
          </div>
          <ul style="list-style:none;padding:0;">
            ${list}
          </ul>
        `,
        footer: `
          <a href="tickets.html#purchase-form" class="btn btn-primary" onclick="closeModalGlobal && closeModalGlobal()">Comprar Ahora</a>
          <button class="btn btn-outline" onclick="closeModalGlobal && closeModalGlobal()">Seguir viendo</button>
        `
      });
    });
  });

  document.querySelectorAll('.accordion__header').forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.accordion__body');
      const isOpen = item.classList.contains('is-open');

      document.querySelectorAll('.accordion__item').forEach((i) => {
        i.classList.remove('is-open');
        const b = i.querySelector('.accordion__body');
        if (b) b.style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('is-open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  document.querySelectorAll('.day-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.day;

      document.querySelectorAll('.day-tab').forEach((t) => t.classList.remove('is-active'));
      document.querySelectorAll('.day-content').forEach((c) => c.classList.remove('is-active'));

      tab.classList.add('is-active');
      const targetContent = document.getElementById(`day-${target}`);
      if (targetContent) targetContent.classList.add('is-active');
    });
  });

  const revealEls = document.querySelectorAll('.section-title, .info-card, .ticket-card, .headliner-card, .form-wrapper');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.7s ease ${i * 60}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms`;
      io.observe(el);
    });
  }

  const currentPath = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPath)) {
      link.classList.add('active');
    }
    if (currentPath === '' && href === 'index.html') {
      link.classList.add('active');
    }
  });

  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      const caption = item.querySelector('.gallery-item__overlay')?.textContent?.trim() || 'Festival Coachella';
      openModal({
        eyebrow: 'Galería',
        title: caption,
        body: `
          <div style="aspect-ratio: 16/9; border-radius: var(--radius-md); background: linear-gradient(135deg, #4a1a3a, #2e1a4a, #1a3a4a); display:flex;align-items:center;justify-content:center; font-family:var(--font-display); font-size:2rem; font-weight:800; margin-bottom:1rem;">
            🎡 ${caption}
          </div>
          <p style="color:var(--color-muted);font-size:0.93rem;">Captura de ediciones anteriores del festival Coachella en el Valle de Coachella, California. Una experiencia única con la mejor música, arte y ambiente.</p>
        `,
        footer: `
          <button class="btn btn-outline" onclick="closeModalGlobal && closeModalGlobal()">Cerrar</button>
          <a href="lineup.html" class="btn btn-primary" onclick="closeModalGlobal && closeModalGlobal()">Ver Lineup</a>
        `
      });
    });
  });

})();
