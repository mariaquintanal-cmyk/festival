(function () {
  'use strict';

  const validators = {
    required: (val) => val.trim().length > 0,
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
    minLength: (val, n) => val.trim().length >= n,
    maxLength: (val, n) => val.trim().length <= n,
    phone: (val) => /^[+0-9()\s-]{7,20}$/.test(val.trim()),
    numeric: (val) => /^\d+$/.test(val.trim()),
    checkbox: (el) => el.checked
  };

  const messages = {
    required: 'Este campo es obligatorio.',
    email: 'Introduce un correo electrónico válido.',
    phone: 'Introduce un teléfono válido (7-20 dígitos).',
    minLength: (n) => `Debe tener al menos ${n} caracteres.`,
    maxLength: (n) => `No puede exceder ${n} caracteres.`,
    checkbox: 'Debes aceptar los términos y condiciones.'
  };

  const showError = (field, message) => {
    field.classList.add('is-error');
    field.classList.remove('is-valid');
    const errEl = document.getElementById(field.id + '-error');
    if (errEl) {
      errEl.textContent = message;
      errEl.classList.add('is-visible');
    }
  };

  const clearError = (field) => {
    field.classList.remove('is-error');
    field.classList.add('is-valid');
    const errEl = document.getElementById(field.id + '-error');
    if (errEl) {
      errEl.classList.remove('is-visible');
    }
  };

  const validateField = (field) => {
    const type = field.type;
    const value = field.value;
    let isValid = true;
    let msg = '';

    if (type === 'checkbox') {
      if (!validators.checkbox(field)) {
        isValid = false;
        msg = messages.checkbox;
      }
    } else {
      if (field.required && !validators.required(value)) {
        isValid = false;
        msg = messages.required;
      } else if (value) {
        if (field.dataset.type === 'email' || type === 'email') {
          if (!validators.email(value)) {
            isValid = false;
            msg = messages.email;
          }
        } else if (field.dataset.type === 'phone' || type === 'tel') {
          if (!validators.phone(value)) {
            isValid = false;
            msg = messages.phone;
          }
        } else if (field.dataset.type === 'numeric') {
          if (!validators.numeric(value)) {
            isValid = false;
            msg = 'Introduce solo números.';
          }
        }

        if (isValid && field.minLength && !validators.minLength(value, field.minLength)) {
          isValid = false;
          msg = messages.minLength(field.minLength);
        }
        if (isValid && field.maxLength && !validators.maxLength(value, field.maxLength)) {
          isValid = false;
          msg = messages.maxLength(field.maxLength);
        }
      }
    }

    if (!isValid) {
      showError(field, msg);
    } else if (value || type === 'checkbox') {
      clearError(field);
    } else {
      field.classList.remove('is-error', 'is-valid');
    }

    return isValid;
  };

  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach((form) => {
    const fields = form.querySelectorAll('[required], input, textarea, select');

    fields.forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('is-error')) validateField(field);
      });
      if (field.type === 'checkbox') {
        field.addEventListener('change', () => validateField(field));
      }
      if (field.tagName === 'SELECT') {
        field.addEventListener('change', () => validateField(field));
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;

      fields.forEach((field) => {
        if (!validateField(field)) {
          allValid = false;
        }
      });

      if (allValid) {
        const successEl = form.querySelector('.form-success');
        if (successEl) {
          successEl.classList.add('is-visible');
        }
        if (form.id === 'ticket-form') {
          const data = {
            nombre: form.querySelector('#name')?.value || '',
            email: form.querySelector('#email')?.value || '',
            tipo: form.querySelector('#ticket-type')?.value || '',
            cantidad: form.querySelector('#quantity')?.value || ''
          };
          setTimeout(() => {
            const modal = document.getElementById('modal-overlay');
            const modalTitle = document.getElementById('modal-title');
            const modalEyebrow = document.getElementById('modal-eyebrow');
            const modalBody = document.getElementById('modal-body');
            const modalFooter = document.getElementById('modal-footer');

            if (modal) {
              if (modalTitle) modalTitle.textContent = '¡Compra completada!';
              if (modalEyebrow) modalEyebrow.textContent = 'Resumen de tu pedido';
              if (modalBody) {
                modalBody.innerHTML = `
                  <p style="margin-bottom:1rem;color:var(--color-success);font-weight:700;">✓ Pago procesado correctamente</p>
                  <div class="modal__info">
                    <div class="modal__info-item">
                      <div class="modal__info-label">Asistente</div>
                      <div class="modal__info-value">${data.nombre}</div>
                    </div>
                    <div class="modal__info-item">
                      <div class="modal__info-label">Email</div>
                      <div class="modal__info-value">${data.email}</div>
                    </div>
                    <div class="modal__info-item">
                      <div class="modal__info-label">Tipo de entrada</div>
                      <div class="modal__info-value">${data.tipo}</div>
                    </div>
                    <div class="modal__info-item">
                      <div class="modal__info-label">Cantidad</div>
                      <div class="modal__info-value">${data.cantidad} unidad(es)</div>
                    </div>
                  </div>
                  <p style="margin-top:1rem;color:var(--color-muted);font-size:0.88rem;">Te hemos enviado un correo con tu entrada digital. ¡Nos vemos en Coachella!</p>
                `;
              }
              if (modalFooter) {
                modalFooter.innerHTML = `<button class="btn btn-primary" onclick="(function(){document.getElementById('modal-overlay').classList.remove('is-open'); document.body.style.overflow='';})();">Genial!</button>`;
              }
              modal.classList.add('is-open');
              document.body.style.overflow = 'hidden';
              modal.onclick = function (ev) {
                if (ev.target === modal || ev.target.classList.contains('modal__close')) {
                  modal.classList.remove('is-open');
                  document.body.style.overflow = '';
                }
              };
            }
          }, 600);
        }
        form.reset();
        fields.forEach((f) => f.classList.remove('is-error', 'is-valid'));
        setTimeout(() => {
          if (successEl) successEl.classList.remove('is-visible');
        }, 6000);
      } else {
        const firstError = form.querySelector('.is-error');
        if (firstError) firstError.focus();
      }
    });
  });

  const initTicketCalculator = () => {
    const ticketForm = document.getElementById('ticket-form');
    if (!ticketForm) return false;
    const typeEl = ticketForm.querySelector('#ticket-type');
    const qtyEl = ticketForm.querySelector('#quantity');
    const priceDisplay = document.getElementById('price-display');
    if (!typeEl || !qtyEl || !priceDisplay) return false;

    const prices = {
      'GA 1 Día': 189,
      'GA 3 Días': 499,
      'VIP 3 Días': 1069,
      'VIP Safari': 2599
    };

    const formatMoney = (n) => '$' + Number(n).toLocaleString('en-US') + ' USD';

    const updatePrice = () => {
      const type = (typeEl.value || '').trim();
      let qty = parseInt(qtyEl.value || '1', 10);
      if (!qty || qty < 1) qty = 1;
      if (qty > 8) qty = 8;
      const base = prices[type] || 0;
      const total = base * qty;

      if (!type || base === 0) {
        if (priceDisplay) priceDisplay.textContent = 'Selecciona una entrada';
        return;
      }

      const breakdown = document.getElementById('price-breakdown');
      if (priceDisplay) {
        priceDisplay.textContent = formatMoney(total);
        if (qty > 1 && breakdown) {
          breakdown.textContent = formatMoney(base) + ' × ' + qty + (qty===1?' entrada':' entradas');
        } else if (breakdown) {
          breakdown.textContent = formatMoney(base) + ' · 1 entrada';
        }
      }
    };

    typeEl.addEventListener('change', updatePrice);
    qtyEl.addEventListener('input', updatePrice);
    qtyEl.addEventListener('change', updatePrice);
    document.addEventListener('change', (e) => { if (e.target === typeEl || e.target === qtyEl) updatePrice(); });
    updatePrice();
    setTimeout(updatePrice, 150);
    setTimeout(updatePrice, 600);
    return true;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTicketCalculator);
  } else {
    initTicketCalculator();
  }
  setTimeout(initTicketCalculator, 200);
  setTimeout(initTicketCalculator, 1200);

})();
