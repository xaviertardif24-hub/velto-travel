import * as React from "react"
import { motion } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"
import { Zap, Globe, Heart, Sparkles } from "lucide-react"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */

export default function VoxeraBento(props) {
    const { accentColor, card1Title, card1Desc, card2Title, card2Desc, card3Title, card3Desc } = props

    return (
        <div style={containerStyle}>
            <div style={gridStyle}>
                {/* Card 1: Vitesse IA */}
                <motion.div 
                    style={cardStyle}
                    whileHover={{ scale: 1.02, borderColor: accentColor }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <div style={{ ...iconCircle, backgroundColor: `${accentColor}15` }}>
                        <Zap size={24} color={accentColor} />
                    </div>
                    <h3 style={h3Style}>{card1Title}</h3>
                    <p style={pStyle}>{card1Desc}</p>
                    <div style={{ ...itemBadge, color: accentColor }}>500 sources/sec</div>
                </motion.div>

                {/* Card 2: 100% Canada */}
                <motion.div 
                    style={cardStyle}
                    whileHover={{ scale: 1.02, borderColor: accentColor }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <div style={{ ...iconCircle, backgroundColor: `${accentColor}15` }}>
                        <Globe size={24} color={accentColor} />
                    </div>
                    <h3 style={h3Style}>{card2Title}</h3>
                    <p style={pStyle}>{card2Desc}</p>
                    <div style={{ ...itemBadge, color: accentColor }}>Montréal • Toronto • etc.</div>
                </motion.div>

                {/* Card 3: Sur-Mesure (Wide) */}
                <motion.div 
                    style={{ ...cardStyle, gridColumn: "span 2" }}
                    whileHover={{ scale: 1.01, borderColor: accentColor }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                        <div style={{ ...iconCircle, width: 60, height: 60, backgroundColor: `${accentColor}15` }}>
                            <Heart size={32} color={accentColor} />
                        </div>
                        <div>
                            <h3 style={{ ...h3Style, marginBottom: 4 }}>{card3Title}</h3>
                            <p style={{ ...pStyle, margin: 0 }}>{card3Desc}</p>
                        </div>
                        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
                             <div style={aiPill}>Éléonore AI</div>
                             <div style={{ ...aiPill, background: `${accentColor}20`, borderColor: accentColor }}>Active</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

// Default Props
VoxeraBento.defaultProps = {
    accentColor: "#22c55e",
    card1Title: "Vitesse IA",
    card1Desc: "Éléonore analyse 500 sources par seconde pour trouver le deal imbattable.",
    card2Title: "100% Canada",
    card2Desc: "Spécialisé pour Montréal et Toronto. Tout est en CAD, clair et net.",
    card3Title: "Expérience Sur-Mesure",
    card3Desc: "Plus qu'un comparateur, une agente qui comprend vos envies et votre budget pour des suggestions uniques.",
}

// Framer Property Controls
addPropertyControls(VoxeraBento, {
    accentColor: { type: ControlType.Color, title: "Couleur Accent", defaultValue: "#22c55e" },
    card1Title: { type: ControlType.String, title: "Titre Carte 1", defaultValue: "Vitesse IA" },
    card1Desc: { type: ControlType.String, title: "Desc Carte 1", defaultValue: "..." },
    card2Title: { type: ControlType.String, title: "Titre Carte 2", defaultValue: "100% Canada" },
    card2Desc: { type: ControlType.String, title: "Desc Carte 2", defaultValue: "..." },
    card3Title: { type: ControlType.String, title: "Titre Carte 3", defaultValue: "Sur-Mesure" },
    card3Desc: { type: ControlType.String, title: "Desc Carte 3", defaultValue: "..." },
})

// Styles
const containerStyle = {
    width: "100%",
    backgroundColor: "#000000",
    padding: "60px 20px",
    display: "flex",
    justifyContent: "center",
}

const gridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    maxWidth: "1000px",
    width: "100%",
}

const cardStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "24px",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    transition: "border-color 0.4s ease",
}

const h3Style = {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#ffffff",
    margin: 0,
    marginTop: "8px",
}

const pStyle = {
    fontSize: "0.95rem",
    lineHeight: 1.5,
    color: "#94a3b8",
    margin: 0,
}

const iconCircle = {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}

const itemBadge = {
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.02em",
    padding: "6px 12px",
    borderRadius: "100px",
    backgroundColor: "rgba(255,255,255,0.05)",
    width: "fit-content",
    marginTop: "auto",
}

const aiPill = {
    fontSize: "0.7rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    padding: "4px 10px",
    borderRadius: "99px",
    border: "1px solid rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "#94a3b8",
}
