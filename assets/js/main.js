/**
 * EventPulse - Main JavaScript Utilities & Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Back to top button listener
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('active');
      } else {
        backToTopBtn.classList.remove('active');
      }
    });

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2. Animated Counter on Scroll
  const counterElements = document.querySelectorAll('.counter-value');
  if (counterElements.length > 0) {
    let counted = false;

    const startCounters = () => {
      const firstCounter = counterElements[0];
      const rect = firstCounter.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top <= windowHeight && !counted) {
        counted = true;
        counterElements.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target') || '0', 10);
          const suffix = counter.getAttribute('data-suffix') || '';
          let count = 0;
          const speed = Math.ceil(target / 60);

          const updateCount = () => {
            count += speed;
            if (count >= target) {
              counter.innerText = target.toLocaleString() + suffix;
            } else {
              counter.innerText = count.toLocaleString() + suffix;
              requestAnimationFrame(updateCount);
            }
          };
          updateCount();
        });
      }
    };

    window.addEventListener('scroll', startCounters);
    startCounters(); // Initial check
  }

  // 3. Category Filter Logic for Events & Gallery
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('.filter-item');

  if (filterBtns.length > 0 && filterItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Active state
        filterBtns.forEach(b => b.classList.remove('active', 'btn-primary-custom'));
        filterBtns.forEach(b => b.classList.add('btn-outline-custom'));
        
        btn.classList.remove('btn-outline-custom');
        btn.classList.add('active', 'btn-primary-custom');

        const category = btn.getAttribute('data-filter');

        filterItems.forEach(item => {
          const itemCat = item.getAttribute('data-category');
          if (category === 'all' || itemCat === category) {
            item.style.display = 'block';
            item.classList.add('animate__animated', 'animate__fadeIn');
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // 4. Live Search Input Filter for Events
  const eventSearchInput = document.getElementById('eventSearchInput');
  if (eventSearchInput && filterItems.length > 0) {
    eventSearchInput.addEventListener('keyup', (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();

      filterItems.forEach(item => {
        const title = item.querySelector('.card-title')?.innerText.toLowerCase() || '';
        const desc = item.querySelector('.card-text')?.innerText.toLowerCase() || '';
        if (title.includes(searchTerm) || desc.includes(searchTerm)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // 5. Booking Modal Calculation logic
  const bookingModal = document.getElementById('bookingModal');
  if (bookingModal) {
    const ticketTypeSelect = document.getElementById('ticketTypeSelect');
    const ticketQuantityInput = document.getElementById('ticketQuantityInput');
    const totalPriceDisplay = document.getElementById('totalPriceDisplay');
    const bookingEventName = document.getElementById('bookingEventName');

    const updatePrice = () => {
      if (!ticketTypeSelect || !ticketQuantityInput || !totalPriceDisplay) return;
      const basePrice = parseInt(ticketTypeSelect.value || '99', 10);
      const qty = parseInt(ticketQuantityInput.value || '1', 10);
      const total = basePrice * qty;
      totalPriceDisplay.innerText = '$' + total.toLocaleString();
    };

    if (ticketTypeSelect) ticketTypeSelect.addEventListener('change', updatePrice);
    if (ticketQuantityInput) ticketQuantityInput.addEventListener('input', updatePrice);

    // Trigger when modal opens with dynamic event name
    bookingModal.addEventListener('show.bs.modal', (event) => {
      const button = event.relatedTarget;
      if (button) {
        const eventTitle = button.getAttribute('data-event-title') || 'Selected Event';
        if (bookingEventName) bookingEventName.innerText = eventTitle;
      }
      updatePrice();
    });
  }

  // 6. Generic Form Validation Toast / Alert Handler
  const forms = document.querySelectorAll('.needs-validation-custom');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
      } else {
        // Show success alert
        const alertBox = document.createElement('div');
        alertBox.className = 'alert alert-success alert-dismissible fade show mt-3';
        alertBox.innerHTML = `
          <i class="bi bi-check-circle-fill me-2"></i> 
          <strong>Success!</strong> Your request has been submitted successfully. We will get back to you shortly.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        form.appendChild(alertBox);
        form.reset();
        form.classList.remove('was-validated');

        setTimeout(() => {
          alertBox.remove();
        }, 5000);
      }
    });
  });

  // 7. Lightbox Gallery Modal Handler
  const galleryModal = document.getElementById('galleryModal');
  if (galleryModal) {
    galleryModal.addEventListener('show.bs.modal', (event) => {
      const triggerCard = event.relatedTarget;
      if (triggerCard) {
        const imgSrc = triggerCard.getAttribute('data-img-src');
        const imgTitle = triggerCard.getAttribute('data-img-title');
        const modalImg = galleryModal.querySelector('.gallery-modal-img');
        const modalTitle = galleryModal.querySelector('.modal-title');

        if (modalImg) modalImg.src = imgSrc;
        if (modalTitle) modalTitle.innerText = imgTitle || 'Gallery Event Preview';
      }
    });
  }

  // 8. Dashboard Navigation Section Switching
  const dashNavItems = document.querySelectorAll('.dash-section-trigger');
  const dashSections = document.querySelectorAll('.dash-section');

  if (dashNavItems.length > 0 && dashSections.length > 0) {
    dashNavItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        dashNavItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const targetId = item.getAttribute('data-target-section');
        dashSections.forEach(sec => {
          if (sec.id === targetId) {
            sec.style.display = 'block';
          } else {
            sec.style.display = 'none';
          }
        });
      });
    });
  }

  // 9. Password Visibility Toggle
  const togglePassBtns = document.querySelectorAll('.toggle-password-btn');
  togglePassBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target-input');
      const input = document.getElementById(targetId);
      const icon = btn.querySelector('i');

      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          if (icon) {
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
          }
        } else {
          input.type = 'password';
          if (icon) {
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
          }
        }
      }
    });
  });
});
