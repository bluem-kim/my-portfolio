import { useEffect, useRef, useState } from 'react'

const experiences = [
  { number: '01', role: 'Waitress', company: 'Kitchen City', dates: 'December 2023 — January 2024', color: 'lime', details: ['Assisted in setting up event venues, including tables, chairs, and dining arrangements.', 'Served food and beverages to guests during catering and special events.', 'Ensured cleanliness and organization of the venue before, during, and after events.'] },
  { number: '02', role: 'Encoder', company: 'Public Employment Service Office', dates: 'May 2023 — June 2023', color: 'blue', details: ['Encoded and organized applicant and employment records.', 'Entered data accurately into computer systems and maintained proper documentation.', 'Assisted office staff with clerical tasks.'] },
]

const currentYear = new Date().getFullYear()

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.12 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return [ref, visible]
}

function Arrow() {
  return <span aria-hidden="true" className="arrow">↗</span>
}

function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeExperience, setActiveExperience] = useState(null)
  const [activeProfile, setActiveProfile] = useState('birthday')
  const [aboutRef, aboutVisible] = useReveal()
  const [experienceRef, experienceVisible] = useReveal()

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="MK portfolio home">mk<span>.</span></a>
        <span className="header-note">Portfolio / {currentYear}</span>
        <button className={`menu-button ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation"><span /><span /></button>
        <nav className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <a href="/about" onClick={() => setMenuOpen(false)}>About Me <Arrow /></a>
          <a href="/skills" onClick={() => setMenuOpen(false)}>My Skills <Arrow /></a>
          <a href="/studio" onClick={() => setMenuOpen(false)}>Skill Studio <Arrow /></a>
        </nav>
      </header>

      <main>
        <section className={`section about-section reveal ${aboutVisible ? 'is-visible' : ''}`} ref={aboutRef}>
          <div className="section-label"><span>01</span><span>A little about me</span><span className="section-label-note">get to know emkim ↓</span></div>
          <div className="about-content">
            <div className="about-title-wrap"><span className="about-sticker">hello,<br />i&apos;m<br /><b>emkim</b> ✦</span><h1>I&apos;m curious,<br /><em>organized,</em><br />and ready.</h1><span className="about-handnote">learning as I go →</span></div>
            <div className="about-copy"><div className="about-intro-cards"><article className="about-intro-card about-intro-card-one"><span>01 / who I am</span><p>Motivated, detail-oriented, and ready to contribute while building meaningful experience.</p></article><article className="about-intro-card about-intro-card-two"><span>02 / how I learn</span><p>Largely self-taught, I enjoy turning new ideas and tools into practical work.</p></article><article className="about-intro-card about-intro-card-three"><span>03 / what&apos;s next</span><p>Looking forward to enhancing my knowledge and adding new chapters to my experience.</p></article></div><div className="about-now"><span>Currently</span><strong>learning, making,<br />and showing up.</strong><i>● open to opportunities</i></div><a className="text-link" href="https://mail.google.com/mail/?view=cm&fs=1&to=labilabikim13%40gmail.com" target="_blank" rel="noreferrer">Say hello <Arrow /></a></div>
          </div>
        </section>

        <section className="about-profile-section section">
          <div className="section-label"><span>02</span><span>A few details</span></div>
          <div className="profile-intro"><h2>Still becoming,<br /><em>one chapter at a time.</em></h2><p>Tap a card to reveal a little more about me.</p></div>
          <div className="profile-cards">{[['birthday', 'Birthday', '07 FEB 2005', 'A little February spark with plenty more ideas ahead.'], ['learning', 'Always learning', 'CURIOUS BY DEFAULT', 'I enjoy discovering better ways to do things and turning lessons into useful work.'], ['next', 'Looking ahead', 'READY FOR THE NEXT CHAPTER', 'I am excited to grow through new responsibilities, people, and opportunities.']].map(([id, label, value, detail]) => <button className={`profile-card profile-card-${id} ${activeProfile === id ? 'is-active' : ''}`} onClick={() => setActiveProfile(activeProfile === id ? null : id)} aria-expanded={activeProfile === id} key={id}><span className="profile-card-label">{label}</span><strong>{value}</strong><span className="profile-card-detail">{detail}</span><span className="profile-card-action">{activeProfile === id ? 'Close −' : 'Open +'}</span></button>)}</div>
        </section>

        <section id="experience" className={`section experience-section reveal ${experienceVisible ? 'is-visible' : ''}`} ref={experienceRef}>
          <div className="section-label"><span>03</span><span>Things I&apos;ve done</span></div>
          <p className="section-intro">Every experience teaches me something new.<br /><em>Here are a few chapters so far.</em></p>
          <div className="experience-list">{experiences.map((experience, index) => {
            const isActive = activeExperience === index
            return <article className={`experience-item ${experience.color} ${isActive ? 'is-active' : ''}`} key={experience.role}><button className="experience-toggle" onClick={() => setActiveExperience(isActive ? null : index)} aria-expanded={isActive}><span className="experience-number">{experience.number}</span><span className="experience-title"><small>{experience.dates}</small><strong>{experience.role}</strong><i>{experience.company}</i></span><span className="plus">{isActive ? '−' : '+'}</span></button><div className="experience-details"><ul>{experience.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></div></article>
          })}</div>
        </section>

        <section id="contact" className="contact-section"><div className="contact-sparkle">✦</div><p className="eyebrow">Have a role in mind?</p><h2>Let&apos;s make<br /><mark className="highlight-yellow">something good.</mark></h2><a className="contact-link" href="mailto:labilabikim13@gmail.com">labilabikim13@gmail.com <Arrow /></a><div className="contact-meta"><span>Taguig City, Philippines</span><a href="tel:+639354514084">+63 935 451 4084</a></div><div className="social-links"><span>Find me online</span><a href="https://www.instagram.com/maria.kmbrlyy/" target="_blank" rel="noreferrer">Instagram <Arrow /></a><a href="https://www.facebook.com/maria.kmbrlyyy" target="_blank" rel="noreferrer">Facebook <Arrow /></a><a href="https://wa.me/639354514084" target="_blank" rel="noreferrer">WhatsApp <Arrow /></a></div></section>
      </main>
      <footer><span>© {currentYear} Maria Kimberly Labi-Labi</span><span>Made with curiosity <span className="accent">♥</span></span></footer>
    </div>
  )
}

export default AboutPage
