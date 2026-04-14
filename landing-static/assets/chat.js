// ============================================
// VELTO — Éléonore, Agente Experte (v5.0)
// Mémoire Blindée + Détection Accent-Insensible
// ============================================

// Utilitaire: supprime les accents pour une comparaison robuste
function normalize(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

// ============ MÉMOIRE PERSISTANTE ============
const getSessionState = () => {
    try {
        const saved = localStorage.getItem('velto_session_state');
        return saved ? JSON.parse(saved) : defaultState();
    } catch(e) {
        return defaultState();
    }
};

function defaultState() {
    return {
        departureCity: null,
        budget: null,
        travelers: null,      // Type: 'solo', 'couple', 'famille', 'groupe'
        adults: null,         // Nombre d'adultes
        children: null,       // Nombre d'enfants
        childrenAges: null,   // Liste des âges
        dates: null,          // NEW: Période de voyage
        style: null,          // NEW: Style (Luxe, Aventure, etc.)
        lastDestination: null,
        answeredQuestions: [],
        firstTime: true
    };
}

const saveSessionState = (state) => {
    try {
        localStorage.setItem('velto_session_state', JSON.stringify(state));
    } catch(e) {}
};

let sessionState = getSessionState();

// ============ SYNCHRO DASHBOARD ============
function updateDashboard() {
    // Calcul de progression
    const fields = ['departureCity', 'budget', 'travelers', 'dates'];
    const completed = fields.filter(f => sessionState[f]).length;
    const progress = Math.round((completed / fields.length) * 100);

    // Envoyer l'état à la page parente (discovery.html)
    window.parent.postMessage({
        type: 'UPDATE_DOSSIER',
        state: sessionState,
        progress: progress
    }, '*');
}

// Initial sync
setTimeout(updateDashboard, 500);

// ============ BASE DE CONNAISSANCES ============
const aiResponses = {
    greetings: {
        new:      "Bonjour ! Je suis <strong>Éléonore</strong>, votre agente experte VELTO 👒<br>Je suis spécialisée dans les voyages au départ du Canada. Construisons ensemble votre projet idéal !",
        returning: "Heureuse de vous revoir ! 👋<br>Je me souviens de nos échanges. On reprend là où on s'était arrêté ?",
        followUp:  "Partez-vous de Montréal (YUL), Toronto (YYZ) ou Vancouver (YVR) ?"
    },
    farewells: {
        text:     "C'était un plaisir de vous conseiller ! 🌍<br>Vos recherches sont sauvegardées dans l'historique 🕒",
        followUp: "À très bientôt sur VELTO !"
    },
    thanks: {
        text:     "Je vous en prie ! C'est ma passion 😎",
        followUp: "Avez-vous d'autres questions sur cette destination ou une autre ?"
    },
    destinations: {
        bali: { 
            filter: "bali",      
            text: "### 🌴 Bali, Indonésie\n- **Vol depuis Canada** : ~20-24h (1-2 escales)\n- **Meilleure saison** : Mai à Octobre\n- **Visa** : Requis — 35 USD\n- **Note pro** : Ubud pour la culture, Seminyak pour la plage", 
            followUp: "C'est pour un voyage romantique, entre amis ou en solo ?",
            hotels: {
                eco:      { name: "Mojo Resort Ubud", price: "45 CAD/nuit", desc: "Charme local et piscine à débordement (Excellent rapport Q/P)." },
                standard: { name: "Ubud Village Hotel", price: "180 CAD/nuit", desc: "Au cœur des rizières avec spa et service premium." },
                luxe:     { name: "Ayana Resort & Spa", price: "550 CAD/nuit", desc: "Le luxe absolu avec la célèbre Rock Bar face à l'océan." }
            }
        },
        islande: { 
            filter: "islande",   
            text: "### 🌌 Islande\n- **Vol depuis Canada** : ~5-7h depuis l'Est\n- **Meilleure saison** : Juin–Août ou Nov–Mars\n- **Visa** : Non requis\n- **Note pro** : Louez absolument un 4x4", 
            followUp: "Vous visez les aurores boréales ou les paysages estivaux ?",
            hotels: {
                eco:      { name: "Kex Hostel Reykjavík", price: "65 CAD/nuit", desc: "Ancienne usine réhabilitée, ambiance ultra-cool et centrale." },
                standard: { name: "Canopy by Hilton", price: "320 CAD/nuit", desc: "Design scandinave et petit-déjeuner islandais artisanal." },
                luxe:     { name: "Silica Hotel (Blue Lagoon)", price: "850 CAD/nuit", desc: "Lagon privé et vue imprenable sur les champs de lave." }
            }
        },
        "new york": { 
            filter: "new york",  
            text: "### 🗽 New York, USA\n- **Vol depuis Canada** : 1h30 (YUL/YYZ)\n- **Meilleure saison** : Toute l'année\n- **Visa** : ESTA requis\n- **Note pro** : Évitez midweek pour les hôtels", 
            followUp: "C'est un week-end express ou une semaine complète ?",
            hotels: {
                eco:      { name: "Freehand New York", price: "190 CAD/nuit", desc: "Hôtel arty à Flatiron, idéal pour les jeunes voyageurs." },
                standard: { name: "Arlo NoMad", price: "380 CAD/nuit", desc: "Chambres 'Micro' avec vues spectaculaires sur l'Empire State." },
                luxe:     { name: "The Plaza Hotel", price: "1 200 CAD/nuit", desc: "L'icône de la 5ème Avenue. Le sommet de l'élégance new-yorkaise." }
            }
        },
        tokyo: { 
            filter: "tokyo",     
            text: "### 🏙️ Tokyo, Japon\n- **Vol depuis Canada** : ~13-14h direct (YVR/YYZ)\n- **Meilleure saison** : Mars–Avril (cerisiers)\n- **Visa** : Non requis\n- **Note pro** : Le JR Pass couvre aussi Kyoto", 
            followUp: "Vous souhaitez rester qu'à Tokyo ou explorer d'autres villes ?",
            hotels: {
                eco:      { name: "Nine Hours Capsule", price: "55 CAD/nuit", desc: "Design futuriste minimaliste pour une expérience 100% Tokyo." },
                standard: { name: "Park Hotel Tokyo", price: "280 CAD/nuit", desc: "Chambres d'artistes avec vue sur la Tokyo Tower." },
                luxe:     { name: "Aman Tokyo", price: "1 800 CAD/nuit", desc: "Le sanctuaire urbain le plus exclusif du Japon." }
            }
        },
        paris: { 
            filter: "paris",     
            text: "### 🗼 Paris, France\n- **Vol depuis Canada** : ~7-8h direct (YUL/YYZ)\n- **Meilleure saison** : Mai–Guin ou Septembre\n- **Visa** : Non requis\n- **Note pro** : Le Marais est idéal pour l'ambiance", 
            followUp: "Première visite à Paris ou vous connaissez déjà ?",
            hotels: {
                eco:      { name: "Generator Paris", price: "75 CAD/nuit", desc: "Design moderne près du Canal St-Martin, rooftop incroyable." },
                standard: { name: "Hôtel Henriette", price: "240 CAD/nuit", desc: "Boutique-hôtel bohème et vintage près de Mouffetard." },
                luxe:     { name: "Hôtel Ritz Paris", price: "2 100 CAD/nuit", desc: "Place Vendôme. L'excellence du luxe à la française." }
            }
        },
        rome: { 
            filter: "rome",      
            text: "### 🏛️ Rome, Italie\n- **Vol depuis Canada** : ~8-9h direct (YUL/YYZ)\n- **Meilleure saison** : Avril–Juin\n- **Visa** : Non requis\n- **Note pro** : Réservez le Vatican 2 mois à l'avance", 
            followUp: "Vous souhaitez combiner Rome avec Florence ou Naples ?",
            hotels: {
                eco:      { name: "The Beehive", price: "80 CAD/nuit", desc: "Hôtel éco-responsable et familial près de Termini." },
                standard: { name: "Hôtel Artemide", price: "340 CAD/nuit", desc: "Sur la Via Nazionale, réputé pour le meilleur petit-déjeuner de Rome." },
                luxe:     { name: "Hotel de Russie", price: "1 400 CAD/nuit", desc: "Jardins secrets et luxe absolu près de la Piazza del Popolo." }
            }
        },
        santorin: { 
            filter: "santorin",  
            text: "### 🤍 Santorin, Grèce\n- **Vol depuis Canada** : ~12-14h (1 escale)\n- **Meilleure saison** : Mai–Juin ou Septembre\n- **Visa** : Non requis\n- **Note pro** : Oia offre le plus beau coucher de soleil", 
            followUp: "C'est pour une lune de miel ou un anniversaire spécial ?",
            hotels: {
                eco:      { name: "Stelios Place (Perissa)", price: "95 CAD/nuit", desc: "Près de la plage noire, familial et très accueillant." },
                standard: { name: "Astra Suites (Imerovigli)", price: "550 CAD/nuit", desc: "Élu meilleur hôtel de service au monde, vue caldera." },
                luxe:     { name: "Canaves Oia Suites", price: "1 600 CAD/nuit", desc: "Piscines privées à débordement et luxe blanc immaculé." }
            }
        },
        cancun: {
            filter: "cancun",
            text: "### 🏝️ Cancún, Mexique\n- **Vol depuis Canada** : ~4-5h direct (YUL/YYZ/YYC)\n- **Meilleure saison** : Janvier à Mai\n- **Visa** : Non requis (FMM à remplir)\n- **Note pro** : La Zone Hôtelière est pratique, mais restez à Playa Mujeres pour plus de calme",
            followUp: "Plutôt tout-inclus ou hôtel boutique en ville ?",
            hotels: {
                eco:      { name: "Selina Cancun Downtown", price: "40 CAD/nuit", desc: "Ambiance nomade digitale avec piscine et coworking." },
                standard: { name: "Westin Resort & Spa", price: "280 CAD/nuit", desc: "Plage privée calme à l'extrémité sud de la zone hôtelière." },
                luxe:     { name: "Le Blanc Spa Resort", price: "950 CAD/nuit", desc: "Le summum du tout-inclus luxe ( Adultes seulement)." }
            }
        },
        londres: {
            filter: "london",
            text: "### 🇬🇧 Londres, Royaume-Uni\n- **Vol depuis Canada** : ~6h30 (Est) - 9h (Ouest)\n- **Meilleure saison** : Mai à Juillet ou Décembre (marchés de Noël)\n- **Visa** : Non requis\n- **Note pro** : Prenez l'Elizabeth Line depuis LHR, c'est le plus rapide",
            followUp: "C'est pour le shopping ou les musées historiques ?",
            hotels: {
                eco:      { name: "Point A Hotel Shoreditch", price: "120 CAD/nuit", desc: "Chambres compactes en plein quartier branché." },
                standard: { name: "The Hoxton, Holborn", price: "350 CAD/nuit", desc: "Design industriel ultra-confort et lobby vibrant." },
                luxe:     { name: "The Savoy", price: "1 100 CAD/nuit", desc: "L'institution légendaire face à la Tamise. Thé obligatoire !" }
            }
        },
        varadero: {
            filter: "cuba",
            text: "### 🇨🇺 Varadero, Cuba\n- **Vol depuis Canada** : ~3h30 - 4h (Direct fréquent)\n- **Meilleure saison** : Novembre à Avril\n- **Visa** : Carte de tourisme incluse avec le vol (Air Canada/Sunwing)\n- **Note pro** : Apportez des cadeaux pour le personnel, c'est plus utile que les pourboires",
            followUp: "Avez-vous votre carte de tourisme ou est-elle avec votre billet ?",
            hotels: {
                eco:      { name: "Hôtel Sunbeach", price: "75 CAD/nuit", desc: "Proche de la ville, idéal pour vivre l'ambiance cubaine réelle." },
                standard: { name: "Sol Palmeras", price: "210 CAD/nuit", desc: "Le favori des familles canadiennes depuis des années." },
                luxe:     { name: "Iberostar Selection Varadero", price: "480 CAD/nuit", desc: "Plage de rêve et service hôtelier haut de gamme." }
            }
        }
    },
    family:  { text: "### 👨‍👩‍👧‍👦 Voyage en Famille\n- **Top destinations** : Cancún (Mexique), Varadero (Cuba), Orlando (Floride)\n- **Format recommandé** : Tout-inclus avec Kids Club\n- **Budget moyen** : 3 000–5 000 CAD / pers (vol + hôtel)\n- **Note pro** : Moins de 6h de vol, c'est l'idéal avec de jeunes enfants", followUp: "Vos enfants ont quel âge ? Certains clubs offrent la gratuité aux moins de 12 ans !" },
    budget:  { text: "### 💰 Voyage Budget\n- **Top destinations depuis Canada** : Cuba, Mexique, Portugal\n- **Astuce #1** : Partir en épaule de saison (avril, octobre) divise les prix\n- **Astuce #2** : YUL → Cancún a souvent les meilleurs deals CAD\n- **Astuce #3** : Les vols du mardi et mercredi sont statistiquement moins chers", followUp: "Quel est votre budget maximum par personne ?" },
    warmth:  { text: "### ☀️ Destinations Chaleur & Plage\n- **Rapide (< 5h)** : Cuba, République Dominicaine, Floride\n- **Moyen (5-10h)** : Mexique (Cancún, Tulum), Costa Rica\n- **Long (10h+)** : Bali, Thaïlande, Maldives\n- **En ce moment** : Bali (32°C ☀️) et Cancún (29°C 🌴)", followUp: "Combien d'heures de vol êtes-vous prêt à faire pour votre soleil ?" },
    adventure: { text: "### 🏔️ Voyages Aventure & Nature\n- **Islande** : Geysers, glaciers, aurores boréales\n- **Costa Rica** : Volcans, jungle, surf\n- **Patagonie** : Randonnées épiques, Torres del Paine\n- **Nouvelle-Zélande** : Aventure extrême et paysages de film", followUp: "Vous préférez l'aventure en pleine nature ou plus \"confort\" ?" },
    fallback: { text: "Je suis toute ouïe ! 👒 Pour trouver votre voyage idéal, dites-moi :\n- Une destination qui vous fait rêver ?\n- Votre budget approximatif ?\n- Combien de temps partez-vous ?", followUp: "Plus vous me donnez de détails, plus mes suggestions seront précises !" }
};

// Questions de relance progressives (posées une seule fois)
const followUpQuestions = [
    { id: "city",     test: (s) => !s.departureCity,  q: "De quel aéroport canadien souhaitez-vous partir ?" },
    { id: "budget",   test: (s) => !s.budget,         q: "Avez-vous un budget approximatif pour ce voyage ?" },
    { id: "travelers", test: (s) => !s.travelers,      q: "Partez-vous seul, en couple, en famille ou en groupe ?" },
    
    // Branche Fa- Groupe (Étapes)
    { id: "adults",   test: (s) => (s.travelers === 'famille' || s.travelers === 'groupe') && !s.adults, 
      q: "Combien d'adultes seront du voyage ?" },
    
    { id: "children", test: (s) => s.travelers === 'famille' && s.children === null, 
      q: "Et combien d'enfants (moins de 18 ans) ?" },
    
    { id: "ages",     test: (s) => s.travelers === 'famille' && s.children > 0 && !s.childrenAges, 
      q: "Quel âge ont les enfants ? (Pour les clubs et tarifs)" },

    { id: "dates",    test: (s) => !s.dates,           q: "Avez-vous des dates en tête ou êtes-vous flexible ?" },
    { id: "style",    test: (s) => !s.style,           q: "Plutôt hôtel luxueux ou expérience locale authentique ?" }
];

// ============ GÉNÉRATEUR UNIVERSEL ============
function generateDynamicResponse(cityName) {
    const city = cityName.charAt(0).toUpperCase() + cityName.slice(1);
    
    // Simulation intelligente basée sur la ville
    return {
        type: "destination",
        key: cityName,
        filter: cityName,
        isDynamic: true,
        data: {
            text: `### 🌍 ${city}\n- **Disponibilité** : Vols trouvés depuis le Canada ✈️\n- **Note de l'Agente** : C'est une excellente suggestion ! Mes algorithmes indiquent une tendance forte pour cette destination.\n- **Pack Recommandé** : Vol + 7 nuits.\n- **Formalités** : Variable (Vérifiez les exigences d'entrée Canada → ${city})`,
            followUp: `Dites-moi, c'est pour un voyage d'affaires ou pour le plaisir à ${city} ?`,
            hotels: {
                eco:      { name: `${city} Central Hostel`, price: "75 CAD/nuit", desc: "Parfait pour explorer sans se ruiner, très bien situé." },
                standard: { name: `${city} Riverside Hotel`, price: "240 CAD/nuit", desc: "Confort premium et vue imprenable sur les points d'intérêt." },
                luxe:     { name: `Royal ${city} Grand Palace`, price: "680 CAD/nuit", desc: "Le luxe iconique pour un séjour inoubliable." }
            }
        }
    };
}

// ============ ANALYSE DU MESSAGE ============
function analyzeMessage(message) {
    const raw     = message.trim();
    const n       = normalize(raw); // version sans accents, minuscule
    let validation = "";

    // — Détection Villes (Regex, accent-insensible) —
    const cityPatterns = [
        { regex: /montreal|yul/,   city: "Montréal",  msg: "📍 Départ de <strong>Montréal (YUL)</strong> bien noté !" },
        { regex: /toronto|yyz/,    city: "Toronto",   msg: "📍 Départ de <strong>Toronto (YYZ)</strong> bien noté !" },
        { regex: /vancouver|yvr/,  city: "Vancouver", msg: "📍 Départ de <strong>Vancouver (YVR)</strong> bien noté !" },
        { regex: /calgary|yeg|yyc/,city: "Calgary",   msg: "📍 Départ de <strong>Calgary (YYC)</strong> bien noté !" },
        { regex: /ottawa|yow/,     city: "Ottawa",    msg: "📍 Départ de <strong>Ottawa (YOW)</strong> bien noté !" },
    ];
    for (const { regex, city, msg } of cityPatterns) {
        if (regex.test(n)) {
            sessionState.departureCity = city;
            if (!sessionState.answeredQuestions.includes("city")) sessionState.answeredQuestions.push("city");
            validation = msg;
            break;
        }
    }

    // 2. Extraction Intelligence (Budget - Regex)
    const budgetMatch = n.match(/(\d[\d\s]*)\s*(?:\$|cad|dollars?|k\b)/i) ||
                        n.match(/(?:budget|environ|autour de|vers les?|pour|max)\s*(\d[\d\s]*)/i);
    
    // NOUVEAU : Détection de flexibilité (pas de budget, peu importe, etc.)
    const flexBudgetMatch = /\b(pas de budget|peu importe|ignore|sais pas|flexible|illimite|aucune idee)\b/i.test(n);

    if (budgetMatch) {
        const amount = budgetMatch[1].replace(/\s/g, "");
        sessionState.budget = amount;
        if (!sessionState.answeredQuestions.includes("budget")) sessionState.answeredQuestions.push("budget");
        validation = validation || `💰 Budget de <strong>${amount} CAD</strong> enregistré dans votre dossier !`;
    } else if (flexBudgetMatch) {
        sessionState.budget = "Flexible";
        if (!sessionState.answeredQuestions.includes("budget")) sessionState.answeredQuestions.push("budget");
        validation = validation || "💰 C'est noté ! On part sur une <strong>recherche flexible</strong> sans limite de budget.";
    }

    // — Détection Voyageurs (Type) —
    if (/\b(solo|seul[e]?)\b/.test(n)) { 
        sessionState.travelers = "solo";
        sessionState.adults = 1; sessionState.children = 0;
        if (!sessionState.answeredQuestions.includes("travelers")) sessionState.answeredQuestions.push("travelers");
    }
    else if (/\b(couple|deux|2)\b/.test(n) && !/enfant|kid|famille/.test(n)) { 
        sessionState.travelers = "couple";
        sessionState.adults = 2; sessionState.children = 0;
        if (!sessionState.answeredQuestions.includes("travelers")) sessionState.answeredQuestions.push("travelers");
    }
    else if (/\b(famille|enfant|kid|ado|bebe|fils|fille)\b/.test(n)) { 
        sessionState.travelers = "famille";
        if (!sessionState.answeredQuestions.includes("travelers")) sessionState.answeredQuestions.push("travelers");
    }
    else if (/\b(amis?|groupe|collègues)\b/.test(n)) { 
        sessionState.travelers = "groupe";
        if (!sessionState.answeredQuestions.includes("travelers")) sessionState.answeredQuestions.push("travelers");
    }

    // — Extraction Nombre de Personnes (Adultes / Enfants / Âges) —
    const totalMatch  = n.match(/(?:famille|groupe|on est|total)\s*(?:de|à)?\s*(\d+)/i);
    const adultsMatch = n.match(/(\d+)\s*(?:adulte|personne|grand|parent)/i);
    const kidsMatch   = n.match(/(\d+)\s*(?:enfant|kid|ado|jeune|petit)/i);
    const agesMatch   = n.match(/(?:âgés? de|ont|âge(?:s)?)\s*([\d\s,et-]+)\s*(?:ans?)/i);

    let foundAdults = adultsMatch ? parseInt(adultsMatch[1]) : null;
    let foundKids   = kidsMatch ? parseInt(kidsMatch[1]) : null;
    let foundTotal  = totalMatch ? parseInt(totalMatch[1]) : null;

    // Logique de déduction intelligente
    if (foundTotal && foundKids !== null && !foundAdults) {
        foundAdults = foundTotal - foundKids; // Ex: "Famille de 5 avec 3 enfants" -> 2 adultes
    } else if (foundTotal && !foundAdults && !foundKids) {
        foundAdults = foundTotal; // Par défaut si juste un chiffre est donné
    }

    if (foundAdults !== null) {
        sessionState.adults = foundAdults;
        if (!sessionState.answeredQuestions.includes("adults")) sessionState.answeredQuestions.push("adults");
        validation = validation || `📍 <strong>${sessionState.adults} adultes</strong> enregistrés !`;
    }
    if (foundKids !== null) {
        sessionState.children = foundKids;
        if (!sessionState.answeredQuestions.includes("children")) sessionState.answeredQuestions.push("children");
        validation = validation || `📍 <strong>${sessionState.children} enfants</strong> enregistrés !`;
    }
    if (agesMatch && sessionState.children > 0) {
        sessionState.childrenAges = agesMatch[1].trim();
        if (!sessionState.answeredQuestions.includes("ages")) sessionState.answeredQuestions.push("ages");
        validation = validation || `📍 Âges (<strong>${sessionState.childrenAges}</strong>) notés pour les activités !`;
    }

    // — NOUVEAU : Détection de Dates —
    const monthPatterns = /janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre/i;
    const dateMatch = n.match(monthPatterns) || n.match(/prochain mois|cet ete|noel|jour de l'an|paques/i);
    if (dateMatch) {
        sessionState.dates = dateMatch[0];
        if (!sessionState.answeredQuestions.includes("dates")) sessionState.answeredQuestions.push("dates");
        validation = validation || `📅 Période (<strong>${sessionState.dates}</strong>) enregistrée !`;
    }

    // — NOUVEAU : Détection de Style —
    if (/\b(luxe|prestige|5 etoiles|palace|haut de gamme)\b/.test(n)) {
        sessionState.style = "Luxe";
        if (!sessionState.answeredQuestions.includes("style")) sessionState.answeredQuestions.push("style");
        validation = validation || `✨ Style <strong>Luxe & Prestige</strong> sélectionné.`;
    } else if (/\b(aventure|sac a dos|trek|nature|sauvage)\b/.test(n)) {
        sessionState.style = "Aventure";
        if (!sessionState.answeredQuestions.includes("style")) sessionState.answeredQuestions.push("style");
        validation = validation || `🏔️ Style <strong>Aventure & Nature</strong> sélectionné.`;
    }

    // Sauvegarder IMMÉDIATEMENT
    sessionState._lastValidation = validation;
    saveSessionState(sessionState);
    updateDashboard(); // Appeler la synchro

    // — Destination VIP —
    for (const [key, val] of Object.entries(aiResponses.destinations)) {
        if (n.includes(normalize(key))) {
            sessionState.lastDestination = key;
            saveSessionState(sessionState);
            return { type: "destination", key, filter: val.filter };
        }
    }

    // — NOUVEAU : Détection Destination UNIVERSELLE —
    const tripToMatch = raw.match(/(?:alle[rz] a|partir (?:a|pour)|voyage(?:r)? (?:a|au|aux)|visiter) ([A-Z][a-zà-ÿ]+)/);
    if (tripToMatch) {
        const city = tripToMatch[1];
        validation = validation || `📍 C'est noté pour <strong>${city}</strong> ! Je prépare le dossier.`;
        sessionState._lastValidation = validation;
        saveSessionState(sessionState);
        return generateDynamicResponse(city);
    }

    // — Intents —
    if (/bonjour|salut|hello|allo|hey|bjr/.test(n)) return { type: "greeting" };
    if (/au revoir|bye|ciao|bonne nuit|tchao/.test(n)) return { type: "farewell" };
    if (/merci|super|parfait|genial|cool|bravo/.test(n)) return { type: "thanks" };
    if (/famille|enfant|kids|kid|disney/.test(n)) return { type: "family" };
    if (/budget|pas cher|economique|moins cher/.test(n)) return { type: "budget" };
    if (/soleil|plage|mer|chaud|tropique/.test(n)) return { type: "warmth" };
    if (/aventure|nature|montagne|trek|randonn/.test(n)) return { type: "adventure" };

    return { type: "fallback" };
}

// ============ GÉNÉRATION DE RÉPONSE ============
function getAIResponse(analysis) {
    let mainText = "";
    let followUp = "";
    let hotelHTML = "";
    let destData = null;

    // Contenu principal
    if (analysis.type === "greeting") {
        mainText  = sessionState.firstTime ? aiResponses.greetings.new : aiResponses.greetings.returning;
        followUp  = aiResponses.greetings.followUp;
        sessionState.firstTime = false;
        saveSessionState(sessionState);
    } else if (analysis.type === "destination") {
        // Prio 1: Destination VIP?
        if (aiResponses.destinations[analysis.key]) {
            destData = aiResponses.destinations[analysis.key];
        } 
        // Prio 2: Destination Dynamique?
        else if (analysis.isDynamic) {
            destData = analysis.data;
        }

        if (destData) {
            mainText = destData.text;
            followUp = destData.followUp;

            // --- Logique Hôtels par Budget ---
            if (destData.hotels) {
                let category = "standard"; 
                const b = sessionState.budget;
                
                if (b === "Flexible") {
                    category = "standard";
                } else if (b) {
                    const num = parseInt(b.replace(/\D/g, ""));
                    if (num < 2000) category = "eco";
                    else if (num > 4500) category = "luxe";
                }

                const h = destData.hotels[category];
                const catLabel = category.charAt(0).toUpperCase() + category.slice(1);
                
                hotelHTML = `
                    <div style="margin-top:20px; padding:15px; background:rgba(255,255,255,0.05); border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                            <span style="font-size:0.7rem; text-transform:uppercase; letter-spacing:1px; color:#4ade80; font-weight:bold;">🏨 Recommandation ${catLabel}</span>
                            <span style="font-size:0.8rem; font-weight:bold; color:white;">${h.price}</span>
                        </div>
                        <div style="font-weight:bold; color:white; font-size:1rem; margin-bottom:4px;">${h.name}</div>
                        <div style="font-size:0.85rem; color:#94a3b8; line-height:1.4; margin-bottom:15px;">${h.desc}</div>
                        <button onclick="window.parent.postMessage('openBooking', '*')" style="width:100%; padding:10px; background:#22c55e; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer; transition:background 0.2s;">
                            Réserver avec VELTO
                        </button>
                    </div>
                `;
            }
        }
    } else {
        const res = aiResponses[analysis.type] || aiResponses.fallback;
        mainText  = res.text || aiResponses.fallback.text;
        followUp  = res.followUp || aiResponses.fallback.followUp;
    }

    // Choisir la prochaine question utile (si non encore répondue)
    const nextQ = followUpQuestions.find(fq =>
        !sessionState.answeredQuestions.includes(fq.id) && fq.test(sessionState)
    );
    if (nextQ) {
        followUp = nextQ.q;
    }

    // Formatage Markdown → HTML
    let body = mainText
        .replace(/### (.*)/g,    '<strong style="font-size:1.05rem; color:#4ade80; display:block; margin-bottom:6px;">$1</strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n- /g,        '<br>• ')
        .replace(/\n\n/g,        '<br><br>');

    // Encadré de validation (vert si info captée)
    const validation = sessionState._lastValidation || "";
    let validBox = "";
    if (validation) {
        const validFormatted = validation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        validBox = `<div style="background:rgba(74,222,128,0.12);border-left:3px solid #4ade80;padding:10px 14px;border-radius:6px;margin-bottom:14px;font-size:0.85rem;">${validFormatted}</div>`;
    }

    // Badge "Dossier" en pied de message si on a des infos
    let dossier = "";
    if (sessionState.departureCity || sessionState.budget || sessionState.travelers) {
        const parts = [];
        if (sessionState.departureCity) parts.push(`🛫 ${sessionState.departureCity}`);
        if (sessionState.budget)        parts.push(`💰 ${sessionState.budget}${sessionState.budget === 'Flexible' ? '' : ' CAD'}`);
        
        // Affichage détaillé des voyageurs
        if (sessionState.travelers) {
            let tStr = `👥 ${sessionState.travelers.charAt(0).toUpperCase() + sessionState.travelers.slice(1)}`;
            if (sessionState.adults || sessionState.children) {
                const details = [];
                if (sessionState.adults)   details.push(`${sessionState.adults} ad`);
                if (sessionState.children)  details.push(`${sessionState.children} enf`);
                tStr += ` (${details.join(" / ")})`;
            }
            parts.push(tStr);
        }

        dossier = `<div style="font-size:0.72rem;color:#475569;margin-top:14px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.07);">📌 Dossier : ${parts.join("  ·  ")}</div>`;
    }

    // Conseils Spéciaux Famille/Groupe
    let familyAdvice = "";
    if (sessionState.travelers === 'famille' && (sessionState.adults + sessionState.children) >= 5) {
        familyAdvice = `<div style="margin-top:10px; font-size:0.85rem; color:#facc15; font-style:italic;">👒 Note d'Éléonore : Étant une famille de ${sessionState.adults + sessionState.children} personnes, je vais prioriser les complexes avec <strong>Suites Familiales</strong> et <strong>Kids Clubs</strong> gratuits pour optimiser votre budget !</div>`;
    }

    const hr  = `<hr style="border:0;border-top:1px solid rgba(255,255,255,0.08);margin:12px 0;">`;
    const qEl = `<em style="color:#94a3b8;font-size:0.88rem;">${followUp}</em>`;

    return {
        text:   `${validBox}<div>${body}</div>${familyAdvice}${hotelHTML}${dossier}${hr}${qEl}`,
        filter: analysis.filter || null
    };
}

// ============ SCROLL VERS DESTINATION ============
function scrollToDestination(filterKey) {
    if (!filterKey) return;
    const reels = document.querySelectorAll('.reel');
    for (const reel of reels) {
        const img = reel.querySelector('img');
        const h2  = reel.querySelector('h2');
        if (img && h2 && (
            img.src.toLowerCase().includes(filterKey) ||
            normalize(h2.textContent).includes(normalize(filterKey))
        )) {
            reel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            reel.style.transition  = 'box-shadow 0.3s ease';
            reel.style.boxShadow   = '0 0 0 4px #22c55e';
            setTimeout(() => reel.style.boxShadow = 'none', 2500);
            window.dispatchEvent(new CustomEvent('saveToHistory', { detail: filterKey }));
            break;
        }
    }
}
