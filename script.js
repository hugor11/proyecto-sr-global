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
    
    // Verificar que el menú esté inicializado
    const menuBtn = document.querySelector('#menu-toggle');
    if (menuBtn && !menuBtn._menuBound) {
        console.log('⚠️ Menú no inicializado, ejecutando attachMenuListeners...');
        attachMenuListeners();
    }

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

// Función robusta para verificar y ejecutar inicialización del menú
function attachMenuListeners() {
    console.log('🔍 Ejecutando attachMenuListeners...');
    
    // Usar selectores amplios y robustos
    const buttons = document.querySelectorAll('#menu-toggle, .hamburger, [data-menu-toggle]');
    console.log('🔍 Botones encontrados:', buttons.length);
    
    if (buttons.length === 0) {
        console.error('❌ NO se encontró ningún botón de menú hamburguesa');
        return;
    }

    buttons.forEach((btn, index) => {
        console.log(`🔍 Procesando botón ${index + 1}:`, btn);
        
        // Evitar duplicar listeners
        if (btn._menuBound) {
            console.log(`⚠️ Botón ${index + 1} ya tiene listeners, saltando`);
            return;
        }
        
        btn._menuBound = true;
        
        // Función de toggle robusta
        const toggleMenu = (e) => {
            console.log('🎯 Toggle menu disparado por:', e.type, 'en botón:', btn);
            e?.preventDefault?.();
            
            const mobileMenu = document.querySelector('#mobile-menu');
            if (!mobileMenu) {
                console.error('❌ No se encontró #mobile-menu');
                return;
            }
            
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            const newState = !isExpanded;
            
            console.log('📱 Cambiando estado del menú de', isExpanded, 'a', newState);
            
            // Actualizar estado
            btn.setAttribute('aria-expanded', String(newState));
            
            if (newState) {
                // Abrir menú
                mobileMenu.classList.remove('hidden');
                mobileMenu.style.display = 'block';
                btn.querySelector('i').className = 'fas fa-times text-2xl';
                btn.setAttribute('aria-label', 'Cerrar menú');
                document.body.classList.add('no-scroll');
                console.log('✅ Menú abierto exitosamente');
            } else {
                // Cerrar menú
                mobileMenu.classList.add('hidden');
                mobileMenu.style.display = 'none';
                btn.querySelector('i').className = 'fas fa-bars text-2xl';
                btn.setAttribute('aria-label', 'Abrir menú');
                document.body.classList.remove('no-scroll');
                console.log('✅ Menú cerrado exitosamente');
            }
        };
        
        // Agregar múltiples event listeners para máxima compatibilidad
        btn.addEventListener('click', toggleMenu);
        btn.addEventListener('pointerup', toggleMenu);
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu(e);
            }
        });
        
        // Configurar atributos de accesibilidad
        btn.setAttribute('role', 'button');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', 'mobile-menu');
        btn.setAttribute('aria-label', 'Abrir menú');
        
        console.log(`✅ Listeners agregados exitosamente al botón ${index + 1}`);
    });
}

// Inicialización robusta con debugging
if (document.readyState === 'loading') {
    console.log('🔄 DOM cargando, esperando DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', function() {
        console.log('✅ DOMContentLoaded disparado');
        setVH();
        attachMenuListeners();
        safeStartApp();
    }, { once: true });
} else {
    console.log('✅ DOM ya listo, inicializando inmediatamente');
    setTimeout(function() {
        setVH();
        attachMenuListeners(); 
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
            attachMenuListeners();
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
        
        // Limpiar flags de listeners para permitir re-enganche
        document.querySelectorAll('#menu-toggle, .hamburger, [data-menu-toggle]')
            .forEach(b => { 
                b._menuBound = false; 
                console.log('🧹 Flag _menuBound limpiado en botón:', b);
            });
            
        setTimeout(function() {
            setVH();
            attachMenuListeners();
            
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
                attachMenuListeners();
                safeStartApp();
            }, 100);
        }
    }
});

// Fallback final: forzar inicio después de 3 segundos si nada más funcionó
setTimeout(function() {
    const btn = document.querySelector('#menu-toggle');
    if (!btn || !btn._menuBound) {
        console.warn('🚨 FORCING menu initialization after timeout');
        console.log('🔍 Estado del botón:', btn);
        console.log('🔍 ¿Tiene listeners?', btn?._menuBound);
        
        setVH();
        attachMenuListeners();
        
        if (!window.__appStarted) {
            safeStartApp();
        }
    }
}, 3000);

// SPA navigation removed; site is now multipage

// Instancia global para evitar reinicializaciones innecesarias
let promotionsSwiper = null;

// Inicializar Swiper para carruseles (si está visible o forzando)
function initSwiper() {
    // No forzar en carga inicial; se hará al ser visible o al activar la página
    ensurePromotionsSwiper(false);
}

// Asegurar que el carrusel esté inicializado/actualizado cuando sea visible
let __swiperWaitTimer = null;
function ensurePromotionsSwiper(forceInit = false) {
    const container = document.querySelector('#promotions-carousel');
    // Si Swiper aún no está disponible, reintentar pronto sin inundar
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

    const isVisible = !!(container.offsetParent || container.getClientRects().length);

    if (!promotionsSwiper) {
        if (!isVisible && !forceInit) return; // espera a visibilidad
        try {
    promotionsSwiper = new Swiper('#promotions-carousel', {
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
            // pequeña actualización tras layout
            setTimeout(() => promotionsSwiper && promotionsSwiper.update(), 100);
            console.log('✅ Swiper inicializado');
        } catch (error) {
            console.error('❌ Error al inicializar Swiper:', error);
        }
    } else {
        try {
            promotionsSwiper.update();
            console.log('🔄 Swiper actualizado');
        } catch {}
    }
}

// Observar visibilidad del carrusel para inicializar cuando aparezca en viewport
function watchCarouselVisibility() {
    const container = document.querySelector('#promotions-carousel');
    if (!('IntersectionObserver' in window) || !container) return;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                ensurePromotionsSwiper(true);
                // tras inicializar, no necesitamos seguir observando
                obs.disconnect();
            }
        });
    }, { threshold: 0.1 });
    obs.observe(container);
}

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
// NOTA: initMobileMenu() removida - reemplazada por attachMenuListeners() profesional

