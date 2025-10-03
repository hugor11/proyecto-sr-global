// Swiper: estado único + init/destroy idempotentes
window.SR = window.SR || {};
window.SR.promotionsSwiper = window.SR.promotionsSwiper || null;
function initPromotionsSwiper() {
  const el = document.querySelector('#promotions-carousel');
  if (window.SR.promotionsSwiper) {
    try { window.SR.promotionsSwiper.destroy(true, true); } catch (_) {}
    window.SR.promotionsSwiper = null;
  }
  if (!el || typeof window.Swiper === 'undefined') return;
  window.SR.promotionsSwiper = new window.Swiper(el, {
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: {
      el: '#promotions-carousel .swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '#promotions-carousel .swiper-button-next',
      prevEl: '#promotions-carousel .swiper-button-prev',
    },
    breakpoints: {
      640: { slidesPerView: 2, spaceBetween: 20 },
      1024: { slidesPerView: 3, spaceBetween: 30 },
    },
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    observer: true,
    observeParents: true,
  });
}
function destroyPromotionsSwiper() {
  if (window.SR.promotionsSwiper) {
    try { window.SR.promotionsSwiper.destroy(true, true); } catch (_) {}
    window.SR.promotionsSwiper = null;
  }
}
