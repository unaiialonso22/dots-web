// Structured brand/object dataset (DOT A)
export interface DotAItem {
  id: number;
  name: string;
  category: string;
}

export interface DotBItem {
  id: number;
  name: string;
  category: string;
}

export const DOT_A_ITEMS: DotAItem[] = [
  {"id":1,"name":"Nike","category":"Ropa"},
  {"id":2,"name":"Adidas","category":"Ropa"},
  {"id":3,"name":"Apple","category":"Tecnología"},
  {"id":4,"name":"Samsung","category":"Tecnología"},
  {"id":5,"name":"Microsoft","category":"Tecnología"},
  {"id":6,"name":"Google","category":"Tecnología"},
  {"id":7,"name":"Amazon","category":"Tecnología"},
  {"id":8,"name":"Tesla","category":"Automoción"},
  {"id":9,"name":"McDonald's","category":"Comida rápida"},
  {"id":10,"name":"Coca-Cola","category":"Alimentación"},
  {"id":11,"name":"Pepsi","category":"Alimentación"},
  {"id":12,"name":"Starbucks","category":"Alimentación"},
  {"id":13,"name":"KFC","category":"Comida rápida"},
  {"id":14,"name":"Burger King","category":"Comida rápida"},
  {"id":15,"name":"Subway","category":"Comida rápida"},
  {"id":16,"name":"Disney","category":"Entretenimiento"},
  {"id":17,"name":"Netflix","category":"Redes sociales / plataformas"},
  {"id":18,"name":"Spotify","category":"Redes sociales / plataformas"},
  {"id":19,"name":"YouTube","category":"Redes sociales / plataformas"},
  {"id":20,"name":"TikTok","category":"Redes sociales / plataformas"},
  {"id":21,"name":"Instagram","category":"Redes sociales / plataformas"},
  {"id":22,"name":"Facebook","category":"Redes sociales / plataformas"},
  {"id":23,"name":"WhatsApp","category":"Redes sociales / plataformas"},
  {"id":24,"name":"Snapchat","category":"Redes sociales / plataformas"},
  {"id":25,"name":"Twitter / X","category":"Redes sociales / plataformas"},
  {"id":26,"name":"Zara","category":"Moda"},
  {"id":27,"name":"H&M","category":"Moda"},
  {"id":28,"name":"Uniqlo","category":"Moda"},
  {"id":29,"name":"Gucci","category":"Moda"},
  {"id":30,"name":"Prada","category":"Moda"},
  {"id":31,"name":"Louis Vuitton","category":"Moda"},
  {"id":32,"name":"Balenciaga","category":"Moda"},
  {"id":33,"name":"Chanel","category":"Moda"},
  {"id":34,"name":"Dior","category":"Moda"},
  {"id":35,"name":"Rolex","category":"Relojes / lujo"},
  {"id":36,"name":"Casio","category":"Relojes / lujo"},
  {"id":37,"name":"Lego","category":"Juguetes"},
  {"id":38,"name":"Nintendo","category":"Videojuegos"},
  {"id":39,"name":"PlayStation","category":"Videojuegos"},
  {"id":40,"name":"Xbox","category":"Videojuegos"},
  {"id":41,"name":"Ubisoft","category":"Videojuegos"},
  {"id":42,"name":"EA Sports","category":"Videojuegos"},
  {"id":43,"name":"Red Bull","category":"Energía / bebidas"},
  {"id":44,"name":"Monster","category":"Energía / bebidas"},
  {"id":45,"name":"Heineken","category":"Alimentación"},
  {"id":46,"name":"Budweiser","category":"Alimentación"},
  {"id":47,"name":"Corona","category":"Alimentación"},
  {"id":48,"name":"Ikea","category":"Hogar / muebles"},
  {"id":49,"name":"Leroy Merlin","category":"Hogar / muebles"},
  {"id":50,"name":"Decathlon","category":"Deportes / outdoor"},
  {"id":51,"name":"Patagonia","category":"Deportes / outdoor"},
  {"id":52,"name":"The North Face","category":"Deportes / outdoor"},
  {"id":53,"name":"Columbia","category":"Deportes / outdoor"},
  {"id":54,"name":"Puma","category":"Calzado / streetwear"},
  {"id":55,"name":"Reebok","category":"Calzado / streetwear"},
  {"id":56,"name":"New Balance","category":"Calzado / streetwear"},
  {"id":57,"name":"Asics","category":"Calzado / streetwear"},
  {"id":58,"name":"Under Armour","category":"Calzado / streetwear"},
  {"id":59,"name":"Ferrari","category":"Automoción"},
  {"id":60,"name":"Lamborghini","category":"Automoción"},
  {"id":61,"name":"Porsche","category":"Automoción"},
  {"id":62,"name":"BMW","category":"Automoción"},
  {"id":63,"name":"Mercedes-Benz","category":"Automoción"},
  {"id":64,"name":"Audi","category":"Automoción"},
  {"id":65,"name":"Volkswagen","category":"Automoción"},
  {"id":66,"name":"Toyota","category":"Automoción"},
  {"id":67,"name":"Honda","category":"Automoción"},
  {"id":68,"name":"Hyundai","category":"Automoción"},
  {"id":69,"name":"Kia","category":"Automoción"},
  {"id":70,"name":"Ford","category":"Automoción"},
  {"id":71,"name":"Chevrolet","category":"Automoción"},
  {"id":72,"name":"Jeep","category":"Automoción"},
  {"id":73,"name":"Land Rover","category":"Automoción"},
  {"id":74,"name":"Tesla Energy","category":"Automoción"},
  {"id":75,"name":"SpaceX","category":"Espacio / aviación"},
  {"id":76,"name":"Blue Origin","category":"Espacio / aviación"},
  {"id":77,"name":"Boeing","category":"Espacio / aviación"},
  {"id":78,"name":"Airbus","category":"Espacio / aviación"},
  {"id":79,"name":"Intel","category":"Tecnología"},
  {"id":80,"name":"AMD","category":"Tecnología"},
  {"id":81,"name":"Nvidia","category":"Tecnología"},
  {"id":82,"name":"Qualcomm","category":"Tecnología"},
  {"id":83,"name":"Dell","category":"Tecnología"},
  {"id":84,"name":"HP","category":"Tecnología"},
  {"id":85,"name":"Lenovo","category":"Tecnología"},
  {"id":86,"name":"Asus","category":"Tecnología"},
  {"id":87,"name":"Acer","category":"Tecnología"},
  {"id":88,"name":"Canon","category":"Tecnología"},
  {"id":89,"name":"Nikon","category":"Tecnología"},
  {"id":90,"name":"GoPro","category":"Tecnología"},
  {"id":91,"name":"Sony","category":"Tecnología"},
  {"id":92,"name":"Panasonic","category":"Tecnología"},
  {"id":93,"name":"Philips","category":"Tecnología"},
  {"id":94,"name":"LG","category":"Tecnología"},
  {"id":95,"name":"Dyson","category":"Tecnología"},
  {"id":96,"name":"Bosch","category":"Tecnología"},
  {"id":97,"name":"Siemens","category":"Tecnología"},
  {"id":98,"name":"PayPal","category":"Finanzas / fintech"},
  {"id":99,"name":"Visa","category":"Finanzas / fintech"},
  {"id":100,"name":"Mastercard","category":"Finanzas / fintech"},
  {"id":101,"name":"American Express","category":"Finanzas / fintech"},
  {"id":102,"name":"Revolut","category":"Finanzas / fintech"},
  {"id":103,"name":"Binance","category":"Finanzas / fintech"},
  {"id":104,"name":"Coinbase","category":"Finanzas / fintech"},
  {"id":105,"name":"Airbnb","category":"Viajes / alojamiento"},
  {"id":106,"name":"Booking","category":"Viajes / alojamiento"},
  {"id":107,"name":"Uber","category":"Delivery / movilidad"},
  {"id":108,"name":"Lyft","category":"Delivery / movilidad"},
  {"id":109,"name":"Glovo","category":"Delivery / movilidad"},
  {"id":110,"name":"Deliveroo","category":"Delivery / movilidad"},
  {"id":111,"name":"Just Eat","category":"Delivery / movilidad"},
  {"id":112,"name":"Domino's Pizza","category":"Comida rápida"},
  {"id":113,"name":"Pizza Hut","category":"Comida rápida"},
  {"id":114,"name":"Taco Bell","category":"Comida rápida"},
  {"id":115,"name":"Chipotle","category":"Comida rápida"},
  {"id":116,"name":"Nestlé","category":"Alimentación"},
  {"id":117,"name":"Danone","category":"Alimentación"},
  {"id":118,"name":"Kellogg's","category":"Alimentación"},
  {"id":119,"name":"Oreo","category":"Alimentación"},
  {"id":120,"name":"KitKat","category":"Alimentación"},
  {"id":121,"name":"Haribo","category":"Alimentación"},
  {"id":122,"name":"Lego Technic","category":"Juguetes"},
  {"id":123,"name":"Mattel","category":"Juguetes"},
  {"id":124,"name":"Barbie","category":"Juguetes"},
  {"id":125,"name":"Hot Wheels","category":"Juguetes"},
  {"id":126,"name":"Warner Bros","category":"Entretenimiento"},
  {"id":127,"name":"Marvel","category":"Entretenimiento"},
  {"id":128,"name":"DC Comics","category":"Entretenimiento"},
  {"id":129,"name":"Paramount","category":"Entretenimiento"},
  {"id":130,"name":"Universal Pictures","category":"Entretenimiento"},
  {"id":131,"name":"HBO","category":"Redes sociales / plataformas"},
  {"id":132,"name":"Prime Video","category":"Redes sociales / plataformas"},
  {"id":133,"name":"Crunchyroll","category":"Redes sociales / plataformas"},
  {"id":134,"name":"BBC","category":"Redes sociales / plataformas"},
  {"id":135,"name":"National Geographic","category":"Redes sociales / plataformas"},
  {"id":136,"name":"Tag Heuer","category":"Relojes / lujo"},
  {"id":137,"name":"Omega","category":"Relojes / lujo"},
  {"id":138,"name":"Cartier","category":"Relojes / lujo"},
  {"id":139,"name":"Tiffany & Co","category":"Relojes / lujo"},
  {"id":140,"name":"Versace","category":"Moda"},
  {"id":141,"name":"Fendi","category":"Moda"},
  {"id":142,"name":"Bottega Veneta","category":"Moda"},
  {"id":143,"name":"Supreme","category":"Moda"},
  {"id":144,"name":"Off-White","category":"Moda"},
  {"id":145,"name":"Vans","category":"Calzado / streetwear"},
  {"id":146,"name":"Converse","category":"Calzado / streetwear"},
  {"id":147,"name":"Timberland","category":"Calzado / streetwear"},
  {"id":148,"name":"Crocs","category":"Calzado / streetwear"},
  {"id":149,"name":"Ray-Ban","category":"Relojes / lujo"},
  {"id":150,"name":"Sephora","category":"Moda"},
  {"id":151,"name":"L'Oréal","category":"Moda"},
];

