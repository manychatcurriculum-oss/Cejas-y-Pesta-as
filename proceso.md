# proceso.md — Bitácora del Proyecto Cejas & Pestañas

> Este archivo es para que dos instancias de Claude (en distintas PCs) puedan entenderse.
> Siempre actualizar este archivo con lo que se hizo, lo que falta y lo que viene.
> Cuando terminés una tarea, marcala como [x]. Cuando agregues algo nuevo, agregalo en el historial.

---

## ESTADO ACTUAL: EN DESARROLLO

---

## DATOS DEL PROYECTO

| Campo | Valor |
|---|---|
| Producto | Masterclass Cejas & Pestañas |
| Precio | $4.900 ARS / $9.800 tachado |
| Prefijo GalioPay | cb_ |
| Carpeta local | C:\CLAUDE\cejas-pestanas |
| GitHub | https://github.com/manychatcurriculum-oss/Cejas-y-Pesta-as |
| Página post-compra | /bellezagracias |
| Base copiada de | C:\CLAUDE\OFERTA GELATINA BASE PARA COPIA |
| Stack | Next.js 14 + TypeScript + Tailwind + Supabase + GalioPay + Nodemailer + Zustand |

---

## LO QUE YA ESTA HECHO

### Estructura y codigo
- [x] Proyecto copiado de base Gelatina Fit
- [x] package.json renombrado a cejas-pestanas
- [x] src/lib/constants.ts — reemplazado completamente (producto cejas/pestañas, precio $4.900, testimonios, FAQ, beneficios, entregables)
- [x] src/store/types.ts — simplificado a 3 campos: name, level, email
- [x] src/store/quizStore.ts — simplificado, localStorage key: cejas-quiz, max 6 pasos
- [x] Quiz de 6 pasos creado:
  - Step01Hero — Hero con stats del curso
  - Step02Name — Captura nombre
  - Step03Level — Cards: principiante / con experiencia / trabaja en belleza
  - Step04Email — Captura email
  - Step05Loading — Loading animado 4 segundos personalizado
  - Step06Sales — Sales page completa adaptada a cejas/pestañas
- [x] Pasos viejos de Gelatina eliminados (Step02Age hasta Step20Sales)
- [x] QuizShell.tsx actualizado a 6 pasos
- [x] src/components/sales/GalioPayModal.tsx — pre-llena nombre y email desde el store del quiz
- [x] src/app/api/galiopay/create-payment/route.ts — prefijo cb_, precio 4900
- [x] src/app/api/galiopay/webhook/route.ts — producto actualizado (placeholder FB Pixel)
- [x] src/lib/email.ts — template de entrega completamente reescrito para cejas/pestañas
- [x] src/app/layout.tsx — SEO meta tags actualizados
- [x] src/app/bellezagracias/page.tsx — dashboard post-compra creado
- [x] .env.local — credenciales compartidas cargadas, pendientes marcadas
- [x] Pusheado a GitHub

---

## LO QUE FALTA HACER

### BLOQUEANTE — Sin esto NO funciona el pago

#### Supabase (nuevo proyecto por-proyecto)
- [ ] Crear nuevo proyecto en https://supabase.com
- [ ] Copiar SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY al .env.local
- [ ] Correr los 3 bloques SQL uno por uno en el dashboard de Supabase:

BLOQUE 1 — quiz_entries:
  CREATE TABLE public.quiz_entries (id TEXT PRIMARY KEY, timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(), answers JSONB NOT NULL);
  ALTER TABLE public.quiz_entries ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "service role full access" ON public.quiz_entries USING (true) WITH CHECK (true);
  CREATE INDEX idx_quiz_entries_timestamp ON public.quiz_entries(timestamp DESC);

