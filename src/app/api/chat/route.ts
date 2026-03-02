import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `Sos un asistente nutricional de "Gelatina Fit", un plan basado en gelatina con colágeno hidrolizado que ayuda a bajar de peso, reducir hinchazón y mejorar la piel. No menciones nombres propios ni credenciales.

Tu misión es ayudar a las mujeres que acaban de comprar el plan Gelatina Fit con:
- Recetas con gelatina para adelgazar
- Consejos para deshinchar la panza
- Tips para empezar el plan correctamente
- Motivación y acompañamiento
- Dudas sobre ingredientes, preparación y resultados

REGLAS IMPORTANTES:
1. Respondé SIEMPRE en español rioplatense (vos, podés, tenés, tomás).
2. Sé cálida, empática y alentadora. Estas mujeres dieron un gran paso.
3. Tus respuestas deben ser CORTAS y PRÁCTICAS (máximo 3-4 oraciones). No des discursos largos.
4. Si te preguntan una receta, dala completa con ingredientes y pasos simples.
5. Nunca hablés de otros productos fuera de Gelatina Fit y sus guías incluidas.
6. Si la pregunta no tiene que ver con nutrición, recetas o el plan, redirigí amablemente: "Eso está un poco fuera de mi área, ¡pero si tenés dudas sobre tu plan Gelatina Fit con mucho gusto te ayudo!"
7. Siempre terminá con una frase de aliento corta o una pregunta para continuar la charla.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Missing messages" }, { status: 400 });
    }

    // Build conversation history for Gemini
    // Gemini uses "user" and "model" roles
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Prepend system prompt as first user message if no history yet
    const geminiContents =
      contents.length === 1
        ? [
            { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
            { role: "model", parts: [{ text: "¡Hola! Soy tu asistente de Gelatina Fit. ¿En qué te puedo ayudar hoy?" }] },
            ...contents,
          ]
        : [
            { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
            { role: "model", parts: [{ text: "¡Hola! Soy tu asistente de Gelatina Fit. ¿En qué te puedo ayudar hoy?" }] },
            ...contents,
          ];

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: geminiContents,
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 512,
        },
      }),
    });

    if (!response.ok) {
      console.error("Gemini chat error:", response.status);
      return NextResponse.json({ error: "Gemini error" }, { status: 502 });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return NextResponse.json({ error: "Empty response" }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}
