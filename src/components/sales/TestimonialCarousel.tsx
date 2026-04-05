"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { TESTIMONIALS } from "@/lib/constants";

export default function TestimonialCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);

  const scroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || isPaused.current) return;

    el.scrollLeft += 1;

    if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
      el.scrollLeft = 0;
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(scroll, 30);
    return () => clearInterval(interval);
  }, [scroll]);

  const handlePointerDown = () => { isPaused.current = true; };
  const handlePointerUp = () => { isPaused.current = false; };

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-bold text-gray-900 text-center">
        Lo que dicen nuestras estudiantes
      </h3>

      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
      >
        {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
          <div
            key={`${t.name}-${i}`}
            className="shrink-0 w-[280px] bg-white rounded-2xl border border-pink-100 overflow-hidden"
          >
            <Image
              src={t.avatar}
              alt={`Testimonio de ${t.name}`}
              width={280}
              height={200}
              className="w-full h-48 object-cover"
            />

            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.location}</p>
                </div>
                <div className="text-yellow-400 text-sm">★★★★★</div>
              </div>

              <p className="text-sm text-gray-600 italic leading-relaxed">
                &quot;{t.text}&quot;
              </p>

              <div className="bg-pink-50 rounded-lg px-3 py-1.5 inline-block">
                <p className="text-xs font-semibold text-pink-600">
                  ✨ {t.result}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
