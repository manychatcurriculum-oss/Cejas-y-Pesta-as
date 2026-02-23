export const PRODUCT_NAME = "Gelatina Fit";
export const PRICE = 3900;
export const ORIGINAL_PRICE = 12000;
export const CURRENCY = "ARS";
export const NUTRITIONIST = "Lic. Carolina Méndez";
export const NUTRITIONIST_LICENSE = "MN 8847";

// Té Mounjaro combo
export const TEA_NAME = "Té Mounjaro Japonés";
export const COMBO_PRICE = 3900;
export const COMBO_ORIGINAL_PRICE = 12000;
export const TEA_ORIGINAL_PRICE = 6999;

// All deliverables with images and drive links
export const ALL_DELIVERABLES = [
  { name: "Gelatina Fit — Plan Personalizado", icon: "⚖️", image: "/images/entregables/gelatina-fit-plan-personalizado.webp", driveUrl: "https://drive.google.com/file/d/1pl_t1J5v3aqGBNDgnBkIQQylwssn210f/view?usp=drive_link", main: true },
  { name: "Té Mounjaro Japonés", icon: "🍵", image: "/images/entregables/te-mounjaro-japones.webp", driveUrl: "https://drive.google.com/file/d/1NVo4o26oCcbhM387NCppvMmaPsGD3gsH/view?usp=drive_link", highlighted: true },
  { name: "Acelerador de Metabolismo", icon: "🧬", image: "/images/entregables/acelerador-de-metabolismo.webp", driveUrl: "https://drive.google.com/file/d/1j5PTG3p3sRv9950IV5LF73aDgMdDMLEz/view?usp=drive_link", bonus: true },
  { name: "Definición de Metas Diarias", icon: "🎯", image: "/images/entregables/definicion-de-metas-diarias.webp", driveUrl: "https://drive.google.com/file/d/1LL0dm3GLiErcy-b5tWkGZMvD7_-TcOGV/view?usp=drive_link", bonus: true },
  { name: "Plan de Alimentación Personalizado", icon: "🥗", image: "/images/entregables/plan-de-alimentacion-personalizado.webp", driveUrl: "https://drive.google.com/file/d/1rbPbFLxznd5dmQzwPck02FODXDt0hBfH/view?usp=drive_link", bonus: true },
  { name: "Protocolo Anti Efecto Rebote", icon: "🛡️", image: "/images/entregables/protocolo-anti-efecto-rebote.webp", driveUrl: "https://drive.google.com/file/d/1LVJPCLUz5gBzqwoHQqDV-BkUNagxaLgt/view?usp=drive_link", bonus: true },
  { name: "Protocolo 7 Días para Desinflamar", icon: "💧", image: "/images/entregables/protocolo-7-dias-para-desinflamar.webp", driveUrl: "https://drive.google.com/file/d/1IyahdqWNvATgv5-lhwtod5M3kuAlLq0R/view?usp=drive_link", bonus: true },
  { name: "Protocolo Anti Procrastinación", icon: "⚡", image: "/images/entregables/protocolo-anti-procrastinacion.webp", driveUrl: "https://drive.google.com/file/d/1WlfHd3LX56nQTTESYL_KrG7-6nZureP6/view?usp=drive_link", bonus: true },
  { name: "Recetas Detox para Deshinchar", icon: "🥣", image: "/images/entregables/recetas-detox-para-deshinchar.webp", driveUrl: "https://drive.google.com/file/d/1KwtqwL_zv0iCDWTl91mbFC3eJztZuarV/view?usp=drive_link" },
  { name: "Dieta Detox 21 Días", icon: "📅", image: "/images/entregables/dieta-detox-21-dias.webp", driveUrl: "https://drive.google.com/file/d/1RHxVpW0BzBr7dj616JgJQHAK2idZFklZ/view?usp=drive_link" },
  { name: "Jugos y Energizantes Naturales", icon: "🥤", image: "/images/entregables/jugos-y-energizantes-naturales.webp", driveUrl: "https://drive.google.com/file/d/120dPSHQUqLT9dzFJoJvEOM52vdn8RJ9I/view?usp=drive_link" },
  { name: "Detox para Cambiar tu Vida", icon: "🌱", image: "/images/entregables/detox-para-cambiar-tu-vida.webp", driveUrl: "https://drive.google.com/file/d/1n0chm9YPumwvJjEbs5m7PPCeK62AFv70/view?usp=drive_link" },
  { name: "Detox con Med", icon: "💊", image: "/images/entregables/detox-con-med.webp", driveUrl: "https://drive.google.com/file/d/1gy95gPLBHRMzHiY1WNLqPnHsh2blFjLU/view?usp=drive_link" },
  { name: "21 Jugos Detox", icon: "🍹", image: "/images/entregables/21-jugos-detox.webp", driveUrl: "https://drive.google.com/file/d/1LAei4qKu7u51V6aWWBQLfvJmEdeCXoaG/view?usp=drive_link" },
  { name: "21 Jugos Detox para Perder Peso", icon: "🔥", image: "/images/entregables/21-jugos-detox-para-perder-peso.webp", driveUrl: "https://drive.google.com/file/d/1K51u10XC_rPUpizi-LFxLKu_DzdB_Jyg/view?usp=sharing" },
];