export const DOT_B_ITEMS: DotBItem[] = [
  {"id":1,"name":"Ballet","category":"Artes escénicas"},
  {"id":2,"name":"Filosofía","category":"Filosofía / pensamiento"},
  {"id":3,"name":"Antigua Roma","category":"Historia"},
  {"id":4,"name":"Antigua Grecia","category":"Historia"},
  {"id":5,"name":"Edad Media","category":"Historia"},
  {"id":6,"name":"Renacimiento","category":"Historia"},
  {"id":7,"name":"Ilustración","category":"Historia"},
  {"id":8,"name":"Revolución Industrial","category":"Historia"},
  {"id":9,"name":"Mitología","category":"Historia"},
  {"id":10,"name":"Religión","category":"Filosofía / pensamiento"},
  {"id":11,"name":"Espiritualidad","category":"Filosofía / pensamiento"},
  {"id":12,"name":"Democracia","category":"Política / sociedad"},
  {"id":13,"name":"Imperio","category":"Política / sociedad"},
  {"id":14,"name":"Guerra","category":"Política / sociedad"},
  {"id":15,"name":"Paz","category":"Política / sociedad"},
  {"id":16,"name":"Amor","category":"Emociones humanas"},
  {"id":17,"name":"Amistad","category":"Emociones humanas"},
  {"id":18,"name":"Soledad","category":"Emociones humanas"},
  {"id":19,"name":"Felicidad","category":"Emociones humanas"},
  {"id":20,"name":"Tragedia","category":"Emociones humanas"},
  {"id":21,"name":"Heroísmo","category":"Valores humanos"},
  {"id":22,"name":"Traición","category":"Valores humanos"},
  {"id":23,"name":"Poder","category":"Valores humanos"},
  {"id":24,"name":"Ambición","category":"Valores humanos"},
  {"id":25,"name":"Destino","category":"Filosofía / pensamiento"},
  {"id":26,"name":"Arte","category":"Arte"},
  {"id":27,"name":"Pintura","category":"Arte"},
  {"id":28,"name":"Escultura","category":"Arte"},
  {"id":29,"name":"Música","category":"Música"},
  {"id":30,"name":"Jazz","category":"Música"},
  {"id":31,"name":"Rock","category":"Música"},
  {"id":32,"name":"Hip hop","category":"Música"},
  {"id":33,"name":"Música clásica","category":"Música"},
  {"id":34,"name":"Cine","category":"Artes escénicas"},
  {"id":35,"name":"Teatro","category":"Artes escénicas"},
  {"id":36,"name":"Literatura","category":"Literatura"},
  {"id":37,"name":"Poesía","category":"Literatura"},
  {"id":38,"name":"Arquitectura","category":"Arte"},
  {"id":39,"name":"Diseño","category":"Arte"},
  {"id":40,"name":"Moda","category":"Arte"},
  {"id":41,"name":"Creatividad","category":"Arte"},
  {"id":42,"name":"Innovación","category":"Arte"},
  {"id":43,"name":"Tecnología","category":"Tecnología"},
  {"id":44,"name":"Inteligencia artificial","category":"Tecnología"},
  {"id":45,"name":"Robótica","category":"Tecnología"},
  {"id":46,"name":"Internet","category":"Tecnología"},
  {"id":47,"name":"Realidad virtual","category":"Tecnología"},
  {"id":48,"name":"Metaverso","category":"Tecnología"},
  {"id":49,"name":"Videojuegos","category":"Tecnología"},
  {"id":50,"name":"Deportes","category":"Deportes"},
  {"id":51,"name":"Fútbol","category":"Deportes"},
  {"id":52,"name":"Baloncesto","category":"Deportes"},
  {"id":53,"name":"Tenis","category":"Deportes"},
  {"id":54,"name":"Olimpiadas","category":"Deportes"},
  {"id":55,"name":"Aventura","category":"Exploración"},
  {"id":56,"name":"Exploración","category":"Exploración"},
  {"id":57,"name":"Viajes","category":"Exploración"},
  {"id":58,"name":"Turismo","category":"Exploración"},
  {"id":59,"name":"Naturaleza","category":"Naturaleza"},
  {"id":60,"name":"Bosques","category":"Naturaleza"},
  {"id":61,"name":"Montañas","category":"Naturaleza"},
  {"id":62,"name":"Océanos","category":"Naturaleza"},
  {"id":63,"name":"Desierto","category":"Naturaleza"},
  {"id":64,"name":"Espacio","category":"Espacio"},
  {"id":65,"name":"Astronomía","category":"Espacio"},
  {"id":66,"name":"Ciencia","category":"Ciencia"},
  {"id":67,"name":"Física","category":"Ciencia"},
  {"id":68,"name":"Química","category":"Ciencia"},
  {"id":69,"name":"Biología","category":"Ciencia"},
  {"id":70,"name":"Evolución","category":"Ciencia"},
  {"id":71,"name":"Medicina","category":"Ciencia"},
  {"id":72,"name":"Psicología","category":"Psicología / mente"},
  {"id":73,"name":"Sociología","category":"Ciencia"},
  {"id":74,"name":"Antropología","category":"Ciencia"},
  {"id":75,"name":"Educación","category":"Educación / conocimiento"},
  {"id":76,"name":"Aprendizaje","category":"Educación / conocimiento"},
  {"id":77,"name":"Sabiduría","category":"Filosofía / pensamiento"},
  {"id":78,"name":"Misterio","category":"Filosofía / pensamiento"},
  {"id":79,"name":"Magia","category":"Filosofía / pensamiento"},
  {"id":80,"name":"Fantasía","category":"Futuro / ciencia ficción"},
  {"id":81,"name":"Ciencia ficción","category":"Futuro / ciencia ficción"},
  {"id":82,"name":"Futuro","category":"Futuro / ciencia ficción"},
  {"id":83,"name":"Distopía","category":"Futuro / ciencia ficción"},
  {"id":84,"name":"Utopía","category":"Futuro / ciencia ficción"},
  {"id":85,"name":"Civilización","category":"Humanidad"},
  {"id":86,"name":"Cultura","category":"Cultura"},
  {"id":87,"name":"Tradición","category":"Cultura"},
  {"id":88,"name":"Ritual","category":"Cultura"},
  {"id":89,"name":"Identidad","category":"Filosofía / pensamiento"},
  {"id":90,"name":"Libertad","category":"Valores humanos"},
  {"id":91,"name":"Justicia","category":"Valores humanos"},
  {"id":92,"name":"Igualdad","category":"Valores humanos"},
  {"id":93,"name":"Ética","category":"Filosofía / pensamiento"},
  {"id":94,"name":"Moralidad","category":"Filosofía / pensamiento"},
  {"id":95,"name":"Economía","category":"Economía / negocios"},
  {"id":96,"name":"Capitalismo","category":"Economía / negocios"},
  {"id":97,"name":"Comercio","category":"Economía / negocios"},
  {"id":98,"name":"Dinero","category":"Economía / negocios"},
  {"id":99,"name":"Inversión","category":"Economía / negocios"},
  {"id":100,"name":"Negocios","category":"Economía / negocios"},
  {"id":101,"name":"Emprendimiento","category":"Economía / negocios"},
  {"id":102,"name":"Liderazgo","category":"Economía / negocios"},
  {"id":103,"name":"Estrategia","category":"Economía / negocios"},
  {"id":104,"name":"Competencia","category":"Economía / negocios"},
  {"id":105,"name":"Superación","category":"Desarrollo personal"},
  {"id":106,"name":"Disciplina","category":"Desarrollo personal"},
  {"id":107,"name":"Motivación","category":"Desarrollo personal"},
  {"id":108,"name":"Inspiración","category":"Desarrollo personal"},
  {"id":109,"name":"Sueños","category":"Psicología / mente"},
  {"id":110,"name":"Imaginación","category":"Psicología / mente"},
  {"id":111,"name":"Juego","category":"Exploración"},
  {"id":112,"name":"Infancia","category":"Etapas de la vida"},
  {"id":113,"name":"Juventud","category":"Etapas de la vida"},
  {"id":114,"name":"Envejecimiento","category":"Etapas de la vida"},
  {"id":115,"name":"Memoria","category":"Psicología / mente"},
  {"id":116,"name":"Nostalgia","category":"Emociones humanas"},
  {"id":117,"name":"Historia","category":"Historia"},
  {"id":118,"name":"Revolución","category":"Política / sociedad"},
  {"id":119,"name":"Protesta","category":"Política / sociedad"},
  {"id":120,"name":"Política","category":"Política / sociedad"},
  {"id":121,"name":"Nación","category":"Política / sociedad"},
  {"id":122,"name":"Imperios antiguos","category":"Historia"},
  {"id":123,"name":"Civilizaciones perdidas","category":"Historia"},
  {"id":124,"name":"Exploradores","category":"Exploración"},
  {"id":125,"name":"Inventores","category":"Humanidad"},
  {"id":126,"name":"Genios","category":"Humanidad"},
  {"id":127,"name":"Matemáticas","category":"Ciencia"},
  {"id":128,"name":"Geometría","category":"Ciencia"},
  {"id":129,"name":"Astronautas","category":"Espacio"},
  {"id":130,"name":"Colonización espacial","category":"Espacio"},
  {"id":131,"name":"Energía","category":"Tecnología"},
  {"id":132,"name":"Electricidad","category":"Tecnología"},
  {"id":133,"name":"Fuego","category":"Elementos naturales"},
  {"id":134,"name":"Agua","category":"Elementos naturales"},
  {"id":135,"name":"Aire","category":"Elementos naturales"},
  {"id":136,"name":"Tierra","category":"Elementos naturales"},
  {"id":137,"name":"Clima","category":"Medio ambiente"},
  {"id":138,"name":"Cambio climático","category":"Medio ambiente"},
  {"id":139,"name":"Sostenibilidad","category":"Medio ambiente"},
  {"id":140,"name":"Ecología","category":"Medio ambiente"},
  {"id":141,"name":"Agricultura","category":"Medio ambiente"},
  {"id":142,"name":"Alimentación","category":"Gastronomía"},
  {"id":143,"name":"Gastronomía","category":"Gastronomía"},
  {"id":144,"name":"Café","category":"Gastronomía"},
  {"id":145,"name":"Chocolate","category":"Gastronomía"},
  {"id":146,"name":"Lujo","category":"Estilo de vida"},
  {"id":147,"name":"Minimalismo","category":"Estilo de vida"},
  {"id":148,"name":"Estética","category":"Arte"},
  {"id":149,"name":"Belleza","category":"Estilo de vida"},
  {"id":150,"name":"Futurismo","category":"Futuro / ciencia ficción"},
];

