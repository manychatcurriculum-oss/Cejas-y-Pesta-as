"use client";

import { PRICE, PRICE_ORIGINAL } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

interface StickyCheckoutBarProps {
  onCheckout: () => void;
  loading?: boolean;
}

export default function StickyCheckoutBar({ onCheckout, loading }: StickyCheckoutBarProps) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "linear-gradient(to right, #ec4899, #db2777)",
        padding: "12px 16px",
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "448px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        {/* Price info */}
        <div style={{ color: "white", flexShrink: 0 }}>
          <p
            style={{
              fontSize: "11px",
              textDecoration: "line-through",
              opacity: 0.75,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {formatPrice(PRICE_ORIGINAL)}
          </p>
          <p style={{ fontSize: "20px", fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
            {formatPrice(PRICE)}{" "}
            <span style={{ fontSize: "12px", fontWeight: 600 }}>ARS</span>
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={onCheckout}
          disabled={loading}
          style={{
            flex: 1,
            backgroundColor: "white",
            color: "#db2777",
            fontWeight: 700,
            fontSize: "14px",
            padding: "12px 16px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? "Procesando..." : "Quiero mi plan →"}
        </button>
      </div>
    </div>
  );
}
