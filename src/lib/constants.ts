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
  { icon: "💰", title: "Técnicas que se cobran caro", description: "El volumen ruso, lifting y pestañas pelo a pelo tienen alta demanda y se pagan muy bien en Argentina" },
  { icon: "🏠", title: "Trabajás desde tu casa", description: "Sin alquilar local, sin jefe, sin horario fijo. Montás tu espacio y empezás" },
  { icon: "⚡", title: "Empezás de cero y en semanas ya cobrás", description: "Alumnas nuestras atendieron su primera clienta antes del mes de empezar el curso" },
  { icon: "📱", title: "Lo hacés desde el celular", description: "Los videos son HD y están optimizados para móvil. Aprendés donde quieras, cuando quieras" },
  { icon: "✂️", title: "4 técnicas en un solo curso", description: "Diseño de cejas, lifting de pestañas, pelo a pelo y volumen ruso — el menú completo" },
  { icon: "📋", title: "Te enseñamos a conseguir clientas", description: "Hay un módulo específico de marketing para que no te quedes sin trabajo una vez que aprendés" },
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
    question: "¿Necesito experiencia previa?",
    answer: "No. Empezás desde cero. El curso arranca con los fundamentos y avanza paso a paso. También sirve si ya tenés algo de experiencia y querés profesionalizarte.",
  },
  {
    question: "¿En cuánto tiempo puedo empezar a cobrar?",
    answer: "Depende de vos, pero hay alumnas que atendieron su primera clienta antes del mes. Lo más rápido es practicar en amigas o familiares mientras avanzás con los módulos.",
  },
  {
    question: "¿Cómo accedo al curso?",
    answer: "Apenas confirmado el pago, te llega un email con el link. Acceso inmediato, de por vida, sin vencimiento.",
  },
  {
    question: "¿Qué materiales necesito comprar aparte?",
    answer: "Cada módulo detalla los materiales necesarios y dónde conseguirlos. La inversión es mínima y la recuperás con tus primeras clientas.",
  },
  {
    question: "¿Tiene certificado?",
    answer: "Sí. Al completar el curso recibís un certificado digital que podés mostrar a tus clientas y usar en tus redes.",
  },
  {
    question: "¿Y si no me convence?",
    answer: "Tenés 30 días de garantía. Si por cualquier motivo no quedás conforme, te devolvemos el 100% del dinero. Sin preguntas, sin vueltas.",
  },
  {
    question: "¿El pago es seguro?",
    answer: "Sí, pagás por GalioPay, plataforma de pagos certificada para Argentina 🇦🇷. Recibís el comprobante al instante.",
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
