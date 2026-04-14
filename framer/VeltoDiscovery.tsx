// ──────────────────────────────────────────────────────────────────────────────
// VeltoDiscovery.tsx — Framer Code Component
// Discovery "Reels" section for Velto — Le Futur du Voyage Intelligent 🇨🇦
// ──────────────────────────────────────────────────────────────────────────────

import { addPropertyControls, ControlType } from "framer"
import { motion, AnimatePresence, useDragControls } from "framer-motion"
import { useState, useEffect, useCallback } from "react"

// ─── Data ─────────────────────────────────────────────────────────────────────
const DEFAULT_DESTINATIONS = [
    {
        name: "Maldives",
        country: "🏝️",
        price: "2 490 CAD",
        badge: "-40%",
        color: "#0ea5e9",
        // Public image from Unsplash (free to use)
        image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
        desc: "Villas sur pilotis · All-inclusive · Vol inclus",
    },
    {
        name: "Kyoto",
        country: "🇯🇵",
        price: "1 890 CAD",
        badge: "Deal Flash",
        color: "#f43f5e",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
        desc: "Ryokan traditionnel · Sakura saison · Vol direct",
    },
    {
        name: "New York",
        country: "🗽",
        price: "780 CAD",
        badge: "Meilleur Prix",
        color: "#8b5cf6",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
        desc: "Hôtel Manhattan · 4 nuits · Vol inclus",
    },
    {
        name: "Bali",
        country: "🌴",
        price: "1 650 CAD",
        badge: "-30%",
        color: "#22c55e",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
        desc: "Villa privée · Piscine · Spa · 7 nuits",
    },
]

// ─── Types ───────────────────────────────────────────────────────────────────
interface Destination {
    name: string
    country: string
    price: string
    badge: string
    color: string
    image: string
    desc: string
}