// Category overlap pairs to avoid obvious combinations
const CATEGORY_BANS: Record<string, string[]> = {
  "Tecnología": ["Tecnología"],
  "Deportes / outdoor": ["Deportes"],
  "Calzado / streetwear": ["Deportes"],
  "Ropa": ["Deportes", "Moda"],
  "Moda": ["Moda", "Estilo de vida"],
  "Relojes / lujo": ["Estilo de vida"],
  "Videojuegos": ["Tecnología"],
  "Comida rápida": ["Gastronomía"],
  "Alimentación": ["Gastronomía"],
  "Energía / bebidas": ["Gastronomía"],
  "Espacio / aviación": ["Espacio"],
  "Automoción": ["Tecnología"],
  "Finanzas / fintech": ["Economía / negocios"],
  "Delivery / movilidad": ["Exploración"],
  "Viajes / alojamiento": ["Exploración"],
  "Entretenimiento": ["Artes escénicas"],
  "Redes sociales / plataformas": ["Tecnología"],
  "Juguetes": ["Exploración"],
};

function isObviousPair(a: DotAItem, b: DotBItem): boolean {
  const banned = CATEGORY_BANS[a.category];
  return banned ? banned.includes(b.category) : false;
}

export function getRandomDots(): { dotA: string; dotB: string; dotACategory: string; dotBCategory: string } {
  let a: DotAItem;
  let b: DotBItem;
  let attempts = 0;
  do {
    a = DOT_A_ITEMS[Math.floor(Math.random() * DOT_A_ITEMS.length)];
    b = DOT_B_ITEMS[Math.floor(Math.random() * DOT_B_ITEMS.length)];
    attempts++;
  } while (isObviousPair(a, b) && attempts < 100);
  return { dotA: a.name, dotB: b.name, dotACategory: a.category, dotBCategory: b.category };
}