BLOQUE 2 — galiopay_orders:
  CREATE TABLE public.galiopay_orders (id TEXT PRIMARY KEY, reference_id TEXT NOT NULL UNIQUE, name TEXT, email TEXT, amount INTEGER, status TEXT NOT NULL DEFAULT 'pending', payment_id TEXT, paid_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
  ALTER TABLE public.galiopay_orders ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "service role full access" ON public.galiopay_orders USING (true) WITH CHECK (true);
  CREATE INDEX idx_galiopay_orders_reference ON public.galiopay_orders(reference_id);

BLOQUE 3 — checkout_events:
  CREATE TABLE public.checkout_events (id BIGSERIAL PRIMARY KEY, event TEXT, data JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
  ALTER TABLE public.checkout_events ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "service role full access" ON public.checkout_events USING (true) WITH CHECK (true);

#### GalioPay (cuando tengas acceso)
- [ ] Agregar en galiopay-router (repo: C:\Users\Nico\Desktop\galiopay-router) una nueva entrada para el prefijo cb_
- [ ] Deploy del router: vercel --prod desde la carpeta del router
- [ ] El webhook en panel GalioPay ya apunta a galiopay-router.vercel.app/api/webhook — NO cambiar

#### Vercel (deploy)
- [ ] Crear nuevo proyecto Vercel conectado al repo GitHub
- [ ] Obtener URL del proyecto Vercel y copiarla en NEXT_PUBLIC_SITE_URL del .env.local
- [ ] Agregar TODAS las variables del .env.local en el dashboard de Vercel

---

### IMPORTANTE — Para que funcione bien

#### Imagenes (con Higgsfield cuando este disponible)
- [ ] Reemplazar todas las imagenes de gelatina con imagenes de cejas/pestañas
- [ ] public/images/hero-bg.webp — close-up ojos con extensiones perfectas (16:9, 4K, Nano Banana 2)
- [ ] public/images/sales-hero.webp — mujer argentina, pestañas impecables (16:9, 4K)
- [ ] public/images/product-mockup.webp — tablet con video del curso mas pinzas (4:3, 2K)
- [ ] public/testimonials/1-6.webp — retratos mujeres latinas 25-45 años (1:1, 2K)
- [ ] Convertir todo a .webp con Sharp quality 85

#### Google Drive
- [ ] Subir los videos del curso a Google Drive
- [ ] Reemplazar en constants.ts:
  - REEMPLAZAR_DRIVE_VIDEOS por el link real de los videos
  - REEMPLAZAR_DRIVE_MANUAL por el link real del manual PDF

#### Sales components heredados de Gelatina a revisar
- [ ] src/components/sales/TestimonialCarousel.tsx — verificar que usa TESTIMONIALS de constants.ts
- [ ] src/components/sales/FAQAccordion.tsx — verificar que usa FAQ_ITEMS de constants.ts
- [ ] src/components/sales/BonusSection.tsx — revisar si aplica o eliminar
- [ ] src/components/sales/PricingCard.tsx — no se usa mas (Step06Sales tiene su propio pricing)
- [ ] src/app/gracias/page.tsx — se puede eliminar o poner redirect a /bellezagracias
- [ ] src/components/gracias/GelatinaChatbot.tsx — no se usa, se puede eliminar

---

### OPCIONAL / FUTURO

- [ ] Facebook Pixel ID — reemplazar REEMPLAZAR_FB_PIXEL_ID en layout.tsx y webhook/route.ts
- [ ] Google Analytics — reemplazar REEMPLAZAR_GA4_ID en layout.tsx
- [ ] FB_ACCESS_TOKEN para Conversions API server-side
- [ ] ADMIN_PASSWORD para el dashboard en /admin
- [ ] og:image (public/images/og-image.webp) para preview en redes sociales

---

## VARIABLES DE ENTORNO (.env.local)

Listas:
  GALIOPAY_API_KEY — cargada
  GALIOPAY_CLIENT_ID — cargada
  GALIOPAY_API_BASE — cargada
  GMAIL_USER — cargada
  GMAIL_APP_PASSWORD — cargada
  GEMINI_API_KEY — cargada

Pendientes:
  SUPABASE_URL — crear nuevo proyecto Supabase
  SUPABASE_SERVICE_ROLE_KEY — del nuevo proyecto Supabase
  NEXT_PUBLIC_SITE_URL — URL de Vercel cuando se deploye
  FB_ACCESS_TOKEN — cuando tengas Meta Business Manager
  ADMIN_PASSWORD — elegir cualquier contraseña segura

---

## ARCHIVOS CLAVE DEL PROYECTO

  src/lib/constants.ts — precio, testimonios, FAQ, beneficios, entregables
  src/store/quizStore.ts — estado del quiz (name, level, email)
  src/store/types.ts — TypeScript interfaces
  src/components/quiz/QuizShell.tsx — contenedor del quiz (6 pasos)
  src/components/quiz/steps/Step01Hero.tsx — pantalla inicial
  src/components/quiz/steps/Step02Name.tsx — captura nombre
  src/components/quiz/steps/Step03Level.tsx — captura nivel
  src/components/quiz/steps/Step04Email.tsx — captura email
  src/components/quiz/steps/Step05Loading.tsx — loading personalizado
  src/components/quiz/steps/Step06Sales.tsx — sales page completa
  src/components/sales/GalioPayModal.tsx — modal de checkout
  src/app/api/galiopay/create-payment/route.ts — crea link de pago
  src/app/api/galiopay/webhook/route.ts — procesa confirmacion de pago
  src/lib/email.ts — email de entrega post-compra
  src/app/bellezagracias/page.tsx — dashboard post-compra
  .env.local — variables de entorno (NO subir a git)

---

## CHECKLIST FINAL ANTES DE LANZAR

  [ ] npm run dev — levanta sin errores de TypeScript
  [ ] Flujo quiz completo: Hero > Nombre > Nivel > Email > Loading > Sales page
  [ ] Modal checkout pre-llena nombre y email del quiz
  [ ] Supabase: 3 tablas creadas y con RLS activo
  [ ] Test de pago con precio $1 ARS
  [ ] Redirect correcto a /bellezagracias despues del pago
  [ ] Email de entrega llega con links correctos
  [ ] Orden aparece como "paid" en Supabase
  [ ] GalioPay Router actualizado con prefijo cb_
  [ ] Deploy en Vercel: build exitoso
  [ ] Imagenes .webp de cejas/pestañas en su lugar
  [ ] Volver al precio real ($4.900) y deployar
  [ ] Lanzar trafico con ads

---

## HISTORIAL DE CAMBIOS

  2026-04-05 | Claude (PC Mateo) | Setup inicial completo — quiz 6 pasos, sales page, email template, bellezagracias dashboard, .env.local, push a GitHub
