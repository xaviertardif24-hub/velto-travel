const destinations = [
    {
        name: "Bali, Indonésie",
        price: "Dès 2 390 CAD",
        description: "Vol + 10 nuits en hôtel boutique. Ubud, rizières et temples zen sélectionnés par notre IA pour le meilleur ratio qualité-prix.",
        image: "assets/bali.png",
        badge: "Meilleure offre IA",
        promo: true
    },
    {
        name: "Laponie & Islande",
        price: "Dès 3 150 CAD",
        description: "Vol + 8 nuits en cabine panoramique. Aurores boréales garanties de novembre à mars. Baisse de prix de 15% détectée par l'IA.",
        image: "assets/iceland.png",
        badge: "Aventure Pure",
        promo: true
    },
    {
        name: "New York, USA",
        price: "Dès 1 750 CAD",
        description: "Vol direct + 5 nuits en hôtel Manhattan. Vol express depuis Montréal en 1h30. Deal week-end disponible.",
        image: "assets/newyork.png",
        badge: "City Trip Express",
        promo: false
    },
    {
        name: "Tokyo, Japon",
        price: "Dès 3 480 CAD",
        description: "Vol direct YVR + 10 nuits en capsule hôtel design. Avril = cerisiers en fleurs. Le Yen est au plus bas pour le CAD.",
        image: "assets/tokyo.png",
        badge: "Tendance 2026",
        promo: true
    },
    {
        name: "Paris, France",
        price: "Dès 2 180 CAD",
        description: "Vol direct YUL + 7 nuits en hôtel charme au cœur du Marais. Printemps parisien à portée de main.",
        image: "assets/paris.png",
        badge: "Coup de cœur",
        promo: false
    },
    {
        name: "Rome, Italie",
        price: "Dès 1 990 CAD",
        description: "Vol direct YUL + 7 nuits en hôtel boutique. Café à 1€, pasta authentique. Réservez le Colisée à l'avance !",
        image: "assets/rome.png",
        badge: "Histoire & Culture",
        promo: false
    },
    {
        name: "Santorin, Grèce",
        price: "Dès 3 050 CAD",
        description: "Vol + 7 nuits en hôtel dôme blanc avec vue mer. Coucher de soleil à Oia — le plus beau du monde selon l'IA VELTO.",
        image: "assets/santorini.png",
        badge: "Luxe accessible",
        promo: true
    }
];

function shuffleDestinations(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}
