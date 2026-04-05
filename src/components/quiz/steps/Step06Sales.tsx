"use client";

import { useState } from "react";
import { useQuizStore } from "@/store/quizStore";
import { trackBeginCheckout } from "@/lib/analytics";
import { PRODUCT_NAME, PRICE, PRICE_ORIGINAL, BENEFITS, TESTIMONIALS, FAQ_ITEMS, COMPARISON_TABLE, DELIVERABLES } from "@/lib/constants";
import GalioPayModal from "@/components/sales/GalioPayModal";
import CountdownTimer from "@/components/sales/CountdownTimer";
import GuaranteeSection from "@/components/sales/GuaranteeSection";
import FAQAccordion from "@/components/sales/FAQAccordion";
import TestimonialCarousel from "@/components/sales/TestimonialCarousel";
import LivePurchaseToast from "@/components/sales/LivePurchaseToast";
import ComparisonTable from "@/components/sales/ComparisonTable";

function scrollToPricing() {
  const el = document.getElementById("pricing");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
}

interface ScrollCtaProps {
  label: string;
  sublabel?: string;
}

function ScrollCTA({ label, sublabel }: ScrollCtaProps) {
  return (
    <div className="animate-breathe">
      <button
        onClick={scrollToPricing}
        className="w-full relative overflow-hidden bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-500/40 hover:from-pink-600 hover:to-pink-700 active:scale-[0.97] transition-all text-base animate-pulse-pink"
      >
        <span aria-hidden="true" className="animate-shimmer absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
        <span className="relative z-10 flex flex-col items-center">
          <span className="flex items-center gap-1.5">
            <span>{label}</span>
          </span>
          {sublabel && (
            <span className="text-xs font-normal opacity-80 mt-0.5">{sublabel}</span>
          )}
        </span>
      </button>
    </div>
  );
}

function GoldCTA({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-extrabold py-5 rounded-2xl shadow-xl shadow-amber-500/40 hover:from-yellow-500 hover:to-amber-600 active:scale-[0.97] transition-all text-lg disabled:opacity-50"
    >
      {loading ? "Procesando..." : "Sí, quiero acceder ahora →"}
    </button>
  );
}

function DeliveryBadge() {
  return (
    <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-xl py-2.5 px-4">
      <span className="text-lg">📧</span>
      <p className="text-sm text-green-700 font-medium">
        Acceso <strong>inmediato</strong> por email al comprar
      </p>
    </div>
  );
}

const LEVEL_MESSAGES: Record<string, { subtitle: string; badge: string }> = {
  beginner: {
    subtitle: "Empezás de cero y llegás a cobrar por tu trabajo.",
    badge: "🌱 Perfecto para principiantes",
  },
  intermediate: {
    subtitle: "Ya tenés la base. Ahora subís al siguiente nivel.",
    badge: "📚 Ideal para seguir creciendo",
  },
  professional: {
    subtitle: "Sumás 4 técnicas top a tu menú de servicios.",
    badge: "💼 Para profesionales que quieren más",
  },
};

