/* ═══════════════  DOTS · inglés  ═══════════════
   Un solo diccionario, indexado por el texto español tal cual aparece en la
   página. El aplicador recorre los nodos de texto y sustituye los que coinciden,
   así el HTML se escribe una vez, en español, y el inglés vive aquí.
   La lengua se decide por la URL: /en, /en/premium, /en/comunidad (o ?lang=en). */
(function(){
"use strict";

var path=location.pathname;
var LANG=(/^\/en(\/|$)/.test(path)||/[?&]lang=en\b/.test(location.search))?'en':'es';
var EN={
/* ── barra y pie ── */
"Saltar al contenido":"Skip to content",
"Cómo funciona":"How it works",
"La base de datos":"The database",
"Pruébalo":"Try it",
"Comunidad":"Community",
"Empezar gratis":"Start for free",
"El gimnasio para el pensamiento creativo.":"The gym for creative thinking.",
"DOTS · connectdots.es · Las marcas citadas pertenecen a sus dueños. Las ideas de ejemplo las escribió la comunidad de DOTS y no son campañas oficiales de esas marcas.":"DOTS · connectdots.es · Brands mentioned belong to their owners. The example ideas were written by the DOTS community and are not official campaigns by those brands.",
"DOTS, inicio":"DOTS, home",
"Pausar las animaciones":"Pause animations",
"Reanudar las animaciones":"Resume animations",
"Cambiar entre modo claro y oscuro":"Switch between light and dark mode",
"Pie de página":"Footer",
"Ver en inglés":"View in Spanish",

/* ── hero ── */
"Todo lo que sabes está aquí dentro.":"Everything you know is in here.",
"Suelto. Sin conectar.":"Loose. Unconnected.",
"Las buenas ideas no son ideas nuevas.":"Good ideas aren't new ideas.",
"Son una marca y un concepto que no pintan nada juntos.":"They're a brand and a concept that have no business being together.",
"Aquí entrenas eso.":"This is where you train that.",
"Una marca real. Un concepto al azar. Tres minutos. Una idea que no existía.":"A real brand. A random concept. Three minutes. An idea that didn't exist.",
"Te damos dos palabras. Tú haces la magia.":"We give you two words. You make the magic.",
"151 marcas reales y 150 conceptos que no tienen nada que ver con ellas. 22.650 combinaciones esperando a que alguien las junte.":"151 real brands and 150 concepts that have nothing to do with them. 22,650 combinations waiting for someone to put them together.",
"Sin registro. Sin tarjeta. También en el móvil.":"No sign-up. No card. Works on your phone too.",
"BAJA":"SCROLL",
"Una marca real y un concepto que no tiene nada que ver. 22.650 combinaciones, tres minutos, una idea que no existía.":"A real brand and a concept that has nothing to do with it. 22,650 combinations, three minutes, an idea that didn't exist.",
"MARCA":"BRAND",
"CONCEPTO":"CONCEPT",

/* ── el problema ── */
"El problema":"The problem",
"No es que no tengas ideas. Es que siempre llegan las mismas.":"It's not that you have no ideas. It's that the same ones keep showing up.",
"Abres el documento. Escribes tres cosas. Las tres las has escrito ya otras veces, y el reloj corriendo.":"You open the document. You write three things. All three you've written before, and the clock is running.",
"El bloqueo no se quita descansando. Se quita moviendo.":"A block doesn't lift by resting. It lifts by moving.",
"SIN CONECTAR":"UNCONNECTED",

/* ── cómo funciona ── */
"Tres minutos":"Three minutes",
"No hay curva de aprendizaje. Hay una marca, un concepto y un cronómetro que te da igual.":"There's no learning curve. There's a brand, a concept and a timer you can ignore.",
"Recibes una marca y un concepto":"You get a brand and a concept",
"DOTS te lanza una marca real y un concepto al azar.":"DOTS throws you a real brand and a random concept.",
"Sin temática, sin filtros, sin que puedas elegir.":"No theme, no filters, no choosing.",
"Los conectas":"You connect them",
"Tu cerebro entra en modo creativo. La IA te ayuda si te quedas bloqueado.":"Your brain switches into creative mode. The AI helps if you get stuck.",
"La primera idea siempre es mala. La cuarta ya no.":"The first idea is always bad. The fourth one isn't.",
"Guardas y compartes tu idea":"You save and share your idea",
"Guarda las ideas que te gusten, compártelas en redes.":"Save the ideas you like, share them on social.",
"Tu colección crece, y con ella tu nivel.":"Your collection grows, and your level with it.",

/* ── la base ── */
"Marcas de verdad contra conceptos que no pegan ni con cola":"Real brands versus concepts that don't fit at all",
"Un lado son marcas que conoces. El otro son ideas grandes: emociones, épocas, ciencia, oficios. DOTS coge una de cada lado y te las pone delante.":"One side is brands you know. The other is big ideas: emotions, eras, science, trades. DOTS takes one from each side and puts them in front of you.",
"marcas reales, de Nike a Lego":"real brands, from Nike to Lego",
"conceptos, de Soledad a Colonización espacial":"concepts, from Solitude to Space colonization",
"parejas posibles, y solo necesitas una":"possible pairs, and you only need one",

/* ── tablero ── */
"Pruébalo aquí":"Try it here",
"Conecta dos puntos":"Connect two dots",
"Elige una marca de la izquierda y un concepto de la derecha. Eso es todo lo que hace DOTS, y por eso funciona.":"Pick a brand on the left and a concept on the right. That's all DOTS does, and that's why it works.",
"Marca":"Brand",
"Concepto":"Concept",
"Tu pareja":"Your pair",
"Toca una marca y luego un concepto. Cuanto menos tengan que ver, mejor sale.":"Tap a brand, then a concept. The less they have in common, the better it works.",
"Dame una al azar":"Give me a random one",
"Empezar de cero":"Start over",
"Falta el concepto":"Concept missing",
"Falta la marca":"Brand missing",
"Ahora elige un concepto de la derecha. Cuanto menos tenga que ver con {A}, mejor.":"Now pick a concept on the right. The less it has to do with {A}, the better.",
"Ahora elige una marca de la izquierda.":"Now pick a brand on the left.",
"Alguien ya escribió esta":"Someone already wrote this one",
"Tres minutos para {A} con {B}. Escribe lo primero que se te ocurra, y luego lo segundo. La buena suele ser la cuarta.":"Three minutes for {A} with {B}. Write the first thing that comes to mind, then the second. The good one is usually the fourth.",
"Sacada de las 22.650":"Drawn from the 22,650",

/* ── ideas de la comunidad ── */
"Salió de dos palabras":"It came from two words",
"Ideas que empezaron siendo una tontería":"Ideas that started out as nonsense",
"Ninguna de estas parejas tiene sentido sobre el papel. Son ideas escritas por gente en DOTS, no campañas que estas marcas hayan hecho.":"None of these pairs make sense on paper. They're ideas written by people on DOTS, not campaigns these brands have run.",

/* ── niveles ── */
"Progreso":"Progress",
"Se entrena como un músculo. Y se nota como un músculo.":"You train it like a muscle. And it shows like a muscle.",
"Cada idea que guardas cuenta. El nivel no es un adorno, es la prueba de que estás yendo al gimnasio.":"Every idea you save counts. Your level isn't decoration, it's proof you're showing up at the gym.",
"Principiante":"Beginner","Explorador":"Explorer","Creativo":"Creative","Estratega":"Strategist","Visionario":"Visionary","Maestro creativo":"Creative master",
"desde la idea 0":"from idea 0",

/* ── voces ── */
"La comunidad":"The community",
"Lo que cuentan los que ya entrenan":"What the people already training say",
"\"Llevo 3 semanas con DOTS cada mañana antes de trabajar. Mi proceso creativo ha cambiado por completo.\"":"\"I've been doing DOTS every morning before work for 3 weeks. My creative process has completely changed.\"",
"Marta G., diseñadora UX":"Marta G., UX designer",
"\"Usé una combinación de DOTS para el nombre de mi último proyecto. Lo que parecía una tontería se convirtió en la idea más valorada.\"":"\"I used a DOTS combination for the name of my latest project. What looked like nonsense became the most praised idea.\"",
"Carlos R., emprendedor":"Carlos R., entrepreneur",
"\"Mi profesora me preguntó de dónde había sacado la idea del trabajo final. Le dije que de un gimnasio.\"":"\"My teacher asked me where I got the idea for my final project. I told her: from a gym.\"",
"Lucía T., estudiante de publicidad":"Lucía T., advertising student",

/* ── planes ── */
"Planes":"Plans",
"Gratis de verdad. Premium si vives de esto.":"Truly free. Premium if you do this for a living.",
"Entrenamiento libre":"Free training",
"Gratis":"Free",
"para siempre":"forever",
"Una marca y un concepto al azar, siempre que quieras":"A random brand and concept, whenever you want",
"El reto del día de toda la comunidad":"The whole community's daily challenge",
"Tus ideas guardadas y tu nivel":"Your saved ideas and your level",
"Sin registro obligatorio y sin tarjeta":"No mandatory sign-up and no card",
"Modo experto":"Expert mode",
"Modo Experto Creativo IA":"AI Creative Expert Mode",
"Modo entrenamiento ilimitado":"Unlimited training mode",
"Mini-ayuda creativa cuando te atascas":"A creative mini-hint when you get stuck",
"Sin permanencia: cancela cuando quieras":"No commitment: cancel anytime",
"Hazte Premium":"Go Premium",
"Todo lo que incluye":"Everything it includes",
"al mes":"a month",

/* ── preguntas ── */
"Lo que suelen preguntar":"What people usually ask",
"Las dudas de siempre":"The usual questions",
"¿Esto no es un generador de palabras al azar?":"Isn't this just a random word generator?",
"El azar está en la pareja, no en el resultado. Una marca real con su historia y su público, y un concepto que no tiene nada que ver. Ahí es donde tu cabeza tiene que hacer el trabajo, y por eso no puedes elegir tema: elegir es justo lo que te devuelve a las ideas de siempre.":"The randomness is in the pair, not in the result. A real brand with its history and its audience, and a concept that has nothing to do with it. That's where your head has to do the work, and that's why you can't pick a theme: choosing is exactly what takes you back to the same old ideas.",
"¿Por qué marcas y no dos palabras cualquiera?":"Why brands and not just any two words?",
"Porque una marca trae un briefing puesto. Nike no es una palabra, es un público, un tono y una historia. Cuando le pones al lado Soledad o Nostalgia, la idea ya nace con un sitio donde vivir en vez de quedarse en un juego de palabras.":"Because a brand comes with a brief built in. Nike isn't a word, it's an audience, a tone and a history. Put Solitude or Nostalgia next to it and the idea is born with a place to live, instead of staying a play on words.",
"La creatividad no se puede forzar.":"Creativity can't be forced.",
"Forzar no. Entrenar sí. Nadie espera a tener ganas para ir al gimnasio, y nadie sale de ahí igual que entró.":"Forced, no. Trained, yes. Nobody waits to feel like it before going to the gym, and nobody leaves the same as they walked in.",
"¿Tengo que registrarme?":"Do I have to sign up?",
"No. Entras y empiezas. Tus ideas y tu nivel se guardan en tu navegador, sin cuenta.":"No. You come in and start. Your ideas and your level are saved in your browser, no account needed.",
"¿Y si lo que se me ocurre es malo?":"What if what I come up with is bad?",
"Lo será. Las tres primeras casi siempre lo son. La cuarta es la que buscabas, y solo llega si escribes las tres primeras.":"It will be. The first three almost always are. The fourth is the one you were looking for, and it only arrives if you write the first three.",

/* ── cierre ── */
"Una marca. Un concepto. Tres minutos.":"One brand. One concept. Three minutes.",

/* ── página Premium ── */
"4,99 € al mes · Sin permanencia":"€4.99 a month · No commitment",
"Para los que viven de esto":"For the people who do this for a living",
"El plan gratuito es el gimnasio. Premium es el entrenador personal: la IA en modo experto, entrenamiento sin límite y una pista cuando te atascas. Para quien tiene que entregar ideas cada semana.":"The free plan is the gym. Premium is the personal trainer: the AI in expert mode, unlimited training and a hint when you get stuck. For people who have to deliver ideas every week.",
"Entrena gratis":"Train for free",
"Pago seguro con Stripe · Cancela cuando quieras":"Secure payment with Stripe · Cancel anytime",
"Qué incluye":"What's included",
"Lo que cambia":"What changes",
"Un director creativo, un estratega de marca y un copywriter analizan tu idea y te dicen dónde flojea y cómo afilarla. No te la escriben: te la mejoran.":"A creative director, a brand strategist and a copywriter analyse your idea and tell you where it's weak and how to sharpen it. They don't write it for you: they make it better.",
"El reto del día es uno. En Premium tienes todos los que quieras, cuando quieras. Cuando estás en racha, no te cortamos.":"The daily challenge is one. In Premium you get as many as you want, whenever you want. When you're on a roll, we don't cut you off.",
"Mini-ayuda creativa":"Creative mini-hint",
"¿Bloqueado? Una pista sutil que te orienta sin darte la respuesta. La idea sigue siendo tuya.":"Stuck? A subtle hint that points you in the right direction without giving you the answer. The idea is still yours.",
"Mejora tu idea con IA":"Improve your idea with AI",
"Ya tienes la idea, pero no termina de brillar. La IA la revisa contigo hasta que aguanta una presentación.":"You have the idea, but it doesn't quite shine. The AI reviews it with you until it can survive a pitch.",
"Gratis frente a Premium":"Free versus Premium",
"Reto del día":"Daily challenge",
"Sí":"Yes",
"Parejas al azar":"Random pairs",
"Ilimitadas":"Unlimited",
"Ideas guardadas, portfolio y nivel":"Saved ideas, portfolio and level",
"Modo entrenamiento":"Training mode",
"No":"No",
"Ilimitado":"Unlimited",
"Análisis de tu idea con IA":"AI analysis of your idea",
"Modo experto":"Expert mode",
"Precio":"Price",
"0 €":"€0",
"4,99 € al mes":"€4.99 a month",
"Cómo se contrata":"How to subscribe",
"Tres pasos y estás dentro":"Three steps and you're in",
"Crea tu cuenta":"Create your account",
"O inicia sesión si ya la tienes. Premium va ligado a tu cuenta: es lo que desbloquea las funciones.":"Or sign in if you already have one. Premium is tied to your account: that's what unlocks the features.",
"Elige cómo pagar":"Choose how to pay",
"Tarjeta, Apple Pay, Google Pay o PayPal, en el pago seguro de Stripe dentro de DOTS.":"Card, Apple Pay, Google Pay or PayPal, through Stripe's secure checkout inside DOTS.",
"Ya eres Premium":"You're Premium",
"Se activa al momento. Se renueva cada mes y lo cancelas cuando quieras desde \"Gestionar suscripción\".":"It activates instantly. It renews monthly and you can cancel anytime from \"Manage subscription\".",
"4,99 €":"€4.99",
"Sin permanencia. Cancela cuando quieras y sigues con el plan gratuito, que no se toca.":"No commitment. Cancel anytime and keep the free plan, which stays untouched.",
"Pago seguro con Stripe":"Secure payment with Stripe",
"¿Cuánto cuesta Premium?":"How much does Premium cost?",
"4,99 € al mes. Sin permanencia: pagas mes a mes y lo dejas cuando quieras.":"€4.99 a month. No commitment: you pay month to month and leave whenever you want.",
"¿Cómo se paga?":"How do I pay?",
"Con tarjeta, Apple Pay, Google Pay o PayPal, a través de Stripe. DOTS nunca ve ni guarda los datos de tu tarjeta.":"By card, Apple Pay, Google Pay or PayPal, through Stripe. DOTS never sees or stores your card details.",
"¿Cómo cancelo?":"How do I cancel?",
"Desde \"Gestionar suscripción\" en la app, que abre tu portal de Stripe. Sin llamadas ni correos.":"From \"Manage subscription\" in the app, which opens your Stripe portal. No calls, no emails.",
"¿Necesito una cuenta?":"Do I need an account?",
"Sí. Premium se activa sobre tu cuenta de DOTS, así que hace falta una. Crearla es gratis y tarda un minuto.":"Yes. Premium is activated on your DOTS account, so you need one. Creating it is free and takes a minute.",
"¿Perderé algo de lo gratuito?":"Will I lose anything from the free plan?",
"No. El plan gratuito se queda como está, para siempre. Premium añade, no quita.":"No. The free plan stays as it is, forever. Premium adds, it doesn't take away.",

/* ── legal y cookies ── */
"Privacidad":"Privacy",
"Aviso legal":"Legal notice",
"Cookies":"Cookies",
"Legal":"Legal",
"Privacidad y cookies":"Privacy and cookies",
"Aviso legal y condiciones":"Legal notice and terms",
"Este texto solo está disponible en español.":"This text is only available in Spanish.",
"Aviso de cookies":"Cookie notice",
"Usamos cookies analíticas para saber cuánta gente visita DOTS. Solo se activan si las aceptas.":"We use analytics cookies to know how many people visit DOTS. They only switch on if you accept them.",
"Rechazar":"Reject",
"Aceptar":"Accept",
"Preferencias de cookies":"Cookie preferences",
"Más información":"Learn more",
"@title.privacidad":"DOTS · Privacy and cookies",
"@description.privacidad":"What data DOTS processes, why, with whom and how to exercise your rights. Includes the cookie policy.",
"@title.avisolegal":"DOTS · Legal notice and terms",
"@description.avisolegal":"Who runs DOTS, the terms of use of the service and the terms of DOTS Premium.",

/* ── página Comunidad ── */
"Lo que la gente conecta":"What people are connecting",
"Cada día, la misma pareja para todo el mundo. Cada persona, una idea distinta. Aquí está lo que sale de ahí.":"Every day, the same pair for everyone. Every person, a different idea. Here's what comes out of it.",
"El reto de hoy":"Today's challenge",
"La misma pareja para toda la comunidad. Cambia cada día a medianoche.":"The same pair for the whole community. It changes every day at midnight.",
"Empezar los tres minutos":"Start the three minutes",
"Escribe tu idea aquí. La primera será mala. Sigue.":"Write your idea here. The first one will be bad. Keep going.",
"Guardar en mi colección":"Save to my collection",
"Compartir":"Share",
"Copiado":"Copied",
"Guardada. Va a tu colección de abajo.":"Saved. It's in your collection below.",
"Se acabó el tiempo. Lo que tengas, guárdalo: la buena suele estar ahí.":"Time's up. Whatever you have, save it: the good one is usually in there.",
"Tu colección":"Your collection",
"Tu nivel":"Your level",
"Sin cuentas por ahora: tus ideas se guardan solo en este navegador.":"No accounts for now: your ideas are saved only in this browser.",
"Todavía no has guardado ninguna idea. El reto de hoy es un buen sitio para empezar.":"You haven't saved any ideas yet. Today's challenge is a good place to start.",
"Borrar":"Delete",
"ideas guardadas":"saved ideas",
"idea guardada":"saved idea",
"Ideas de la comunidad":"Community ideas",
"Escritas por gente en DOTS. No son campañas reales de estas marcas.":"Written by people on DOTS. They are not real campaigns by these brands.",
"Buscar por marca o concepto":"Search by brand or concept",
"Nada por aquí. Prueba con otra palabra.":"Nothing here. Try another word.",
"Hasta el siguiente nivel":"Until the next level",
"Nivel máximo":"Top level",
"Mi idea en DOTS":"My idea on DOTS",

/* ── conceptos (los 150 de la base, en su orden) ── */
"Filosofía":"Philosophy","Antigua Roma":"Ancient Rome","Antigua Grecia":"Ancient Greece","Edad Media":"Middle Ages","Renacimiento":"Renaissance","Ilustración":"Enlightenment","Revolución Industrial":"Industrial Revolution","Mitología":"Mythology","Religión":"Religion","Espiritualidad":"Spirituality","Democracia":"Democracy","Imperio":"Empire","Guerra":"War","Paz":"Peace","Amor":"Love","Amistad":"Friendship","Soledad":"Solitude","Felicidad":"Happiness","Tragedia":"Tragedy","Heroísmo":"Heroism","Traición":"Betrayal","Poder":"Power","Ambición":"Ambition","Destino":"Fate","Arte":"Art","Pintura":"Painting","Escultura":"Sculpture","Música":"Music","Música clásica":"Classical music","Cine":"Film","Teatro":"Theatre","Literatura":"Literature","Poesía":"Poetry","Arquitectura":"Architecture","Diseño":"Design","Moda":"Fashion","Creatividad":"Creativity","Innovación":"Innovation","Tecnología":"Technology","Inteligencia artificial":"Artificial intelligence","Robótica":"Robotics","Realidad virtual":"Virtual reality","Metaverso":"Metaverse","Videojuegos":"Video games","Deportes":"Sports","Fútbol":"Football","Baloncesto":"Basketball","Tenis":"Tennis","Olimpiadas":"Olympics","Aventura":"Adventure","Exploración":"Exploration","Viajes":"Travel","Turismo":"Tourism","Naturaleza":"Nature","Bosques":"Forests","Montañas":"Mountains","Océanos":"Oceans","Desierto":"Desert","Espacio":"Space","Astronomía":"Astronomy","Ciencia":"Science","Física":"Physics","Química":"Chemistry","Biología":"Biology","Evolución":"Evolution","Medicina":"Medicine","Psicología":"Psychology","Sociología":"Sociology","Antropología":"Anthropology","Educación":"Education","Aprendizaje":"Learning","Sabiduría":"Wisdom","Misterio":"Mystery","Magia":"Magic","Fantasía":"Fantasy","Ciencia ficción":"Science fiction","Futuro":"Future","Distopía":"Dystopia","Utopía":"Utopia","Civilización":"Civilization","Cultura":"Culture","Tradición":"Tradition","Identidad":"Identity","Libertad":"Freedom","Justicia":"Justice","Igualdad":"Equality","Ética":"Ethics","Moralidad":"Morality","Economía":"Economics","Capitalismo":"Capitalism","Comercio":"Trade","Dinero":"Money","Inversión":"Investment","Negocios":"Business","Emprendimiento":"Entrepreneurship","Liderazgo":"Leadership","Estrategia":"Strategy","Competencia":"Competition","Superación":"Self-improvement","Disciplina":"Discipline","Motivación":"Motivation","Inspiración":"Inspiration","Sueños":"Dreams","Imaginación":"Imagination","Juego":"Play","Infancia":"Childhood","Juventud":"Youth","Envejecimiento":"Ageing","Memoria":"Memory","Historia":"History","Revolución":"Revolution","Protesta":"Protest","Política":"Politics","Nación":"Nation","Imperios antiguos":"Ancient empires","Civilizaciones perdidas":"Lost civilizations","Exploradores":"Explorers","Inventores":"Inventors","Genios":"Geniuses","Matemáticas":"Mathematics","Geometría":"Geometry","Astronautas":"Astronauts","Colonización espacial":"Space colonization","Energía":"Energy","Electricidad":"Electricity","Fuego":"Fire","Agua":"Water","Aire":"Air","Tierra":"Earth","Clima":"Weather","Cambio climático":"Climate change","Sostenibilidad":"Sustainability","Ecología":"Ecology","Agricultura":"Agriculture","Alimentación":"Food","Gastronomía":"Gastronomy","Café":"Coffee","Lujo":"Luxury","Minimalismo":"Minimalism","Estética":"Aesthetics","Belleza":"Beauty","Futurismo":"Futurism",
/* conceptos que solo aparecen en ideas de la comunidad */
"Silencio":"Silence","Imperfección":"Imperfection","Aburrimiento":"Boredom","Distancia":"Distance","Incertidumbre":"Uncertainty","Fracaso":"Failure","Vulnerabilidad":"Vulnerability","Velocidad":"Speed","Arte contemporáneo":"Contemporary art","Miedo":"Fear","Empatía":"Empathy","Rituales":"Rituals","Secretos":"Secrets","Caos":"Chaos","Tiempo":"Time","Comida":"Food","Gravedad":"Gravity","Honestidad":"Honesty",

/* ── las 25 ideas de la comunidad ── */
"Una campaña donde IKEA recrea habitaciones icónicas de series de los 90 con muebles actuales. Cada habitación incluye un QR que desbloquea la playlist de la serie.":"A campaign where IKEA recreates iconic rooms from 90s TV shows with today's furniture. Each room includes a QR code that unlocks the show's playlist.",
"Nike lanza 'The Quiet Run': una carrera urbana donde los participantes corren sin música, sin reloj, sin app. Solo tú y la ciudad. La campaña celebra correr por el placer de correr.":"Nike launches 'The Quiet Run': an urban race where runners go without music, without a watch, without an app. Just you and the city. The campaign celebrates running for the pleasure of running.",
"Spotify diseña espacios efímeros en ciudades donde la arquitectura del lugar cambia según la música que suena. Paredes reactivas, luces sincronizadas. Tu playlist construye el espacio.":"Spotify designs pop-up spaces in cities where the architecture changes with the music playing. Reactive walls, synced lights. Your playlist builds the space.",
"Zara lanza una colección donde cada prenda tiene un 'defecto' intencional: una costura visible, un corte asimétrico. La campaña celebra que lo imperfecto es lo que nos hace únicos.":"Zara launches a collection where every garment has one intentional 'flaw': a visible seam, an asymmetric cut. The campaign celebrates that imperfection is what makes us unique.",
"Google crea un 'Modo Aburrimiento' en Chrome: elimina recomendaciones, oculta feeds y te deja solo con una barra de búsqueda. La campaña reivindica el aburrimiento como motor creativo.":"Google adds a 'Boredom Mode' to Chrome: it removes recommendations, hides feeds and leaves you alone with a search bar. The campaign reclaims boredom as a creative engine.",
"Coca-Cola lanza botellas con coordenadas GPS de personas queridas que viven lejos. Al escanearlas puedes enviarles un mensaje de voz. Campaña: 'La distancia no apaga lo que sientes'.":"Coca-Cola launches bottles printed with the GPS coordinates of loved ones who live far away. Scan them to send a voice message. Campaign: 'Distance doesn't switch off what you feel'.",
"Netflix lanza 'Mystery Play': ves una serie sin saber el título, género ni sinopsis. Solo confías en el algoritmo. Al terminar, descubres qué viste y puedes compartir tu reacción.":"Netflix launches 'Mystery Play': you watch a series without knowing its title, genre or synopsis. You just trust the algorithm. When it ends, you find out what you watched and share your reaction.",
"Lego crea un kit llamado 'Beautiful Failures': sets donde las instrucciones te llevan a un resultado inesperado. El mensaje: construir sin miedo a equivocarse es el verdadero juego.":"Lego creates a kit called 'Beautiful Failures': sets whose instructions lead to an unexpected result. The message: building without fear of mistakes is the real game.",
"Apple lanza una campaña donde creativos famosos comparten sus archivos eliminados: los proyectos que nunca publicaron, las fotos que descartaron. Mensaje: 'Detrás de cada obra hay cien intentos'.":"Apple launches a campaign where famous creatives share their deleted files: the projects they never published, the photos they discarded. Message: 'Behind every work there are a hundred attempts'.",
"Patagonia lanza 'Slow Drops': cada prenda se vende durante un solo minuto al mes. Si la pierdes, esperas 30 días. La campaña cuestiona la moda rápida con su propia urgencia.":"Patagonia launches 'Slow Drops': each garment goes on sale for a single minute a month. Miss it and you wait 30 days. The campaign questions fast fashion with its own urgency.",
"McDonald's convierte sus bandejas de plástico en lienzos para artistas emergentes. Cada mes, un artista diferente. Las bandejas se subastan y los fondos van a becas de arte.":"McDonald's turns its plastic trays into canvases for emerging artists. A different artist every month. The trays are auctioned and the proceeds fund art scholarships.",
"Tesla diseña un 'Modo Soledad' en sus coches: rutas que evitan el tráfico, desactivan notificaciones y reproducen podcasts largos. Campaña para quienes necesitan tiempo a solas.":"Tesla designs a 'Solitude Mode' for its cars: routes that avoid traffic, notifications off, long podcasts on. A campaign for people who need time alone.",
"Adidas crea zapatillas con suelas que dejan huellas personalizadas. Cada usuario diseña su huella. Campaña: 'Deja tu marca'. Las huellas se comparten en una galería digital.":"Adidas creates trainers with soles that leave personalised footprints. Every user designs their own print. Campaign: 'Leave your mark'. The prints are shared in a digital gallery.",
"Airbnb ofrece 'Stay Brave': alojamientos en lugares que te sacan de tu zona de confort. Casas en acantilados, cabañas sin wifi, refugios en bosques profundos. Viaja para sentir.":"Airbnb offers 'Stay Brave': places that push you out of your comfort zone. Houses on cliffs, cabins without wifi, shelters deep in the woods. Travel to feel.",
"Samsung crea una app que traduce emociones a colores en tiempo real usando la cámara frontal. La app sugiere mensajes empáticos cuando detecta tristeza en tus contactos frecuentes.":"Samsung creates an app that translates emotions into colours in real time using the front camera. It suggests empathetic messages when it detects sadness in your frequent contacts.",
"Red Bull patrocina slams de poesía en deportes extremos: poetas recitando en paracaídas, en olas gigantes, en pistas de skate. La energía de las palabras encuentra la energía del cuerpo.":"Red Bull sponsors poetry slams in extreme sports: poets reciting in freefall, on giant waves, in skate parks. The energy of words meets the energy of the body.",
"Amazon lanza 'Ritual Box': una caja mensual sin elegir el contenido. Basada en tus rituales diarios (café, lectura, baño), Amazon te sorprende con productos para enriquecer esos momentos.":"Amazon launches 'Ritual Box': a monthly box you don't choose. Based on your daily rituals (coffee, reading, bath), Amazon surprises you with products to enrich those moments.",
"BMW invita a adultos a dibujar su coche soñado como cuando eran niños. Los mejores dibujos se convierten en renders 3D profesionales. Campaña: 'Nunca dejes de soñar coches'.":"BMW invites adults to draw their dream car the way they did as kids. The best drawings become professional 3D renders. Campaign: 'Never stop dreaming cars'.",
"Starbucks crea 'Secret Sip': cada semana, un barista inventa una bebida secreta. Solo se puede pedir susurrando una frase clave. Los clientes descubren la frase a través de pistas en redes.":"Starbucks creates 'Secret Sip': every week a barista invents a secret drink. You can only order it by whispering a passphrase. Customers find the phrase through clues on social media.",
"Porsche diseña un circuito urbano donde las reglas cambian cada vuelta: dirección inversa, obstáculos aleatorios, zonas de velocidad variable. Campaña: 'El control nace del caos'.":"Porsche designs an urban circuit where the rules change every lap: reverse direction, random obstacles, variable speed zones. Campaign: 'Control is born from chaos'.",
"LUSH crea bombas de baño que tardan exactamente 20 minutos en disolverse. Cada fase libera un aroma diferente. Campaña: 'Date tiempo'. Un reloj olfativo para desconectar.":"LUSH creates bath bombs that take exactly 20 minutes to dissolve. Each phase releases a different scent. Campaign: 'Give yourself time'. A clock made of smells, to disconnect.",
"Duolingo abre restaurantes pop-up donde solo puedes pedir en el idioma que estás aprendiendo. Si te equivocas, el camarero te corrige con cariño. Aprende pidiendo tu plato favorito.":"Duolingo opens pop-up restaurants where you can only order in the language you're learning. Get it wrong and the waiter gently corrects you. Learn by ordering your favourite dish.",
"H&M presenta su nueva colección en gravedad cero: modelos flotando en vuelos parabólicos. La ropa se mueve diferente sin gravedad. Campaña: 'La moda no tiene peso'.":"H&M presents its new collection in zero gravity: models floating on parabolic flights. Clothes move differently without gravity. Campaign: 'Fashion has no weight'.",
"Mastercard lanza 'Dream Tracker': una app donde registras sueños y Mastercard te sugiere experiencias reales para vivirlos. ¿Soñaste con el mar? Te ofrece un viaje a la costa.":"Mastercard launches 'Dream Tracker': an app where you log your dreams and Mastercard suggests real experiences to live them. Dreamt of the sea? It offers you a trip to the coast.",
"Volkswagen lanza una campaña sin Photoshop, sin iluminación perfecta, sin modelos. Coches reales, de usuarios reales, con rayaduras reales. Mensaje: 'Un coche de verdad para gente de verdad'.":"Volkswagen launches a campaign with no Photoshop, no perfect lighting, no models. Real cars, from real owners, with real scratches. Message: 'A real car for real people'.",

/* ── 404 ── */
"Esta página no existe.":"This page doesn't exist.",
"Igual que muchas ideas antes de conectarlas. Vuelve al principio y prueba con dos palabras.":"Like many ideas before they're connected. Go back to the start and try two words.",
"Volver al inicio":"Back to the start",

/* ── metadatos ── */
"@title":"DOTS · The gym for creative thinking",
"@title.premium":"DOTS Premium · Expert mode for people who do this for a living",
"@title.comunidad":"DOTS Community · Today's challenge and what people are connecting",
"@description":"We give you a brand and a concept that have no business being together. You make the magic. 151 brands, 150 concepts, 22,650 combinations. Free, no sign-up.",
"@description.premium":"The AI in expert mode, unlimited training and a hint when you get stuck. €4.99 a month, no commitment. The free plan stays free forever.",
"@description.comunidad":"Every day, the same brand and concept for the whole community. Write your idea in three minutes, save it in your collection and level up.",
"@og:title":"DOTS · We give you two words. You make the magic.",
"@og:description":"A real brand and a concept that has nothing to do with it. 22,650 combinations. Three minutes and an idea that didn't exist."
};

/* traduce una cadena (o la devuelve tal cual en español); {A} y {B} se rellenan después */
function t(s,vars){
  var out=(LANG==='en'&&Object.prototype.hasOwnProperty.call(EN,s))?EN[s]:s;
  if(vars) for(var k in vars) out=out.split('{'+k+'}').join(vars[k]);
  return out;
}

/* qué página es, para el título y el enlace de idioma */
var page=/premium/.test(path)?'premium':/comunidad/.test(path)?'comunidad':/privacidad/.test(path)?'privacidad':/aviso-legal/.test(path)?'avisolegal':'index';

function applyI18n(){
  var root=document.documentElement;
  root.lang=LANG;
  /* el enlace de idioma lleva a la misma página en la otra lengua */
  var stripped=path.replace(/^\/en(?=\/|$)/,'')||'/';
  var esPath=stripped, enPath=stripped==='/'?'/en':'/en'+stripped;
  var tog=document.getElementById('lang');
  if(tog){
    if(LANG==='en'){tog.href=esPath;tog.textContent='ES';tog.setAttribute('lang','es');tog.setAttribute('hreflang','es');tog.setAttribute('aria-label','Ver en español')}
    else{tog.href=enPath;tog.textContent='EN';tog.setAttribute('lang','en');tog.setAttribute('hreflang','en');tog.setAttribute('aria-label','View in English')}
  }
  if(LANG!=='en'){root.classList.add('i18n-ready');return}

  /* metadatos */
  var tk='@title'+(page==='index'?'':'.'+page), dk='@description'+(page==='index'?'':'.'+page);
  if(EN[tk]) document.title=EN[tk];
  var md=document.querySelector('meta[name="description"]'); if(md&&EN[dk]) md.setAttribute('content',EN[dk]);
  var ogt=document.querySelector('meta[property="og:title"]'); if(ogt&&page==='index') ogt.setAttribute('content',EN['@og:title']);
  var ogd=document.querySelector('meta[property="og:description"]'); if(ogd&&page==='index') ogd.setAttribute('content',EN['@og:description']);
  var twt=document.querySelector('meta[name="twitter:title"]'); if(twt&&page==='index') twt.setAttribute('content',EN['@og:title']);
  var twd=document.querySelector('meta[name="twitter:description"]'); if(twd&&page==='index') twd.setAttribute('content',EN['@og:description']);
  var ogl=document.querySelector('meta[property="og:locale"]'); if(ogl) ogl.setAttribute('content','en_US');

  /* nodos de texto */
  var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:function(n){
    var p=n.parentNode; if(!p||p.nodeName==='SCRIPT'||p.nodeName==='STYLE') return NodeFilter.FILTER_REJECT;
    return NodeFilter.FILTER_ACCEPT;
  }});
  var node, todo=[];
  while((node=walker.nextNode())){
    var raw=node.nodeValue, key=raw.replace(/\s+/g,' ').trim();
    if(key&&Object.prototype.hasOwnProperty.call(EN,key)) todo.push([node,raw,key]);
  }
  todo.forEach(function(x){
    var raw=x[1], lead=raw.match(/^\s*/)[0], tail=raw.match(/\s*$/)[0];
    x[0].nodeValue=lead+EN[x[2]]+tail;
  });

  /* atributos con texto */
  ['aria-label','placeholder','title','alt'].forEach(function(a){
    var els=document.querySelectorAll('['+a+']');
    for(var i=0;i<els.length;i++){var v=els[i].getAttribute(a);if(Object.prototype.hasOwnProperty.call(EN,v)) els[i].setAttribute(a,EN[v])}
  });
  /* la palabra enfatizada del hero cambia de sitio en inglés */
  var em=document.querySelector('[data-em][data-split]'); if(em) em.setAttribute('data-em','4');
  /* los enlaces internos se quedan en inglés */
  /* salvo los de la app, que no tiene rutas /en: elige idioma por su cuenta */
  var APP_PATH=/^\/(auth|challenge|training|improve|feed|portfolio|messages|pago|user|blog)(\/|$|\?|#)/;
  var links=document.querySelectorAll('a[href^="/"]');
  for(var j=0;j<links.length;j++){
    var h=links[j].getAttribute('href');
    if(/^\/en(\/|$|#)/.test(h)||/^\/assets\//.test(h)||APP_PATH.test(h)||links[j].id==='lang') continue;
    links[j].setAttribute('href',h==='/'?'/en':'/en'+h);
  }
  root.classList.add('i18n-ready');
}

if(LANG==='en') document.documentElement.lang='en';
window.DOTS_LANG=LANG;
window.t=t;
window.applyI18n=applyI18n;
})();
