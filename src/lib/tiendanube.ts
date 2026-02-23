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

export async function fetchTNOrders(from?: string, to?: string): Promise<TNOrder[]> {
  if (!STORE_ID || !ACCESS_TOKEN) throw new Error("Tienda Nube credentials not set");

  const allOrders: TNOrder[] = [];
  let page = 1;

  while (true) {
    const params = new URLSearchParams({
      per_page: "200",
      page: String(page),
      sort_by: "created_at",
      sort_direction: "desc",
    });

    if (from) params.set("created_at_min", from);
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      params.set("created_at_max", toDate.toISOString());
    }

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
