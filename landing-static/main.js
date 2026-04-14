document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Smooth Scroll Animations for Sections
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });

    // 2. AI Chat Mockup Animation (Simulated typing)
    const chatBody = document.getElementById('chat-body');
    const messages = [
        { role: 'user', text: "Trouve-moi un deal pour Santorin en septembre." },
        { role: 'ai', text: "Une seconde... Je scanne les vols YUL-JTR. 🇬🇷" },
        { role: 'ai', text: "Trouvé ! 940 CAD aller-retour avec une escale à Paris. C'est 200 CAD de moins que la moyenne saisonnière !" }
    ];

    let messageIndex = 0;

    function typeMessage() {
        if (messageIndex < messages.length) {
            const msg = messages[messageIndex];
            const div = document.createElement('div');
            div.className = `chat-msg ${msg.role}`;
            div.innerHTML = msg.text;
            div.style.opacity = '0';
            div.style.transform = 'translateY(10px)';
            div.style.transition = 'all 0.4s ease';
            
            chatBody.appendChild(div);
            
            setTimeout(() => {
                div.style.opacity = '1';
                div.style.transform = 'translateY(0)';
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 100);

            messageIndex++;
            setTimeout(typeMessage, 3000);
        }
    }

    // Start typing animation when in view
    const chatObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && messageIndex === 0) {
            setTimeout(typeMessage, 1000);
        }
    });
    chatObserver.observe(document.querySelector('.chat-mockup'));

    // 3. Reels Horizontal Scroll Indication
    const reels = document.getElementById('reels');
    let isDown = false;
    let startDate;
    let scrollLeft;

    reels.addEventListener('mousedown', (e) => {
        isDown = true;
        startDate = e.pageX - reels.offsetLeft;
        scrollLeft = reels.scrollLeft;
    });

    reels.addEventListener('mouseleave', () => {
        isDown = false;
    });

    reels.addEventListener('mouseup', () => {
        isDown = false;
    });

    reels.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - reels.offsetLeft;
        const walk = (x - startDate) * 2;
        reels.scrollLeft = scrollLeft - walk;
    });
});

// Add fade-in styles dynamically
const style = document.createElement('style');
style.textContent = `
    .fade-in-section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 1s ease-out, transform 1s ease-out;
    }
    .fade-in-section.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);
