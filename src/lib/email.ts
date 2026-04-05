import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function buildDeliveryEmail(name: string, siteUrl: string, variant: number): { subject: string; text: string; html: string } {
  if (variant === 0) {
    return {
      subject: `✨ ${name}, tu acceso a Masterclass Cejas & Pestañas ya está listo`,
      text: `Hola ${name},\n\nTu acceso a Masterclass Cejas & Pestañas ya está disponible.\n\nIngresá desde este enlace: ${siteUrl}/bellezagracias\n\nDentro vas a encontrar tus 13 módulos en video y el manual completo descargable.\n\nSi tenés algún inconveniente, respondé este email y te ayudamos.\n\nSaludos,\nMasterclass Cejas & Pestañas\n\n---\nRecibiste este mensaje porque realizaste una compra en nuestro sitio.`,
      html: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background-color:#fdf2f8; font-family:Arial, sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf2f8; padding:32px 16px;">
  <tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #fce7f3;">
    <tr>
      <td style="background: linear-gradient(135deg, #db2777, #be185d); padding:28px 24px; text-align:center;">
        <p style="margin:0; font-family:Arial, sans-serif; font-size:22px; font-weight:700; color:#ffffff;">✨ Masterclass Cejas & Pestañas</p>
        <p style="margin:6px 0 0 0; font-family:Arial, sans-serif; font-size:13px; color:rgba(255,255,255,0.85);">Tu acceso está listo</p>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 24px; color:#374151;">
        <p style="margin:0 0 16px 0; font-size:16px; color:#111827;">Hola ${name},</p>
        <p style="margin:0 0 20px 0; font-size:14px; color:#4b5563; line-height:1.7;">¡Tu compra fue confirmada! Hacé clic en el botón para acceder a todos tus materiales.</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:4px 0 24px 0;">
              <a href="${siteUrl}/bellezagracias" style="display:inline-block; background-color:#db2777; color:#ffffff; font-family:Arial, sans-serif; font-size:15px; font-weight:700; text-decoration:none; padding:14px 36px; border-radius:8px;">Acceder a mis materiales →</a>
            </td>
          </tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf2f8; border-radius:8px; border:1px solid #fce7f3;">
          <tr>
            <td style="padding:16px 20px;">
              <p style="margin:0 0 10px 0; font-size:13px; font-weight:700; color:#9d174d;">Lo que vas a encontrar:</p>
              <p style="margin:0 0 5px 0; font-size:13px; color:#374151;">🎬 13 módulos en video — acceso de por vida</p>
              <p style="margin:0 0 5px 0; font-size:13px; color:#374151;">✂️ Cejas perfectas y corrección profesional</p>
              <p style="margin:0 0 5px 0; font-size:13px; color:#374151;">💫 Lifting de pestañas paso a paso</p>
              <p style="margin:0 0 5px 0; font-size:13px; color:#374151;">👁️ Extensiones pelo a pelo y volumen ruso</p>
              <p style="margin:0; font-size:13px; color:#374151;">📖 Manual completo descargable</p>
            </td>
          </tr>
        </table>
        <p style="margin:20px 0 0 0; font-size:13px; color:#6b7280; line-height:1.6;">¿Algún problema para acceder? Respondé este email y te ayudamos a la brevedad.</p>
      </td>
    </tr>
    <tr>
      <td style="background-color:#fdf2f8; padding:16px 24px; text-align:center; border-top:1px solid #fce7f3;">
        <p style="margin:0; font-family:Arial, sans-serif; font-size:11px; color:#9ca3af;">Masterclass Cejas & Pestañas — Recibiste este email porque realizaste una compra.</p>
      </td>
    </tr>
  </table>
  </td></tr>
</table>
</body>
</html>`,
    };
  }

  if (variant === 1) {
    return {
      subject: `Tu acceso a Masterclass Cejas & Pestañas — Instrucciones`,
      text: `Hola ${name},\n\nGracias por tu compra. A continuación te enviamos el enlace para acceder a todo tu material.\n\nEnlace de acceso: ${siteUrl}/bellezagracias\n\nIncluye 13 módulos en video, manual PDF descargable y más.\n\nAnte cualquier consulta estamos disponibles respondiendo este email.\n\nMuchas gracias,\nMasterclass Cejas & Pestañas`,
      html: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background-color:#fff5f7; font-family:Arial, sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff5f7; padding:32px 16px;">
  <tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #fcd7e8;">
    <tr>
      <td style="padding:24px; border-bottom:3px solid #db2777;">
        <p style="margin:0; font-family:Arial, sans-serif; font-size:20px; font-weight:700; color:#db2777;">✨ Masterclass Cejas & Pestañas</p>
        <p style="margin:4px 0 0 0; font-family:Arial, sans-serif; font-size:12px; color:#9ca3af; text-transform:uppercase; letter-spacing:1px;">Confirmación de acceso</p>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 24px; color:#374151; font-family:Arial, sans-serif;">
        <p style="margin:0 0 14px 0; font-size:15px; color:#111827;">Estimada ${name},</p>
        <p style="margin:0 0 20px 0; font-size:14px; color:#4b5563; line-height:1.7;">Recibimos tu pago correctamente. A continuación encontrás el enlace para ingresar a todo el contenido incluido.</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:4px 0 24px 0;">
              <a href="${siteUrl}/bellezagracias" style="display:inline-block; background-color:#be185d; color:#ffffff; font-family:Arial, sans-serif; font-size:14px; font-weight:700; text-decoration:none; padding:13px 32px; border-radius:6px;">Ingresar a mi curso →</a>
            </td>
          </tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #fcd7e8; border-radius:6px;">
          <tr>
            <td style="padding:16px 20px;">
              <p style="margin:0 0 10px 0; font-size:13px; font-weight:700; color:#be185d;">Contenido incluido:</p>
              <p style="margin:0 0 5px 0; font-size:13px; color:#374151;">🎬 13 módulos en video con las 4 técnicas</p>
              <p style="margin:0 0 5px 0; font-size:13px; color:#374151;">📖 Manual completo PDF descargable</p>
              <p style="margin:0; font-size:13px; color:#374151;">♾️ Acceso de por vida sin fecha de vencimiento</p>
            </td>
          </tr>
        </table>
        <p style="margin:20px 0 0 0; font-size:13px; color:#6b7280; line-height:1.6;">Cualquier inconveniente con el acceso, respondé este mensaje.</p>
      </td>
    </tr>
    <tr>
      <td style="padding:14px 24px; text-align:center; border-top:1px solid #fcd7e8;">
        <p style="margin:0; font-family:Arial, sans-serif; font-size:11px; color:#9ca3af;">Masterclass Cejas & Pestañas — Compra realizada en nuestro sitio.</p>
      </td>
    </tr>
  </table>
  </td></tr>
</table>
</body>
</html>`,
    };
  }

  // variant === 2
  return {
    subject: `¡Listo ${name}! Ya podés ingresar a tu Masterclass`,
    text: `Hola ${name}!\n\nTodo salió bien con tu pago. Tu curso ya está esperándote.\n\nEntrá acá: ${siteUrl}/bellezagracias\n\nVas a encontrar los 13 módulos en video y el manual completo.\n\nSi algo no funciona bien, contestame este email directamente.\n\nUn saludo!\nMasterclass Cejas & Pestañas`,
    html: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background-color:#f3f4f6; font-family:Arial, sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6; padding:32px 16px;">
  <tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; overflow:hidden; border-radius:12px; border:1px solid #e5e7eb;">
    <tr>
      <td style="padding:20px 24px; border-bottom:1px solid #f3f4f6;">
        <p style="margin:0; font-family:Arial, sans-serif; font-size:18px; font-weight:700; color:#db2777;">✨ Masterclass Cejas & Pestañas</p>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 24px; color:#374151;">
        <p style="margin:0 0 8px 0; font-size:22px; font-weight:700; color:#111827; line-height:1.3;">Todo listo, ${name}.</p>
        <p style="margin:0 0 22px 0; font-size:14px; color:#6b7280; line-height:1.7;">Tu curso ya está disponible. Hacé clic abajo para acceder a todo el contenido.</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:4px 0 26px 0; text-align:center;">
              <a href="${siteUrl}/bellezagracias" style="display:inline-block; background-color:#db2777; color:#ffffff; font-family:Arial, sans-serif; font-size:15px; font-weight:700; text-decoration:none; padding:14px 32px; border-radius:8px;">Acceder ahora →</a>
            </td>
          </tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf2f8; border-radius:8px;">
          <tr>
            <td style="padding:16px 20px;">
              <p style="margin:0 0 10px 0; font-size:12px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.8px;">Lo que incluye tu curso</p>
              <p style="margin:0 0 6px 0; font-size:13px; color:#374151;">🎬 13 módulos en video completos</p>
              <p style="margin:0 0 6px 0; font-size:13px; color:#374151;">✂️ Cejas, lifting, pelo a pelo y volumen ruso</p>
              <p style="margin:0 0 6px 0; font-size:13px; color:#374151;">📋 Módulo de marketing para tu negocio</p>
              <p style="margin:0; font-size:13px; color:#374151;">📖 Manual completo en PDF</p>
            </td>
          </tr>
        </table>
        <p style="margin:20px 0 6px 0; font-size:13px; color:#6b7280; line-height:1.6;">Si no podés acceder, contestá este email.</p>
      </td>
    </tr>
    <tr>
      <td style="padding:14px 24px; text-align:center; border-top:1px solid #f3f4f6;">
        <p style="margin:0; font-size:11px; color:#9ca3af; font-family:Arial, sans-serif;">Masterclass Cejas & Pestañas — Compraste en nuestro sitio web.</p>
      </td>
    </tr>
  </table>
  </td></tr>
</table>
</body>
</html>`,
  };
}

export async function sendDeliveryEmail(to: string, name: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const variant = Math.floor(Math.random() * 3);
  const { subject, text, html } = buildDeliveryEmail(name, siteUrl, variant);

  const mailOptions = {
    from: `"Masterclass Cejas & Pestañas" <${process.env.GMAIL_USER}>`,
    to,
    bcc: process.env.GMAIL_USER,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
}