export default function Step06Sales() {
  const { answers } = useQuizStore();
  const [loading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const levelMsg = LEVEL_MESSAGES[answers.level] || {
    subtitle: "Tu camino al mundo de la belleza profesional empieza acá.",
    badge: "✨ Personalizado para vos",
  };

  const handleCheckout = () => {
    trackBeginCheckout(PRICE);
    setModalOpen(true);
  };

  const discount = Math.round((1 - PRICE / PRICE_ORIGINAL) * 100);

  return (
    <div className="space-y-8 pb-24">
      <GalioPayModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* 1. HERO PERSONALIZADO */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-full px-3 py-1.5">
          <span className="text-sm">{levelMsg.badge}</span>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
          {answers.name ? `${answers.name}, ` : ""}tu camino al mundo de la{" "}
          <span className="text-pink-600">belleza profesional</span> empieza acá
        </h2>
        <p className="text-gray-600 font-medium">{levelMsg.subtitle}</p>
      </div>

      {/* 2. SOCIAL PROOF */}
      <div className="bg-white rounded-2xl border border-pink-100 p-4">
        <div className="flex items-center justify-around">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-pink-600">+500</p>
            <p className="text-xs text-gray-500 mt-0.5">alumnas que<br/>ya aprendieron</p>
          </div>
          <div className="w-px h-10 bg-gray-100" />
          <div className="text-center">
            <p className="text-2xl font-extrabold text-pink-600">⭐ 4.9</p>
            <p className="text-xs text-gray-500 mt-0.5">calificación<br/>promedio</p>
          </div>
          <div className="w-px h-10 bg-gray-100" />
          <div className="text-center">
            <p className="text-2xl font-extrabold text-pink-600">30 días</p>
            <p className="text-xs text-gray-500 mt-0.5">garantía de<br/>devolución</p>
          </div>
        </div>
      </div>

      {/* 3. COUNTDOWN */}
      <CountdownTimer />

      {/* 4. CTA #1 */}
      <div className="space-y-3">
        <ScrollCTA label="Quiero acceder al curso →" sublabel="Acceso inmediato · Garantía 30 días" />
        <DeliveryBadge />
      </div>

      {/* 5. "ESTO ES PARA VOS SI..." */}
      <div className="space-y-3">
        <div className="text-center">
          <p className="text-xs font-bold text-pink-500 uppercase tracking-wide">Esto es para vos si...</p>
          <h3 className="text-xl font-bold text-gray-900 mt-1">Te sentís identificada con algo de esto</h3>
        </div>
        <div className="space-y-2">
          {[
            { icon: "😔", text: "Querés generar tus propios ingresos pero no sabés por dónde empezar" },
            { icon: "💅", text: "Te apasiona la belleza y querés convertirlo en un negocio rentable" },
            { icon: "⏰", text: "Necesitás flexibilidad horaria para trabajar a tu propio ritmo" },
            { icon: "📱", text: "Querés aprender desde tu casa sin pagar cursos presenciales caros" },
            { icon: "✂️", text: "Ya trabajás en belleza pero querés sumar técnicas que se pagan muy bien" },
            { icon: "💰", text: "Buscás independencia económica sin depender de un jefe" },
          ].map((item) => (
            <div key={item.text} className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-pink-100">
              <span className="text-xl shrink-0">{item.icon}</span>
              <span className="text-sm text-gray-700">{item.text}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-sm font-semibold text-pink-600">
          Si marcaste aunque sea una → {PRODUCT_NAME} es para vos.
        </p>
      </div>

      {/* 6. QUÉ INCLUYE */}
      <div className="bg-white rounded-2xl p-5 border border-pink-100 space-y-4">
        <h3 className="text-xl font-extrabold text-gray-900 text-center">Esto es todo lo que recibís</h3>
        <div className="space-y-3">
          {DELIVERABLES.map((item) => (
            <div key={item.name} className={`flex items-start gap-3 rounded-xl p-3.5 ${item.isMain ? "bg-gradient-to-r from-pink-50 to-white border-2 border-pink-400" : "bg-gray-50 border border-gray-100"}`}>
              <span className="text-green-500 shrink-0 mt-0.5 font-bold">✓</span>
              <div>
                <p className={`font-bold text-sm ${item.isMain ? "text-pink-700" : "text-gray-800"}`}>{item.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. CTA #2 */}
      <div className="space-y-3">
        <ScrollCTA label="Empezar mi formación →" sublabel="Solo por hoy · $4.900 ARS 🇦🇷" />
        <DeliveryBadge />
      </div>

      {/* 8. CÓMO FUNCIONA */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-900 text-center">¿Cómo funciona?</h3>
        <div className="space-y-3">
          {[
            { step: "1", title: "Comprás el curso", desc: "Pago único en segundos con GalioPay — seguro y sin suscripciones" },
            { step: "2", title: "Acceso inmediato", desc: "Te llega el link al email al instante. Abrís y empezás hoy mismo" },
            { step: "3", title: "Aprendés y cobrás", desc: "Avanzás a tu ritmo. En pocas semanas ya podés atender clientas" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-pink-100">
              <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {item.step}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{item.title}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 9. BENEFICIOS */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-900 text-center">Por qué elegir este curso</h3>
        <div className="grid grid-cols-1 gap-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-pink-100">
              <span className="text-2xl shrink-0">{b.icon}</span>
              <div>
                <p className="font-semibold text-gray-800">{b.title}</p>
                <p className="text-sm text-gray-500">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 10. CTA #3 */}
      <ScrollCTA label="Obtener acceso ahora →" sublabel="Pago único · Sin suscripción" />

      {/* 11. COMPARATIVA */}
      <ComparisonTable />

      {/* 12. TESTIMONIOS */}
      <TestimonialCarousel />

      {/* 13. CTA #4 */}
      <div className="space-y-3">
        <ScrollCTA label="Quiero todo esto →" sublabel="+ Garantía de devolución 30 días" />
        <DeliveryBadge />
      </div>

      {/* 14. ESCASEZ */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <span className="text-xl shrink-0">⚠️</span>
        <div>
          <p className="text-sm font-bold text-amber-800">Precio promocional por tiempo limitado</p>
          <p className="text-xs text-amber-700 mt-0.5">
            El precio de $4.900 🇦🇷 puede actualizarse en cualquier momento. Accedé hoy y asegurá el precio.
          </p>
        </div>
      </div>

      {/* 15. PRICING CARD */}
      <div id="pricing" className="bg-gradient-to-b from-pink-600 to-pink-700 rounded-3xl p-6 text-white space-y-5 shadow-2xl shadow-pink-500/40">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-yellow-900 font-bold text-sm px-3 py-1 rounded-full">
            🔴 {discount}% OFF — Promo por tiempo limitado
          </div>
          <h3 className="text-2xl font-extrabold mt-2">{PRODUCT_NAME}</h3>
          <p className="text-pink-200 text-sm">Acceso completo de por vida</p>
        </div>

        <div className="text-center space-y-1">
          <p className="text-pink-300 line-through text-lg">${PRICE_ORIGINAL.toLocaleString("es-AR")} ARS 🇦🇷</p>
          <p className="text-5xl font-extrabold text-yellow-300">${PRICE.toLocaleString("es-AR")}</p>
          <p className="text-pink-200 text-sm">pesos argentinos 🇦🇷 · pago único</p>
        </div>

        <div className="space-y-2 bg-white/10 rounded-2xl p-4">
          {DELIVERABLES.map((d) => (
            <div key={d.name} className="flex items-center gap-2 text-sm">
              <span className="text-green-300">✓</span>
              <span>{d.name}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-300">✓</span>
            <span>Certificado digital al completar</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-300">✓</span>
            <span>Garantía 30 días sin preguntas</span>
          </div>
        </div>

        <GoldCTA onClick={handleCheckout} loading={loading} />

        <div className="flex items-center justify-center gap-2 text-pink-200 text-xs">
          <span>🛡️</span>
          <span>Garantía total 30 días · Devolución sin preguntas</span>
        </div>
      </div>

      {/* 16. GUARANTEE */}
      <GuaranteeSection />

      {/* 17. CTA #5 */}
      <div className="space-y-3">
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-500/40 hover:from-pink-600 hover:to-pink-700 active:scale-[0.97] transition-all text-base disabled:opacity-50"
        >
          Comprar sin riesgo — Garantía 30 días →
        </button>
        <DeliveryBadge />
      </div>

      {/* 18. FAQ */}
      <FAQAccordion />

      {/* 19. CTA FINAL */}
      <div className="space-y-3">
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-500/40 hover:from-pink-600 hover:to-pink-700 active:scale-[0.97] transition-all text-base disabled:opacity-50"
        >
          Sí, quiero acceder a {PRODUCT_NAME} →
        </button>
        <p className="text-center text-xs text-gray-400">
          $4.900 ARS 🇦🇷 · Pago único · Sin suscripción
        </p>
        <DeliveryBadge />
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-400">
          Al comprar aceptás nuestros{" "}
          <a href="/terminos" className="underline">términos</a> y{" "}
          <a href="/privacidad" className="underline">política de privacidad</a>.{" "}
          Este producto no garantiza resultados específicos.
        </p>
      </div>

      <LivePurchaseToast />
    </div>
  );
}
