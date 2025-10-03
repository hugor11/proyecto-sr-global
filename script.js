// Guard anti-doble-toggle
let lastToggleTime = 0;
const DEBOUNCE_MS = 300;
// Swiper wait timer (hoisted early to avoid TDZ when ensurePromotionsSwiper runs during init)
var __swiperWaitTimer = null;
// SR Global Experiences - Script Principal

// Polyfills y correcciones específicas para iOS/Safari
(function() {
    'use strict';
    
    // 1. Polyfill para closest() en Safari más antiguo
    if (!Element.prototype.closest) {
        Element.prototype.closest = function(s) {
            var el = this;
            do {
                if (el.matches && el.matches(s)) return el;
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        };
    }
    
    // 2. Polyfill para matches() en Safari más antiguo
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.matchesSelector || 
                                  Element.prototype.webkitMatchesSelector || 
                                  Element.prototype.mozMatchesSelector || 
                                  Element.prototype.msMatchesSelector;
    }
    
    // 3. CRÍTICO: Fix para viewport height en iOS (problema del 100vh) - versión profesional
    function setVH() {
        try {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            console.log('VH updated:', vh, 'px');
        } catch (e) {
            console.warn('Error setting VH property:', e);
        }
    }
    
    // 4. Configurar VH al cargar y al cambiar orientación - mejorado para iOS
    setVH();
    window.addEventListener('resize', setVH, { passive: true });
    window.addEventListener('orientationchange', function() {
        // Delay para iOS orientation change
        setTimeout(setVH, 100);
    }, { passive: true });
    
    // 5. Fix para eventos touch en iOS
    if ('ontouchstart' in window) {
        document.documentElement.classList.add('touch-device');
    }
    
    // 6. Fix para scroll momentum en iOS + diagnóstico visual
    if (window.navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
        document.documentElement.style.webkitOverflowScrolling = 'touch';
    }
    
    console.log('iOS/Safari polyfills and fixes loaded');
})();

// Hacer setVH disponible globalmente para uso en inicialización
function setVH() {
    try {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        console.log('VH updated:', vh, 'px');
    } catch (e) {
        console.warn('Error setting VH property:', e);
    }
}

