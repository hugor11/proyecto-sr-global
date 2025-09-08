// SR Global Experiences - Script Principal

// Evitar doble inicialización
window.__appStarted = window.__appStarted || false;

function startApp() {
    if (window.__appStarted) return;
    window.__appStarted = true;

    // Inicializar funcionalidades
    initFancybox();
    initLanguageSwitcher();
    addScrollEffects();
    initModals();
    watchCarouselVisibility();
    // Intento inicial del carrusel (solo se creará si es visible)
    try { initSwiper(); } catch {}

    // Integraciones de Zoho (iframe): auto-resize y tracking
    initZohoFormIntegration();
    initGAInteractions();
}

// Arranque seguro, incluso si el script se carga después del DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    // DOM ya listo
    startApp();
}

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

// Sistema de cambio de idioma
function switchLanguage(lang) {
    // Nueva guarda idempotente basada en un sentinel propio, no en <html lang>
    if (window.__lastAppliedLanguage === lang) {
        // Aseguramos que los enlaces mantengan el parámetro aunque no volvamos a traducir
        applyLangToLinks(lang);
        return;
    }
    // Objeto con traducciones
    const translations = {
        es: {
            'pageTitle': 'SR Global Experiences - Diseñamos Tu Viaje Perfecto',
            'metaDescription': 'Descubre tours y experiencias únicas en Riviera Maya y el mundo. Agencia de viajes human-first, itinerarios a medida y soporte 24/7. Cotiza hoy.',
            'titlePromotions': 'Promociones | SR Global Experiences',
            'titleExperiences': 'Experiencias | SR Global Experiences',
            'titleRomance': 'Viajes de Romance | SR Global Experiences',
            'titleDestinations': 'Destinos | SR Global Experiences',
            'titleGroups': 'Grupos y Convenciones | SR Global Experiences',
            'titleAbout': 'Nosotros | SR Global Experiences',
            'titleContact': 'Contacto | SR Global Experiences',
            'metaPromotions': 'Promociones de viajes y tours. Ofertas del mes y paquetes personalizados con atención 24/7.',
            'metaExperiences': 'Experiencias únicas: tours, viajes y aventuras personalizadas por SR Global Experiences.',
            'metaRomance': 'Bodas destino, lunas de miel y escapadas románticas organizadas por SR Global Experiences.',
            'metaDestinations': 'Descubre destinos imperdibles alrededor del mundo con SR Global Experiences.',
            'metaGroups': 'MICE, grupos y convenciones con logística integral y experiencias a medida.',
            'metaAbout': 'Conoce nuestra historia, misión, visión y valores: SR Global Experiences.',
            'metaContact': 'Contacto: correo, teléfono, WhatsApp y formulario. Estamos listos para ayudarte 24/7.',
            'navHome': 'Inicio',
            'navPromotions': 'Promociones',
            'navExperiences': 'Experiencias',
            'navGroups': 'Grupos y Convenciones',
            'navAbout': 'Nosotros',
            'navContactBtn': 'Contactar',
            'navRomance': 'Romance',
            'navDestinations': 'Destinos',
            'heroTitle': 'Riviera Maya',
            'heroSubtitle': 'Reserva Nuestros Tours',
            'heroDescription': 'Creamos experiencias inolvidables con un servicio <span class="font-bold">human-first</span>. Tu tranquilidad es nuestro destino.',
            'missionTitle': 'Nuestra Misión',
            'missionDesc': 'Convertir sueños en experiencias de viaje inolvidables.',
            'visionTitle': 'Nuestra Visión',
            'visionDesc': 'Crear historias únicas que inspiren, emocionen, conecten y permanezcan en la memoria de cada viajero.',
            'valueTitle': 'Valores',
            'valueDesc': 'Pasión por viajar, excelencia en el servicio, creatividad sin límites, confianza y seguridad.',
            'exploreWorldTitle': 'FORMAS DE EXPLORAR EL MUNDO',
            'exploreWorldDesc': 'Cada momento especial merece una experiencia única. Descubre nuestras propuestas personalizadas para cada etapa de tu vida.',
            'honeymoonTitle': 'Lunas de Miel',
            'honeymoonDesc': 'Comenzad vuestra historia juntos con un viaje tan especial como vuestro amor. Creamos experiencias románticas a medida que recordaréis toda la vida.',
            'honeymoonBtn': 'Descubrir más',
            'bachelorTitle': 'Despedidas',
            'bachelorDesc': 'Celebra tu última aventura de soltero/a con experiencias inolvidables. Diversión, aventura y momentos especiales con tus amigos antes del gran día.',
            'bachelorBtn': 'Ver opciones',
            'anniversaryTitle': 'Aniversarios',
            'anniversaryDesc': 'Renovad vuestros votos y celebrad vuestro amor con experiencias diseñadas para conmemorar cada año juntos de manera especial.',
            'anniversaryBtn': 'Explorar ideas',
            'honeymoonModalTitle': 'Experiencias para Lunas de Miel',
            'honeymoonModalDesc1': 'Cada luna de miel merece ser tan única como vuestra historia de amor. Nuestros expertos en diseño de viajes románticos os ayudarán a crear momentos inolvidables:',
            'honeymoonPoint1': 'Destinos románticos seleccionados especialmente para parejas',
            'honeymoonPoint2': 'Alojamientos exclusivos con detalles especiales para recién casados',
            'honeymoonPoint3': 'Experiencias privadas: cenas a la luz de las velas, masajes en pareja, paseos al atardecer',
            'honeymoonPoint4': 'Fotografía profesional para capturar vuestros momentos más especiales',
            'honeymoonModalDesc2': 'Contáctanos y cuéntanos cómo imaginas tu luna de miel perfecta. Nos encargaremos de cada detalle para que solo tengáis que disfrutar.',
            'bachelorModalTitle': 'Experiencias para Despedidas',
            'bachelorModalDesc1': 'La última aventura antes del "Sí, quiero" debe ser tan especial como divertida. Organizamos despedidas de soltero/a memorables:',
            'bachelorPoint1': 'Actividades adaptadas a tus gustos: aventura, relax, fiestas o un mix de todo',
            'bachelorPoint2': 'Opciones para todos los presupuestos y tamaños de grupo',
            'bachelorPoint3': 'Experiencias en la Riviera Maya: catamarán privado, cenotes exclusivos, fiestas temáticas',
            'bachelorPoint4': 'Organización completa de alojamiento, transporte y actividades',
            'bachelorModalDesc2': 'Nos encargamos de todo para que tú y tus amigos solo tengáis que disfrutar de la celebración.',
            'anniversaryModalTitle': 'Experiencias para Aniversarios',
            'anniversaryModalDesc1': 'Celebrad cada año de amor con una experiencia memorable. Os ayudamos a conmemorar vuestro aniversario de forma especial:',
            'anniversaryPoint1': 'Renovación de votos en escenarios paradisíacos: playa, cenote o jardín',
            'anniversaryPoint2': 'Escapadas románticas diseñadas según los años que celebráis',
            'anniversaryPoint3': 'Experiencias exclusivas: cena privada con chef, spa para parejas, tours fotográficos',
            'anniversaryPoint4': 'Detalles personalizados que reflejen vuestra historia de amor',
            'anniversaryModalDesc2': 'Cada año juntos es un tesoro que merece una celebración única. Déjanos ayudarte a crear recuerdos inolvidables.',
            'contactWhatsapp': 'Contactar por WhatsApp',
            'contactEmail': 'Enviar Email',
            'contactForm': 'Ir al Formulario Completo',
            'contactRedirectTitle': 'Formulario de Contacto',
            'contactRedirectDesc': 'Para contactarnos, completa nuestro formulario en la página de contacto.',
            'contactRedirectBtn': 'Ir al formulario',
            'contactTitle': 'Contáctanos',

            // About page
            'aboutWhoTitle': '¿QUIÉNES SOMOS?',
            'aboutHistoryTitle': 'Nuestra Historia',
            'aboutHistoryP1': 'Agentes de viaje apasionados por la organización de eventos, una profunda fascinación por los viajes y creadores de experiencias personalizadas en México y el mundo.',
            'aboutHistoryP2': 'SR Global Experiences nació por la pasión en conectar personas y crear experiencias extraordinarias.',
            'aboutHistoryQuote': '"Te ofrecemos un servicio integral y personalizado para hacer realidad tus sueños."',
            'aboutGuaranteeTitle': 'Satisfacción Garantizada',
            'aboutGuaranteeDesc': 'Nos comprometemos a superar tus expectativas en cada experiencia que diseñamos.',
            'aboutExcellenceTitle': 'Compromiso con la Excelencia',
            'aboutExcellenceDesc': 'Cada viaje es una oportunidad para superar expectativas y crear momentos inolvidables.',
            'aboutMissionTitle': 'Misión:',
            'aboutMissionDesc': 'Convertir sueños en experiencias de viaje inolvidables.',
            'aboutVisionTitle': 'Visión:',
            'aboutVisionDesc': 'Crear historias únicas que inspiren, emocionen, conecten y permanezcan en la memoria de cada viajero.',
            'aboutValuesTitle': 'Valores:',
            'aboutValue1': 'Pasión por viajar',
            'aboutValue2': 'Excelencia en el servicio',
            'aboutValue3': 'Creatividad sin límites',
            'aboutValue4': 'Confianza y seguridad',
            'aboutWhyTitle': '¿Por qué elegir <span class="text-[#009688]">SR Global Experiences</span>?',
            'aboutWhyServiceTitle': 'Servicio Personalizado',
            'aboutWhyServiceDesc': 'Cada itinerario se diseña específicamente para ti, adaptándose a tus preferencias y necesidades.',
            'aboutWhySupportTitle': 'Atención 24/7',
            'aboutWhySupportDesc': 'Estamos disponibles para ti en cualquier momento durante tu viaje para resolver cualquier situación.',
            'aboutWhyExclusiveTitle': 'Experiencias Exclusivas',
            'aboutWhyExclusiveDesc': 'Acceso a experiencias únicas y destinos que no encontrarás en paquetes turísticos convencionales.',
            'aboutCtaTitle': '¿Te gustaría trabajar con nosotros?',
            'aboutCtaDesc': 'Permítenos ayudarte a crear experiencias inolvidables. Nuestro equipo está listo para diseñar tu próximo viaje soñado.',
            'aboutCtaButton': 'Contactar Ahora',

            // Comunes - footer
            'footerTitle': 'Empieza a Soñar',
            'footerSubtitle': 'y déjate llevar por un mundo de posibilidades.',
            'footerWhatsapp': 'Chatear por WhatsApp',
            'footerEmail': 'Enviar un Correo',
            'footerCopyright': 'SR Global Experiences &copy; 2025. Diseñado con ❤️ para crear experiencias inolvidables.',

            // Inicio / promociones
            'destinationsTitle': 'Destinos que Enamoran',
            'promotionsTitle': '🔥 Promociones Imperdibles del Mes 🔥',
            'askForPackages': '¡Pregunta por nuestros paquetes!',
            'askForPackages2': '¡Pregunta por nuestros paquetes!',
            'askForPackages3': '¡Pregunta por nuestros paquetes!',
            'askForPackages4': '¡Pregunta por nuestros paquetes!',
            'askForPackages5': '¡Pregunta por nuestros paquetes!',
            'askForPackages6': '¡Pregunta por nuestros paquetes!',
            'moreInfo': 'Más Información',
            'moreInfo2': 'Más Información',
            'moreInfo3': 'Más Información',
            'moreInfo4': 'Más Información',
            'moreInfo5': 'Más Información',
            'moreInfo6': 'Más Información',
            'promoDisney': 'Viaja a Disney',
            'promoJordan': 'Jordania y Egipto',

            // Arquitectos
            'architectsTitle': 'Arquitectos de Viajes',
            'architectsDescription': 'Vamos más allá de lo predeterminado. Nos especializamos en crear momentos a medida que se convierten en los mejores recuerdos.',
            'architectsCard1Title': 'Turismo Culinario',
            'architectsCard1Desc': 'Momento Creado: Cena privada con chef en la orilla de un cenote.',
            'architectsCard2Title': 'Retiros de Bienestar',
            'architectsCard2Desc': 'Momento Creado: Sesión de yoga al amanecer seguida de una ceremonia de temazcal.',
            'architectsCard3Title': 'Eventos Inolvidables',
            'architectsCard3Desc': 'Momento Creado: Tu evento en espacios impensables, como cenotes o playas vírgenes.',
            'architectsCard4Title': 'Viajes en Grupo',
            'architectsCard4Desc': 'Momento Creado: La escapada perfecta con tu familia o amigos, totalmente organizada.',

            // MICE / Grupos
            'miceTitle': 'Tu Aliado Estratégico en Eventos Corporativos (MICE)',
            'miceDescription': 'Organizar un evento corporativo, de incentivo o una convención es complejo. Nos convertimos en tu socio estratégico, manejando toda la logística para que tú te enfoques en los objetivos de tu empresa.',
            'micePoint1': '<b>Gestión Integral:</b> Desde la conceptualización hasta la ejecución, cubrimos cada detalle.',
            'micePoint2': '<b>Locaciones Exclusivas:</b> Acceso a salones, hoteles y espacios únicos para causar impacto.',
            'micePoint3': '<b>Logística Impecable:</b> Coordinación de vuelos, traslados, alojamiento y tecnología.',
            'micePoint4': '<b>Actividades de Team Building:</b> Experiencias diseñadas para fortalecer equipos e inspirar conexiones.',
            'miceButton': 'Cotizar Mi Evento',

            // Contacto bloques
            'contactDesc': '¿Listo para comenzar tu próxima aventura? Estamos aquí para crear una experiencia inolvidable personalizada para ti.',
            'contactSubtitle': 'Cuéntanos tu idea; diseñamos tu experiencia a la medida, con atención 24/7.',
        },
        en: {
            'pageTitle': 'SR Global Experiences - We Design Your Perfect Trip',
            'metaDescription': 'Discover unique tours and experiences in the Riviera Maya and worldwide. Human-first travel agency, custom itineraries and 24/7 support. Request a quote.',
            'titlePromotions': 'Promotions | SR Global Experiences',
            'titleExperiences': 'Experiences | SR Global Experiences',
            'titleRomance': 'Romance Travel | SR Global Experiences',
            'titleDestinations': 'Destinations | SR Global Experiences',
            'titleGroups': 'Groups & Conventions | SR Global Experiences',
            'titleAbout': 'About Us | SR Global Experiences',
            'titleContact': 'Contact | SR Global Experiences',
            'metaPromotions': 'Travel promotions and tours. Monthly deals and custom packages with 24/7 support.',
            'metaExperiences': 'Unique experiences: tours, trips and tailor-made adventures by SR Global Experiences.',
            'metaRomance': 'Destination weddings, honeymoons and romantic getaways organized by SR Global Experiences.',
            'metaDestinations': 'Discover must-see destinations around the world with SR Global Experiences.',
            'metaGroups': 'MICE, groups and conventions with end-to-end logistics and tailored experiences.',
            'metaAbout': 'Learn about our story, mission, vision and values at SR Global Experiences.',
            'metaContact': 'Contact us: email, phone, WhatsApp and contact form. We’re here to help 24/7.',
            'navHome': 'Home',
            'navPromotions': 'Promotions',
            'navExperiences': 'Experiences',
            'navGroups': 'Groups & Conventions',
            'navAbout': 'About Us',
            'navContactBtn': 'Contact',
            'navRomance': 'Romance',
            'navDestinations': 'Destinations',
            'heroTitle': 'Riviera Maya',
            'heroSubtitle': 'Book Our Tours',
            'heroDescription': 'We create unforgettable experiences with a <span class="font-bold">human-first</span> service. Your peace of mind is our destination.',
            'missionTitle': 'Our Mission',
            'missionDesc': 'Turn dreams into unforgettable travel experiences.',
            'visionTitle': 'Our Vision',
            'visionDesc': 'Create unique stories that inspire, excite, connect, and remain in the memory of each traveler.',
            'valueTitle': 'Values',
            'valueDesc': 'Passion for travel, excellence in service, limitless creativity, trust and security.',
            'exploreWorldTitle': 'WAYS TO EXPLORE THE WORLD',
            'exploreWorldDesc': 'Every special moment deserves a unique experience. Discover our personalized proposals for each stage of your life.',
            'honeymoonTitle': 'Honeymoons',
            'honeymoonDesc': 'Begin your story together with a trip as special as your love. We create custom romantic experiences you\'ll remember for a lifetime.',
            'honeymoonBtn': 'Discover more',
            'bachelorTitle': 'Bachelor Parties',
            'bachelorDesc': 'Celebrate your last adventure as a single with unforgettable experiences. Fun, adventure, and special moments with your friends before the big day.',
            'bachelorBtn': 'See options',
            'anniversaryTitle': 'Anniversaries',
            'anniversaryDesc': 'Renew your vows and celebrate your love with experiences designed to commemorate each year together in a special way.',
            'anniversaryBtn': 'Explore ideas',
            'honeymoonModalTitle': 'Honeymoon Experiences',
            'honeymoonModalDesc1': 'Every honeymoon deserves to be as unique as your love story. Our romantic travel design experts will help you create unforgettable moments:',
            'honeymoonPoint1': 'Romantic destinations specially selected for couples',
            'honeymoonPoint2': 'Exclusive accommodations with special details for newlyweds',
            'honeymoonPoint3': 'Private experiences: candlelit dinners, couples massages, sunset walks',
            'honeymoonPoint4': 'Professional photography to capture your most special moments',
            'honeymoonModalDesc2': 'Contact us and tell us how you imagine your perfect honeymoon. We\'ll take care of every detail so you can just enjoy.',
            'bachelorModalTitle': 'Bachelor Party Experiences',
            'bachelorModalDesc1': 'The last adventure before saying "I do" should be as special as it is fun. We organize memorable bachelor/bachelorette parties:',
            'bachelorPoint1': 'Activities tailored to your tastes: adventure, relaxation, parties, or a mix of everything',
            'bachelorPoint2': 'Options for all budgets and group sizes',
            'bachelorPoint3': 'Riviera Maya experiences: private catamaran, exclusive cenotes, themed parties',
            'bachelorPoint4': 'Complete organization of accommodation, transportation, and activities',
            'bachelorModalDesc2': 'We take care of everything so that you and your friends can just enjoy the celebration.',
            'anniversaryModalTitle': 'Anniversary Experiences',
            'anniversaryModalDesc1': 'Celebrate each year of love with a memorable experience. We help you commemorate your anniversary in a special way:',
            'anniversaryPoint1': 'Vow renewal in paradisiacal settings: beach, cenote, or garden',
            'anniversaryPoint2': 'Romantic getaways designed according to the years you\'re celebrating',
            'anniversaryPoint3': 'Exclusive experiences: private dinner with chef, couples spa, photo tours',
            'anniversaryPoint4': 'Personalized details that reflect your love story',
            'anniversaryModalDesc2': 'Each year together is a treasure that deserves a unique celebration. Let us help you create unforgettable memories.',
            'contactWhatsapp': 'Contact via WhatsApp',
            'contactEmail': 'Send Email',
            'contactForm': 'Go to Complete Form',
            'contactRedirectTitle': 'Contact Form',
            'contactRedirectDesc': 'To contact us, please complete our form on the contact page.',
            'contactRedirectBtn': 'Go to form',
            'contactTitle': 'Contact Us',

            // About page
            'aboutWhoTitle': 'WHO WE ARE',
            'aboutHistoryTitle': 'Our Story',
            'aboutHistoryP1': 'Travel agents passionate about event organization, deeply fascinated by travel, and creators of tailor‑made experiences in Mexico and around the world.',
            'aboutHistoryP2': 'SR Global Experiences was born from our passion for connecting people and crafting extraordinary experiences.',
            'aboutHistoryQuote': '"We offer a comprehensive and personalized service to make your dreams come true."',
            'aboutGuaranteeTitle': 'Satisfaction Guaranteed',
            'aboutGuaranteeDesc': 'We commit to exceeding your expectations in every experience we design.',
            'aboutExcellenceTitle': 'Commitment to Excellence',
            'aboutExcellenceDesc': 'Every trip is an opportunity to exceed expectations and create unforgettable moments.',
            'aboutMissionTitle': 'Mission:',
            'aboutMissionDesc': 'Turn dreams into unforgettable travel experiences.',
            'aboutVisionTitle': 'Vision:',
            'aboutVisionDesc': 'Create unique stories that inspire, excite, connect, and remain in every traveler’s memory.',
            'aboutValuesTitle': 'Values:',
            'aboutValue1': 'Passion for travel',
            'aboutValue2': 'Service excellence',
            'aboutValue3': 'Limitless creativity',
            'aboutValue4': 'Trust and security',
            'aboutWhyTitle': 'Why choose <span class="text-[#009688]">SR Global Experiences</span>?',
            'aboutWhyServiceTitle': 'Personalized Service',
            'aboutWhyServiceDesc': 'Each itinerary is designed specifically for you, tailored to your preferences and needs.',
            'aboutWhySupportTitle': '24/7 Support',
            'aboutWhySupportDesc': 'We’re available anytime during your trip to handle any situation.',
            'aboutWhyExclusiveTitle': 'Exclusive Experiences',
            'aboutWhyExclusiveDesc': 'Access to unique experiences and destinations beyond conventional tour packages.',
            'aboutCtaTitle': 'Would you like to work with us?',
            'aboutCtaDesc': 'Let us help you create unforgettable experiences. Our team is ready to design your next dream trip.',
            'aboutCtaButton': 'Contact Now',

            // Tours Include section
            'toursIncludeTitle': 'What\'s Included in Tours?',
            'toursInclude1': 'Round-trip transportation from hotels or central locations.',
            'toursInclude2': 'Food and drinks according to each tour\'s plan.',
            'toursInclude3': 'Certified bilingual guides.',
            'toursInclude4': 'Ferry, catamaran or boat to cross to the islands.',
            'toursInclude5': 'Snorkel equipment, life vests and park entries.',

            // Anti-frustration section
            'antidoteTitle': 'Your Anti-Frustration Antidote',
            'antidoteDescription': 'Planning a trip can be overwhelming. We eliminate the stress so you only worry about enjoying.',
            'service1Title': 'Personalized 24/7 Assistance',
            'service1Desc': 'Forget about bots. A real expert from our team will be available for you before, during and after your trip.',
            'service2Title': 'A Single Point of Contact',
            'service2Desc': 'You\'ll have a dedicated experience designer who knows every detail of your trip. No confusion or intermediaries.',
            'service3Title': 'Service Guarantee',
            'service3Desc': 'We obsess over perfection so your trip is flawless. Our guarantee is simple: in any eventuality, we act with an immediate solution.',

            // Global Services section
            'globalServicesTitle': 'Global Services',
            'globalServices1': 'National and international accommodations.',
            'globalServices2': 'Flights anywhere in Mexico and the world.',
            'globalServices3': 'Transportation and transfers at destination.',
            'globalServices4': 'Customized excursions and tours.',
            'globalServices5': '24/7 assistance throughout your trip.',

            // Romance - Romantic Destinations section
            'romanticDestinationsTitle': 'Preferred Romantic Destinations',
            'rivieraMayaTitle': 'Riviera Maya',
            'rivieraMayaDesc': 'White sand beaches and turquoise waters, the perfect setting for a romantic getaway with your partner. Enjoy moonlit dinners and exclusive experiences.',
            'parisEuropeTitle': 'Paris & Europe',
            'parisEuropeDesc': 'Immerse yourself in the history and romance of European cities. From Paris, the city of love, to the canals of Venice or the castles of Scotland.',
            'consultBtn': 'Consult',

            // Destinations page
            'mainDestinationsTitle': 'Our Main Destinations',
            'destinationsForYouTitle': 'Destinations we create for you',
            'destinationsForYouDesc': 'Explore our selection of carefully chosen destinations to offer you the best travel experiences. Each one designed with your needs and preferences in mind.',
            'mexicoMagicTitle': 'Magical Mexico: Riviera Maya',
            'mexicoMagicDesc': 'Paradisiacal beaches, mystical cenotes and fascinating Mayan culture.',
            'cruisesTitle': 'Unforgettable Cruises',
            'cruisesDesc': 'Experiences aboard the best cruises through the Caribbean, Mediterranean and more.',
            'themeParksTitle': 'Magic and Adventure in Theme Parks',
            'themeParksDesc': 'Guaranteed fun for the whole family at the world\'s most popular parks.',
            'europeTitle': 'Europe',
            'europeDesc': 'History, culture and stunning landscapes in the old continent.',
            'latinamericaTitle': 'Essential Latin America',
            'latinamericaDesc': 'Discover the rich culture, gastronomy and landscapes of our continent.',
            'usaTitle': 'United States',
            'usaDesc': 'Iconic cities, natural parks and unique experiences.',
            'readyExploreText': 'Ready to explore our destinations and create unforgettable memories?',
            'discoverDestinationsBtn': 'Discover all our destinations',
            'popularDestinationsTitle': 'Most Popular Destinations',
            'rivieraMayaCardDesc': 'Discover the natural, cultural and historical beauty of this Mexican paradise.',
            'caribbeanCruisesTitle': 'Caribbean Cruises',
            'caribbeanCruisesDesc': 'A unique experience visiting paradisiacal islands aboard a luxury cruise.',
            'disneyUniversalTitle': 'Disney World & Universal',
            'disneyUniversalDesc': 'Magic and fun for the whole family at the best theme parks.',
            'moreInfoBtn': 'More information',

            // Contact page
            'contactHeroTitle': 'Let\'s talk about your trip',
            'contactHeroSubtitle': 'Tell us your idea; we design your experience to measure, with 24/7 attention.',
            'sendRequestBtn': 'Send a request',
            'whatsappImmediateBtn': 'Immediate WhatsApp',
            'supportLabel': 'Support',
            'support24_7': '24/7 attention',
            'responseLabel': 'Response',
            'fastPersonalizedResponse': 'Fast and personalized',
            'securityLabel': 'Security',
            'protectedForm': 'Protected form',
            'contactDataTitle': 'Contact information',
            'emailLabel': 'Email',
            'phoneLabel': 'Phone',
            'chatWhatsappLink': 'Chat on WhatsApp',
            'scheduleLabel': 'Schedule',
            'businessHours': 'Mon to Sat: 9:00 – 18:00 (GMT-6)',
            'coverageLabel': 'Coverage',
            'coverageText': 'Mexico and the world',
            'followUsLabel': 'Follow us',
            'contactFormTitle': 'Contact Form',
            'dataProtectionText': 'Your data is protected and sent securely to our CRM.',
            'formFallbackText': 'If the form doesn\'t load, open <a class="underline text-brand-orange" href="zoho-form.html" target="_blank" rel="noopener">this page</a> or write to <a class="underline text-brand-orange" href="mailto:ventas@srglobalexperiences.com">ventas@srglobalexperiences.com</a>',
            'faqTitle': 'Frequently Asked Questions',
            'faqQuestion1': 'How long do you take to respond?',
            'faqAnswer1': 'We serve 24/7 and usually respond the same business day. If urgent, write us on WhatsApp.',
            'faqQuestion2': 'Can I request a quote without commitment?',
            'faqAnswer2': 'Yes, the consultation is free. Share destination, dates and number of travelers to design your proposal.',
            'faqQuestion3': 'Do you offer experiences for groups or companies?',
            'faqAnswer3': 'Yes, we organize MICE trips: groups, incentives, conventions and customized events.',
            'faqQuestion4': 'Can you help me with a romantic trip or honeymoon?',
            'faqAnswer4': 'Of course, we personalize proposals for anniversaries, proposals and honeymoons in dream destinations.',

            // Our History section
            'ourHistoryTitle': 'Our Story',
            'ourHistoryP1': 'Travel agents passionate about event organization, deeply fascinated by travel, and creators of personalized experiences in Mexico and around the world.',
            'ourHistoryP2': 'SR Global Experiences was born from our passion for connecting people and creating extraordinary experiences.',
            'ourHistoryQuote': '"We offer a comprehensive and personalized service to make your dreams come true."',

            // Satisfaction and Excellence section
            'satisfactionGuaranteedTitle': 'Satisfaction Guaranteed',
            'satisfactionGuaranteedDesc': 'We commit to exceeding your expectations in every experience we design.',
            'excellenceCommitmentTitle': 'Commitment to Excellence',
            'excellenceCommitmentDesc': 'Every trip is an opportunity to exceed expectations and create unforgettable moments.',

            // Mission, Vision, Values section
            'missionLabel': 'Mission:',
            'missionText': 'Turn dreams into unforgettable travel experiences.',
            'visionLabel': 'Vision:',
            'visionText': 'Create unique stories that inspire, excite, connect, and remain in every traveler\'s memory.',
            'valuesLabel': 'Values:',
            'value1': 'Passion for travel',
            'value2': 'Service excellence',
            'value3': 'Limitless creativity',
            'value4': 'Trust and security',

            // Why Choose Us section
            'whyChooseUsTitle': 'Why choose',
            'personalizedServiceTitle': 'Personalized Service',
            'personalizedServiceDesc': 'Each itinerary is designed specifically for you, tailored to your preferences and needs.',
            'support247Title': '24/7 Support',
            'support247Desc': 'We\'re available anytime during your trip to handle any situation.',
            'exclusiveExperiencesTitle': 'Exclusive Experiences',
            'exclusiveExperiencesDesc': 'Access to unique experiences and destinations beyond conventional tour packages.',

            // Work With Us section
            'workWithUsTitle': 'Would you like to work with us?',
            'workWithUsDesc': 'Let us help you create unforgettable experiences. Our team is ready to design your next dream trip.',
            'contactNowBtn': 'Contact Now',

            // Common - footer
            'footerTitle': 'Start Dreaming',
            'footerSubtitle': 'and let yourself be carried away by a world of possibilities.',
            'footerWhatsapp': 'Chat on WhatsApp',
            'footerEmail': 'Send an Email',
            'footerCopyright': 'SR Global Experiences &copy; 2025. Designed with ❤️ to create unforgettable experiences.',

            // Home / promotions
            'destinationsTitle': 'Destinations to Fall in Love With',
            'promotionsTitle': '🔥 Unmissable Promotions of the Month 🔥',
            'askForPackages': 'Ask about our packages!',
            'askForPackages2': 'Ask about our packages!',
            'askForPackages3': 'Ask about our packages!',
            'askForPackages4': 'Ask about our packages!',
            'askForPackages5': 'Ask about our packages!',
            'askForPackages6': 'Ask about our packages!',
            'moreInfo': 'More Information',
            'moreInfo2': 'More Information',
            'moreInfo3': 'More Information',
            'moreInfo4': 'More Information',
            'moreInfo5': 'More Information',
            'moreInfo6': 'More Information',
            'promoDisney': 'Travel to Disney',
            'promoJordan': 'Jordan and Egypt',

            // Architects
            'architectsTitle': 'Travel Architects',
            'architectsDescription': 'We go beyond the default. We specialize in crafting tailor-made moments that become your best memories.',
            'architectsCard1Title': 'Culinary Tourism',
            'architectsCard1Desc': 'Created Moment: Private dinner with a chef by a cenote.',
            'architectsCard2Title': 'Wellness Retreats',
            'architectsCard2Desc': 'Created Moment: Sunrise yoga session followed by a temazcal ceremony.',
            'architectsCard3Title': 'Unforgettable Events',
            'architectsCard3Desc': 'Created Moment: Your event in unimaginable venues like cenotes or pristine beaches.',
            'architectsCard4Title': 'Group Travel',
            'architectsCard4Desc': 'Created Moment: The perfect getaway with family or friends, fully organized.',

            // MICE / Groups
            'miceTitle': 'Your Strategic Partner in Corporate Events (MICE)',
            'miceDescription': 'Organizing a corporate event, incentive or convention is complex. We become your strategic partner, handling all logistics so you can focus on your company’s goals.',
            'micePoint1': '<b>End-to-end Management:</b> From concept to execution, we cover every detail.',
            'micePoint2': '<b>Exclusive Venues:</b> Access to halls, hotels and unique spaces to create impact.',
            'micePoint3': '<b>Flawless Logistics:</b> Coordination of flights, transfers, lodging and technology.',
            'micePoint4': '<b>Team Building Activities:</b> Experiences designed to strengthen teams and inspire connections.',
            'miceButton': 'Get a Quote',

            // Contact blocks
            'contactDesc': 'Ready to start your next adventure? We’re here to tailor an unforgettable experience for you.',
            'contactSubtitle': 'Tell us your idea; we design your trip to measure, with 24/7 support.',
        }
    };

    // Cambiar textos según el idioma seleccionado
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'META') {
                element.setAttribute('content', translations[lang][key]);
            } else if (element.tagName === 'INPUT') {
                element.setAttribute('value', translations[lang][key]);
            } else {
                element.innerHTML = translations[lang][key];
            }
        }
    });

    // Guardar preferencia del usuario
    localStorage.setItem('preferredLanguage', lang);

    // Establecer atributo lang en <html>
    if (document.documentElement) {
        document.documentElement.setAttribute('lang', lang);
    }

    // Actualizar la URL actual con ?lang=
    try {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', lang);
        window.history.replaceState({}, '', url.toString());
    } catch (e) {
        // no-op en entornos sin URL compatible
    }

    // Propagar el idioma seleccionado a los enlaces internos
    applyLangToLinks(lang);
    // Marcar sentinel después de aplicar realmente las traducciones en esta carga de página
    window.__lastAppliedLanguage = lang;
}

