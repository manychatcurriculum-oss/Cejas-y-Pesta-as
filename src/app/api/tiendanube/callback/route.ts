import { NextRequest, NextResponse } from "next/server";

// After user authorizes the app, Tienda Nube redirects here with ?code=xxx
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch("https://www.tiendanube.com/apps/authorize/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.TIENDANUBE_CLIENT_ID,
        client_secret: process.env.TIENDANUBE_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
      }),
    });

    const tokenData = await tokenRes.json();
    const { access_token, user_id } = tokenData;

    if (!access_token || !user_id) {
      return NextResponse.json({ error: "Failed to get token", details: tokenData }, { status: 500 });
    }

    // Register the order/paid webhook
    const webhookRes = await fetch(`https://api.tiendanube.com/v1/${user_id}/webhooks`, {
      method: "POST",
      headers: {
        "Authentication": `bearer ${access_token}`,
        "User-Agent": "NDPROD (curriculumfacill@gmail.com)",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: "order/paid",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/tiendanube/webhook`,
      }),
    });

    const webhookData = await webhookRes.json();

    // Show the token and store ID so they can be added to .env
    return new NextResponse(`
      <html><body style="font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto;">
        <h2 style="color:#16a34a">✅ App conectada exitosamente</h2>
        <p>Guardá estos valores en tus variables de entorno de Vercel:</p>
        <pre style="background:#f3f4f6;padding:16px;border-radius:8px;font-size:14px;">
TIENDANUBE_ACCESS_TOKEN=${access_token}
TIENDANUBE_STORE_ID=${user_id}
        </pre>
        <p style="color:#6b7280;font-size:14px;">Webhook registrado: ${JSON.stringify(webhookData)}</p>
      </body></html>
    `, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
