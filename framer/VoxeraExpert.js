import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"
import { Mic, Send, MapPin, Users, Wallet, Calendar, CheckCircle } from "lucide-react"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */

// ─── Conversation Flow ────────────────────────────────────────────────────────
const STEPS = [
    {
        key: "destination",
        question: "Bonjour ! Je suis prête à bâtir votre projet de voyage idéal ✈️\n\nQuelle destination vous fait rêver ? (Ex : Bali, Tokyo, Grèce...)",
        placeholder: "Ex : Tokyo, Bali, Portugal...",
        dossierKey: null,
    },
    {
        key: "travelers",
        question: "Excellent choix ! 🌏\n\nCombien de voyageurs partent avec vous ? (Ex : 2 adultes, 1 enfant)",
        placeholder: "Ex : 2 adultes, 1 enfant de 8 ans...",
        dossierKey: "travelers",
    },
    {
        key: "dates",
        question: "Super ! 👨‍👩‍👧\n\nQuelles sont vos dates de voyage envisagées ? (Ex : Juillet 2026, 2 semaines)",
        placeholder: "Ex : Juillet 2026, 10 jours...",
        dossierKey: "dates",
    },
    {
        key: "budget",
        question: "Parfait, je note ! 📅\n\nQuel est votre budget estimé pour ce voyage ? (En CAD ou USD)",
        placeholder: "Ex : 4500 CAD, 3000 USD...",
        dossierKey: "budget",
    },
    {
        key: "complete",
        question: null, // generated dynamically
        placeholder: null,
        dossierKey: null,
    },
]

// Typewriter hook
function useTypewriter(text, speed = 18, active = true) {
    const [displayed, setDisplayed] = React.useState("")
    const [done, setDone] = React.useState(false)

    React.useEffect(() => {
        if (!active || !text) {
            setDisplayed(text || "")
            setDone(true)
            return
        }
        setDisplayed("")
        setDone(false)
        let i = 0
        const timer = setInterval(() => {
            i++
            setDisplayed(text.slice(0, i))
            if (i >= text.length) {
                clearInterval(timer)
                setDone(true)
            }
        }, speed)
        return () => clearInterval(timer)
    }, [text, active])

    return { displayed, done }
}

// Single chat message component
function ChatMessage({ msg, isLatest }) {
    const isAI = msg.role === "ai"
    const { displayed } = useTypewriter(msg.content, 14, isAI && isLatest)

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
                display: "flex",
                justifyContent: isAI ? "flex-start" : "flex-end",
                marginBottom: "12px",
            }}
        >
            <div
                style={{
                    maxWidth: "85%",
                    padding: "12px 16px",
                    borderRadius: isAI ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
                    backgroundColor: isAI ? "rgba(255,255,255,0.05)" : "rgba(167,139,250,0.15)",
                    border: isAI
                        ? "1px solid rgba(255,255,255,0.07)"
                        : "1px solid rgba(167,139,250,0.25)",
                    fontSize: "0.9rem",
                    lineHeight: 1.55,
                    color: "#ffffff",
                    whiteSpace: "pre-line",
                }}
            >
                {isAI && isLatest ? displayed : msg.content}
            </div>
        </motion.div>
    )
}