// IIFE Principal - SISTEMA DE MENÚ ROBUSTO CON LISTENERS SEPARADOS
(() => {
  window.SR = window.SR || {};
  if (window.SR.__mainLoaded) {
    console.warn('[SR] main bundle already loaded — skipping duplicate execution');
    return;
  }
  window.SR.__mainLoaded = true;
  
  let menuController; // AbortController específico para el menú
  
  function setMenuState(isOpen) {
    const btn = document.querySelector('[data-menu-toggle]');
    const panel = document.querySelector('[data-menu-panel]') || document.getElementById('mobile-menu');
    const overlay = document.querySelector('[data-menu-overlay]');
    
    if (!btn || !panel) {
      console.warn('⚠️ No se encontró botón o panel');
      return;
    }
    
    console.log('🔧 setMenuState llamado con isOpen:', isOpen);
    console.log('📦 Panel antes:', {
      hasHidden: panel.hasAttribute('hidden'),
      display: getComputedStyle(panel).display,
      classes: panel.className
    });
    
    // Modificar atributos
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    
    // CRÍTICO: quitar/agregar hidden explícitamente
    if (isOpen) {
      panel.removeAttribute('hidden');
      console.log('✅ Atributo hidden REMOVIDO');
    } else {
      panel.setAttribute('hidden', '');
      console.log('✅ Atributo hidden AGREGADO');
    }
    
    console.log('📦 Panel después:', {
      hasHidden: panel.hasAttribute('hidden'),
      display: getComputedStyle(panel).display,
      rect: panel.getBoundingClientRect()
    });
    
    // Bloqueo de scroll
    document.body.classList.toggle('overflow-hidden', isOpen);
    document.body.classList.toggle('touch-none', isOpen);
    
    // Overlay
    if (overlay) {
      overlay.classList.toggle('hidden', !isOpen);
    }
    
    // Cambiar ícono del botón
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = isOpen ? 'fas fa-times text-2xl' : 'fas fa-bars text-2xl';
    }
    
    console.log(isOpen ? '✅ Menú abierto' : '✅ Menú cerrado');
  }
  
  function initMenu() {
    // Abortar listeners previos
    if (menuController) {
      menuController.abort();
    }
    menuController = new AbortController();
    const { signal } = menuController;
    
    console.log('✅ Inicializando menú móvil...');
    
    // 🧹 Limpieza de duplicados
    const panel = document.querySelector('[data-menu-panel]');
    if (panel) {
      const closeBtns = panel.querySelectorAll('[data-menu-close]');
      if (closeBtns.length > 1) {
        console.warn(`⚠️ ${closeBtns.length} botones de cerrar, eliminando duplicados`);
        closeBtns.forEach((btn, i) => {
          if (i > 0) btn.remove();
        });
      }
    }
    
    // 🎯 Listener principal
    document.addEventListener('click', (e) => {
      // ORDEN CRÍTICO: verificar enlaces PRIMERO
      const link = e.target.closest('[data-menu-panel] a[href]');
      if (link) {
        console.log('🔗 Navegando a:', link.href);
        // NO hacer preventDefault - dejar que navegue
        // Cerrar menú DESPUÉS de un micro-delay
        setTimeout(() => setMenuState(false), 100);
        return; // SALIR - no procesar nada más
      }
      
      // Luego verificar si el clic fue dentro del panel (pero no en X)
      const clickedPanel = e.target.closest('[data-menu-panel]');
      const closeBtn = e.target.closest('[data-menu-close]');
      
      if (clickedPanel && !closeBtn) {
        console.log('🔵 Clic dentro del panel, ignorando');
        return; // SALIR
      }
      
      // Ahora sí, procesar botones de control
      const btn = e.target.closest('[data-menu-toggle]');
      const overlay = e.target.closest('[data-menu-overlay]');
      
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        console.log('🎯 Toggle por botón hamburguesa');
        setMenuState(!isOpen);
      } 
      else if (closeBtn) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔴 Cerrando por botón X');
        setMenuState(false);
      }
      else if (overlay) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔴 Cerrando por overlay (fondo oscuro)');
        setMenuState(false);
      }
    }, { capture: true, signal });
    
    // � Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const btn = document.querySelector('[data-menu-toggle]');
        const isOpen = btn?.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
          console.log('🔴 Cerrando con Escape');
          setMenuState(false);
        }
      }
    }, { signal });
    
    console.log('✅ Menú inicializado correctamente');
  }
  
  // Función principal de inicialización
  function safeStartApp() {
    if (window.__appStarted) {
      console.log('🔄 App ya iniciada, saltando reinicialización');
      return;
    }
    window.__appStarted = true;
    console.log('🚀 Iniciando app...');
    
    initMenu();
    setVH();
    
    // Llamar funciones externas si existen
    if (typeof ensurePromotionsSwiper === 'function') ensurePromotionsSwiper(false);
    if (typeof initFancybox === 'function') initFancybox();
    if (typeof addScrollEffects === 'function') addScrollEffects();
    if (typeof initModals === 'function') initModals();
    if (typeof initGAInteractions === 'function') initGAInteractions();
    
    console.log('✅ App iniciada correctamente');
  }
  
  // Event listeners principales
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      console.log('🔄 pageshow con BFCache, reinicializando');
      initMenu();
    }
  });
  
  window.addEventListener('pagehide', () => {
    menuController?.abort();
    setMenuState(false);
  });
  
  // Inicialización
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeStartApp);
  } else {
    safeStartApp();
  }
  
})();

// ============================================================================
// FUNCIONES AUXILIARES (fuera del IIFE principal)
// ============================================================================

