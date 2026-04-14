import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Globe, Zap, Heart, Sparkles, Layout } from 'lucide-react';
import maldives from './assets/maldives.png';
import kyoto from './assets/kyoto.png';
import newyork from './assets/newyork.png';
import './App.css';

const images = [maldives, kyoto, newyork];

const App = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="velto-site">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">VELTO<span>.</span></div>
        <div className="nav-links">
          <a href="#features">Expertise</a>
          <a href="#demo">Démo</a>
          <button className="btn-vibe">Essayer gratuitement</button>
        </div>
      </nav>

      <main className="snap-container">
        {/* HERO SECTION */}
        <section className="section hero">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="hero-content"
          >
            <div className="badge"><Sparkles size={14} /> Propulsé par Éléonore AI</div>
            <h1>Ailleurs.<br/>Pour beaucoup moins.</h1>
            <p className="subtitle">
              L'algorithme de voyage le plus sophistiqué du Canada. 
              Des milliers de deals comparés en 2ms pour vous garantir le prix le plus bas en CAD.
            </p>
            <div className="cta-group">
              <button className="btn-primary">Démarrer l'aventure <ChevronRight size={18} /></button>
              <button className="btn-secondary">En savoir plus</button>
            </div>
          </motion.div>

          <div className="hero-scroll-hint">
            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="mouse"
            />
          </div>
        </section>

        {/* PRICE TICKER */}
        <div className="ticker-section">
          <div className="ticker-bg">
            <motion.div 
              animate={{ x: "-50%" }}
              transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
              className="ticker-track"
            >
              {[...Array(20)].map((_, i) => (
                <div key={i} className="ticker-item">
                  🇲🇽 Cancún : <b>-45%</b> 🇯🇵 Tokyo : <b>1 890 CAD</b> 🇫🇷 Paris : <b>Deal Flash</b> 🏝️ Bali : <b>-30%</b>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* FEATURES GRID */}
        <section className="section features" id="features">
          <div className="grid">
            <FeatureCard 
              icon={<Zap className="icon-v" />} 
              title="Vitesse IA" 
              desc="Éléonore analyse 500 sources par seconde pour trouver le deal imbattable."
            />
            <FeatureCard 
              icon={<Globe className="icon-v" />} 
              title="100% Canada" 
              desc="Spécialisé pour Montréal, Toronto et Vancouver. Tout est en CAD, clair et net."
            />
            <FeatureCard 
              icon={<Heart className="icon-v" />} 
              title="Sur-Mesure" 
              desc="Plus qu'un comparateur, une agente qui comprend vos envies et votre budget."
            />
          </div>
        </section>

        {/* SHOWCASE SECTION */}
        <section className="section showcase" id="demo">
          <div className="showcase-inner">
            <div className="showcase-info">
              <h2>L'App Discovery.</h2>
              <p>Faites défiler le monde comme vos Reels préférés. Une expérience immersive pour ne plus jamais rater un deal.</p>
              <button className="btn-primary">Tester la démo</button>
            </div>
            
            <div className="mockup-frame">
              <AnimatePresence mode="wait">
                <motion.img
                  key={index}
                  src={images[index]}
                  initial={{ opacity: 0, scale: 1.1, rotate: 2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                  className="mockup-img"
                />
              </AnimatePresence>
              <div className="mockup-ui">
                <div className="badge-ia">EN PROMO -40%</div>
                <h3>{index === 0 ? "Maldives" : index === 1 ? "Kyoto" : "New York"}</h3>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <p>© 2026 VELTO TRAVEL. Built with Framer Motion 🇨🇦</p>
        </footer>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -10, borderColor: "#22c55e" }}
    className="feat-card"
  >
    {icon}
    <h3>{title}</h3>
    <p>{desc}</p>
  </motion.div>
);

export default App;