export default function VoxeraExpert(props) {
    const { accentColor, aiName, statusText } = props

    // ─── State ────────────────────────────────────────────────────────────────
    const [step, setStep] = React.useState(0)
    const [messages, setMessages] = React.useState([
        { role: "ai", content: STEPS[0].question, id: Date.now() },
    ])
    const [inputValue, setInputValue] = React.useState("")
    const [isTyping, setIsTyping] = React.useState(false)
    const [dossier, setDossier] = React.useState({
        destination: "—",
        travelers: "—",
        dates: "—",
        budget: "—",
    })
    const [isComplete, setIsComplete] = React.useState(false)

    const chatRef = React.useRef(null)
    const inputRef = React.useRef(null)

    // Auto-scroll to bottom
    React.useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight
        }
    }, [messages, isTyping])

    // Progress = step / (STEPS.length - 1) * 100
    const progress = Math.min((step / (STEPS.length - 1)) * 100, 100)

    // ─── Send Handler ──────────────────────────────────────────────────────────
    const handleSend = () => {
        const trimmed = inputValue.trim()
        if (!trimmed || isTyping || isComplete) return

        const currentStep = STEPS[step]

        // Add user message
        const userMsg = { role: "user", content: trimmed, id: Date.now() }
        setMessages(prev => [...prev, userMsg])
        setInputValue("")

        // Update dossier
        const newDossier = { ...dossier }
        if (step === 0) newDossier.destination = trimmed
        if (step === 1) newDossier.travelers = trimmed
        if (step === 2) newDossier.dates = trimmed
        if (step === 3) newDossier.budget = trimmed
        setDossier(newDossier)

        const nextStep = step + 1

        if (nextStep >= STEPS.length - 1) {
            // Final step — summary
            setIsTyping(true)
            setTimeout(() => {
                const summary = `🎉 Votre dossier est prêt !\n\n📍 Destination : ${newDossier.destination}\n👥 Voyageurs : ${newDossier.travelers}\n📅 Période : ${newDossier.dates}\n💰 Budget : ${newDossier.budget}\n\nJe prépare vos meilleures offres personnalisées. On décolle bientôt ! ✨`
                setMessages(prev => [...prev, { role: "ai", content: summary, id: Date.now() }])
                setIsTyping(false)
                setStep(nextStep)
                setIsComplete(true)
            }, 800)
        } else {
            setIsTyping(true)
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: "ai",
                    content: STEPS[nextStep].question,
                    id: Date.now(),
                }])
                setIsTyping(false)
                setStep(nextStep)
            }, 900)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleReset = () => {
        setStep(0)
        setMessages([{ role: "ai", content: STEPS[0].question, id: Date.now() }])
        setInputValue("")
        setIsTyping(false)
        setIsComplete(false)
        setDossier({ destination: "—", travelers: "—", dates: "—", budget: "—" })
    }

    // ─── Render ────────────────────────────────────────────────────────────────
    return (
        <div style={containerStyle}>
            {/* AI Agent Avatar */}
            <div style={avatarSection}>
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    style={{ ...avatarRing, borderColor: `${accentColor}4D` }}
                />
                <div style={{ ...avatarCircle, backgroundColor: accentColor }}>
                    <span style={{ fontSize: "2rem" }}>👒</span>
                </div>
                <div style={statusBadge}>
                    <div style={{ ...statusDot, backgroundColor: accentColor }} />
                    {statusText}
                </div>
            </div>

            {/* Chat Frame */}
            <div style={chatFrame}>
                <div style={chatHeader}>
                    <span style={{ fontWeight: 700 }}>{aiName}</span> — Agente Experte
                </div>

                {/* Progress Bar */}
                <div style={progressBarBg}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        style={{ ...progressBarFill, backgroundColor: accentColor }}
                    />
                </div>
                <div style={progressLabel}>
                    {isComplete ? "Dossier complet ✓" : `Étape ${Math.min(step + 1, STEPS.length - 1)} / ${STEPS.length - 1}`}
                </div>

                {/* Chat Window */}
                <div ref={chatRef} style={chatWindow}>
                    <AnimatePresence>
                        {messages.map((msg, i) => (
                            <ChatMessage
                                key={msg.id}
                                msg={msg}
                                isLatest={i === messages.length - 1}
                            />
                        ))}
                    </AnimatePresence>

                    {/* Typing indicator */}
                    <AnimatePresence>
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                style={typingIndicator}
                            >
                                <span style={typingDot} />
                                <span style={{ ...typingDot, animationDelay: "0.2s" }} />
                                <span style={{ ...typingDot, animationDelay: "0.4s" }} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Dossier Dashboard */}
                <div style={dossierContainer}>
                    <div style={dossierGrid}>
                        <DossierItem icon={<MapPin size={14} />} label="Destination" value={dossier.destination} accent={accentColor} />
                        <DossierItem icon={<Users size={14} />} label="Passagers" value={dossier.travelers} accent={accentColor} />
                        <DossierItem icon={<Calendar size={14} />} label="Période" value={dossier.dates} accent={accentColor} />
                        <DossierItem icon={<Wallet size={14} />} label="Budget" value={dossier.budget} accent={accentColor} />
                    </div>
                </div>

                {/* Input Bar */}
                {isComplete ? (
                    <button onClick={handleReset} style={{ ...resetBtn, backgroundColor: accentColor }}>
                        <CheckCircle size={16} color="white" />
                        <span style={{ color: "white", fontSize: "0.85rem", fontWeight: 600 }}>Nouveau voyage</span>
                    </button>
                ) : (
                    <div style={inputBar}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={STEPS[Math.min(step, STEPS.length - 2)].placeholder}
                            disabled={isTyping}
                            style={inputStyle}
                        />
                        <div style={iconGroup}>
                            <div
                                onClick={handleSend}
                                style={{
                                    ...sendBtn,
                                    backgroundColor: inputValue.trim() && !isTyping ? accentColor : "rgba(255,255,255,0.1)",
                                    cursor: inputValue.trim() && !isTyping ? "pointer" : "default",
                                    transition: "background-color 0.2s ease",
                                }}
                            >
                                <Send size={16} color="white" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function DossierItem({ icon, label, value, accent }) {
    const isFilled = value !== "—"
    return (
        <div style={itemStyle}>
            <div style={{ ...itemIcon, color: isFilled ? accent : "#94a3b8", borderColor: isFilled ? `${accent}33` : "transparent" }}>
                {icon}
            </div>
            <div style={itemInfo}>
                <div style={itemLabel}>{label}</div>
                <div style={{ ...itemValue, color: isFilled ? "#ffffff" : "#475569" }}>{value}</div>
            </div>
        </div>
    )
}

// Default Props
VoxeraExpert.defaultProps = {
    accentColor: "#22c55e",
    aiName: "Éléonore",
    statusText: "En ligne — Spécialiste Canada",
}

// Framer Property Controls
addPropertyControls(VoxeraExpert, {
    accentColor: { type: ControlType.Color, title: "Couleur", defaultValue: "#22c55e" },
    aiName: { type: ControlType.String, title: "Nom IA", defaultValue: "Éléonore" },
    statusText: { type: ControlType.String, title: "Statut", defaultValue: "En ligne — Spécialiste Canada" },
})

// Styles
const containerStyle = {
    width: "100%",
    backgroundColor: "#000000",
    padding: "60px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "40px",
    fontFamily: "'Inter', sans-serif",
}

const avatarSection = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
}

const avatarCircle = {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    boxShadow: "0 0 40px rgba(34, 197, 94, 0.2)",
}

const avatarRing = {
    position: "absolute",
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    border: "1px solid",
    zIndex: 1,
}

const statusBadge = {
    marginTop: "20px",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: "6px 14px",
    borderRadius: "100px",
    fontSize: "0.8rem",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "1px solid rgba(255,255,255,0.1)",
}

const statusDot = {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
}

const chatFrame = {
    maxWidth: "500px",
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(30px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "32px",
    padding: "24px",
}

const chatHeader = {
    fontSize: "0.9rem",
    color: "#94a3b8",
    marginBottom: "16px",
    textAlign: "center",
}

const progressBarBg = {
    width: "100%",
    height: "3px",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: "2px",
    overflow: "hidden",
    marginBottom: "6px",
}

const progressBarFill = {
    height: "100%",
    borderRadius: "2px",
}

const progressLabel = {
    fontSize: "0.7rem",
    color: "#475569",
    textAlign: "right",
    marginBottom: "16px",
    letterSpacing: "0.03em",
}

const chatWindow = {
    height: "220px",
    overflowY: "auto",
    marginBottom: "20px",
    paddingRight: "4px",
    scrollBehavior: "smooth",
}

const typingIndicator = {
    display: "flex",
    gap: "5px",
    alignItems: "center",
    padding: "10px 14px",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: "12px 12px 12px 4px",
    width: "fit-content",
    marginBottom: "12px",
}

const typingDot = {
    display: "inline-block",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#475569",
    animation: "typingBounce 1.2s ease infinite",
}

const dossierContainer = {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: "20px",
    padding: "16px 20px",
    marginBottom: "20px",
}

const dossierGrid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
}

const itemStyle = {
    display: "flex",
    gap: "10px",
    alignItems: "center",
}

const itemIcon = {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    backgroundColor: "rgba(255,255,255,0.05)",
    border: "1px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "color 0.3s ease, border-color 0.3s ease",
}

const itemInfo = {
    display: "flex",
    flexDirection: "column",
}

const itemLabel = {
    fontSize: "0.65rem",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
}

const itemValue = {
    fontSize: "0.82rem",
    fontWeight: 600,
    transition: "color 0.3s ease",
}

const inputBar = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: "6px 6px 6px 16px",
    borderRadius: "100px",
    border: "1px solid rgba(255,255,255,0.08)",
}

const inputStyle = {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    fontSize: "0.88rem",
    color: "#f1f5f9",
    fontFamily: "inherit",
    minWidth: 0,
}

const iconGroup = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
}

const sendBtn = {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}

const resetBtn = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    padding: "12px",
    borderRadius: "100px",
    border: "none",
    cursor: "pointer",
}
