// Guard anti-doble-toggle
let lastToggleTime = 0;
const DEBOUNCE_MS = 300;
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
    
    // 6. [REMOVIDO] gesturestart preventDefault - causaba conflictos con navegación
    // NO prevenir gestures - dejar comportamiento nativo del navegador
    
    // 7. Fix para scroll momentum en iOS + diagnóstico visual
    if (window.navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
        document.documentElement.style.webkitOverflowScrolling = 'touch';
    }
    
    // 8. Diagnóstico visual para debugging (solo en desarrollo)
    window.debugMenuPosition = function() {
        const btn = document.querySelector('#menu-toggle');
        if (!btn) return console.error('Menu toggle not found');
        
        const r = btn.getBoundingClientRect();
        const x = r.left + r.width / 2, y = r.top + r.height / 2;
        const el = document.elementFromPoint(x, y);
        
        console.log('=== DIAGNÓSTICO MENÚ ===');
        console.log('Botón:', btn);
        console.log('Rectángulo:', r);
        console.log('Centro del botón:', {x, y});
        console.log('Elemento superior:', el);
        console.log('¿Es el botón?', el === btn);
        console.log('Z-index del botón:', getComputedStyle(btn).zIndex);
        console.log('Z-index del elemento superior:', el ? getComputedStyle(el).zIndex : 'N/A');
        
        if (el !== btn) {
            console.warn('⚠️ PROBLEMA: Hay algo tapando el botón del menú');
            console.log('Elemento que tapa:', el);
            console.log('Clases del elemento:', el?.className);
        }
    };
    
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

// Evitar doble inicialización
window.__appStarted = window.__appStarted || false;

function startApp() {
    if (window.__appStarted) return;
    window.__appStarted = true;

    console.log('🚀 Iniciando aplicación...');
    
    // Inicializar funcionalidades
    initFancybox();
    addScrollEffects();
    initModals();
    watchCarouselVisibility();
    // Intento inicial del carrusel (solo se creará si es visible)
    try { initSwiper(); } catch {}

    // Integraciones de Zoho (iframe): auto-resize y tracking
    initZohoFormIntegration();
    initGAInteractions();
    
    console.log('✅ Aplicación iniciada exitosamente');
}

// Arranque seguro y robusto para todos los dispositivos, especialmente iOS
function safeStartApp() {
    // Verificar que el DOM esté completamente listo
    if (document.readyState !== 'complete' && document.readyState !== 'interactive') {
        console.log('DOM not ready, waiting...');
        return false;
    }
    
    // Verificar que las dependencias básicas estén disponibles
    if (typeof document.querySelector !== 'function') {
        console.warn('Basic DOM methods not available');
        return false;
    }
    
    try {
        startApp();
        return true;
    } catch (e) {
        console.error('Error starting app:', e);
        // Reintentar después de un delay
        setTimeout(function() {
            try {
                startApp();
            } catch (e2) {
                console.error('Second attempt failed:', e2);
            }
        }, 1000);
        return false;
    }
}

// Múltiples estrategias de inicialización para máxima compatibilidad iOS
console.log('🔍 Script cargado. Estado DOM:', document.readyState);

// IIFE Principal - NUEVO SISTEMA ROBUSTO
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
    
    if (!btn || !panel) return;
    
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    panel.hidden = !isOpen;
    document.body.classList.toggle('overflow-hidden', isOpen);
    document.body.classList.toggle('touch-none', isOpen);
    if (overlay) overlay.classList.toggle('hidden', !isOpen);
    
    // Cambiar ícono del botón
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = isOpen ? 'fas fa-times text-2xl' : 'fas fa-bars text-2xl';
    }
    
    console.log(isOpen ? '✅ Menú abierto' : '✅ Menú cerrado');
  }
  
  function initMenu() {
    // Abortar listeners previos para evitar duplicados
    if (menuController) {
      menuController.abort();
    }
    menuController = new AbortController();
    const { signal } = menuController;
    
    // Listener 1: Para botón hamburguesa, X y overlay (NO para links)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-menu-toggle]');
      const closeBtn = e.target.closest('[data-menu-close]');
      const overlay = e.target.closest('[data-menu-overlay]');
      
      if (btn) {
        e.preventDefault();
        e.stopPropagation(); // evita bubbling
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
        console.log('🔴 Cerrando por overlay');
        setMenuState(false);
      }
    }, { capture: true, signal });
    
    // Listener 2: SEPARADO para enlaces (sin preventDefault)
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-menu-panel] a[href]');
      if (link) {
        console.log('🔗 Navegando a:', link.href);
        // Cerrar el menú pero PERMITIR la navegación
        setMenuState(false);
        // NO hacer e.preventDefault() - dejar que el navegador navegue
      }
    }, { signal }); // SIN capture: true aquí
    
    // Cerrar con Escape
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
    
    // Clic fuera del menú (mejorado)
    document.addEventListener('click', (e) => {
      const panel = document.querySelector('[data-menu-panel]');
      const btn = document.querySelector('[data-menu-toggle]');
      const isOpen = btn?.getAttribute('aria-expanded') === 'true';
      
      if (!isOpen) return;
      
      // Ignorar si es un link (ya lo manejamos arriba)
      if (e.target.closest('[data-menu-panel] a[href]')) return;
      
      const clickedInside = panel?.contains(e.target) || btn?.contains(e.target);
      if (!clickedInside && !e.target.closest('[data-menu-overlay]')) {
        console.log('🔴 Cerrando por clic fuera');
        setMenuState(false);
      }
    }, { capture: true, signal });
  }
      
      if (!isOpen) return;
      
      const clickedInside = panel?.contains(e.target) || btn?.contains(e.target);
      if (!clickedInside && !e.target.closest('[data-menu-overlay]')) {
        console.log('🔴 Cerrando por clic fuera');
        setMenuState(false);
      }
    }, { capture: true, signal });
  }

