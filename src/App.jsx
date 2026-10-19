import { useEffect, useState } from 'react'
import AboutPage from './AboutPage.jsx'
import SkillsPage from './SkillsPage.jsx'
import SkillStudio from './SkillStudio.jsx'

const currentYear = new Date().getFullYear()

function Arrow() {
  return <span aria-hidden="true" className="arrow">↗</span>
}

const featureCards = [
  { title: 'About Me', image: '/cards/about-me.jpg', href: '/about', className: 'card-lime' },
  { title: 'My Skills', image: '/cards/my-skills.jpg', href: '/skills', className: 'card-blue' },
  { title: 'Skill Studio', image: '/cards/skill-studio.jpg', href: '/studio', className: 'card-coral' },
]

function Navigation({ menuOpen, setMenuOpen }) {
  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="/" onClick={closeMenu} aria-label="MK portfolio home">mk<span>.</span></a>
        <span className="header-note">Portfolio / {currentYear}</span>
        <button className={`menu-button ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">
          <span />
          <span />
        </button>
        <nav className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <a href="/about" onClick={closeMenu}>About Me <Arrow /></a>
          <a href="/skills" onClick={closeMenu}>My Skills <Arrow /></a>
          <a href="/studio" onClick={closeMenu}>Skill Studio <Arrow /></a>
        </nav>
      </header>
    </>
  )
}

function HomePage() {
  const [showIntro, setShowIntro] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="site-shell home-page">
      {showIntro && (
        <div className="intro-screen" role="status" aria-label="Welcome">
          <div className="intro-doodle intro-doodle-one">+</div>
          <div className="intro-doodle intro-doodle-two">⌁</div>
          <p>Welcome to my little corner</p>
          <h2>Hi! I&apos;m <mark className="highlight-pink">Emkim</mark><span>.</span></h2>
          <div className="intro-progress"><span /></div>
        </div>
      )}
      <div className="cursor-glow" aria-hidden="true" />
      <Navigation menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main id="top">
        <section className="hero">
          <div className="floating-shape shape-one" />
          <div className="floating-shape shape-two" />
          <p className="eyebrow">Hello, I&apos;m Emkim</p>
          <h1>
            Hi! I&apos;m <mark className="highlight-pink">Emkim</mark>
            <br />who loves to <mark className="highlight-yellow">learn</mark>,
            <br />make things <mark className="highlight-blue">better</mark>
            <br />and show up with <em>purpose.</em>
          </h1>
          <div className="feature-cards" aria-label="Explore portfolio">
            <div className="card-heading">
              <span>Start here</span>
              <span>Pick a page <b>↓</b></span>
            </div>
            <div className="card-grid">
              {featureCards.map((card, index) => (
                <a className={`feature-card ${card.className} card-${index + 1}`} href={card.href} key={card.title}>
                  <div className="card-image-wrap">
                    <img src={card.image} alt={`${card.title} illustrated card`} />
                    <span className="card-arrow"><Arrow /></span>
                  </div>
                  <div className="card-caption"><span>0{index + 1}</span><strong>{card.title}</strong><span>Open <Arrow /></span></div>
                </a>
              ))}
            </div>
          </div>
          <div className="hero-bottom">
            <p>Based in Taguig City, Philippines<br />Available for new opportunities</p>
            <a className="scroll-cue" href="/about">Explore about me <span>↓</span></a>
          </div>
        </section>
      </main>
    </div>
  )
}

function App() {
  const path = window.location.pathname
  if (path.startsWith('/about')) return <AboutPage />
  if (path.startsWith('/skills')) return <SkillsPage />
  if (path.startsWith('/studio')) return <SkillStudio />
  return <HomePage />
}

export default App
