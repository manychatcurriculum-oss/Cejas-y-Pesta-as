export const PRODUCT_NAME = "Masterclass Cejas & Pestañas";
export const PRODUCT_TAGLINE = "De cero a profesional en el arte de la mirada";
export const PRICE = 4900;
export const PRICE_ORIGINAL = 9800;
export const CURRENCY = "ARS";
export const GALIOPAY_PREFIX = "cb_";

export const STATS = [
  { num: "13", label: "módulos en video", icon: "🎬" },
  { num: "4", label: "técnicas profesionales", icon: "✨" },
  { num: "1", label: "manual descargable", icon: "📖" },
];

export const DELIVERABLES = [
  {
    name: "13 Módulos en Video — Acceso de por vida",
    description: "Cejas perfectas, lifting, pestañas pelo a pelo y volumen ruso en video HD",
    driveUrl: "REEMPLAZAR_DRIVE_VIDEOS",
    isMain: true,
    isPremium: false,
  },
  {
    name: "Manual Completo PDF Descargable",
    description: "Guía de referencia con todo el contenido del curso para tener siempre a mano",
    driveUrl: "REEMPLAZAR_DRIVE_MANUAL",
    isMain: false,
    isPremium: false,
  },
];

export const BENEFITS = [
  { icon: "💰", title: "Generá ingresos desde casa", description: "Aprendé técnicas que te permiten cobrar por sesión desde el primer mes" },
  { icon: "⏱️", title: "A tu ritmo, sin horarios", description: "Acceso de por vida — avanzás cuando querés, sin fechas límite" },
  { icon: "🎯", title: "Para principiantes y avanzadas", description: "Empezás de cero o perfeccionás lo que ya sabés" },
  { icon: "📱", title: "100% online desde tu casa", description: "Desde tu celular o computadora, sin salir de casa" },
  { icon: "✂️", title: "4 técnicas de tendencia mundial", description: "Cejas, lifting, pestañas pelo a pelo y volumen ruso — lo más pedido hoy" },
  { icon: "📋", title: "Marketing para tu negocio", description: "Módulo completo para que sepas cómo vender tus servicios y conseguir clientas" },
];

export const TESTIMONIALS = [
  {
    name: "Valentina R.",
    location: "Buenos Aires",
    text: "Empecé sin saber nada y en dos meses ya estaba atendiendo clientas. El módulo de volumen ruso es increíble, re detallado.",
    result: "Primera clienta al mes de terminar",
    avatar: "/testimonials/1.webp",
  },
  {
    name: "Camila S.",
    location: "Córdoba",
    text: "Lo que más me gustó fue que te enseña también cómo vender. Eso no lo encontrás en otros cursos. Ya recuperé la inversión.",
    result: "Recuperó la inversión en 3 semanas",
    avatar: "/testimonials/2.webp",
  },
  {
    name: "Luciana M.",
    location: "Rosario",
    text: "Soy esteticista hace años pero no sabía lifting. Con este curso lo aprendí en una semana y ya lo ofrezco en mi salón.",
    result: "Nuevo servicio incorporado a su salón",
    avatar: "/testimonials/3.webp",
  },
  {
    name: "Florencia G.",
    location: "Mendoza",
    text: "La calidad de los videos es muy buena, se ve todo en detalle. Y el manual de cejas es una joya, lo tengo impreso en el trabajo.",
    result: "Trabaja como freelance los fines de semana",
    avatar: "/testimonials/4.webp",
  },
  {
    name: "Antonella B.",
    location: "La Plata",
    text: "Quería aprender para hacerme las cejas yo sola y terminé montando un pequeño emprendimiento desde mi casa. No lo podía creer.",
    result: "Emprendimiento propio en 2 meses",
    avatar: "/testimonials/5.webp",
  },
  {
    name: "Micaela T.",
    location: "Tucumán",
    text: "Muy completo, re claro. La instructora explica todo paso a paso y podés pausar y repetir las veces que necesites.",
    result: "Certifica 4 servicios nuevos",
    avatar: "/testimonials/6.webp",
  },
];

export const FAQ_ITEMS = [
  {
    question: "¿Necesito experiencia previa para tomar el curso?",
    answer: "No, está diseñado tanto para principiantes absolutas como para personas con conocimientos previos. Empezás desde los fundamentos.",
  },
  {
    question: "¿Cómo accedo a los videos?",
    answer: "Apenas confirmado el pago, te llega un email con el link de acceso. Es de por vida, sin vencimiento.",
  },
  {
    question: "¿Qué materiales necesito para practicar?",
    answer: "En cada módulo se detallan los materiales y proveedores. La inversión inicial es mínima y la recuperás rápido con tus primeras clientas.",
  },
  {
    question: "¿Puedo aprender a mi propio ritmo?",
    answer: "Sí, 100%. No hay fechas límite ni clases en vivo. Avanzás cuando querés, desde donde estés.",
  },
  {
    question: "¿Tiene certificado?",
    answer: "Sí, al completar el curso recibís un certificado digital que podés mostrar a tus clientas.",
  },
  {
    question: "¿Qué pasa si no me gusta?",
    answer: "Tenés 30 días de garantía total. Si por cualquier motivo no quedás conforme, te devolvemos el 100% del dinero sin preguntas.",
  },
  {
    question: "¿Se puede hacer desde el celular?",
    answer: "Sí, los videos están optimizados para verse desde cualquier dispositivo — celular, tablet o computadora.",
  },
  {
    question: "¿El pago es seguro?",
    answer: "Sí, el pago se procesa a través de GalioPay, plataforma segura y certificada para pagos en Argentina 🇦🇷.",
  },
];

export const COMPARISON_TABLE = {
  headers: ["", PRODUCT_NAME, "Tutoriales gratis", "Curso presencial"],
  rows: [
    ["Contenido profesional completo", true, false, true],
    ["Precio accesible", true, true, false],
    ["A tu ritmo, sin horarios", true, true, false],
    ["4 técnicas en un solo lugar", true, false, false],
    ["Manual descargable", true, false, false],
    ["Módulo de marketing", true, false, false],
    ["Garantía de devolución", true, false, false],
  ],
};
