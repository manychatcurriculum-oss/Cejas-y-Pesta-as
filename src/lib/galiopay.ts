const API_BASE = process.env.GALIOPAY_API_BASE || "https://pay.galio.app/api";
const API_KEY = process.env.GALIOPAY_API_KEY!;
const CLIENT_ID = process.env.GALIOPAY_CLIENT_ID!;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
      "x-client-id": CLIENT_ID,
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || `GalioPay error ${res.status}`);
  return data as T;
}

export interface CreatePaymentLinkPayload {
  items: { title: string; quantity: number; unitPrice: number; currency: string }[];
  referenceId: string;
  description?: string;
  callbackUrls: { success: string; failure: string };
}

export interface PaymentLinkResponse {
  id: string;
  url: string;
  status: string;
}

export interface PaymentResponse {
  id: string;
  amount: number;
  currency: string;
  status: string;
  date?: string;
  netAmount?: number;
}

export function createPaymentLink(payload: CreatePaymentLinkPayload) {
  return request<PaymentLinkResponse>("/payment-links", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getPayment(paymentId: string) {
  return request<PaymentResponse>(`/payments/${paymentId}`);
}