// Backward compat
export const COMBO_DELIVERABLES = ALL_DELIVERABLES.filter(d => d.bonus || d.highlighted);

export const AGE_OPTIONS = [
  { label: "18–24 años", value: "18-24" },
  { label: "25–34 años", value: "25-34" },
  { label: "35–44 años", value: "35-44" },
  { label: "45–54 años", value: "45-54" },
  { label: "55+ años", value: "55+" },
];

export const BODY_TYPES = [
  { label: "En forma", value: "medio", image: "/images/body-types/hourglass.png" },
  { label: "Unos kilos de más", value: "acima-peso", image: "/images/body-types/rectangle.png" },
  { label: "Sobrepeso", value: "sobrepeso", image: "/images/body-types/inverted-triangle.png" },
  { label: "Plus size", value: "plus-size", image: "/images/body-types/triangle.png" },
];

export const FAT_ZONES = [
  { label: "Abdomen", value: "abdomen", icon: "🎯" },
  { label: "Piernas y muslos", value: "legs", icon: "🦵" },
  { label: "Brazos", value: "arms", icon: "💪" },
  { label: "Espalda", value: "back", icon: "🔙" },
  { label: "Cara y papada", value: "face", icon: "😊" },
  { label: "Cintura", value: "waist", icon: "📏" },
];

export const WEIGHT_IMPACT_OPTIONS = [
  { label: "Me impide hacer cosas que disfruto", value: "limits-activities" },
  { label: "Afecta mi autoestima", value: "self-esteem" },
  { label: "Me preocupa mi salud", value: "health-concern" },
  { label: "Me cuesta encontrar ropa que me quede bien", value: "clothing" },
];

export const APPEARANCE_OPTIONS = [
  { label: "No, quiero cambiar", value: "no-want-change" },
  { label: "Más o menos, podría mejorar", value: "somewhat" },
  { label: "Sí, pero quiero sentirme mejor", value: "yes-but-better" },
];

export const BARRIER_OPTIONS = [
  { label: "Ansiedad por la comida", value: "food-anxiety" },
  { label: "Falta de tiempo", value: "no-time" },
  { label: "Metabolismo lento", value: "slow-metabolism" },
  { label: "Falta de motivación", value: "no-motivation" },
  { label: "Dietas aburridas o restrictivas", value: "boring-diets" },
  { label: "Retención de líquidos", value: "water-retention" },
];