// Daily challenge helpers using localStorage
const DAILY_KEY = "dots_daily_challenge";
const DAILY_SHUFFLES_KEY = "dots_daily_shuffles";

interface DailyChallenge {
  date: string;
  dotA: string;
  dotB: string;
  dotACategory: string;
  dotBCategory: string;
}

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getDailyShufflesLeft(): number {
  const today = getTodayString();
  const stored = localStorage.getItem(DAILY_SHUFFLES_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.date === today) return Math.max(0, 3 - parsed.count);
  }
  return 3;
}

export function recordShuffle(): number {
  const today = getTodayString();
  const stored = localStorage.getItem(DAILY_SHUFFLES_KEY);
  let count = 0;
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.date === today) count = parsed.count;
  }
  count++;
  localStorage.setItem(DAILY_SHUFFLES_KEY, JSON.stringify({ date: today, count }));
  return Math.max(0, 3 - count);
}

export function getDailyChallenge(): DailyChallenge {
  const today = getTodayString();
  const stored = localStorage.getItem(DAILY_KEY);
  if (stored) {
    const parsed: DailyChallenge = JSON.parse(stored);
    if (parsed.date === today) return parsed;
  }
  const dots = getRandomDots();
  const challenge: DailyChallenge = { date: today, ...dots };
  localStorage.setItem(DAILY_KEY, JSON.stringify(challenge));
  return challenge;
}

