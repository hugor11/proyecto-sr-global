// Debugging script for mobile hamburger menu on homepage
(function(){
  const selectors = ['#menu-toggle', '#menuToggle', '.hamburger', '[data-menu-toggle]'];
  const navSelectors = ['#mainNav', '.main-nav', 'nav[role="navigation"]', '#navbar'];
  let logDiv;

  function log(msg, type='info') {
    console[type === 'error' ? 'error' : 'log']('[DEBUG-MENU]', msg);
    if (logDiv) {
      const el = document.createElement('div');
      el.textContent = `[DEBUG-MENU] ${msg}`;
      el.style.color = type === 'error' ? '#c00' : '#222';
      logDiv.appendChild(el);
    }
  }

  function setupVisualConsole() {
    logDiv = document.createElement('div');
    logDiv.style.position = 'fixed';
    logDiv.style.bottom = '0';
    logDiv.style.left = '0';
    logDiv.style.width = '100vw';
    logDiv.style.maxHeight = '40vh';
    logDiv.style.overflowY = 'auto';
    logDiv.style.zIndex = '99999';
    logDiv.style.background = 'rgba(255,255,255,0.95)';
    logDiv.style.fontSize = '14px';
    logDiv.style.fontFamily = 'monospace';
    logDiv.style.borderTop = '2px solid #f90';
    logDiv.style.pointerEvents = 'none';
    document.body.appendChild(logDiv);
  }

  function findButton() {
    for (const sel of selectors) {
      const btn = document.querySelector(sel);
      if (btn) {
        log(`Botón hamburguesa encontrado con selector: ${sel}`);
        return btn;
      }
    }
    log('No se encontró el botón hamburguesa con los selectores estándar.', 'error');
    return null;
  }

  function findNav() {
    for (const sel of navSelectors) {
      const nav = document.querySelector(sel);
      if (nav) {
        log(`Menú principal encontrado con selector: ${sel}`);
        return nav;
      }
    }
    log('No se encontró el menú principal con los selectores estándar.', 'error');
    return null;
  }

  function toggleMenu(btn, nav) {
    if (!btn || !nav) return;
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    log(`aria-expanded cambiado a: ${!expanded}`);
    nav.classList.toggle('open');
    log(`Clase 'open' ${nav.classList.contains('open') ? 'agregada' : 'removida'} en el menú principal.`);
  }

  function addListeners(btn, nav) {
    if (!btn) return;
    let attached = false;
    ['click','pointerup'].forEach(evt => {
      btn.addEventListener(evt, function(e){
        log(`Evento ${evt} disparado en botón hamburguesa.`);
        toggleMenu(btn, nav);
      });
      attached = true;
    });
    btn.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ') {
        log(`Evento keydown (${e.key}) disparado en botón hamburguesa.`);
        toggleMenu(btn, nav);
      }
    });
    if (attached) log('Listeners de click/pointerup agregados al botón hamburguesa.');
  }

  function runDebugMenu() {
    setupVisualConsole();
    log('Script de debugging de menú hamburguesa cargado.');
    const btn = findButton();
    const nav = findNav();
    if (!btn) {
      log('FALLO: No se encontró el botón hamburguesa. Revisa el DOM o los selectores.', 'error');
      return;
    }
    if (!nav) {
      log('FALLO: No se encontró el menú principal. Revisa el DOM o los selectores.', 'error');
      return;
    }
    addListeners(btn, nav);
    log('Debugging listo. Toca/clickea el botón hamburguesa y revisa los logs.');
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(runDebugMenu, 300);
  } else {
    window.addEventListener('DOMContentLoaded', runDebugMenu);
  }
})();
