document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Swipe & Mouse Drag Scrolling for Product Categories ---
  const sliders = document.querySelectorAll('.cards-slider-container');

  sliders.forEach(slider => {
    let isDown = false;
    let startX;
    let scrollLeft;
    let isDragging = false;

    // --- Mouse Drag Events ---
    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      isDragging = false;
      slider.classList.add('active');
      // pageX contains the mouse position relative to the document
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('active');
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('active');
      // Prevent click triggers on cards during dragging
      if (isDragging) {
        setTimeout(() => { isDragging = false; }, 50);
      }
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      isDragging = true;
      const x = e.pageX - slider.offsetLeft;
      // Scroll factor multiplier for speed tuning
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    });

    // --- Touch Swipe Events for Mobile Devices ---
    let startTouchX;
    let touchScrollLeft;
    let isTouching = false;

    slider.addEventListener('touchstart', (e) => {
      isTouching = true;
      startTouchX = e.touches[0].pageX - slider.offsetLeft;
      touchScrollLeft = slider.scrollLeft;
    }, { passive: true });

    slider.addEventListener('touchend', () => {
      isTouching = false;
    });

    slider.addEventListener('touchmove', (e) => {
      if (!isTouching) return;
      const x = e.touches[0].pageX - slider.offsetLeft;
      const walk = (x - startTouchX) * 1.2;
      slider.scrollLeft = touchScrollLeft - walk;
    }, { passive: true });
  });


  // --- 2. Interactive Product Details Drawer / Modal ---
  const modal = document.getElementById('details-modal');
  const modalClose = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-product-img');
  const modalCat = document.getElementById('modal-product-cat');
  const modalTitle = document.getElementById('modal-product-title');
  const modalPrice = document.getElementById('modal-product-price');
  const modalDesc = document.getElementById('modal-product-desc');
  const checkoutBtn = document.getElementById('checkout-btn');

  // Add click handlers for all product cards and their buttons
  document.querySelectorAll('.product-card').forEach(card => {
    const seeMoreBtn = card.querySelector('.see-more-btn');

    seeMoreBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid triggering card click if card click binds
      openProductDetails(card);
    });

    // Make the entire card clickable for easier interaction
    card.addEventListener('click', () => {
      // Check if user is dragging to avoid opening modal on drag release
      const slider = card.closest('.cards-slider-container');
      if (slider && slider.classList.contains('active')) return;
      openProductDetails(card);
    });
  });

  // Open Modal function
  function openProductDetails(card) {
    const id = card.getAttribute('data-id');
    const title = card.getAttribute('data-title');
    const price = card.getAttribute('data-price');
    const category = card.getAttribute('data-category');
    const desc = card.getAttribute('data-desc');

    // Retrieve the background image URL from style of card's image
    const cardImgEl = card.querySelector('.card-image');
    const bgImage = window.getComputedStyle(cardImgEl).backgroundImage;

    // Populate Modal Content
    modalImg.style.backgroundImage = bgImage;
    modalCat.textContent = category;
    modalTitle.textContent = title;
    modalPrice.textContent = price;
    modalDesc.textContent = desc;

    // Show Modal with Animation
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Disable scroll under overlay
  }

  // Close Modal function
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable body scroll
  }

  modalClose.addEventListener('click', closeModal);

  // Close modal when clicking on the backdrop overlay
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal with ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Checkout button simulation
  checkoutBtn.addEventListener('click', () => {
    const title = modalTitle.textContent;
    checkoutBtn.textContent = 'Processing...';
    checkoutBtn.style.pointerEvents = 'none';
    
    setTimeout(() => {
      alert(`Thank you for your interest! "${title}" is ready for purchase (mock checkout checkout success).`);
      checkoutBtn.textContent = 'Purchase Item';
      checkoutBtn.style.pointerEvents = 'auto';
      closeModal();
    }, 1200);
  });
});