// Inicialización robusta con debugging
if (document.readyState === 'loading') {
    console.log('🔄 DOM cargando, esperando DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', function() {
        console.log('✅ DOMContentLoaded disparado');
        setVH();
        initMenu();
        safeStartApp();
    }, { once: true });
} else {
    console.log('✅ DOM ya listo, inicializando inmediatamente');
    setTimeout(function() {
        setVH();
        initMenu(); 
        safeStartApp();
    }, 0);
}

// Fallback adicional para iOS: también escuchar el evento load
window.addEventListener('load', function() {
    console.log('🔄 Load event disparado');
    if (!window.__appStarted) {
        console.log('⚠️ App no había iniciado, iniciando ahora...');
        setTimeout(function() {
            setVH();
            initMenu();
            safeStartApp();
        }, 200);
    }
}, { once: true });

// CRÍTICO: Manejar bfcache de iOS Safari - el menú móvil no se inicializa en pageshow
window.addEventListener('pageshow', function(event) {
    console.log('🔄 pageshow event fired, persisted:', event.persisted);
    
    // Si la página viene de bfcache (navegación back/forward en iOS)
    if (event.persisted) {
        console.log('🔄 Page restored from bfcache, reinitializing...');
        
        setTimeout(function() {
            setVH();
            initMenu(); // reinicializar menú
            
            // Aplicar hotfix de overlays después del bfcache
            document.querySelectorAll('.overlay, .hero::before, .banner-overlay').forEach(el => {
                const cs = getComputedStyle(el);
                if (cs.opacity === '0' || cs.visibility === 'hidden')
                    el.style.pointerEvents = 'none';
            });
        }, 100);
    } else {
        // Primera carga o reload completo
        console.log('🔄 Primera carga de página');
        if (!window.__appStarted) {
            setTimeout(function() {
                setVH();
                initMenu();
                safeStartApp();
            }, 100);
        }
    }
});

// Fallback final: forzar inicio después de 3 segundos si nada más funcionó
setTimeout(function() {
    if (!window.__appStarted) {
        console.warn('🚨 FORCING app initialization after timeout');
        setVH();
        initMenu();
        safeStartApp();
    }
}, 3000);

// ============================================================================
// FUNCIONES AUXILIARES (fuera del IIFE principal)
// ============================================================================

