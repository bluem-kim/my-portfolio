import { useEffect, useRef, useState } from 'react'

const technicalSkills = ['Data Entry', 'Data Management', 'Microsoft Office', 'Google Workspace', 'HTML/CSS', 'JavaScript']
const softSkills = ['Attention to Detail', 'Organization', 'Communication', 'Time Management', 'Problem-Solving', 'Adaptability']
const skillSamples = [
  ['Dataset annotation', 'annotation', '/skill-samples/annotation.png'],
  ['Product inventory', 'orders', '/skill-samples/inventory.png'],
  ['Order management', 'orders', '/skill-samples/orders.png'],
  ['File management', 'files', '/skill-samples/files.png'],
  ['Calendar planning', 'calendar', '/skill-samples/calendar.png'],
  ['Email organization', 'email', '/skill-samples/email.png'],
  ['Workflow mapping', 'workflow', '/skill-samples/workflow.png'],
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

function SkillsPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [skillsRef, skillsVisible] = useReveal()

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="MK portfolio home">mk<span>.</span></a>
        <span className="header-note">My Skills / {currentYear}</span>
        <button className={`menu-button ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation"><span /><span /></button>
        <nav className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <a href="/about" onClick={() => setMenuOpen(false)}>About Me <Arrow /></a>
          <a href="/skills" onClick={() => setMenuOpen(false)}>My Skills <Arrow /></a>
          <a href="/studio" onClick={() => setMenuOpen(false)}>Skill Studio <Arrow /></a>
        </nav>
      </header>

      <main>
        <section className={`section details-section reveal ${skillsVisible ? 'is-visible' : ''}`} ref={skillsRef}>
          <div className="section-label"><span>01</span><span>What I bring</span></div>
          <div className="about-content">
            <h1>Skills I&apos;ve<br /><em>built with care.</em></h1>
            <div className="about-copy"><p>My skills come from classroom learning, hands-on practice, and teaching myself new tools whenever a task gives me a chance to grow.</p><p>I enjoy learning independently, staying organized, and turning new knowledge into practical work.</p></div>
          </div>
          <div className="details-grid skills-page-grid">
            <div className="education-block education-finish-line"><h2>Education</h2><div className="finish-line-copy"><div className="finish-line-top"><span className="finish-kicker">Final lap</span><span className="finish-flag">FINISH</span></div><strong>Almost there.</strong><p className="large-detail">Bachelor of Science in Information Technology</p><p>Technological University of the Philippines<br />Taguig Campus</p><p className="muted">4th year · August 2023 — Present</p><small>I&apos;m looking for a part-time opportunity to help fund myself and reach graduation.</small></div><div className="finish-track"><i /><span>Graduation ahead</span></div></div>
            <div className="skills-showcase">
              <h2>Skills</h2>
            <div className="skill-group skill-group-technical"><div className="skill-group-heading"><span>01</span><strong>Technical skills</strong></div><div className="skill-list">{technicalSkills.map((skill) => <span key={skill}>{skill}</span>)}</div></div>
              <div className="skill-group skill-group-soft"><div className="skill-group-heading"><span>02</span><strong>Soft skills</strong></div><div className="skill-list">{softSkills.map((skill) => <span key={skill}>{skill}</span>)}</div></div>
            </div>
            <div className="language-card"><h2>Languages</h2><p className="language-intro">I make room for different voices.</p><div className="language-meter"><div><strong>Filipino</strong><span>Native</span></div><i><b style={{ width: '100%' }} /></i></div><div className="language-meter"><div><strong>English</strong><span>Proficient</span></div><i><b style={{ width: '82%' }} /></i></div><p className="language-note">Clear, thoughtful communication in both everyday and work settings.</p></div>
          </div>
          <section className="skill-samples-section">
            <div className="section-label"><span>02</span><span>Skills in action</span></div>
            <div className="skill-samples-heading"><h2>Here are samples<br /><em>of my skills.</em></h2><p>Click the image to open the matching practice station in Skill Studio.</p></div>
            <div className="skill-samples-grid">{skillSamples.map(([title, station, image]) => <a className="skill-sample-card" href={`/studio?station=${station}`} key={image}><img src={image} alt={`${title} Skill Studio sample`} /><span><strong>{title}</strong><Arrow /></span></a>)}</div>
          </section>
        </section>
      </main>
      <footer><span>© {currentYear} Maria Kimberly Labi-Labi</span><span>Made with curiosity <span className="accent">♥</span></span></footer>
    </div>
  )
}

export default SkillsPage
