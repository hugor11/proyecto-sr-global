# 🚀 PASOS PARA CONFIGURAR NETLIFY

**Proyecto:** SR Global Experiences - Next.js 15  
**Branch Deploy:** nextjs-migration  
**Commit Actual:** c4a71d5  

---

## ✅ COMPLETADO

### 1. Auditoría del Proyecto
- ✅ Build local exitoso (6 páginas estáticas generadas)
- ✅ TypeScript sin errores
- ✅ Código pusheado a GitHub
- ✅ Branch `nextjs-migration` actualizado

### 2. Configuración Creada
- ✅ `netlify.toml` configurado para Next.js 15
- ✅ `NETLIFY-AUDIT.md` documentación completa
- ✅ Commit: `c4a71d5` - feat: configuración de Netlify para Next.js 15 con i18n y SSG
- ✅ Pusheado a GitHub

### 3. Historial de Commits
```
c4a71d5 ← (HEAD, ACTUAL) Configuración Netlify
1681da0 ← Limpieza completa
0bbd65f ← Migración base completa
```

---

## ⚠️ ACCIÓN REQUERIDA EN NETLIFY DASHBOARD

**Acceso Manual Requerido** - No se puede automatizar sin credenciales

### PASO 1: Acceder a Netlify
```
URL: https://app.netlify.com/
Login: [Usar cuenta del propietario]
```

### PASO 2: Seleccionar el Sitio
```
Sites → SR Global Experiences (o nombre del sitio actual)
```

### PASO 3: Cambiar Branch de Deploy
```
Site settings → Build & deploy → Continuous deployment
└── Configure → Branch to deploy
    ├── Branch actual: main o master
    └── CAMBIAR A: nextjs-migration
└── Save
```

### PASO 4: Actualizar Build Settings
```
Site settings → Build & deploy → Build settings
└── Edit settings
    ├── Build command: npm run build
    ├── Publish directory: .next
    └── Node version: 20 (en Environment variables si no se detecta)
└── Save
```

### PASO 5: Agregar Variables de Entorno (Opcional)
```
Site settings → Environment variables → Add a variable
└── NODE_VERSION = 20
└── NPM_FLAGS = --legacy-peer-deps
```

### PASO 6: Trigger Deploy
```
Deploys → Trigger deploy → Deploy site
```

**Tiempo de deploy esperado:** 2-3 minutos

### PASO 7: Verificar Deploy Exitoso
```
Deploys → (Ver deploy más reciente)
└── Status: Published ✅
└── Branch: nextjs-migration
└── Commit: c4a71d5
```

### PASO 8: Probar el Sitio
```
[URL del sitio en Netlify] → Debería mostrar el sitio Next.js
└── Probar cambio de idioma (ES/EN)
└── Verificar menú hamburguesa
└── Probar en móvil
```

---

## 📊 CONFIGURACIÓN ESPERADA EN NETLIFY

### Build Settings
```yaml
Repository:       hugor11/proyecto-sr-global
Branch:           nextjs-migration
Build command:    npm run build
Publish directory: .next
Production branch: nextjs-migration
```

### Environment Variables
```yaml
NODE_VERSION:     20
NPM_FLAGS:        --legacy-peer-deps (opcional)
```

### Build Log Esperado
```
Building with Next.js 15.5.4
✓ Compiled successfully in 1246ms
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (6/6)
✓ Build completed successfully
```

---

## 🎯 CHECKLIST DE VERIFICACIÓN

### En Netlify Dashboard
- [ ] Branch cambiado a `nextjs-migration`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `.next`
- [ ] Node version: 20
- [ ] Deploy triggered
- [ ] Deploy completado con status "Published"

### En el Sitio de Producción
- [ ] Homepage carga correctamente
- [ ] Cambio de idioma funciona (ES ↔ EN)
- [ ] URLs i18n correctas (/es, /en)
- [ ] Navbar responsive funciona
- [ ] Footer links funcionan
- [ ] No errores en consola del navegador
- [ ] Performance aceptable (< 3s First Contentful Paint)

---

## 🚨 TROUBLESHOOTING

### Problema 1: Build Falla en Netlify

**Síntomas:**
```
Error: Cannot find module 'next'
npm ERR! code 1
```

