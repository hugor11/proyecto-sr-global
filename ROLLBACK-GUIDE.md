# 🔄 GUÍA DE ROLLBACK

**Proyecto:** SR Global Next.js  
**Branch:** nextjs-migration  
**Fecha:** 1 de Octubre, 2025  

---

## 📌 COMMITS DISPONIBLES

### Commit Actual (HEAD)
```
1681da0 - chore: limpieza completa, eliminado chatbot y legacy. Listo para despliegue y rollback seguro
```
**Estado:** ✅ Limpieza completa, documentación actualizada  
**Contenido:**
- CLEANUP-COMPLETE.md añadido
- Sin referencias a chatbot
- Listo para deploy

---

### Commit Anterior
```
0bbd65f - chore: migración completa a Next.js - eliminar código legacy y preparar para deploy
```
**Estado:** ✅ Base funcional completa  
**Contenido:**
- Next.js 15 + TypeScript + Tailwind v4
- next-intl configurado
- Navbar, Footer, LanguageSwitcher
- Homepage funcional
- Build exitoso

---

## 🔄 COMANDOS DE ROLLBACK

### 1. Volver al Commit Anterior (0bbd65f)
```bash
cd "c:\Users\hugor\OneDrive\Mis Documentos\Trabajos\sara\sr-global-nextjs"
git reset --hard 0bbd65f
git push --force origin nextjs-migration
```
**Efecto:** Elimina CLEANUP-COMPLETE.md, vuelve al estado inmediatamente después de la migración

---

### 2. Volver al Estado Actual (1681da0)
```bash
cd "c:\Users\hugor\OneDrive\Mis Documentos\Trabajos\sara\sr-global-nextjs"
git reset --hard 1681da0
git push --force origin nextjs-migration
```
**Efecto:** Restaura el estado actual (limpieza completa)

---

### 3. Ver Diferencias Entre Commits
```bash
# Ver cambios entre commits
git diff 0bbd65f 1681da0

# Ver archivos cambiados
git diff --name-only 0bbd65f 1681da0

# Ver log completo
git log --oneline --graph --all
```

---

### 4. Crear Branch de Respaldo
```bash
# Antes de hacer rollback, crea un backup
git branch backup-cleanup-$(date +%Y%m%d)
git push origin backup-cleanup-$(date +%Y%m%d)

# Luego puedes hacer rollback seguro
git reset --hard <commit-hash>
git push --force
```

---

## 🚨 COMANDOS DE EMERGENCIA

### Si algo sale mal...

#### 1. Ver Reflog (historial de todos los cambios)
```bash
git reflog
```
**Output esperado:**
```
1681da0 HEAD@{0}: commit: chore: limpieza completa...
0bbd65f HEAD@{1}: commit (initial): chore: migración completa...
```

#### 2. Recuperar desde Reflog
```bash
# Si hiciste reset y te arrepientes
git reset --hard HEAD@{1}
```

#### 3. Clonar Desde Cero
```bash
cd "c:\Users\hugor\OneDrive\Mis Documentos\Trabajos\sara"
git clone https://github.com/hugor11/proyecto-sr-global.git sr-global-clone
cd sr-global-clone
git checkout nextjs-migration
npm install
npm run dev
```

---

## 📊 ESTADO ACTUAL DEL REPOSITORIO

### Branch: nextjs-migration
```
1681da0 (HEAD -> nextjs-migration, origin/nextjs-migration)
    └── CLEANUP-COMPLETE.md (nuevo)
    
0bbd65f
    └── 25 archivos base del proyecto Next.js
```

### Remote: origin
```
URL: https://github.com/hugor11/proyecto-sr-global.git
Branch: nextjs-migration
Commits: 2
Status: ✅ Sincronizado
```

---

## 🎯 ESCENARIOS COMUNES

### Escenario 1: "Quiero volver antes de la limpieza"
```bash
git reset --hard 0bbd65f
git push --force origin nextjs-migration
```

### Escenario 2: "Quiero probar un cambio sin perder el actual"
```bash
# Crear branch temporal
git checkout -b test-feature
# Hacer cambios...
# Si funciona:
git checkout nextjs-migration
git merge test-feature
# Si no funciona:
git checkout nextjs-migration
git branch -D test-feature
```

### Escenario 3: "Quiero ver qué cambió en el último commit"
```bash
git show 1681da0
# o simplemente
git show HEAD
```

### Escenario 4: "Quiero deshacer el último commit pero mantener los cambios"
```bash
git reset --soft HEAD~1
# Los cambios quedan en staging
# Puedes modificarlos y hacer nuevo commit
```

---

## ⚠️ ADVERTENCIAS

### ⚠️ --force Push
```bash
git push --force
```
**PELIGRO:** Sobrescribe el historial remoto  
**Usar solo si:** Estás seguro y nadie más está trabajando en el branch  
**Alternativa segura:** `git push --force-with-lease`

### ⚠️ --hard Reset
```bash
git reset --hard
```
**PELIGRO:** Elimina cambios no commiteados permanentemente  
**Verificar antes:** `git status` para ver qué se perderá  
**Alternativa segura:** `git stash` primero

---

## 📝 CHECKLIST ANTES DE ROLLBACK

- [ ] ✅ Verificar commit destino: `git log --oneline`
- [ ] ✅ Crear backup branch: `git branch backup-$(date +%Y%m%d)`
- [ ] ✅ Verificar estado: `git status`
- [ ] ✅ Guardar cambios no commiteados: `git stash`
- [ ] ✅ Ejecutar rollback: `git reset --hard <commit>`
- [ ] ✅ Verificar resultado: `git log --oneline`
- [ ] ✅ Push si es necesario: `git push --force-with-lease`
- [ ] ✅ Probar build: `npm run build`
- [ ] ✅ Probar servidor: `npm run dev`

---

## 🔗 RECURSOS ÚTILES

### Documentación Git
- [git-reset](https://git-scm.com/docs/git-reset)
- [git-reflog](https://git-scm.com/docs/git-reflog)
- [git-revert](https://git-scm.com/docs/git-revert)

### Comandos de Consulta
```bash
# Ver todos los branches
git branch -a

# Ver remotes
git remote -v

# Ver commits detallados
git log --graph --decorate --all

# Ver quién cambió qué
git blame <archivo>

# Buscar en commits
git log --grep="limpieza"
```

---

## ✅ ESTADO ACTUAL CONFIRMADO

**Commit:** `1681da0`  
**Branch:** `nextjs-migration`  
**Remote:** ✅ Sincronizado  
**Build:** ✅ Exitoso  
**Servidor:** ✅ Corriendo  
**Documentación:** ✅ Completa  

**Listo para:**
- ✅ Deploy a producción
- ✅ Testing manual
- ✅ Desarrollo de nuevas features
- ✅ Rollback si es necesario

---

**Autor:** GitHub Copilot  
**Fecha:** 1 de Octubre, 2025  
**Última actualización:** Después de commit `1681da0`