interface Props {
    sectionTitle: string
    sectionSubtitle: string
    accentColor: string
    autoSlide: boolean
    autoSlideInterval: number
    onBookNow?: () => void
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function VeltoDiscovery({
    sectionTitle = "L'App Discovery.",
    sectionSubtitle = "Faites défiler le monde comme vos Reels préférés. Une expérience immersive pour ne plus jamais rater un deal.",
    accentColor = "#22c55e",
    autoSlide = true,
    autoSlideInterval = 4000,
    onBookNow,
}: Props) {
    const [index, setIndex] = useState(0)
    const [direction, setDirection] = useState(1)
    const destinations: Destination[] = DEFAULT_DESTINATIONS

    const next = useCallback(() => {
        setDirection(1)
        setIndex((prev) => (prev + 1) % destinations.length)
    }, [destinations.length])

    const prev = useCallback(() => {
        setDirection(-1)
        setIndex((prev) => (prev - 1 + destinations.length) % destinations.length)
    }, [destinations.length])

    useEffect(() => {
        if (!autoSlide) return
        const timer = setInterval(next, autoSlideInterval)
        return () => clearInterval(timer)
    }, [autoSlide, autoSlideInterval, next])

    const current = destinations[index]

    const css = `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;800&family=Inter:wght@400;500;600&display=swap');

        .vd-root {
            width: 100%;
            height: 100%;
            min-height: 100vh;
            background: #0b0f1a;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 80px 5% 60px;
            position: relative;
            overflow: hidden;
            font-family: 'Inter', sans-serif;
            box-sizing: border-box;
        }

        /* Background blobs */
        .vd-blob {
            position: absolute;
            width: 50vw;
            height: 50vw;
            filter: blur(90px);
            opacity: 0.2;
            pointer-events: none;
            border-radius: 50%;
        }
        .vd-blob-1 {
            top: 20%; right: -10%;
            background: radial-gradient(circle, rgba(34,197,94,0.5) 0%, transparent 70%);
        }
        .vd-blob-2 {
            bottom: 0%; left: -10%;
            background: radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%);
            opacity: 0.15;
        }

        .vd-inner {
            display: grid;
            grid-template-columns: 1fr 1.1fr;
            gap: 5rem;
            align-items: center;
            max-width: 1200px;
            width: 100%;
            z-index: 1;
        }

        @media (max-width: 900px) {
            .vd-inner {
                grid-template-columns: 1fr;
                text-align: center;
                gap: 3rem;
            }
            .vd-info-actions { justify-content: center !important; }
        }

        /* Info Panel */
        .vd-info h2 {
            font-family: 'Outfit', sans-serif;
            font-size: clamp(2.5rem, 5vw, 4.5rem);
            letter-spacing: -2px;
            line-height: 1.0;
            color: white;
            margin-bottom: 1.2rem;
        }

        .vd-info p {
            font-size: clamp(1rem, 1.5vw, 1.15rem);
            color: #94a3b8;
            line-height: 1.65;
            margin-bottom: 2.5rem;
            max-width: 480px;
        }

        .vd-info-actions {
            display: flex;
            gap: 0.75rem;
            flex-wrap: wrap;
        }

        .vd-btn-book {
            background: white;
            color: #0b0f1a;
            padding: 0.9rem 2.2rem;
            border-radius: 14px;
            border: none;
            font-weight: 700;
            font-size: 0.95rem;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            font-family: 'Inter', sans-serif;
        }
        .vd-btn-book:hover {
            transform: scale(1.04);
            box-shadow: 0 12px 35px rgba(0,0,0,0.4);
        }

        /* Dots */
        .vd-dots {
            display: flex;
            gap: 8px;
            align-items: center;
            margin-top: 2rem;
        }
        .vd-dot {
            width: 8px; height: 8px;
            border-radius: 50%;
            background: rgba(255,255,255,0.15);
            cursor: pointer;
            transition: all 0.3s;
            border: none;
        }
        .vd-dot.active {
            background: ${accentColor};
            width: 24px;
            border-radius: 4px;
        }

        /* Phone Mockup */
        .vd-phone-wrap {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        }

        .vd-phone {
            position: relative;
            width: 300px;
            aspect-ratio: 9/19.5;
            background: #111;
            border-radius: 44px;
            overflow: hidden;
            border: 8px solid rgba(255,255,255,0.06);
            box-shadow:
                0 60px 120px rgba(0,0,0,0.7),
                0 0 0 1px rgba(255,255,255,0.04),
                inset 0 0 30px rgba(0,0,0,0.5);
            cursor: grab;
        }
        .vd-phone:active { cursor: grabbing; }

        /* Phone Notch */
        .vd-notch {
            position: absolute;
            top: 12px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 26px;
            background: #111;
            border-radius: 13px;
            z-index: 20;
        }

        /* Phone image */
        .vd-phone-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.75;
            display: block;
        }

        /* Overlay */
        .vd-phone-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(
                to top,
                rgba(0,0,0,0.92) 0%,
                rgba(0,0,0,0.3) 50%,
                transparent 100%
            );
            pointer-events: none;
        }

        /* Phone UI elements */
        .vd-phone-ui {
            position: absolute;
            bottom: 0; left: 0; right: 0;
            padding: 0 20px 28px;
        }

        .vd-phone-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.65rem;
            font-weight: 800;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
        }

        .vd-phone-name {
            font-family: 'Outfit', sans-serif;
            font-size: 1.6rem;
            font-weight: 700;
            color: white;
            letter-spacing: -0.5px;
            margin-bottom: 4px;
        }

        .vd-phone-desc {
            font-size: 0.7rem;
            color: rgba(255,255,255,0.55);
            margin-bottom: 12px;
        }

        .vd-phone-price {
            font-family: 'Outfit', sans-serif;
            font-size: 1.1rem;
            font-weight: 700;
            color: white;
            margin-bottom: 14px;
        }

        .vd-phone-actions {
            display: flex;
            gap: 10px;
        }

        .vd-phone-btn-primary {
            flex: 1;
            padding: 11px;
            border-radius: 12px;
            border: none;
            font-weight: 700;
            font-size: 0.8rem;
            cursor: pointer;
            font-family: 'Inter', sans-serif;
        }

        .vd-phone-btn-secondary {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.15);
            background: rgba(255,255,255,0.06);
            color: white;
            font-size: 1.1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Phone status bar */
        .vd-status-bar {
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 50px;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            padding: 14px 20px 0;
            z-index: 10;
            pointer-events: none;
        }
        .vd-status-time {
            font-size: 0.65rem;
            color: white;
            font-weight: 700;
        }
        .vd-status-icons {
            font-size: 0.6rem;
            color: white;
            opacity: 0.8;
        }

        /* Navigation arrows */
        .vd-arrow {
            position: absolute;
            width: 44px; height: 44px;
            border-radius: 50%;
            background: rgba(255,255,255,0.07);
            border: 1px solid rgba(255,255,255,0.1);
            color: white;
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            top: 50%;
            transform: translateY(-50%);
            transition: background 0.2s;
            z-index: 5;
        }
        .vd-arrow:hover { background: rgba(255,255,255,0.12); }
        .vd-arrow-l { left: -60px; }
        .vd-arrow-r { right: -60px; }

        /* Feature pills on the right of phone */
        .vd-feature-pills {
            position: absolute;
            right: -10px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .vd-pill {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 12px;
            padding: 10px 14px;
            min-width: 130px;
        }
        .vd-pill-label { font-size: 0.6rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .vd-pill-value { font-family: 'Outfit', sans-serif; font-size: 0.95rem; font-weight: 700; color: white; margin-top: 2px; }
        .vd-pill-accent { color: ${accentColor}; }
    `

    const slideVariants = {
        enter: (dir: number) => ({
            opacity: 0,
            scale: 1.08,
            y: dir > 0 ? 30 : -30,
        }),
        center: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        },
        exit: (dir: number) => ({
            opacity: 0,
            scale: 0.94,
            y: dir > 0 ? -20 : 20,
            transition: { duration: 0.4, ease: "easeIn" },
        }),
    }