export const GOAL_OPTIONS = [
  { label: "Bajar de peso de forma saludable", value: "lose-weight" },
  { label: "Reducir la hinchazón", value: "reduce-bloating" },
  { label: "Mejorar mi digestión", value: "digestion" },
  { label: "Tener más energía", value: "more-energy" },
  { label: "Sentirme más segura", value: "confidence" },
  { label: "Mejorar mi piel", value: "skin" },
];

export const PREGNANCY_OPTIONS = [
  { label: "Nunca estuve embarazada", value: "never" },
  { label: "1 embarazo", value: "1" },
  { label: "2 embarazos", value: "2" },
  { label: "3 o más embarazos", value: "3+" },
];

export const ROUTINE_OPTIONS = [
  { label: "Sedentaria (trabajo de oficina)", value: "sedentary" },
  { label: "Poco activa (camino un poco)", value: "light" },
  { label: "Moderadamente activa", value: "moderate" },
  { label: "Muy activa (ejercicio regular)", value: "active" },
];

export const SLEEP_OPTIONS = [
  { label: "Menos de 5 horas", value: "less-5" },
  { label: "5 a 6 horas", value: "5-6" },
  { label: "7 a 8 horas", value: "7-8" },
  { label: "Más de 8 horas", value: "more-8" },
];

export const WATER_OPTIONS = [
  { label: "Menos de 1 litro", value: "less-1l" },
  { label: "1 a 2 litros", value: "1-2l" },
  { label: "2 a 3 litros", value: "2-3l" },
  { label: "Más de 3 litros", value: "more-3l" },
];

export const TESTIMONIALS = [
  {
    name: "Maricarmen S.",
    city: "San Isidro",
    text: "Mi vida cambió por completo. Recuperé la energía que había perdido.",
    weightLost: "12 kg perdidos",
    rating: 5,
    image: "/images/testimonials/mi-historia-antes-despues-maricarmen-1.jpg",
  },
  {
    name: "Eugenia L.",
    city: "CABA",
    text: "La mejor decisión que tomé. El proceso fue súper amigable.",
    weightLost: "15 kg perdidos",
    rating: 5,
    image: "/images/testimonials/mujer-antes-y-después-de-la-pérdida-peso-en-el-fondo-gris-forma-corporal-se-alteró-durante-retoque-235605213 (1).webp",
  },
  {
    name: "Julieta V.",
    city: "Córdoba",
    text: "No puedo creer lo rápido que noté cambios en mi piel y peso.",
    weightLost: "8 kg perdidos",
    rating: 5,
    image: "/images/testimonials/68c009f1270d4.webp",
  },
  {
    name: "Mar T.",
    city: "Santa Fe",
    text: "Increíble cómo me ayudó a desinflamarme en pocos días.",
    weightLost: "10 kg perdidos",
    rating: 5,
    image: "/images/testimonials/mar-tarres-antes-y-despues-de-su-tratamiento-para-bajar-de-peso-foto-captura-de-instagram-5F63BVHD7BADZMURZPZZRCJVVU.avif",
  },
  {
    name: "Marcela P.",
    city: "Mendoza",
    text: "El sabor es riquísimo y los resultados son reales.",
    weightLost: "9 kg perdidos",
    rating: 5,
    image: "/images/testimonials/58.webp",
  },
  {
    name: "Romina G.",
    city: "CABA",
    text: "En 3 semanas bajé 5 kilos sin pasar hambre. La gelatina es riquísima y me sacó la ansiedad por completo.",
    weightLost: "5 kg en 3 semanas",
    rating: 5,
    image: "/images/testimonials/romina.png",
  },
  {
    name: "Florencia M.",
    city: "Córdoba",
    text: "Probé mil dietas y nada funcionaba. Con Gelatina Fit noté resultados desde la primera semana. Mi panza se desinflamó un montón.",
    weightLost: "8 kg en 6 semanas",
    rating: 5,
    image: "/images/testimonials/florencia.png",
  },
  {
    name: "Luciana P.",
    city: "Rosario",
    text: "Lo que más me gusta es que es fácil de preparar y tiene gusto rico. Bajé 2 talles de pantalón y me siento genial.",
    weightLost: "7 kg en 5 semanas",
    rating: 5,
    image: "/images/testimonials/luciana.png",
  },
  {
    name: "María José T.",
    city: "Mendoza",
    text: "Tenía el metabolismo re lento después de mi segundo embarazo. La Gelatina Fit me ayudó a activarlo. Bajé 6 kilos sin hacer dieta estricta.",
    weightLost: "6 kg en 4 semanas",
    rating: 5,
    image: "/images/testimonials/mariajose.png",
  },
  {
    name: "Camila R.",
    city: "La Plata",
    text: "Mi nutricionista me había dicho que tenía que bajar 10 kilos. Con la Gelatina Fit ya llevo 8 y me falta poco. Es increíble.",
    weightLost: "8 kg en 7 semanas",
    rating: 5,
    image: "/images/testimonials/camila.jpg",
  },
  {
    name: "Valentina S.",
    city: "Tucumán",
    text: "Yo era súper escéptica pero mi amiga me convenció. En un mes bajé 4 kilos y mi piel está mucho mejor. 100% recomendable.",
    weightLost: "4 kg en 4 semanas",
    rating: 5,
    image: "/images/testimonials/valentina.avif",
  },
];

