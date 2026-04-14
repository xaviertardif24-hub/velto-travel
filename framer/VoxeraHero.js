import * as React from "react"
import { motion } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"
import { Sparkles, ChevronRight } from "lucide-react"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */

export default function VoxeraHero(props) {
    const { 
        title, subtitle, btnText, accentColor, 
        bgImage, showLogos, logoTitle, logo1, logo2, logo3, logo4, logo5 
    } = props

    return (
        <div style={{ ...containerStyle, backgroundImage: bgImage ? `url(${bgImage})` : "none" }}>
            {/* Dark Overlay for Readability */}
            <div style={overlayStyle} />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={contentStyle}
            >
                {/* Main Heading */}
                <h1 style={h1Style}>{title}</h1>

                {/* Subtitle */}
                <p style={pStyle}>{subtitle}</p>

                {/* Single Primary Button */}
                <motion.button 
                    style={{ ...btnStyle, background: "white", color: "#000" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {btnText}
                </motion.button>
            </motion.div>

            {/* Logo Row at Bottom */}
            {showLogos && (
                <div style={logoSection}>
                    <p style={logoHeader}>{logoTitle}</p>
                    <div style={logoRow}>
                        <div style={logoItem}>✨ {logo1}</div>
                        <div style={logoItem}>⚡ {logo2}</div>
                        <div style={logoItem}>💎 {logo3}</div>
                        <div style={logoItem}>🔥 {logo4}</div>
                        <div style={logoItem}>🌟 {logo5}</div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Default Props
VoxeraHero.defaultProps = {
    title: "AI Voice Agents for Every Customer Call",
    subtitle: "Voxera's AI voice agents answer questions, resolve issues, book appointments, and qualify leads — 24/7, with natural human-like conversations.",
    btnText: "Talk to Us",
    accentColor: "#22c55e",
    bgImage: "file:///C:/Users/xavie/.gemini/antigravity/brain/32be1248-716c-482d-9e37-4264580f82ed/velto_hero_bg_spectacular_desert_1775134606365.png",
    showLogos: true,
    logoTitle: "Backed by industry leaders",
    logo1: "Air Canada",
    logo2: "WestJet",
    logo3: "Porter",
    logo4: "Flair Air",
    logo5: "Sunwing"
}

// Framer Property Controls
addPropertyControls(VoxeraHero, {
    title: { type: ControlType.String, title: "Titre", defaultValue: "AI Voice Agents..." },
    subtitle: { type: ControlType.String, title: "Sous-titre", displayStepper: true, defaultValue: "Voxera's AI voice agents..." },
    btnText: { type: ControlType.String, title: "Texte Bouton", defaultValue: "Talk to Us" },
    bgImage: { type: ControlType.Image, title: "Image de Fond" },
    accentColor: { type: ControlType.Color, title: "Couleur Accent", defaultValue: "#22c55e" },
    showLogos: { type: ControlType.Boolean, title: "Afficher Logos", defaultValue: true },
    logoTitle: { type: ControlType.String, title: "Titre Logos", defaultValue: "Backed by leaders" },
    logo1: { type: ControlType.String, title: "Logo 1", defaultValue: "Acme Corp" },
    logo2: { type: ControlType.String, title: "Logo 2", defaultValue: "Epicurious" },
    logo3: { type: ControlType.String, title: "Logo 3", defaultValue: "Quantum²" },
    logo4: { type: ControlType.String, title: "Logo 4", defaultValue: "Foresight" },
    logo5: { type: ControlType.String, title: "Logo 5", defaultValue: "Layers" },
})

// Styles
const containerStyle = {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "#fff",
    position: "relative",
    padding: "60px 20px",
    textAlign: "center",
}

const overlayStyle = {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)",
    zIndex: 1,
}

const contentStyle = {
    maxWidth: 800,
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "100px",
}

const h1Style = {
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
    marginBottom: "24px",
}

const pStyle = {
    fontSize: "clamp(1rem, 2vw, 1.2rem)",
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.8)",
    maxWidth: "600px",
    marginBottom: "40px",
}

const btnStyle = {
    padding: "16px 40px",
    borderRadius: "100px",
    border: "none",
    fontWeight: 700,
    fontSize: "1.1rem",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
}

const logoSection = {
    position: "absolute",
    bottom: "40px",
    width: "100%",
    zIndex: 10,
    padding: "0 20px",
}

const logoHeader = {
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "rgba(255,255,255,0.5)",
    marginBottom: "20px",
    fontWeight: 600,
}

const logoRow = {
    display: "flex",
    justifyContent: "center",
    gap: "32px",
    flexWrap: "wrap",
    opacity: 0.8,
}

const logoItem = {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: "8px",
}