**Solución:**
```
1. Verificar que package.json esté en el repo
2. Verificar que node_modules NO esté en .gitignore
3. Agregar flag: NPM_FLAGS = --legacy-peer-deps
4. Retry deploy
```

---

### Problema 2: Publish Directory No Encontrado

**Síntomas:**
```
Error: Publish directory '.next' does not exist
```

**Solución:**
```
1. Verificar build command: npm run build
2. Verificar que next.config.ts esté presente
3. Revisar build log para errores de compilación
4. Retry deploy
```

---

### Problema 3: 404 en Todas las Rutas

**Síntomas:**
- Homepage carga
- Pero /es y /en dan 404

**Solución:**
```
1. Verificar que netlify.toml esté en el repo
2. Verificar redirects en netlify.toml
3. Verificar middleware.ts configurado
4. Redeploy
```

---

### Problema 4: i18n No Funciona

**Síntomas:**
- Sitio carga pero solo en un idioma
- Language switcher no funciona

**Solución:**
```
1. Verificar que messages/es.json y messages/en.json estén en el repo
2. Verificar src/i18n/routing.ts
3. Verificar src/middleware.ts
4. Check browser console for errors
```

---

## 📝 DESPUÉS DEL DEPLOY

### 1. Monitorear el Deploy
```
Netlify Dashboard → Deploys → [Deploy más reciente]
└── View logs para troubleshooting
```

### 2. Verificar Performance
```
Google PageSpeed Insights
└── URL: [URL del sitio en Netlify]
└── Target: > 90 en móvil, > 95 en desktop
```

### 3. Configurar Dominio Personalizado (Opcional)
```
Domain settings → Add custom domain
└── Seguir wizard de Netlify
└── Configurar DNS
└── SSL automático (Let's Encrypt)
```

### 4. Habilitar Analytics (Opcional)
```
Site settings → Analytics
└── Enable Netlify Analytics (de pago)
└── O integrar Google Analytics en el código
```

---

## 🔄 ROLLBACK SI ES NECESARIO

### Opción 1: Rollback en Netlify (Rápido)
```
Deploys → [Seleccionar deploy anterior exitoso] → Publish deploy
```

### Opción 2: Cambiar Branch (Temporal)
```
Site settings → Build & deploy
└── Branch to deploy: main (volver al sitio HTML estático)
```

### Opción 3: Revert Git (Permanente)
```bash
git revert c4a71d5
git push origin nextjs-migration
```

---

## ✅ RESULTADO ESPERADO

Una vez completados todos los pasos en Netlify:

```
✅ Sitio Next.js desplegado en: [URL].netlify.app
✅ Branch: nextjs-migration
✅ Commit: c4a71d5
✅ i18n funcionando (ES/EN)
✅ SSG habilitado (páginas pre-generadas)
✅ Middleware activo (routing i18n)
✅ Performance optimizada
✅ SSL habilitado (HTTPS)
```

---

## 📞 INFORMACIÓN DEL REPOSITORIO

### GitHub
```
Repository: https://github.com/hugor11/proyecto-sr-global
Branch:     nextjs-migration
Commit:     c4a71d5
Files:      27 archivos (3,821 líneas)
```

### Netlify Config
```
File:       netlify.toml
Location:   Raíz del proyecto
Status:     ✅ Commiteado y pusheado
```

---

## 🎯 PRÓXIMOS PASOS RECOMENDADOS

### Inmediato (Después de Deploy)
1. **Verificar funcionalidad completa** del sitio en producción
2. **Probar en múltiples dispositivos** (móvil, tablet, desktop)
3. **Monitorear errores** en Netlify logs
4. **Documentar URL de producción**

### Corto Plazo
1. **Migrar páginas restantes** (about, contact, promotions, etc.)
2. **Integrar Swiper.js** para carousels
3. **Integrar Fancybox** para galerías
4. **Añadir formularios de contacto**

### Mediano Plazo
1. **Configurar dominio personalizado**
2. **Optimizar SEO** (meta tags, sitemap)
3. **Implementar analytics**
4. **Configurar monitores de uptime**

---

**Autor:** GitHub Copilot  
**Fecha:** 1 de Octubre, 2025  
**Commit:** c4a71d5  
**Status:** ✅ Código listo, ⏳ Configuración en Netlify pendiente (acceso manual requerido)