    return (
        <div className="vd-root">
            <style dangerouslySetInnerHTML={{ __html: css }} />

            <div className="vd-blob vd-blob-1" />
            <div className="vd-blob vd-blob-2" />

            <div className="vd-inner">
                {/* Info Panel */}
                <div className="vd-info">
                    <motion.h2
                        key={`title-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {sectionTitle}
                    </motion.h2>

                    <p>{sectionSubtitle}</p>

                    <div className="vd-info-actions">
                        <button className="vd-btn-book" onClick={onBookNow}>
                            Réserver ce deal
                        </button>
                    </div>

                    <div className="vd-dots">
                        {destinations.map((_, i) => (
                            <button
                                key={i}
                                className={`vd-dot ${i === index ? "active" : ""}`}
                                onClick={() => {
                                    setDirection(i > index ? 1 : -1)
                                    setIndex(i)
                                }}
                            />
                        ))}
                    </div>

                    {/* Stats */}
                    <motion.div
                        key={`stats-${index}`}
                        style={{
                            marginTop: "2.5rem",
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "1rem",
                            maxWidth: "360px",
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                    >
                        {[
                            { label: "À partir de", value: current.price, accent: true },
                            { label: "Économie", value: current.badge, accent: true },
                            { label: "Sources comparées", value: "500+", accent: false },
                            { label: "Résultat en", value: "2ms", accent: false },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                style={{
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                    borderRadius: "12px",
                                    padding: "0.9rem 1rem",
                                }}
                            >
                                <div style={{ fontSize: "0.65rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                                    {stat.label}
                                </div>
                                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: stat.accent ? accentColor : "white" }}>
                                    {stat.value}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Phone Mockup */}
                <div className="vd-phone-wrap">
                    <div className="vd-phone">
                        {/* Notch */}
                        <div className="vd-notch" />

                        {/* Status Bar */}
                        <div className="vd-status-bar">
                            <span className="vd-status-time">9:41</span>
                            <span className="vd-status-icons">▲ ◉ ▮▮▮</span>
                        </div>

                        {/* Swipeable image */}
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.img
                                key={`img-${index}`}
                                className="vd-phone-img"
                                src={current.image}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                drag="y"
                                dragConstraints={{ top: 0, bottom: 0 }}
                                dragElastic={0.2}
                                onDragEnd={(_, info) => {
                                    if (info.offset.y < -50) next()
                                    else if (info.offset.y > 50) prev()
                                }}
                                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </AnimatePresence>

                        {/* Overlay */}
                        <div className="vd-phone-overlay" />

                        {/* Phone UI */}
                        <div className="vd-phone-ui">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`ui-${index}`}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.45 }}
                                >
                                    <div
                                        className="vd-phone-badge"
                                        style={{ background: current.color, color: "white" }}
                                    >
                                        EN PROMO {current.badge}
                                    </div>

                                    <div className="vd-phone-name">
                                        {current.country} {current.name}
                                    </div>

                                    <div className="vd-phone-desc">{current.desc}</div>

                                    <div className="vd-phone-price">À partir de {current.price}</div>

                                    <div className="vd-phone-actions">
                                        <button
                                            className="vd-phone-btn-primary"
                                            style={{ background: accentColor, color: "white" }}
                                        >
                                            Réserver →
                                        </button>
                                        <button className="vd-phone-btn-secondary">♡</button>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Arrows */}
                    <button className="vd-arrow vd-arrow-l" onClick={prev}>‹</button>
                    <button className="vd-arrow vd-arrow-r" onClick={next}>›</button>
                </div>
            </div>
        </div>
    )
}

// ─── Framer Property Controls ─────────────────────────────────────────────────
addPropertyControls(VeltoDiscovery, {
    sectionTitle: {
        type: ControlType.String,
        title: "Titre Section",
        defaultValue: "L'App Discovery.",
    },
    sectionSubtitle: {
        type: ControlType.String,
        title: "Sous-titre",
        defaultValue:
            "Faites défiler le monde comme vos Reels préférés. Une expérience immersive pour ne plus jamais rater un deal.",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Couleur Accent",
        defaultValue: "#22c55e",
    },
    autoSlide: {
        type: ControlType.Boolean,
        title: "Auto-slide",
        defaultValue: true,
    },
    autoSlideInterval: {
        type: ControlType.Number,
        title: "Intervalle (ms)",
        defaultValue: 4000,
        min: 1000,
        max: 10000,
        step: 500,
        hidden: (props) => !props.autoSlide,
    },
    onBookNow: { type: ControlType.EventHandler },
})
