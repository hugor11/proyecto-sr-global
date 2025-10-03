// ============================================
// SCRIPT DE VALIDACIÓN DEL MENÚ MÓVIL
// ============================================
// Copia y pega este código en la consola del navegador
// con el menú móvil ABIERTO

console.log('=== VALIDACIÓN FINAL DEL MENÚ ===\n');

const closeBtns = document.querySelectorAll('[data-menu-close]');
const timesIcons = document.querySelectorAll('.fa-times');
const panel = document.querySelector('[data-menu-panel]');
const overlay = document.querySelector('[data-menu-overlay]');

console.log('✅ Botones cerrar:', closeBtns.length, closeBtns.length === 1 ? '✅ (debe ser 1)' : '❌ (debe ser 1)');
console.log('✅ Íconos fa-times:', timesIcons.length, timesIcons.length === 1 ? '✅ (debe ser 1)' : '❌ (debe ser 1)');

if (panel) {
  const panelStyles = getComputedStyle(panel);
  const panelRect = panel.getBoundingClientRect();
  
  console.log('✅ Z-index panel:', panelStyles.zIndex, panelStyles.zIndex === '50' ? '✅ (debe ser 50)' : '❌ (debe ser 50)');
  console.log('✅ Position panel:', panelStyles.position, panelStyles.position === 'fixed' ? '✅ (debe ser fixed)' : '❌ (debe ser fixed)');
  console.log('✅ Panel visible:', !panel.hidden, !panel.hidden ? '✅ (debe ser true)' : '❌ (debe ser true)');
  console.log('✅ Panel dimensiones:', Math.round(panelRect.width), 'x', Math.round(panelRect.height), panelRect.width > 0 ? '✅' : '❌');
} else {
  console.error('❌ Panel no encontrado');
}

if (overlay) {
  const overlayStyles = getComputedStyle(overlay);
  console.log('✅ Z-index overlay:', overlayStyles.zIndex, overlayStyles.zIndex === '40' ? '✅ (debe ser 40)' : '❌ (debe ser 40)');
  console.log('✅ Overlay visible:', !overlay.classList.contains('hidden'), '(debe ser true cuando menú abierto)');
} else {
  console.error('❌ Overlay no encontrado');
}

console.log('\n=== PRUEBA DE ENLACES ===');
const links = document.querySelectorAll('[data-menu-panel] a[href]');
console.log('✅ Enlaces en el menú:', links.length);
if (links.length > 0) {
  console.log('Primer enlace:', links[0].href, '→', links[0].textContent.trim());
  console.log('💡 Haz clic en un enlace y verifica que aparezca el log: "🔗 Navegando a: ..."');
}

console.log('\n=== LISTENERS ===');
const clickListeners = window.getEventListeners ? window.getEventListeners(document).click : 'N/A (usa Chrome DevTools)';
console.log('Click listeners en document:', typeof clickListeners === 'object' ? clickListeners.length : clickListeners);

console.log('\n=== FIN DE VALIDACIÓN ===');
console.log('📋 CHECKLIST:');
console.log('  [ ] Solo 1 botón X visible');
console.log('  [ ] Solo 1 ícono fa-times');
console.log('  [ ] Panel z-index = 50');
console.log('  [ ] Panel position = fixed');
console.log('  [ ] Panel visible con dimensiones correctas');
console.log('  [ ] Clic en enlace navega correctamente');
console.log('  [ ] Clic en X cierra el menú');
console.log('  [ ] Clic en overlay cierra el menú');
console.log('  [ ] Tecla Escape cierra el menú');