// Inicializar Fancybox para galería de imágenes
function initFancybox() {
    if (typeof window.Fancybox === 'undefined') return;
    try {
        Fancybox.bind("[data-fancybox]", {
            // Opciones de configuración
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

    // Ajuste inicial por si el contenido tarda
    let lastHeight = 1000;
    const setHeight = (h) => {
        const height = Math.max(600, Math.min(3000, Number(h) || lastHeight));
        lastHeight = height;
        iframe.style.height = height + 'px';
    };

    // Listener para mensajes postMessage desde la página embebida
    window.addEventListener('message', (event) => {
        // Aceptamos mensajes solo de la misma origin (misma web) o sin origin (algunos navegadores file://)
        // y con un payload esperado
        const data = event.data;
        if (!data || typeof data !== 'object') return;

        // Resize
        if (data.type === 'zohoForm:resize' && data.height) {
            setHeight(data.height);
        }

        // Envío exitoso del formulario
        if (data.type === 'zohoForm:submitted') {
            try {
                if (typeof gtag === 'function') {
                    gtag('event', 'generate_lead', {
                        method: 'zoho_form',
                        event_category: 'lead',
                        event_label: 'contact_form',
                        value: 1
                    });
                }
            } catch {}
        }
    });

    // Intento de solicitar altura periódicamente (fallback)
    const ping = () => {
        try { iframe.contentWindow && iframe.contentWindow.postMessage({ type: 'parent:requestHeight' }, '*'); } catch {}
    };
    const interval = setInterval(ping, 1500);
    // Detener si el iframe se elimina
    const obs = new MutationObserver(() => { if (!document.body.contains(iframe)) { clearInterval(interval); obs.disconnect(); } });
    obs.observe(document.body, { childList: true, subtree: true });
}

// GA4: Medición de clics de contacto (WhatsApp, Email, Tel, Contactar)
function initGAInteractions() {
    // Helper seguro para enviar eventos
    const send = (name, params) => {
        try { if (typeof gtag === 'function') gtag('event', name, params || {}); } catch {}
    };

    // Clics en enlaces relevantes
    document.addEventListener('click', (ev) => {
        const a = ev.target && ev.target.closest ? ev.target.closest('a') : null;
        if (!a) return;
        const href = (a.getAttribute('href') || '').trim();
        if (!href) return;

        const page = location.pathname + location.search;
        const common = { page_path: page, link_url: href };

        // WhatsApp
        if (/wa\.me|api\.whatsapp\.com|whatsapp:\/\//i.test(href)) {
            send('contact', { method: 'whatsapp', ...common });
            return;
        }
        // Email
        if (href.startsWith('mailto:')) {
            send('contact', { method: 'email', ...common });
            return;
        }
        // Teléfono
        if (href.startsWith('tel:')) {
            send('contact', { method: 'phone', ...common });
            return;
        }
        // Botón Contactar / navegación a contact.html
        const isContactBtn = a.matches('[data-lang-key="navContactBtn"]');
        const goesToContact = /contact\.html(\?|#|$)/i.test(href);
        if (isContactBtn || goesToContact) {
            send('contact', { method: isContactBtn ? 'contact_button' : 'contact_page_link', ...common });
        }
    }, true);
}

// Sistema de cambio de idioma eliminado: sitio en Español únicamente

// Efectos de desplazamiento
function addScrollEffects() {
    // Efecto para la barra de navegación
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('py-2');
            navbar.classList.remove('py-3');
        } else {
            navbar.classList.add('py-3');
            navbar.classList.remove('py-2');
        }
    });

    // Animación de entrada para elementos cuando son visibles
    const animatedElements = document.querySelectorAll('.destination-circle, .service-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// Funcionalidad para los modales de experiencias
function initModals() {
    // Abrir modales
    document.querySelectorAll('.open-modal').forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            document.getElementById(modalId).classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevenir scroll en el fondo
        });
    });

    // Cerrar modales
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('[id$="-modal"]').classList.add('hidden');
            document.body.style.overflow = ''; // Restaurar scroll
        });
    });

    // Cerrar modal haciendo clic fuera del contenido
    document.querySelectorAll('[id$="-modal"]').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    });

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('[id$="-modal"]').forEach(modal => {
                if (!modal.classList.contains('hidden')) {
                    modal.classList.add('hidden');
                    document.body.style.overflow = '';
                }
            });
        }
    });
}

// initModals ya se ejecuta dentro de startApp()

// ==============================================================================
// MENÚ HAMBURGUESA MÓVIL - REFACTORIZADO (Simplificado y Funcional)
// ==============================================================================
// VERSIÓN ANTERIOR COMENTADA - VER GIT HISTORY SI NECESARIO
// Problemas encontrados en versión anterior:
// - preventDefault/stopPropagation en toggle causaba conflictos
// - Clonación de nodos (anti-pattern)
// - Overlay innecesario
// - Múltiples eventos touch redundantes
// - Gestión de overflow: hidden problemática
// ==============================================================================

  
  
  // ============================================================================
  // SWIPER MANAGEMENT
  // ============================================================================
  
  // Asegurar que el carrusel esté inicializado/actualizado cuando sea visible
  let __swiperWaitTimer = null;
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

  // Inicializar Swiper para carruseles (si está visible o forzando)
  function initSwiper() {
    // No forzar en carga inicial; se hará al ser visible o al activar la página
    ensurePromotionsSwiper(false);
  }
  
  // ============================================================================
  // MODALS & GA INTERACTIONS (placeholder functions)
  // ============================================================================
  
  function initModals() {
    // Esta función ya existe más abajo, placeholder aquí
    return;
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
    initSwiper();
    setVH();
    
    // Llamar funciones externas si existen
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
      initMenu(); // reinicializar menú
      initSwiper();
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