export function setDailyChallenge(dots: { dotA: string; dotB: string; dotACategory: string; dotBCategory: string }): void {
  const today = getTodayString();
  localStorage.setItem(DAILY_KEY, JSON.stringify({ date: today, ...dots }));
}

export interface IdeaResult {
  originality: number;
  insight: number;
  campaignPotential: number;
  explanation: string;
  suggestion: string;
}

export interface FeedItem {
  id: string;
  dotA: string;
  dotB: string;
  idea: string;
  scores: { originality: number; insight: number; campaignPotential: number };
  likes: number;
  author: string;
  createdAt: string;
}

export const MOCK_FEED: FeedItem[] = [
  {
    id: "1",
    dotA: "Nike",
    dotB: "Ballet",
    idea: "A Nike campaign where ballet dancers perform in urban environments, showing that grace and strength exist everywhere. The tagline: 'Every Step is a Stage.'",
    scores: { originality: 8, insight: 9, campaignPotential: 9 },
    likes: 42,
    author: "CreativeMind",
    createdAt: "2 hours ago",
  },
  {
    id: "2",
    dotA: "Spotify",
    dotB: "Antigua Roma",
    idea: "Spotify creates 'Colosseum Sessions' — live concerts streamed from historical ruins, blending ancient acoustics with modern music.",
    scores: { originality: 9, insight: 7, campaignPotential: 8 },
    likes: 31,
    author: "IdeaForge",
    createdAt: "5 hours ago",
  },
  {
    id: "3",
    dotA: "Ikea",
    dotB: "Minimalismo",
    idea: "IKEA launches a 'Beautifully Imperfect' line — furniture with intentional natural imperfections, celebrating the beauty of aging and use.",
    scores: { originality: 7, insight: 8, campaignPotential: 8 },
    likes: 28,
    author: "DesignThinker",
    createdAt: "1 day ago",
  },
];
