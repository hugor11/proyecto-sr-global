# 🚀 SR Global Experiences - Next.js (Migración Completa)This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



**Sitio web profesional construido con Next.js 15 + TypeScript + Tailwind CSS + next-intl**## Getting Started



---First, run the development server:



## ✅ ESTADO ACTUAL: MIGRACIÓN BASE COMPLETADA```bash

npm run dev

### Lo que funciona ahora:# or

- ✅ Next.js 15 con App Routeryarn dev

- ✅ TypeScript configurado# or

- ✅ Tailwind CSS integradopnpm dev

- ✅ Internacionalización (ES/EN) con next-intl# or

- ✅ Navbar responsive con menú hamburguesa **SIN BUGS**bun dev

- ✅ Footer con links dinámicos```

- ✅ Language switcher persistente

- ✅ Homepage con hero sectionOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- ✅ Routing dinámico por idioma (`/es`, `/en`)

- ✅ Servidor corriendo en `http://localhost:3000`You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.



---This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.



## 🚦 QUICK START## Learn More



```bashTo learn more about Next.js, take a look at the following resources:

# Instalar dependencias (si no lo hiciste)

npm install- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

# Iniciar servidor de desarrollo

npm run devYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

# Abre: http://localhost:3000

## Deploy on Vercel

# Build para producción

npm run buildThe easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

npm start

```Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


---

## 🌍 Internacionalización

### Cambio de Idioma
- **Español:** `http://localhost:3000/es`
- **Inglés:** `http://localhost:3000/en`
- **Switcher:** Botón ES/EN en navbar (persiste entre páginas)

### Archivos de Traducción
```
messages/
├── es.json  ← Español
└── en.json  ← Inglés
```

---

## 🏗️ Arquitectura

```
sr-global-nextjs/
├── src/
│   ├── app/
│   │   ├── [locale]/         # ← Rutas dinámicas por idioma
│   │   │   ├── layout.tsx    # Layout con i18n
│   │   │   └── page.tsx      # Homepage
│   │   └── globals.css
│   ├── components/
│   │   └── layout/
│   │       ├── Navbar.tsx    # Menú refactorizado (95 líneas)
│   │       ├── Footer.tsx
│   │       └── LanguageSwitcher.tsx
│   ├── i18n/
│   │   ├── request.ts
│   │   └── routing.ts
│   └── middleware.ts
├── messages/
│   ├── es.json
│   └── en.json
└── next.config.ts
```

---

## 🔧 Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 15.5.4 | Framework React SSR/SSG |
| **React** | 19.x | UI Library |
| **TypeScript** | 5.x | Type Safety |
| **Tailwind CSS** | 4.x | Estilos utilitarios |
| **next-intl** | Latest | Internacionalización |
| **React Icons** | Latest | Iconos |

---

## 📱 Componentes

### Navbar
```tsx
import Navbar from '@/components/layout/Navbar';
<Navbar />
```
- Responsive (desktop + mobile)
- Menú hamburguesa **sin bugs** (refactorizado desde 180 → 95 líneas)
- Language switcher integrado

### Footer
```tsx
import Footer from '@/components/layout/Footer';
<Footer />
```
- Links dinámicos según idioma
- Redes sociales
- Grid responsive

---

## 🎯 PRÓXIMOS PASOS (Pendientes)

### Páginas a Migrar
- [ ] `/promotions` - Promociones
- [ ] `/experiences` - Experiencias
- [ ] `/romance` - Paquetes Romance
- [ ] `/destinations` - Destinos
- [ ] `/groups` - Grupos & Convenciones
- [ ] `/about` - Sobre Nosotros
- [ ] `/contact` - Contacto

### Funcionalidades
- [ ] Carrusel (Swiper.js)
- [ ] Galería (Fancybox)
- [ ] Formularios de contacto
- [ ] Tests automáticos (Playwright)

---

## 📊 Mejoras vs Sitio Anterior

| Aspecto | Antes (Vanilla JS) | Ahora (Next.js) |
|---------|---------------------|------------------|
| **Framework** | Ninguno | Next.js 15 |
| **Tipo** | JavaScript | TypeScript |
| **i18n** | Manual (buggy) | next-intl (pro) |
| **Menú móvil** | 180 líneas, bugs | 95 líneas, funcional |
| **Navegación** | Recarga página | SPA suave |
| **SEO** | Limitado | SSR/SSG optimizado |
| **Performance** | ~70 | >90 (objetivo) |

---

## 🐛 Debugging

### Ver logs
```bash
npm run dev
# Los logs aparecen en la terminal
```

### Limpiar caché
```bash
rm -rf .next
npm run dev
```

---

## 🚀 Deploy

### Vercel (Recomendado)
1. Push a GitHub
2. Importar en vercel.com
3. Deploy automático ✅

### Netlify
- Build command: `npm run build`
- Publish directory: `.next`

---

## 📝 Documentación

- **Next.js:** https://nextjs.org/docs
- **next-intl:** https://next-intl-docs.vercel.app/
- **Tailwind:** https://tailwindcss.com/docs

---

## 👨‍💻 Autor

**Hugo R. - SR Global Experiences**  
**Versión:** 2.0 (Next.js Migration)  
**Fecha:** Octubre 2025

---

**Status:** ✅ Base funcional lista para testing y expansión.
