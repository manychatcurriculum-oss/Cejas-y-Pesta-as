"use client";

import { useState } from "react";
import { trackBeginCheckout } from "@/lib/analytics";
import { PRODUCT_NAME, PRICE, PRICE_ORIGINAL, BENEFITS, FAQ_ITEMS, COMPARISON_TABLE, DELIVERABLES, CURRICULUM } from "@/lib/constants";
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

function PinkCTA({ label, sublabel }: { label: string; sublabel?: string }) {
  return (
    <button
      onClick={scrollToPricing}
      className="w-full relative overflow-hidden bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-500/40 hover:from-pink-600 hover:to-pink-700 active:scale-[0.97] transition-all text-base"
    >
      <span aria-hidden="true" className="animate-shimmer absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
      <span className="relative z-10 flex flex-col items-center gap-0.5">
        <span>{label}</span>
        {sublabel && <span className="text-xs font-normal opacity-80">{sublabel}</span>}
      </span>
    </button>
  );
}

function GoldCTA({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-extrabold py-5 rounded-2xl shadow-xl shadow-amber-500/40 hover:from-yellow-500 hover:to-amber-600 active:scale-[0.97] transition-all text-lg disabled:opacity-50"
    >
      {loading ? "Procesando..." : `Quiero el curso por $${PRICE.toLocaleString("es-AR")} →`}
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

export default function Step06Sales() {
  const [loading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCheckout = () => {
    trackBeginCheckout(PRICE);
    setModalOpen(true);
  };

  const discount = Math.round((1 - PRICE / PRICE_ORIGINAL) * 100);

  return (
    <div className="space-y-8 pb-24">
      <GalioPayModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* 1. HERO */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-full px-3 py-1.5">
          <span className="text-sm font-semibold text-pink-600">✨ Nuevo lanzamiento — precio de apertura</span>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
          Aprendé cejas y pestañas profesionales.{" "}
          <span className="text-pink-600">Empezá a cobrar este mes.</span>
        </h2>
        <p className="text-gray-600">
          13 módulos en video + manual PDF. Todo lo que necesitás para atender clientas desde tu casa — sin experiencia previa.
        </p>
      </div>

      {/* 2. SOCIAL PROOF */}
      <div className="bg-white rounded-2xl border border-pink-100 p-4">
        <div className="flex items-center justify-around">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-pink-600">+500</p>
            <p className="text-xs text-gray-500 mt-0.5">alumnas<br/>formadas</p>
          </div>
          <div className="w-px h-10 bg-gray-100" />
          <div className="text-center">
            <p className="text-2xl font-extrabold text-pink-600">⭐ 5.0</p>
            <p className="text-xs text-gray-500 mt-0.5">calificación<br/>promedio</p>
          </div>
          <div className="w-px h-10 bg-gray-100" />
          <div className="text-center">
            <p className="text-2xl font-extrabold text-pink-600">30 días</p>
            <p className="text-xs text-gray-500 mt-0.5">garantía<br/>total</p>
          </div>
        </div>
      </div>

      {/* 3. COUNTDOWN */}
      <CountdownTimer />

      {/* 4. CTA #1 */}
      <div className="space-y-3">
        <PinkCTA label={`Acceder por $${PRICE.toLocaleString("es-AR")} ARS →`} sublabel="Pago único · Sin suscripción · Garantía 30 días" />
        <DeliveryBadge />
      </div>

      {/* 5. PARA QUIÉN ES */}
      <div className="space-y-3">
        <div className="text-center">
          <p className="text-xs font-bold text-pink-500 uppercase tracking-wide">Este curso es para vos si...</p>
        </div>
        <div className="space-y-2">
          {[
            { icon: "💸", text: "Querés una fuente de ingresos propia que no dependa de un jefe ni un horario" },
            { icon: "💅", text: "Te gusta el mundo de la belleza y querés vivir de eso" },
            { icon: "🏠", text: "Necesitás algo que puedas hacer desde tu casa, con horarios flexibles" },
            { icon: "📱", text: "Ya viste mil tutoriales gratis pero nunca llegaste al nivel profesional" },
            { icon: "✂️", text: "Ya trabajás en belleza y querés sumar cejas y pestañas a tu menú" },
          ].map((item) => (
            <div key={item.text} className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-pink-100">
              <span className="text-xl shrink-0">{item.icon}</span>
              <span className="text-sm text-gray-700">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. QUÉ INCLUYE */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h3 className="text-xl font-extrabold text-gray-900">Todo lo que aprendés en el curso</h3>
          <p className="text-sm text-gray-500">13 módulos en video · Acceso de por vida</p>
        </div>

        {/* Main deliverable */}
        <div className="flex items-start gap-3 rounded-xl p-4 bg-gradient-to-r from-pink-50 to-white border-2 border-pink-400">
          <span className="text-green-500 shrink-0 mt-0.5 font-bold text-lg">✓</span>
          <div>
            <p className="font-bold text-pink-700">{DELIVERABLES[0].name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{DELIVERABLES[0].description}</p>
          </div>
        </div>

        {/* Curriculum grid */}
        <div className="bg-white rounded-2xl border border-pink-100 p-4 space-y-2">
          <p className="text-xs font-bold text-pink-500 uppercase tracking-wide text-center mb-3">Lo que cubrimos módulo a módulo</p>
          {CURRICULUM.map((item) => (
            <div key={item.title} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
              <span className="text-xl shrink-0 leading-tight">{item.icon}</span>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Extras */}
        <div className="flex items-start gap-3 rounded-xl p-3.5 bg-gray-50 border border-gray-100">
          <span className="text-green-500 shrink-0 mt-0.5 font-bold">✓</span>
          <div>
            <p className="font-bold text-sm text-gray-800">Certificado digital al completar</p>
            <p className="text-xs text-gray-500 mt-0.5">Para mostrar a tus clientas y en tus redes</p>
          </div>
        </div>
      </div>

      {/* CÓMO FUNCIONA */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-900 text-center">¿Cómo funciona?</h3>
        <div className="space-y-3">
          {[
            { step: "1", title: "Pagás por transferencia bancaria", desc: "En pesos argentinos 🇦🇷, pago único. Sin cuotas, sin suscripciones, sin dólares." },
            { step: "2", title: "Acceso inmediato por email", desc: "En minutos te llega el link con todos los videos. Abrís y empezás hoy mismo." },
            { step: "3", title: "Aprendés y empezás a cobrar", desc: "Avanzás a tu ritmo. En pocas semanas ya podés atender tu primera clienta." },
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

      {/* 7. CTA #2 */}
      <div className="space-y-3">
        <PinkCTA label="Quiero empezar ahora →" sublabel={`Solo $${PRICE.toLocaleString("es-AR")} ARS · Pago único`} />
        <DeliveryBadge />
      </div>

      {/* 8. BENEFICIOS */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-900 text-center">Por qué este curso funciona</h3>
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

      {/* 9. CTA #3 */}
      <PinkCTA label="Acceder al curso →" sublabel="Pago único · Sin suscripción" />

      {/* 10. COMPARATIVA */}
      <ComparisonTable />

      {/* 11. TESTIMONIOS */}
      <TestimonialCarousel />

      {/* 12. CTA #4 */}
      <div className="space-y-3">
        <PinkCTA label="Sí, quiero este curso →" sublabel="Garantía de devolución 30 días" />
        <DeliveryBadge />
      </div>

      {/* 13. ESCASEZ */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <span className="text-xl shrink-0">⚠️</span>
        <div>
          <p className="text-sm font-bold text-amber-800">El precio de $4.900 ARS es de lanzamiento</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Puede aumentar en cualquier momento. Comprás hoy, accedés de por vida al precio de hoy.
          </p>
        </div>
      </div>

      {/* 14. PRICING CARD */}
      <div id="pricing" className="bg-gradient-to-b from-pink-600 to-pink-700 rounded-3xl p-6 text-white space-y-5 shadow-2xl shadow-pink-500/40">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-yellow-900 font-bold text-sm px-3 py-1 rounded-full">
            🔴 {discount}% OFF — Precio de lanzamiento
          </div>
          <h3 className="text-2xl font-extrabold mt-2">{PRODUCT_NAME}</h3>
          <p className="text-pink-200 text-sm">Acceso completo · De por vida</p>
        </div>

        <div className="text-center space-y-1">
          <p className="text-pink-300 line-through text-lg">${PRICE_ORIGINAL.toLocaleString("es-AR")} ARS</p>
          <p className="text-5xl font-extrabold text-yellow-300">${PRICE.toLocaleString("es-AR")}</p>
          <p className="text-pink-200 text-sm">pesos argentinos 🇦🇷 · pago único</p>
        </div>

        <div className="space-y-2 bg-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-300">✓</span>
            <span>13 módulos en video HD · Acceso de por vida</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-300">✓</span>
            <span>4 técnicas: cejas, lifting, pelo a pelo, volumen ruso</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-300">✓</span>
            <span>Módulo de marketing para conseguir clientas</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-300">✓</span>
            <span>Certificado digital al completar</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-300">✓</span>
            <span>Garantía 30 días — devolución sin preguntas</span>
          </div>
        </div>

        <GoldCTA onClick={handleCheckout} loading={loading} />

        <div className="flex items-center justify-center gap-2 text-pink-200 text-xs">
          <span>🛡️</span>
          <span>Si no te convence en 30 días, te devolvemos el dinero. Sin preguntas.</span>
        </div>
      </div>

      {/* 15. GUARANTEE */}
      <GuaranteeSection />

      {/* 16. CTA FINAL */}
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

      {/* 17. FAQ */}
      <FAQAccordion />

      {/* 18. CTA FINAL */}
      <div className="space-y-3">
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-500/40 hover:from-pink-600 hover:to-pink-700 active:scale-[0.97] transition-all text-base disabled:opacity-50"
        >
          Sí, quiero el curso →
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
          <a href="/privacidad" className="underline">política de privacidad</a>.
        </p>
      </div>

      <LivePurchaseToast />
    </div>
  );
}
