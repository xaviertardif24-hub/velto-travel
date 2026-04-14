// ──────────────────────────────────────────────────────────────────────────────
// VeltoHero.tsx — Framer Code Component
// Hero section for Velto — Le Futur du Voyage Intelligent 🇨🇦
// ──────────────────────────────────────────────────────────────────────────────

import { addPropertyControls, ControlType } from "framer"
import { motion } from "framer-motion"

// ─── Types ───────────────────────────────────────────────────────────────────
interface Props {
    headline1: string
    headline2: string
    subtitle: string
    ctaPrimary: string
    ctaSecondary: string
    badgeText: string
    accentColor: string
    onClickPrimary?: () => void
    onClickSecondary?: () => void
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function VeltoHero({
    headline1 = "Ailleurs.",
    headline2 = "Pour beaucoup moins.",
    subtitle = "L'algorithme de voyage le plus sophistiqué du Canada. Des milliers de deals comparés en 2ms pour vous garantir le prix le plus bas en CAD.",
    ctaPrimary = "Démarrer l'aventure →",
    ctaSecondary = "En savoir plus",
    badgeText = "✦ Propulsé par Éléonore AI",
    accentColor = "#22c55e",
    onClickPrimary,
    onClickSecondary,
}: Props) {
    const accentGlow = `${accentColor}33`
    const accentShadow = `${accentColor}40`

    const css = `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;800&family=Inter:wght@400;500;600&display=swap');

        .vh-root {
            width: 100%;
            height: 100%;
            min-height: 100vh;
            background: #0b0f1a;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 0 5%;
            position: relative;
            overflow: hidden;
            font-family: 'Inter', sans-serif;
            box-sizing: border-box;
        }

        /* Background blobs */
        .vh-blob {
            position: absolute;
            width: 60vw;
            height: 60vw;
            background: radial-gradient(circle, ${accentGlow} 0%, transparent 70%);
            filter: blur(90px);
            opacity: 0.25;
            pointer-events: none;
        }
        .vh-blob-1 { top: -15%; left: -15%; }
        .vh-blob-2 { bottom: -15%; right: -15%; opacity: 0.15; background: radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%); }

        /* Navbar */
        .vh-nav {
            position: absolute;
            top: 0; left: 0; right: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 5%;
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border-bottom: 1px solid rgba(255,255,255,0.06);
            z-index: 10;
            box-sizing: border-box;
        }

        .vh-logo {
            font-family: 'Outfit', sans-serif;
            font-size: 1.7rem;
            font-weight: 800;
            color: white;
            letter-spacing: -1px;
        }
        .vh-logo span { color: ${accentColor}; }

        .vh-nav-links {
            display: flex;
            gap: 2rem;
            align-items: center;
        }
        .vh-nav-links a {
            color: #94a3b8;
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
            transition: color 0.2s;
            cursor: pointer;
        }
        .vh-nav-links a:hover { color: ${accentColor}; }

        .vh-btn-nav {
            background: ${accentColor};
            color: white;
            padding: 0.6rem 1.4rem;
            border: none;
            border-radius: 100px;
            font-weight: 700;
            font-size: 0.85rem;
            cursor: pointer;
            box-shadow: 0 6px 20px ${accentShadow};
            transition: transform 0.2s, box-shadow 0.2s;
            font-family: 'Inter', sans-serif;
        }
        .vh-btn-nav:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 28px ${accentShadow};
        }

        /* Hero Content */
        .vh-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 0;
            z-index: 1;
        }

        .vh-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: ${accentGlow};
            color: ${accentColor};
            padding: 8px 18px;
            border-radius: 100px;
            font-size: 0.78rem;
            font-weight: 700;
            border: 1px solid ${accentColor}26;
            margin-bottom: 2.2rem;
            letter-spacing: 0.02em;
        }

        .vh-h1 {
            font-family: 'Outfit', sans-serif;
            font-size: clamp(3.5rem, 8vw, 7rem);
            line-height: 0.95;
            letter-spacing: -3px;
            margin-bottom: 2rem;
            background: linear-gradient(135deg, #fff 0%, #e2e8f0 40%, #94a3b8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .vh-subtitle {
            font-size: clamp(1rem, 2vw, 1.3rem);
            color: #94a3b8;
            max-width: 580px;
            margin: 0 auto 3rem;
            line-height: 1.65;
        }

        .vh-cta-group {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }

        .vh-btn-primary {
            background: white;
            color: #0b0f1a;
            padding: 1rem 2.5rem;
            border-radius: 14px;
            border: none;
            font-weight: 700;
            font-size: 1rem;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            font-family: 'Inter', sans-serif;
        }
        .vh-btn-primary:hover {
            transform: scale(1.04);
            box-shadow: 0 15px 40px rgba(0,0,0,0.4);
        }

        .vh-btn-secondary {
            background: rgba(255,255,255,0.06);
            color: white;
            padding: 1rem 2.5rem;
            border-radius: 14px;
            border: 1px solid rgba(255,255,255,0.12);
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.2s;
            font-family: 'Inter', sans-serif;
        }
        .vh-btn-secondary:hover { background: rgba(255,255,255,0.1); }

        /* Ticker */
        .vh-ticker {
            position: absolute;
            bottom: 0; left: 0; right: 0;
            border-top: 1px solid rgba(255,255,255,0.07);
            overflow: hidden;
            padding: 14px 0;
            background: rgba(255,255,255,0.02);
        }
        .vh-ticker-track {
            display: flex;
            gap: 5rem;
            width: max-content;
            animation: ticker-scroll 35s linear infinite;
        }
        @keyframes ticker-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
        }
        .vh-ticker-item {
            font-size: 0.78rem;
            color: #64748b;
            font-weight: 500;
            white-space: nowrap;
        }
        .vh-ticker-item b { color: ${accentColor}; }

        /* Scroll hint */
        .vh-scroll-hint {
            position: absolute;
            bottom: 70px;
            left: 50%;
            transform: translateX(-50%);
            animation: bounce 2s ease-in-out infinite;
        }
        .vh-mouse {
            width: 24px; height: 38px;
            border: 2px solid rgba(255,255,255,0.2);
            border-radius: 12px;
            position: relative;
        }
        .vh-mouse::after {
            content: '';
            position: absolute;
            top: 6px; left: 50%;
            transform: translateX(-50%);
            width: 4px; height: 8px;
            background: ${accentColor};
            border-radius: 2px;
            animation: scroll-dot 2s ease-in-out infinite;
        }
        @keyframes bounce {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(8px); }
        }
        @keyframes scroll-dot {
            0% { opacity: 1; top: 6px; }
            100% { opacity: 0; top: 18px; }
        }
    `

    const tickerItems = [
        "🇲🇽 Cancún : <b>-45%</b>",
        "🇯🇵 Tokyo : <b>1 890 CAD</b>",
        "🇫🇷 Paris : <b>Deal Flash</b>",
        "🏝️ Bali : <b>-30%</b>",
        "🇮🇹 Rome : <b>1 240 CAD</b>",
        "🇬🇷 Santorin : <b>-20%</b>",
        "🇹🇭 Bangkok : <b>1 590 CAD</b>",
        "🇦🇪 Dubaï : <b>Deal Flash</b>",
    ]

    // Duplicate for seamless loop
    const allItems = [...tickerItems, ...tickerItems]

    return (
        <div className="vh-root">
            <style dangerouslySetInnerHTML={{ __html: css }} />

            {/* Blobs */}
            <div className="vh-blob vh-blob-1" />
            <div className="vh-blob vh-blob-2" />

            {/* Navbar */}
            <nav className="vh-nav">
                <div className="vh-logo">VELTO<span>.</span></div>
                <div className="vh-nav-links">
                    <a>Expertise</a>
                    <a>Démo</a>
                    <button className="vh-btn-nav">Essayer gratuitement</button>
                </div>
            </nav>

            {/* Hero Content */}
            <motion.div
                className="vh-content"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
                <motion.div
                    className="vh-badge"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {badgeText}
                </motion.div>

                <motion.h1
                    className="vh-h1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.35 }}
                >
                    {headline1}<br />{headline2}
                </motion.h1>

                <motion.p
                    className="vh-subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.55 }}
                >
                    {subtitle}
                </motion.p>

                <motion.div
                    className="vh-cta-group"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                >
                    <button className="vh-btn-primary" onClick={onClickPrimary}>
                        {ctaPrimary}
                    </button>
                    <button className="vh-btn-secondary" onClick={onClickSecondary}>
                        {ctaSecondary}
                    </button>
                </motion.div>
            </motion.div>

            {/* Scroll hint */}
            <div className="vh-scroll-hint">
                <div className="vh-mouse" />
            </div>

            {/* Ticker */}
            <div className="vh-ticker">
                <div className="vh-ticker-track">
                    {allItems.map((item, i) => (
                        <span
                            key={i}
                            className="vh-ticker-item"
                            dangerouslySetInnerHTML={{ __html: item }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

// ─── Framer Property Controls ─────────────────────────────────────────────────
addPropertyControls(VeltoHero, {
    headline1: {
        type: ControlType.String,
        title: "Titre ligne 1",
        defaultValue: "Ailleurs.",
    },
    headline2: {
        type: ControlType.String,
        title: "Titre ligne 2",
        defaultValue: "Pour beaucoup moins.",
    },
    subtitle: {
        type: ControlType.String,
        title: "Sous-titre",
        defaultValue:
            "L'algorithme de voyage le plus sophistiqué du Canada. Des milliers de deals comparés en 2ms pour vous garantir le prix le plus bas en CAD.",
    },
    ctaPrimary: {
        type: ControlType.String,
        title: "Bouton Principal",
        defaultValue: "Démarrer l'aventure →",
    },
    ctaSecondary: {
        type: ControlType.String,
        title: "Bouton Secondaire",
        defaultValue: "En savoir plus",
    },
    badgeText: {
        type: ControlType.String,
        title: "Badge",
        defaultValue: "✦ Propulsé par Éléonore AI",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Couleur Accent",
        defaultValue: "#22c55e",
    },
    onClickPrimary: { type: ControlType.EventHandler },
    onClickSecondary: { type: ControlType.EventHandler },
})
