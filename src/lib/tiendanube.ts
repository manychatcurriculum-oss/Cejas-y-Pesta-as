const STORE_ID = process.env.TIENDANUBE_STORE_ID;
const ACCESS_TOKEN = process.env.TIENDANUBE_ACCESS_TOKEN;
const USER_AGENT = "NDPROD (curriculumfacill@gmail.com)";

export interface TNOrder {
  id: number;
  payment_status: string;
  status: string;
  contact_email: string;
  contact_name: string;
  total: string;
  created_at: string;
  closed_at: string | null;
  gateway_name: string;
}

async function fetchTNOrdersChunk(chunkFrom: string, chunkTo: string): Promise<TNOrder[]> {
  const allOrders: TNOrder[] = [];
  let page = 1;

  while (true) {
    const params = new URLSearchParams({
      per_page: "200",
      page: String(page),
      sort_by: "created_at",
      sort_direction: "asc",
      created_at_min: chunkFrom,
      created_at_max: chunkTo,
    });

    const res = await fetch(`https://api.tiendanube.com/v1/${STORE_ID}/orders?${params}`, {
      headers: {
        Authentication: `bearer ${ACCESS_TOKEN}`,
        "User-Agent": USER_AGENT,
      },
    });

    if (!res.ok) break;

    const data: TNOrder[] = await res.json();
    if (!data.length) break;

    allOrders.push(...data);
    if (data.length < 200) break;
    page++;
  }

  return allOrders;
}

export async function fetchTNOrders(from?: string, to?: string): Promise<TNOrder[]> {
  if (!STORE_ID || !ACCESS_TOKEN) throw new Error("Tienda Nube credentials not set");

  const startDate = new Date((from || "2026-01-01") + "T00:00:00.000Z");
  const endDate = to
    ? new Date(to + "T23:59:59.999Z")
    : new Date();

  // Split into monthly chunks to bypass the 1000-order API limit
  const allOrders: TNOrder[] = [];
  const seen = new Set<number>();

  let cursor = new Date(startDate);
  while (cursor <= endDate) {
    const chunkStart = cursor.toISOString();
    // End of this chunk = last millisecond of the same month
    const chunkEnd = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1) - 1);
    const chunkEndCapped = chunkEnd > endDate ? endDate : chunkEnd;

    const chunk = await fetchTNOrdersChunk(chunkStart, chunkEndCapped.toISOString());
    for (const o of chunk) {
      if (!seen.has(o.id)) {
        seen.add(o.id);
        allOrders.push(o);
      }
    }

    // Advance to first day of next month
    cursor = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1));
  }

  return allOrders;
}
