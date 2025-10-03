// ============================================
// SCRIPT DE VALIDACIÓN DEL MENÚ MÓVIL v16
// ============================================
// Copia y pega este código en la consola del navegador
// con el menú móvil ABIERTO

console.log('=== VALIDACIÓN FINAL DEL MENÚ v16 ===\n');

const closeBtns = document.querySelectorAll('[data-menu-close]');
const timesIcons = document.querySelectorAll('.fa-times');
const panel = document.querySelector('[data-menu-panel]');
const overlay = document.querySelector('[data-menu-overlay]');

console.log('✅ Botones cerrar:', closeBtns.length, closeBtns.length === 1 ? '✅ (debe ser 1)' : '❌ (debe ser 1)');
console.log('✅ Íconos fa-times:', timesIcons.length, timesIcons.length === 1 ? '✅ (debe ser 1)' : '❌ (debe ser 1)');

if (panel) {
  const panelStyles = getComputedStyle(panel);
  const panelRect = panel.getBoundingClientRect();
  
  console.log('\n--- PANEL ---');
  console.log('✅ Z-index:', panelStyles.zIndex, panelStyles.zIndex === '50' ? '✅ (debe ser 50)' : '❌ (debe ser 50)');
  console.log('✅ Position:', panelStyles.position, panelStyles.position === 'fixed' ? '✅ (debe ser fixed)' : '❌ (debe ser fixed)');
  console.log('✅ Atributo hidden:', panel.hasAttribute('hidden'), panel.hasAttribute('hidden') ? '❌ (debe ser false cuando está abierto)' : '✅ (debe ser false)');
  console.log('✅ Display:', panelStyles.display, panelStyles.display === 'none' ? '❌ (NO debe ser none)' : '✅');
  console.log('✅ Dimensiones:', Math.round(panelRect.width), 'x', Math.round(panelRect.height), panelRect.width > 0 ? '✅' : '❌');
  console.log('✅ Clase md:hidden:', panel.classList.contains('md:hidden') ? '❌ (NO debe tener esta clase)' : '✅ (correcto)');
} else {
  console.error('❌ Panel no encontrado');
}

if (overlay) {
  const overlayStyles = getComputedStyle(overlay);
  console.log('\n--- OVERLAY ---');
  console.log('✅ Z-index:', overlayStyles.zIndex, overlayStyles.zIndex === '40' ? '✅ (debe ser 40)' : '❌ (debe ser 40)');
  console.log('✅ Clase hidden:', overlay.classList.contains('hidden'), '(debe ser false cuando menú abierto)');
  console.log('✅ Display:', overlayStyles.display, overlayStyles.display === 'none' ? '❌ (NO debe ser none)' : '✅');
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

console.log('\n=== BOTÓN HAMBURGUESA ===');
const hamburger = document.querySelector('[data-menu-toggle]');
if (hamburger) {
  console.log('✅ aria-expanded:', hamburger.getAttribute('aria-expanded'), '(debe ser "true" cuando está abierto)');
  console.log('✅ aria-label:', hamburger.getAttribute('aria-label'));
} else {
  console.error('❌ Botón hamburguesa no encontrado');
}

console.log('\n=== FIN DE VALIDACIÓN ===');
console.log('📋 CHECKLIST:');
console.log('  [ ] Solo 1 botón X visible');
console.log('  [ ] Solo 1 ícono fa-times');
console.log('  [ ] Panel z-index = 50');
console.log('  [ ] Panel position = fixed');
console.log('  [ ] Panel SIN atributo hidden');
console.log('  [ ] Panel SIN clase md:hidden');
console.log('  [ ] Panel visible con dimensiones correctas');
console.log('  [ ] Clic en enlace navega correctamente');
console.log('  [ ] Clic en X cierra el menú');
console.log('  [ ] Clic en overlay cierra el menú');
console.log('  [ ] Tecla Escape cierra el menú');
