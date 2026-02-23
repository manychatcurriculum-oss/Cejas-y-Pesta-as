import nodemailer from "nodemailer";
import type { QuizAnswers, BMIResult, PersonalizedTips } from "@/store/types";
import { getLabel, getLabels } from "@/lib/label-map";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendDeliveryEmail(to: string, name: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gelatina-delta.vercel.app";

  const mailOptions = {
    from: `"Gelatina Fit" <${process.env.GMAIL_USER}>`,
    to,
    bcc: process.env.GMAIL_USER,
    subject: `¡Tu Plan Acelerado Gelatina Fit está listo, ${name}! 🎉`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background-color:#fdf2f8;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf2f8; padding:24px 16px;">
  <tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#ffffff; border-radius:24px; overflow:hidden; border:1px solid #fce7f3;">

    <!-- HEADER -->
    <tr>
      <td style="background:linear-gradient(135deg,#ec4899,#db2777); padding:40px 24px; text-align:center;">
        <p style="margin:0 0 6px 0; font-family:sans-serif; font-size:12px; color:rgba(255,255,255,0.75); letter-spacing:2px; text-transform:uppercase;">Plan Acelerado</p>
        <h1 style="margin:0; font-family:sans-serif; font-size:32px; font-weight:900; color:#ffffff;">Gelatina Fit 🌸</h1>
        <p style="margin:12px 0 0 0; font-family:sans-serif; font-size:16px; color:rgba(255,255,255,0.9);">¡Compra confirmada! Tu material está listo.</p>
      </td>
    </tr>

    <!-- BODY -->
    <tr>
      <td style="padding:32px 24px; font-family:sans-serif; color:#374151;">
        <p style="margin:0 0 8px 0; font-size:20px; font-weight:700; color:#1f2937;">Hola ${name} 👋</p>
        <p style="margin:0 0 28px 0; font-size:15px; color:#6b7280; line-height:1.7;">
          ¡Bienvenida a tu transformación! Tu <strong style="color:#db2777;">Plan Acelerado Gelatina Fit</strong> está disponible ahora mismo. Hacé clic en el botón para acceder a todos tus recursos.
        </p>

        <!-- CTA -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:8px 0 28px 0;">
              <a href="${siteUrl}/gracias"
                style="display:inline-block; background:linear-gradient(135deg,#ec4899,#db2777); color:#ffffff; font-family:sans-serif; font-size:18px; font-weight:800; text-decoration:none; padding:18px 40px; border-radius:50px; box-shadow:0 4px 20px rgba(219,39,119,0.35); letter-spacing:0.3px;">
                🚀 Acceder a mis recursos ahora
              </a>
            </td>
          </tr>
        </table>

        <!-- WHAT'S INCLUDED -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf2f8; border-radius:16px; border:1px solid #fce7f3;">
          <tr>
            <td style="padding:20px 20px 12px 20px;">
              <p style="margin:0 0 14px 0; font-size:13px; font-weight:700; color:#db2777; text-transform:uppercase; letter-spacing:1px;">Lo que vas a encontrar:</p>
              ${[
                "⚖️ Gelatina Fit — Plan Personalizado",
                "🍵 Té Mounjaro Japonés (Premium)",
                "🧬 Acelerador de Metabolismo",
                "🎯 Definición de Metas Diarias",
                "🥗 Plan de Alimentación Personalizado",
                "🛡️ Protocolo Anti Efecto Rebote",
                "💧 Protocolo 7 Días para Desinflamar",
                "⚡ Protocolo Anti Procrastinación",
                "🥣 Recetas Detox para Deshinchar",
                "📅 Dieta Detox 21 Días",
                "🥤 Jugos y Energizantes Naturales",
                "🌱 Detox para Cambiar tu Vida",
                "💊 Detox con Med",
                "🍹 21 Jugos Detox",
                "🔥 21 Jugos Detox para Perder Peso",
              ].map(item => `
              <p style="margin:0 0 8px 0; font-size:14px; color:#374151;">✓ ${item}</p>
              `).join("")}
            </td>
          </tr>
        </table>

        <!-- GUARANTEE -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px; background-color:#f0fdf4; border-radius:14px; border:1px solid #bbf7d0;">
          <tr>
            <td style="padding:16px 20px; font-family:sans-serif;">
              <p style="margin:0 0 4px 0; font-size:14px; font-weight:700; color:#166534;">🛡️ Garantía de satisfacción 30 días</p>
              <p style="margin:0; font-size:13px; color:#16a34a; line-height:1.6;">Si por cualquier razón no estás satisfecha, te devolvemos el 100% de tu dinero. Respondé este email y lo resolvemos.</p>
            </td>
          </tr>
        </table>

        <p style="margin:24px 0 0 0; font-size:14px; color:#9ca3af; text-align:center;">
          ¿Problemas con el acceso? Respondé este email y te ayudamos. 💌
        </p>
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="background-color:#fdf2f8; padding:18px 24px; text-align:center; border-top:1px solid #fce7f3;">
        <p style="margin:0; font-family:sans-serif; font-size:12px; color:#9ca3af;">
          © ${new Date().getFullYear()} Gelatina Fit · Recibiste este email porque realizaste una compra en nuestro sitio.
        </p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendQuizCompletionNotification(
  answers: QuizAnswers,
  bmiResult: BMIResult | null,
  personalizedTips?: PersonalizedTips | null
) {
  const now = new Date();
  const fecha = now.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const mailOptions = {
    from: `"Gelatina Fit" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: `📋 Quiz completado por ${answers.name || "Sin nombre"} - ${fecha}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; background-color: #fff;">
        <div style="background-color: #7c3aed; padding: 24px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 22px;">Nuevo Quiz Completado</h1>
          <p style="margin-top: 6px; font-size: 14px; opacity: 0.9;">${fecha}</p>
        </div>

        <div style="padding: 24px; color: #374151; line-height: 1.6; font-size: 14px;">
          <h2 style="margin-top: 0; font-size: 18px; color: #7c3aed;">Datos de la persona</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 8px 4px; font-weight: bold; width: 40%;">Nombre</td>
              <td style="padding: 8px 4px;">${answers.name || "—"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 8px 4px; font-weight: bold;">Edad</td>
              <td style="padding: 8px 4px;">${getLabel("age", answers.age)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 8px 4px; font-weight: bold;">Tipo de cuerpo</td>
              <td style="padding: 8px 4px;">${getLabel("bodyType", answers.bodyType)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 8px 4px; font-weight: bold;">Zonas problemáticas</td>
              <td style="padding: 8px 4px;">${getLabels("fatZones", answers.fatZones)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 8px 4px; font-weight: bold;">Impacto del peso</td>
              <td style="padding: 8px 4px;">${getLabel("weightImpact", answers.weightImpact)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 8px 4px; font-weight: bold;">Feliz con su apariencia</td>
              <td style="padding: 8px 4px;">${getLabel("happyWithAppearance", answers.happyWithAppearance)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 8px 4px; font-weight: bold;">Obstáculos</td>
              <td style="padding: 8px 4px;">${getLabels("barriers", answers.barriers)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 8px 4px; font-weight: bold;">Objetivos</td>
              <td style="padding: 8px 4px;">${getLabels("goals", answers.goals)}</td>
            </tr>
          </table>

          <h2 style="margin-top: 24px; font-size: 18px; color: #7c3aed;">Datos físicos</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 8px 4px; font-weight: bold; width: 40%;">Peso actual</td>
              <td style="padding: 8px 4px;">${answers.currentWeight} kg</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 8px 4px; font-weight: bold;">Altura</td>
              <td style="padding: 8px 4px;">${answers.height} cm</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 8px 4px; font-weight: bold;">Peso deseado</td>
              <td style="padding: 8px 4px;">${answers.desiredWeight} kg</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 8px 4px; font-weight: bold;">Embarazos</td>
              <td style="padding: 8px 4px;">${getLabel("pregnancies", answers.pregnancies)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 8px 4px; font-weight: bold;">Rutina diaria</td>
              <td style="padding: 8px 4px;">${getLabel("dailyRoutine", answers.dailyRoutine)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 8px 4px; font-weight: bold;">Horas de sueño</td>
              <td style="padding: 8px 4px;">${getLabel("sleepHours", answers.sleepHours)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 8px 4px; font-weight: bold;">Consumo de agua</td>
              <td style="padding: 8px 4px;">${getLabel("waterIntake", answers.waterIntake)}</td>
            </tr>
          </table>

          ${bmiResult ? `
          <h2 style="margin-top: 24px; font-size: 18px; color: #7c3aed;">Resultado BMI</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 8px 4px; font-weight: bold; width: 40%;">IMC</td>
              <td style="padding: 8px 4px;"><strong style="color: ${bmiResult.color};">${bmiResult.value}</strong> (${bmiResult.label})</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 8px 4px; font-weight: bold;">Peso a perder</td>
              <td style="padding: 8px 4px;">${bmiResult.weightToLose} kg</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 8px 4px; font-weight: bold;">Tiempo estimado</td>
              <td style="padding: 8px 4px;">${bmiResult.timeEstimate}</td>
            </tr>
          </table>
          ` : ""}

          ${personalizedTips ? `
          <h2 style="margin-top: 24px; font-size: 18px; color: #7c3aed;">Respuesta de IA (lo que vio la persona)</h2>
          <div style="background-color: #faf5ff; padding: 16px; border-radius: 12px; border: 1px solid #e9d5ff; margin-top: 8px;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #6d28d9;">Saludo:</p>
            <p style="margin: 0 0 12px 0; font-size: 14px;">${personalizedTips.greeting}</p>

            <p style="margin: 0 0 8px 0; font-weight: bold; color: #6d28d9;">Diagnóstico:</p>
            <p style="margin: 0 0 12px 0; font-size: 14px;">${personalizedTips.analysis}</p>

            <p style="margin: 0 0 8px 0; font-weight: bold; color: #6d28d9;">Recomendaciones:</p>
            <ul style="padding-left: 16px; margin: 0 0 12px 0;">
              ${personalizedTips.tips.map((t) => `<li style="margin-bottom: 6px; font-size: 14px;">${t.icon} <strong>${t.title}</strong>: ${t.description}</li>`).join("")}
            </ul>

            <p style="margin: 0 0 8px 0; font-weight: bold; color: #6d28d9;">Motivación:</p>
            <p style="margin: 0; font-size: 14px; font-style: italic;">${personalizedTips.motivation}</p>
          </div>
          ` : ""}

          <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 24px;">
            Esta persona aún NO compró. Solo completó el cuestionario.
          </p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
