// Fictional seed data to populate the community feed from day one

export interface SeedProfile {
  id: string;
  display_name: string;
  avatar_url: string;
  total_ideas: number;
}

export interface SeedIdea {
  id: string;
  dot_a: string;
  dot_b: string;
  idea_text: string;
  created_at: string;
  user_id: string;
  attached_file_url: string | null;
}

export interface SeedComment {
  id: string;
  idea_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

function daysAgo(d: number, hours = 0): string {
  return new Date(Date.now() - d * 86400000 - hours * 3600000).toISOString();
}

const SEED_PROFILES: SeedProfile[] = [
  { id: "seed-001", display_name: "Lucía Herrero", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=LuciaH", total_ideas: 14 },
  { id: "seed-002", display_name: "Pablo Mendoza", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=PabloM", total_ideas: 9 },
  { id: "seed-003", display_name: "Marina Costa", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=MarinaC", total_ideas: 22 },
  { id: "seed-004", display_name: "Carlos Ruiz", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=CarlosR", total_ideas: 6 },
  { id: "seed-005", display_name: "Elena Vargas", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaV", total_ideas: 18 },
  { id: "seed-006", display_name: "Javier Torres", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=JavierT", total_ideas: 11 },
  { id: "seed-007", display_name: "Sofía Delgado", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=SofiaD", total_ideas: 7 },
  { id: "seed-008", display_name: "Diego Navarro", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=DiegoN", total_ideas: 16 },
  { id: "seed-009", display_name: "Valentina Ramos", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=ValentinaR", total_ideas: 13 },
  { id: "seed-010", display_name: "Andrés Molina", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=AndresM", total_ideas: 5 },
  { id: "seed-011", display_name: "Carmen Reyes", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=CarmenR", total_ideas: 20 },
  { id: "seed-012", display_name: "Miguel Á. Prieto", avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=MiguelP", total_ideas: 8 },
];

const SEED_IDEAS: SeedIdea[] = [
  // Varied brands × abstract concepts
  { id: "seed-idea-01", dot_a: "IKEA", dot_b: "Nostalgia", idea_text: "Una campaña donde IKEA recrea habitaciones icónicas de series de los 90 con muebles actuales. Cada habitación incluye un QR que desbloquea la playlist de la serie.", created_at: daysAgo(0, 2), user_id: "seed-001", attached_file_url: null },
  { id: "seed-idea-02", dot_a: "Nike", dot_b: "Silencio", idea_text: "Nike lanza 'The Quiet Run': una carrera urbana donde los participantes corren sin música, sin reloj, sin app. Solo tú y la ciudad. La campaña celebra correr por el placer de correr.", created_at: daysAgo(0, 5), user_id: "seed-003", attached_file_url: null },
  { id: "seed-idea-03", dot_a: "Spotify", dot_b: "Arquitectura", idea_text: "Spotify diseña espacios efímeros en ciudades donde la arquitectura del lugar cambia según la música que suena. Paredes reactivas, luces sincronizadas. Tu playlist construye el espacio.", created_at: daysAgo(0, 8), user_id: "seed-005", attached_file_url: null },
  { id: "seed-idea-04", dot_a: "Zara", dot_b: "Imperfección", idea_text: "Zara lanza una colección donde cada prenda tiene un 'defecto' intencional: una costura visible, un corte asimétrico. La campaña celebra que lo imperfecto es lo que nos hace únicos.", created_at: daysAgo(0, 12), user_id: "seed-002", attached_file_url: null },
  { id: "seed-idea-05", dot_a: "Google", dot_b: "Aburrimiento", idea_text: "Google crea un 'Modo Aburrimiento' en Chrome: elimina recomendaciones, oculta feeds y te deja solo con una barra de búsqueda. La campaña reivindica el aburrimiento como motor creativo.", created_at: daysAgo(1, 3), user_id: "seed-008", attached_file_url: null },
  { id: "seed-idea-06", dot_a: "Coca-Cola", dot_b: "Distancia", idea_text: "Coca-Cola lanza botellas con coordenadas GPS de personas queridas que viven lejos. Al escanearlas puedes enviarles un mensaje de voz. Campaña: 'La distancia no apaga lo que sientes'.", created_at: daysAgo(1, 7), user_id: "seed-009", attached_file_url: null },
  { id: "seed-idea-07", dot_a: "Netflix", dot_b: "Incertidumbre", idea_text: "Netflix lanza 'Mystery Play': ves una serie sin saber el título, género ni sinopsis. Solo confías en el algoritmo. Al terminar, descubres qué viste y puedes compartir tu reacción.", created_at: daysAgo(1, 14), user_id: "seed-004", attached_file_url: null },
  { id: "seed-idea-08", dot_a: "Lego", dot_b: "Fracaso", idea_text: "Lego crea un kit llamado 'Beautiful Failures': sets donde las instrucciones te llevan a un resultado inesperado. El mensaje: construir sin miedo a equivocarse es el verdadero juego.", created_at: daysAgo(2, 1), user_id: "seed-006", attached_file_url: null },
  { id: "seed-idea-09", dot_a: "Apple", dot_b: "Vulnerabilidad", idea_text: "Apple lanza una campaña donde creativos famosos comparten sus archivos eliminados: los proyectos que nunca publicaron, las fotos que descartaron. Mensaje: 'Detrás de cada obra hay cien intentos'.", created_at: daysAgo(2, 6), user_id: "seed-011", attached_file_url: null },
  { id: "seed-idea-10", dot_a: "Patagonia", dot_b: "Velocidad", idea_text: "Patagonia lanza 'Slow Drops': cada prenda se vende durante un solo minuto al mes. Si la pierdes, esperas 30 días. La campaña cuestiona la moda rápida con su propia urgencia.", created_at: daysAgo(2, 10), user_id: "seed-007", attached_file_url: null },
  { id: "seed-idea-11", dot_a: "McDonald's", dot_b: "Arte contemporáneo", idea_text: "McDonald's convierte sus bandejas de plástico en lienzos para artistas emergentes. Cada mes, un artista diferente. Las bandejas se subastan y los fondos van a becas de arte.", created_at: daysAgo(3, 2), user_id: "seed-010", attached_file_url: null },
  { id: "seed-idea-12", dot_a: "Tesla", dot_b: "Soledad", idea_text: "Tesla diseña un 'Modo Soledad' en sus coches: rutas que evitan el tráfico, desactivan notificaciones y reproducen podcasts largos. Campaña para quienes necesitan tiempo a solas.", created_at: daysAgo(3, 8), user_id: "seed-012", attached_file_url: null },
  { id: "seed-idea-13", dot_a: "Adidas", dot_b: "Memoria", idea_text: "Adidas crea zapatillas con suelas que dejan huellas personalizadas. Cada usuario diseña su huella. Campaña: 'Deja tu marca'. Las huellas se comparten en una galería digital.", created_at: daysAgo(3, 15), user_id: "seed-001", attached_file_url: null },
  { id: "seed-idea-14", dot_a: "Airbnb", dot_b: "Miedo", idea_text: "Airbnb ofrece 'Stay Brave': alojamientos en lugares que te sacan de tu zona de confort. Casas en acantilados, cabañas sin wifi, refugios en bosques profundos. Viaja para sentir.", created_at: daysAgo(4, 4), user_id: "seed-003", attached_file_url: null },
  { id: "seed-idea-15", dot_a: "Samsung", dot_b: "Empatía", idea_text: "Samsung crea una app que traduce emociones a colores en tiempo real usando la cámara frontal. La app sugiere mensajes empáticos cuando detecta tristeza en tus contactos frecuentes.", created_at: daysAgo(4, 9), user_id: "seed-005", attached_file_url: null },
  { id: "seed-idea-16", dot_a: "Red Bull", dot_b: "Poesía", idea_text: "Red Bull patrocina slams de poesía en deportes extremos: poetas recitando en paracaídas, en olas gigantes, en pistas de skate. La energía de las palabras encuentra la energía del cuerpo.", created_at: daysAgo(5, 1), user_id: "seed-008", attached_file_url: null },
  { id: "seed-idea-17", dot_a: "Amazon", dot_b: "Rituales", idea_text: "Amazon lanza 'Ritual Box': una caja mensual sin elegir el contenido. Basada en tus rituales diarios (café, lectura, baño), Amazon te sorprende con productos para enriquecer esos momentos.", created_at: daysAgo(5, 6), user_id: "seed-009", attached_file_url: null },
  { id: "seed-idea-18", dot_a: "BMW", dot_b: "Infancia", idea_text: "BMW invita a adultos a dibujar su coche soñado como cuando eran niños. Los mejores dibujos se convierten en renders 3D profesionales. Campaña: 'Nunca dejes de soñar coches'.", created_at: daysAgo(5, 12), user_id: "seed-002", attached_file_url: null },
  { id: "seed-idea-19", dot_a: "Starbucks", dot_b: "Secretos", idea_text: "Starbucks crea 'Secret Sip': cada semana, un barista inventa una bebida secreta. Solo se puede pedir susurrando una frase clave. Los clientes descubren la frase a través de pistas en redes.", created_at: daysAgo(6, 3), user_id: "seed-011", attached_file_url: null },
  { id: "seed-idea-20", dot_a: "Porsche", dot_b: "Caos", idea_text: "Porsche diseña un circuito urbano donde las reglas cambian cada vuelta: dirección inversa, obstáculos aleatorios, zonas de velocidad variable. Campaña: 'El control nace del caos'.", created_at: daysAgo(6, 10), user_id: "seed-004", attached_file_url: null },
  { id: "seed-idea-21", dot_a: "LUSH", dot_b: "Tiempo", idea_text: "LUSH crea bombas de baño que tardan exactamente 20 minutos en disolverse. Cada fase libera un aroma diferente. Campaña: 'Date tiempo'. Un reloj olfativo para desconectar.", created_at: daysAgo(7, 2), user_id: "seed-007", attached_file_url: null },
  { id: "seed-idea-22", dot_a: "Duolingo", dot_b: "Comida", idea_text: "Duolingo abre restaurantes pop-up donde solo puedes pedir en el idioma que estás aprendiendo. Si te equivocas, el camarero te corrige con cariño. Aprende pidiendo tu plato favorito.", created_at: daysAgo(7, 8), user_id: "seed-006", attached_file_url: null },
  { id: "seed-idea-23", dot_a: "H&M", dot_b: "Gravedad", idea_text: "H&M presenta su nueva colección en gravedad cero: modelos flotando en vuelos parabólicos. La ropa se mueve diferente sin gravedad. Campaña: 'La moda no tiene peso'.", created_at: daysAgo(8, 5), user_id: "seed-010", attached_file_url: null },
  { id: "seed-idea-24", dot_a: "Mastercard", dot_b: "Sueños", idea_text: "Mastercard lanza 'Dream Tracker': una app donde registras sueños y Mastercard te sugiere experiencias reales para vivirlos. ¿Soñaste con el mar? Te ofrece un viaje a la costa.", created_at: daysAgo(9, 3), user_id: "seed-012", attached_file_url: null },
  { id: "seed-idea-25", dot_a: "Volkswagen", dot_b: "Honestidad", idea_text: "Volkswagen lanza una campaña sin Photoshop, sin iluminación perfecta, sin modelos. Coches reales, de usuarios reales, con rayaduras reales. Mensaje: 'Un coche de verdad para gente de verdad'.", created_at: daysAgo(10, 7), user_id: "seed-001", attached_file_url: null },
];

// Seed likes: map idea_id -> number of likes
const SEED_LIKE_COUNTS: Record<string, number> = {
  "seed-idea-01": 12,
  "seed-idea-02": 24,
  "seed-idea-03": 18,
  "seed-idea-04": 7,
  "seed-idea-05": 31,
  "seed-idea-06": 15,
  "seed-idea-07": 22,
  "seed-idea-08": 9,
  "seed-idea-09": 27,
  "seed-idea-10": 11,
  "seed-idea-11": 5,
  "seed-idea-12": 8,
  "seed-idea-13": 19,
  "seed-idea-14": 14,
  "seed-idea-15": 6,
  "seed-idea-16": 20,
  "seed-idea-17": 3,
  "seed-idea-18": 16,
  "seed-idea-19": 28,
  "seed-idea-20": 10,
  "seed-idea-21": 4,
  "seed-idea-22": 33,
  "seed-idea-23": 2,
  "seed-idea-24": 13,
  "seed-idea-25": 17,
};

const SEED_COMMENTS: SeedComment[] = [
  { id: "seed-c-01", idea_id: "seed-idea-02", user_id: "seed-001", content: "¡Genial! Me encanta la idea de correr sin distracciones.", created_at: daysAgo(0, 3) },
  { id: "seed-c-02", idea_id: "seed-idea-02", user_id: "seed-008", content: "Nike debería hacer esto de verdad. Yo me apunto.", created_at: daysAgo(0, 2) },
  { id: "seed-c-03", idea_id: "seed-idea-03", user_id: "seed-004", content: "Spotify + arquitectura reactiva... esto es el futuro del entretenimiento.", created_at: daysAgo(0, 6) },
  { id: "seed-c-04", idea_id: "seed-idea-05", user_id: "seed-011", content: "Necesito este modo en mi vida. El aburrimiento es subestimado.", created_at: daysAgo(1, 1) },
  { id: "seed-c-05", idea_id: "seed-idea-05", user_id: "seed-003", content: "Brutal concepto. Google predicando con el ejemplo.", created_at: daysAgo(0, 22) },
  { id: "seed-c-06", idea_id: "seed-idea-05", user_id: "seed-009", content: "¿Y si además sugiriera actividades offline? Sería perfecto.", created_at: daysAgo(0, 20) },
  { id: "seed-c-07", idea_id: "seed-idea-06", user_id: "seed-007", content: "Esto me hizo sentir cosas. Muy bonita la idea.", created_at: daysAgo(1, 5) },
  { id: "seed-c-08", idea_id: "seed-idea-07", user_id: "seed-005", content: "¡Quiero probar esto ya! La incertidumbre como entretenimiento.", created_at: daysAgo(1, 10) },
  { id: "seed-c-09", idea_id: "seed-idea-09", user_id: "seed-002", content: "Los archivos eliminados son una mina de oro creativa.", created_at: daysAgo(2, 4) },
  { id: "seed-c-10", idea_id: "seed-idea-09", user_id: "seed-006", content: "Esto humaniza tanto a los creativos. Muy potente.", created_at: daysAgo(2, 3) },
  { id: "seed-c-11", idea_id: "seed-idea-13", user_id: "seed-010", content: "Huellas personalizadas... simple pero memorizable.", created_at: daysAgo(3, 12) },
  { id: "seed-c-12", idea_id: "seed-idea-16", user_id: "seed-012", content: "Poesía en paracaídas. Esto es Red Bull en su máxima expresión.", created_at: daysAgo(5, 0) },
  { id: "seed-c-13", idea_id: "seed-idea-19", user_id: "seed-004", content: "Secret Sip es marketing viral puro. La gente compartiría las frases.", created_at: daysAgo(6, 1) },
  { id: "seed-c-14", idea_id: "seed-idea-19", user_id: "seed-001", content: "Me recuerda a speakeasy bars. Brillante para Starbucks.", created_at: daysAgo(5, 23) },
  { id: "seed-c-15", idea_id: "seed-idea-22", user_id: "seed-005", content: "Duolingo siempre tiene ideas geniales. Esta es top tier.", created_at: daysAgo(7, 6) },
  { id: "seed-c-16", idea_id: "seed-idea-22", user_id: "seed-009", content: "Aprender idiomas comiendo... ¿dónde firmo?", created_at: daysAgo(7, 4) },
  { id: "seed-c-17", idea_id: "seed-idea-22", user_id: "seed-011", content: "Esto funcionaría increíble en ciudades turísticas.", created_at: daysAgo(7, 2) },
  { id: "seed-c-18", idea_id: "seed-idea-01", user_id: "seed-003", content: "IKEA + nostalgia noventera = combinación ganadora.", created_at: daysAgo(0, 1) },
  { id: "seed-c-19", idea_id: "seed-idea-25", user_id: "seed-008", content: "La honestidad radical en publicidad. Refrescante.", created_at: daysAgo(10, 5) },
  { id: "seed-c-20", idea_id: "seed-idea-14", user_id: "seed-012", content: "Esto me da miedo y ganas a la vez. Genial concepto.", created_at: daysAgo(4, 2) },
];

export function getSeedProfiles(): Record<string, { display_name: string | null; avatar_url: string | null; total_ideas?: number }> {
  const map: Record<string, { display_name: string | null; avatar_url: string | null; total_ideas?: number }> = {};
  SEED_PROFILES.forEach((p) => {
    map[p.id] = { display_name: p.display_name, avatar_url: p.avatar_url, total_ideas: p.total_ideas };
  });
  return map;
}

export function getSeedIdeas(): SeedIdea[] {
  return SEED_IDEAS;
}

export function getSeedLikeCounts(): Record<string, number> {
  return { ...SEED_LIKE_COUNTS };
}

export function getSeedComments(): SeedComment[] {
  return SEED_COMMENTS;
}

export function getSeedCommentCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  SEED_COMMENTS.forEach((c) => {
    counts[c.idea_id] = (counts[c.idea_id] || 0) + 1;
  });
  return counts;
}
