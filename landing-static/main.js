// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    // 1. Entrance Animations (Reveal Class)
    const revealElements = document.querySelectorAll('.reveal');
    
    revealElements.forEach((el, index) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none none"
            },
            y: 40,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out",
            delay: index * 0.05
        });
    });

    // 2. Parallax on Discovery Cards
    const cards = document.querySelectorAll('.p-card');
    cards.forEach(card => {
        gsap.to(card.querySelector('img'), {
            scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            },
            scale: 1.2,
            y: 20
        });
    });

    // 3. Organic AI Chat Simulation (Éléonore)
    const chatContainer = document.getElementById('chat-container');
    const messages = [
        { role: 'ai', text: "Bonjour. Je suis <strong>Éléonore</strong>, votre concierge numérique Velto." },
        { role: 'user', text: "Je cherche une destination calme et luxueuse pour septembre." },
        { role: 'ai', text: "Je vous suggère <strong>Bali</strong>. Mes analyses indiquent une baisse de prix de 15% sur les villas haut de gamme cette semaine." },
        { role: 'ai', text: "Voulez-vous que je prépare une simulation de budget en CAD ?" }
    ];

    let currentMsgIndex = 0;

    function addMessage(msg) {
        const bubble = document.createElement('div');
        bubble.className = `bubble-v ${msg.role}`;
        bubble.innerHTML = msg.text;
        chatContainer.appendChild(bubble);

        // Animate in
        setTimeout(() => {
            bubble.classList.add('active');
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 100);
    }

    function runChat() {
        if (currentMsgIndex < messages.length) {
            const delay = messages[currentMsgIndex].role === 'ai' ? 2000 : 1500;
            setTimeout(() => {
                addMessage(messages[currentMsgIndex]);
                currentMsgIndex++;
                runChat();
            }, delay);
        }
    }

    // Trigger chat when AI section is in view
    ScrollTrigger.create({
        trigger: ".ai-organic",
        start: "top 60%",
        onEnter: () => {
            if (currentMsgIndex === 0) runChat();
        }
    });

    // 4. Logo Scale on Scroll
    gsap.to(".f-logo", {
        scrollTrigger: {
            trigger: "footer",
            start: "top bottom",
            end: "bottom bottom",
            scrub: 2
        },
        letterSpacing: "20px",
        opacity: 0.1
    });

});
