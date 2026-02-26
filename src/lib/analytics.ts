// Analytics helpers - ready for Meta Pixel / GTM integration
// Replace with actual implementation when pixel IDs are available

export function trackEvent(eventName: string, params?: Record<string, unknown>, eventId?: string) {
  if (typeof window === "undefined") return;

  // Mapping for GA4 vs Meta Standard events
  let gaEventName = eventName.toLowerCase().replace(/ /g, "_");
  const metaEventName = eventName;

  // Specific mapping for GA4 Ecommerce
  if (eventName === "InitiateCheckout") gaEventName = "begin_checkout";
  if (eventName === "Purchase") gaEventName = "purchase";

  // Meta Pixel — pass eventID for deduplication with CAPI
  const win = window as unknown as Record<string, (...args: unknown[]) => void>;
  if (typeof win.fbq === "function") {
    if (eventId) {
      win.fbq("track", metaEventName, params, { eventID: eventId });
    } else {
      win.fbq("track", metaEventName, params);
    }
  }

  // Data layer for GTM / GA4
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({
      event: gaEventName,
      ...params,
      // Add GA4 specific e-commerce parameters if applicable
      items: params?.content_ids ? [{
        item_id: (params.content_ids as string[])[0],
        item_name: params.content_name,
        item_category: params.content_category,
        price: params.value,
        quantity: 1
      }] : undefined
    });
  }

  // Debug in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] Meta: ${metaEventName} | GA4: ${gaEventName}`, params);
  }
}

export function trackQuizStart() {
  trackEvent("quiz_start");
}

export function trackStepComplete(step: number, stepName: string) {
  trackEvent("step_complete", { step, stepName });
}

export function trackStepView(step: number) {
  trackEvent(`Step${step}`, { step_number: step });
}

export function trackQuizComplete() {
  trackEvent("quiz_complete");
}

export function trackBeginCheckout(price: number) {
  trackEvent("InitiateCheckout", { // Meta Standard Name
    value: price,
    currency: "ARS",
    content_name: "Gelatina Fit - Plan Personalizado",
    content_category: "Plan de Salud",
    content_ids: ["gelatina-fit-plan"],
    content_type: "product",
  });
}

export function trackPurchase(price: number, eventId?: string) {
  trackEvent("Purchase", { // Meta Standard Name
    value: price,
    currency: "ARS",
    content_name: "Gelatina Fit - Plan Personalizado",
    content_category: "Plan de Salud",
    content_ids: ["gelatina-fit-plan"],
    content_type: "product",
  }, eventId);
}