// Asegurar que el carrusel esté inicializado/actualizado cuando sea visible
// __swiperWaitTimer declared at top to avoid TDZ
function ensurePromotionsSwiper(forceInit = false) {
    const container = document.querySelector('#promotions-carousel');
    if (typeof window.Swiper === 'undefined') {
        if (!__swiperWaitTimer) {
            __swiperWaitTimer = setInterval(() => {
                if (typeof window.Swiper !== 'undefined') {
                    clearInterval(__swiperWaitTimer);
                    __swiperWaitTimer = null;
                    ensurePromotionsSwiper(true);
                }
            }, 150);
        }
        return;
    }
    if (!container) return;

    // Destruir instancia previa completamente
    if (window.SR && window.SR.promotionsSwiper) {
        try {
            window.SR.promotionsSwiper.destroy(true, true);
        } catch (e) {
            console.warn('Error destroying Swiper:', e);
        }
        window.SR.promotionsSwiper = null;
    }

    // Limpiar dots huérfanos manualmente
    const oldPagination = container.querySelector('.swiper-pagination');
    if (oldPagination) oldPagination.innerHTML = '';

    // Validar visibilidad del contenedor
    if (container.offsetParent === null) {
        console.warn('Swiper container not visible yet, deferring init');
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                observer.disconnect();
                ensurePromotionsSwiper(true);
            }
        });
        observer.observe(container);
        return;
    }

    try {
        window.SR.promotionsSwiper = new window.Swiper(container, {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: false,
            grabCursor: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true
            },
            breakpoints: {
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            },
            on: {
                init() {
                    console.log('✅ Swiper inicializado correctamente');
                    this.pagination.render();
                    this.pagination.update();
                }
            }
        });
    } catch (error) {
        console.error('Error initializing Swiper:', error);
    }
}

// Inicializar Fancybox para galería de imágenes
function initFancybox() {
    if (typeof window.Fancybox === 'undefined') return;
    try {
        Fancybox.bind("[data-fancybox]", {
            animated: true,
            showClass: "fancybox-zoomIn",
            hideClass: "fancybox-zoomOut",
        });
    } catch {}
}

// Auto-resize y tracking para el iframe del formulario de Zoho
function initZohoFormIntegration() {
    const iframe = document.getElementById('zoho-form-iframe');
    if (!iframe) return;

    let lastHeight = 1000;
    const setHeight = (h) => {
        const height = Math.max(600, Math.min(3000, Number(h) || lastHeight));
        lastHeight = height;
        iframe.style.height = height + 'px';
    };

    window.addEventListener('message', (event) => {
        const data = event.data;
        if (!data || typeof data !== 'object') return;

        if (data.type === 'zohoForm:resize' && data.height) {
            setHeight(data.height);
        }

        if (data.type === 'zohoForm:submitted') {
            try {
                if (typeof gtag === 'function') {
                    gtag('event', 'generate_lead', {
                        method: 'zoho_form',
                        page_path: window.location.pathname + window.location.search
                    });
                }
            } catch {}
        }
    });

    setHeight(lastHeight);
}

// Efectos de scroll
function addScrollEffects() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    window.addEventListener('scroll', function() {
        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top <= windowHeight - 100) {
                el.classList.add('reveal-active');
            }
        });
    });
}

// Inicializar modales
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modalCloses = document.querySelectorAll('.modal-close');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('hidden');
                document.body.classList.add('overflow-hidden');
            }
        });
    });

    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            if (modal) {
                modal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        });
    });
}

// GA4: Medición de clics de contacto (WhatsApp, Email, Tel, Contactar)
function initGAInteractions() {
    const send = (name, params) => {
        try { if (typeof gtag === 'function') gtag('event', name, params || {}); } catch {}
    };

    document.addEventListener('click', (ev) => {
        const a = ev.target && ev.target.closest ? ev.target.closest('a') : null;
        if (!a) return;
        const href = (a.getAttribute('href') || '').trim();
        if (!href) return;

        const page = location.pathname + location.search;
        const common = { page_path: page, link_url: href };

        if (/wa\.me|api\.whatsapp\.com|whatsapp:\/\//i.test(href)) {
            send('contact', { method: 'whatsapp', ...common });
            return;
        }
        if (href.startsWith('mailto:')) {
            send('contact', { method: 'email', ...common });
            return;
        }
        if (href.startsWith('tel:')) {
            send('contact', { method: 'phone', ...common });
            return;
        }
        if (/contactar|contact|contact\.html/i.test(href)) {
            send('contact', { method: 'web_form', ...common });
            return;
        }
    });
}

console.log('✅ SR Global Experiences script loaded successfully');