export const FAQ_ITEMS = [
  {
    question: "¿Cuándo recibo mi plan?",
    answer:
      "Inmediatamente después de confirmar el pago. Te llega un email con acceso a todos tus recursos: el plan personalizado, el Té Mounjaro Japonés y todos los bonuses. Sin esperas, sin envíos.",
  },
  {
    question: "¿Qué es exactamente la Gelatina Fit?",
    answer:
      "Es un plan nutricional digital personalizado según tus respuestas del quiz, formulado con colágeno hidrolizado, fibras naturales y extractos que ayudan a controlar el apetito, mejorar la digestión y acelerar el metabolismo. Recibís todo en formato digital por email.",
  },
  {
    question: "¿Cómo se prepara?",
    answer:
      "Es muy simple: disolvés un sobre en agua caliente, mezclás bien, lo ponés en la heladera y en 2 horas tenés tu gelatina lista. Podés preparar varias porciones de una vez.",
  },
  {
    question: "¿Tiene efectos secundarios?",
    answer:
      "No. La Gelatina Fit está hecha con ingredientes naturales y no contiene estimulantes ni químicos agresivos. Es apta para celíacos y no contiene azúcar agregada.",
  },
  {
    question: "¿En cuánto tiempo veo resultados?",
    answer:
      "La mayoría de nuestras clientas notan menos hinchazón y más energía desde la primera semana. Los resultados visibles en peso suelen verse entre la semana 2 y 3.",
  },
  {
    question: "¿Puedo tomarlo si estoy amamantando?",
    answer:
      "Te recomendamos consultar con tu médico antes de comenzar cualquier suplemento durante la lactancia.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Aceptamos todos los métodos de pago a través de MercadoPago: tarjeta de crédito, débito, transferencia bancaria, y efectivo en puntos de pago.",
  },
  {
    question: "¿Tiene garantía?",
    answer:
      "Sí. Tenés 30 días para probarlo. Si por cualquier razón no estás satisfecha, te devolvemos el 100% de tu dinero sin preguntas y sin letra chica.",
  },
];

export const COMPARISON_TABLE = {
  headers: ["", PRODUCT_NAME, "Dietas", "Gimnasio"],
  rows: [
    ["Fácil de seguir", true, false, false],
    ["Sin pasar hambre", true, false, true],
    ["Resultados en semanas", true, false, false],
    ["Precio accesible", true, true, false],
    ["Sin horarios fijos", true, true, false],
    ["Mejora la piel", true, false, false],
    ["Reduce la ansiedad", true, false, true],
  ],
};