// Añadir ?lang= a enlaces internos para mantener el idioma entre páginas
function applyLangToLinks(lang) {
    const anchors = document.querySelectorAll('a[href]');
    anchors.forEach(a => {
        const href = a.getAttribute('href');
        if (!href) return;
        // Ignorar anclas, externos y protocolos especiales
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || /^https?:\/\//i.test(href) || href.startsWith('https://wa.me')) {
            return;
        }
        // Solo procesar rutas internas (e.g., *.html)
        try {
            const url = new URL(href, window.location.href);
            url.searchParams.set('lang', lang);
            // Usar href absoluto para que funcione con file:// y http(s)
            a.setAttribute('href', url.href);
        } catch (e) {
            // hrefs relativos raros se ignoran
        }
    });
}

// Inicializa el idioma al cargar según ?lang o localStorage y prepara enlaces
function initLanguageSwitcher() {
    let lang = 'es';
    try {
        const params = new URLSearchParams(window.location.search);
        const urlLang = params.get('lang');
        const stored = localStorage.getItem('preferredLanguage');
        if (urlLang === 'es' || urlLang === 'en') {
            lang = urlLang;
        } else if (stored === 'es' || stored === 'en') {
            lang = stored;
        }
    } catch (e) {
        // fallback
    }

    // Aplicar idioma detectado
    switchLanguage(lang);
}

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

// Inicializar botón de menú móvil cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
});
