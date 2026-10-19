import { useEffect, useMemo, useRef, useState } from 'react'

const stations = [
  ['typing', 'Typing sprint', 'Beat 63 WPM'],
  ['email', 'Email desk', 'Triage an inbox'],
  ['calendar', 'Calendar', 'Plan the day'],
  ['design', 'Poster studio', 'Create a visual'],
  ['workflow', 'Workflow builder', 'Map the process'],
  ['files', 'File manager', 'Organize folders'],
  ['orders', 'Shop Desk', 'Run a small shop'],
  ['annotation', 'Annotation desk', 'Label notebook images'],
]

const typingText = 'Great assistants make busy days feel effortless by turning clear communication, thoughtful planning, and careful follow-through into work people can trust. Stay focused, keep a steady rhythm, and let every accurate keystroke move the task forward.'
const TYPING_WPM = 63
const TYPING_CHAR_INTERVAL = 60000 / (TYPING_WPM * 5)
const previewMistakes = new Set([18, 43, 68, 93, 118, 143, 168, 193, 218])

function previewCharacter(character, index) {
  if (!previewMistakes.has(index) || character === ' ') return character
  return character.toLowerCase() === 'a' ? 'e' : 'a'
}
const initialEmails = [
  { id: 1, mailbox: 'inbox', from: 'Ana Santos', subject: 'Updated project brief', preview: 'The latest brief is ready for your review.', labels: ['Work'], unread: true },
  { id: 2, mailbox: 'inbox', from: 'Marco Reyes', subject: 'Team check-in tomorrow', preview: 'Can we confirm the agenda for our check-in?', labels: ['Work'], unread: true },
  { id: 3, mailbox: 'inbox', from: 'Shopify', subject: 'Weekly store summary', preview: 'Your store had 18 new orders this week.', labels: ['Updates'], unread: true },
  { id: 4, mailbox: 'inbox', from: 'Lia Cruz', subject: 'Portfolio feedback', preview: 'I left a few notes on your latest portfolio draft.', labels: ['Follow-up'], unread: true },
  { id: 5, mailbox: 'inbox', from: 'Google Calendar', subject: 'Reminder: interview tomorrow', preview: 'Your event starts tomorrow at 10:00 AM.', labels: ['Personal'], unread: false },
  { id: 6, mailbox: 'inbox', from: 'Jessa Lim', subject: 'Re: Event supplies', preview: 'The supplies have been ordered and are on the way.', labels: ['Work'], unread: true },
  { id: 7, mailbox: 'inbox', from: 'Notion', subject: 'You have a weekly digest', preview: 'Here are the pages and updates you may have missed.', labels: ['Updates'], unread: false },
  { id: 8, mailbox: 'inbox', from: 'Paolo Garcia', subject: 'Quick question about the schedule', preview: 'Would Thursday afternoon work for you?', labels: ['Follow-up'], unread: true },
  { id: 9, mailbox: 'inbox', from: 'LinkedIn', subject: 'You appeared in 12 searches', preview: 'See who is discovering your profile this week.', labels: ['Updates'], unread: false },
  { id: 10, mailbox: 'inbox', from: 'Mia Tan', subject: 'Welcome to the project', preview: 'Excited to have you helping with our next launch.', labels: ['Work'], unread: true },
  { id: 11, mailbox: 'sent', from: 'Me → Carlo', subject: 'Meeting notes and next steps', preview: 'Sharing the notes and action items from today.', content: 'Hi Carlo,\n\nSharing the notes and action items from today. I will take care of the follow-up tasks before our next check-in.\n\nBest,\nMaria', labels: ['Work'], unread: false },
  { id: 12, mailbox: 'sent', from: 'Me → Ana', subject: 'Re: Updated project brief', preview: 'Thanks, I will review the brief tonight.', labels: ['Follow-up'], unread: false },
  { id: 13, mailbox: 'sent', from: 'Me → School office', subject: 'Question about requirements', preview: 'Could you please confirm the submission deadline?', labels: ['Personal'], unread: false },
  { id: 14, mailbox: 'drafts', from: 'Draft', subject: 'Ideas for the next presentation', preview: 'Add examples and a short checklist before sending.', labels: ['Work'], unread: false },
  { id: 15, mailbox: 'drafts', from: 'Draft', subject: 'Thank-you message', preview: 'Write a thoughtful follow-up after the interview.', labels: ['Personal'], unread: false },
  { id: 16, mailbox: 'archive', from: 'Old newsletter', subject: 'January productivity tips', preview: 'A saved newsletter you can revisit later.', labels: ['Updates'], unread: false },
  { id: 17, mailbox: 'archive', from: 'Diana Flores', subject: 'Completed event details', preview: 'Keeping this conversation for future reference.', labels: ['Work'], unread: false },
  { id: 18, mailbox: 'archive', from: 'Online course', subject: 'Your certificate is ready', preview: 'Your completed course certificate is available.', labels: ['Personal'], unread: false },
  { id: 19, mailbox: 'archive', from: 'Recruitment team', subject: 'Application received', preview: 'We received your application and will be in touch.', labels: ['Follow-up'], unread: false },
  { id: 20, mailbox: 'archive', from: 'Receipts', subject: 'Your monthly receipt', preview: 'Your receipt has been saved for your records.', labels: ['Updates'], unread: false },
  { id: 21, mailbox: 'scheduled', from: 'Me → Future team', subject: 'Tomorrow’s priorities', preview: 'A scheduled message waiting to be sent tomorrow.', content: 'Hello team,\n\nHere are our priorities for tomorrow. See you then!', labels: ['Work'], unread: false, scheduledAt: '2099-01-01T09:00' },
]
const initialFiles = [
  { id: 1, name: 'Resume.pdf', folder: 'Documents', type: 'PDF' },
  { id: 2, name: 'Brand moodboard.png', folder: 'Design', type: 'IMG' },
  { id: 3, name: 'Interview notes.docx', folder: 'Documents', type: 'DOC' },
  { id: 4, name: 'Profile photo.jpg', folder: 'Images', type: 'IMG' },
  { id: 5, name: 'Project proposal.pdf', folder: 'Documents', type: 'PDF' },
  { id: 6, name: 'Portfolio wireframe.png', folder: 'Design', type: 'IMG' },
  { id: 7, name: 'Color palette.txt', folder: 'Design', type: 'TXT' },
  { id: 8, name: 'Contact list.docx', folder: 'Documents', type: 'DOC' },
  { id: 9, name: 'Travel references.jpg', folder: 'Images', type: 'IMG' },
  { id: 10, name: 'Old resume.pdf', folder: 'Archives', type: 'PDF' },
  { id: 11, name: 'Application checklist.docx', folder: 'Documents/Applications', type: 'DOC' },
  { id: 12, name: 'Cover letter.pdf', folder: 'Documents/Applications', type: 'PDF' },
  { id: 13, name: 'Logo explorations.png', folder: 'Design/Brand assets', type: 'IMG' },
  { id: 14, name: 'Brand colors.txt', folder: 'Design/Brand assets', type: 'TXT' },
]
const currentYear = new Date().getFullYear()

function Arrow() {
  return <span aria-hidden="true" className="arrow">↗</span>
}

function StudioHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  return <header className="site-header"><a className="wordmark" href="/" onClick={closeMenu} aria-label="MK portfolio home">mk<span>.</span></a><span className="header-note">Skill Studio / {currentYear}</span><button className={`menu-button ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation"><span /><span /></button><nav className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation"><a href="/about" onClick={closeMenu}>About Me <Arrow /></a><a href="/skills" onClick={closeMenu}>My Skills <Arrow /></a><a href="/studio" onClick={closeMenu}>Skill Studio <Arrow /></a></nav></header>
}

const stationReports = {
  typing: {
    title: 'Typing sprint',
    explanation: 'A timed typing exercise that demonstrates speed, accuracy, focus, and careful proofreading.',
    likes: 'Emkim likes how a steady rhythm keeps communication accurate, even on busy days.',
  },
  email: {
    title: 'Email desk',
    explanation: 'A Gmail-style workspace for sorting messages, applying labels, reading carefully, and keeping follow-ups organized.',
    likes: 'Emkim likes how a clean inbox makes priorities easier to see and action.',
  },
  calendar: {
    title: 'Calendar',
    explanation: 'A Google Calendar-style planner for creating events, managing time, and protecting focused work.',
    likes: 'Emkim likes how a thoughtful schedule gives every important task a place.',
  },
  design: {
    title: 'Poster studio',
    explanation: 'A visual editor that demonstrates creative thinking, layout choices, attention to detail, and confident experimentation.',
    likes: 'Emkim likes how small design decisions can make information feel more inviting.',
  },
  workflow: {
    title: 'Workflow builder',
    explanation: 'A draw.io or Roboflow-style flowchart tool for breaking work into clear steps, connecting decisions, and following a process from start to finish.',
    likes: 'Emkim likes how a visible process turns a complicated task into manageable next steps.',
  },
  files: {
    title: 'File manager',
    explanation: 'A Google Drive, Dropbox, or OneDrive-style file organization exercise for creating folders, searching, renaming, moving, and maintaining tidy digital records.',
    likes: 'Emkim likes how a well-organized workspace saves time before the real work even begins.',
  },
  annotation: {
    title: 'Annotation desk',
    explanation: 'A dataset annotation workspace for reviewing notebook photos, drawing bounding boxes, and assigning a consistent notebook class.',
    likes: 'Emkim likes how careful labels make an image dataset useful for training and visual search.',
  },
  orders: {
    title: 'Shop desk',
    explanation: 'A small-shop simulation for managing products, inventory, customer orders, statuses, and stock decisions.',
    likes: 'Emkim likes how accurate details help both the customer experience and the business run smoothly.',
  },
}

function StationReport({ active }) {
  const report = stationReports[active]
  const downloadReport = () => {
    const text = `EMKIM'S SKILL STUDIO\n${report.title.toUpperCase()}\n\nWhat this demonstrates\n${report.explanation}\n\nEmkim likes how\n${report.likes}\n\nThis interactive sample is part of Maria Kimberly Labi-Labi's portfolio.\nGenerated ${new Date().toLocaleDateString()}\n`
    const link = document.createElement('a')
    link.download = `${active}-skill-studio-report.txt`
    link.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }))
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return <aside className="station-report">
    <div><span className="eyebrow">Take a result with you</span><h3>{report.title} report</h3><p>{report.explanation}</p><p><strong>Emkim likes how:</strong> {report.likes}</p></div>
    <div className="station-report-actions"><button className="studio-button" onClick={downloadReport}>Download report</button><button className="text-button" onClick={() => window.print()}>Print / save as PDF</button></div>
  </aside>
}

function TypingStation() {
  const [started, setStarted] = useState(false)
  const [value, setValue] = useState('')
  const [seconds, setSeconds] = useState(30)
  const [startedAt, setStartedAt] = useState(null)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [previewCharCount, setPreviewCharCount] = useState(0)
  const finished = started && seconds === 0
  const previewTypedCharacters = typingText.slice(0, previewCharCount)
  const previewErrorCount = [...previewMistakes].filter((index) => index < previewCharCount).length
  const previewAccuracy = previewCharCount ? Math.round(((previewCharCount - previewErrorCount) / previewCharCount) * 100) : 100
  const previewElapsedMs = previewCharCount * TYPING_CHAR_INTERVAL
  const previewSeconds = Math.max(0, 30 - Math.floor(previewElapsedMs / 1000))
  const previewWpm = previewCharCount ? Math.round((previewCharCount / 5) * (60000 / previewElapsedMs)) : 0
  useEffect(() => {
    const timer = setInterval(() => {
      setPreviewCharCount((current) => current >= typingText.length ? 0 : current + 1)
    }, TYPING_CHAR_INTERVAL)
    return () => clearInterval(timer)
  }, [])
  useEffect(() => {
    if (!started || finished || seconds === 0 || value.length >= typingText.length) return undefined
    const timer = setInterval(() => {
      const elapsed = Date.now() - startedAt
      setElapsedMs(elapsed)
      setSeconds(Math.max(0, 30 - Math.floor(elapsed / 1000)))
    }, 100)
    return () => clearInterval(timer)
  }, [started, finished, seconds, value, startedAt])
  const elapsed = Math.min(30000, elapsedMs)
  const correctChars = value.split('').filter((character, index) => character === typingText[index]).length
  const errorCount = value.split('').filter((character, index) => character !== typingText[index]).length
  const wpm = Math.round((correctChars / 5) * (60000 / Math.max(1000, elapsed)))
  const accuracy = value.length ? Math.round((correctChars / value.length) * 100) : 100
  const complete = value.length >= typingText.length
  const testFinished = finished || complete
  const handleTyping = (event) => {
    const nextValue = event.target.value.slice(0, typingText.length)
    if (!started && nextValue) {
      setStarted(true)
      setStartedAt(Date.now())
    } else if (startedAt) {
      setElapsedMs(Math.min(30000, Date.now() - startedAt))
    }
    setValue(nextValue)
  }
  const reset = () => { setStarted(false); setValue(''); setSeconds(30); setStartedAt(null); setElapsedMs(0) }
  return <div className="station-panel typing-panel">
    <div className="typing-intro"><strong>Emkim&apos;s benchmark is {TYPING_WPM} WPM. Can you beat it?</strong><span>Type the passage as quickly and accurately as you can.</span></div>
    <div className="station-stats"><span>Target <strong>{TYPING_WPM} WPM</strong></span><span>Time <strong>00:{String(seconds).padStart(2, '0')}</strong></span><span>WPM <strong>{wpm || 0}</strong></span><span>Accuracy <strong>{accuracy}%</strong></span><span>Errors <strong>{errorCount}</strong></span></div>
    <div className="typing-prompt" aria-label="Typing passage">{typingText.split('').map((character, index) => <span className={index < value.length ? character === value[index] ? 'correct' : 'incorrect' : index === value.length && !testFinished ? 'current' : ''} key={`${character}-${index}`}>{character}</span>)}</div>
    <textarea autoFocus={started && !testFinished} disabled={testFinished} value={value} onChange={handleTyping} placeholder="Start typing to begin..." aria-label="Typing challenge" />
    <div className="typing-target"><span>Here&apos;s how fast Emkim types · {TYPING_WPM} WPM</span><div className="typing-preview-stats"><span>Time<strong>00:{String(previewSeconds).padStart(2, '0')}</strong></span><span>WPM<strong>{previewWpm}</strong></span><span>Accuracy<strong>{previewAccuracy}%</strong></span><span>Errors<strong>{previewErrorCount}</strong></span></div><div className="typing-target-track" aria-label={`Typing animation at Emkim's ${TYPING_WPM} words per minute pace`}><i>{[...previewTypedCharacters].map((character, index) => <span className={previewMistakes.has(index) ? 'preview-error' : ''} key={`${index}-${character}`}>{previewCharacter(character, index)}</span>)}<b aria-hidden="true" /></i></div></div>
    <div className="station-actions"><button className="studio-button" onClick={reset}>Restart test</button>{testFinished && <strong className={wpm >= 63 && accuracy >= 90 ? 'success-text' : 'muted-text'}>{wpm >= 63 && accuracy >= 90 ? "You beat Emkim's score!" : 'Keep practicing — try again!'}</strong>}</div>
  </div>
}

function EmailStation() {
  const [emails, setEmails] = useState(initialEmails)
  const [mailbox, setMailbox] = useState('inbox')
  const [selectedLabel, setSelectedLabel] = useState(null)
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [composeOpen, setComposeOpen] = useState(false)
  const [compose, setCompose] = useState({ to: '', subject: '', content: '', scheduledAt: '' })
  const [labels, setLabels] = useState(['Work', 'Personal', 'Follow-up', 'Updates'])
  const [newLabel, setNewLabel] = useState('')
  const visibleEmails = emails.filter((email) => {
    if (selectedLabel) return email.labels.includes(selectedLabel) && email.mailbox !== 'archive'
    if (mailbox === 'inbox') return email.mailbox !== 'archive'
    return email.mailbox === mailbox
  })
  const unreadCount = emails.filter((email) => email.mailbox !== 'archive' && email.unread).length
  const updateEmail = (id, changes) => setEmails((items) => items.map((email) => email.id === id ? { ...email, ...changes } : email))
  const promoteScheduled = () => setEmails((items) => items.map((email) => email.mailbox === 'scheduled' && email.scheduledAt && new Date(email.scheduledAt).getTime() <= Date.now() ? { ...email, mailbox: 'sent', sentAt: email.scheduledAt } : email))
  const archiveEmail = (id) => updateEmail(id, { mailbox: 'archive', unread: false })
  const toggleRead = (id) => setEmails((items) => items.map((email) => email.id === id ? { ...email, unread: !email.unread } : email))
  const openEmail = (email) => {
    setSelectedEmail(email.id)
    updateEmail(email.id, { unread: false })
  }
  const sendCompose = (event, saveDraft = false) => {
    event.preventDefault()
    if (!compose.to.trim() && !saveDraft) return
    const sendDate = compose.scheduledAt ? new Date(compose.scheduledAt) : new Date()
    const isScheduled = !saveDraft && sendDate.getTime() > Date.now()
    const id = Math.max(...emails.map((email) => email.id)) + 1
    const message = {
      id,
      mailbox: saveDraft ? 'drafts' : isScheduled ? 'scheduled' : 'sent',
      from: saveDraft ? 'Draft' : `Me → ${compose.to}`,
      subject: compose.subject || '(no subject)',
      preview: compose.content || 'No message content yet.',
      content: compose.content || 'No message content yet.',
      labels: [],
      unread: false,
      ...(isScheduled ? { scheduledAt: compose.scheduledAt } : {}),
    }
    setEmails((items) => [...items, message])
    setCompose({ to: '', subject: '', content: '', scheduledAt: '' })
    setComposeOpen(false)
  }
  const addLabel = (event) => {
    event.preventDefault()
    const value = newLabel.trim()
    if (value && !labels.includes(value)) setLabels((items) => [...items, value])
    setNewLabel('')
  }
  const deleteLabel = (label) => {
    setLabels((items) => items.filter((item) => item !== label))
    setEmails((items) => items.map((email) => ({ ...email, labels: email.labels.filter((item) => item !== label) })))
    if (selectedLabel === label) setSelectedLabel(null)
  }
  const assignLabel = (id, label) => setEmails((items) => items.map((email) => email.id === id ? { ...email, labels: label ? [...new Set([...email.labels, label])] : email.labels } : email))
  const activeEmail = emails.find((email) => email.id === selectedEmail)
  const displayContent = (email) => email.content || `${email.preview}\n\nThis is a practice message in the Skill Studio Gmail simulation.`
  return <div className="email-station">
    <div className="email-intro"><strong>Try email management like how Emkim does it.</strong><span>Emkim organizes messages, prioritizes follow-ups, keeps drafts moving, and maintains a clean inbox.</span><small>Software / tool: <b>Gmail</b></small></div>
    <div className="email-app">
      <aside className="email-sidebar"><button className="email-compose" onClick={() => setComposeOpen(true)}>＋ Compose</button><nav aria-label="Mailboxes">{[['inbox', 'Inbox'], ['sent', 'Sent'], ['scheduled', 'Scheduled'], ['drafts', 'Drafts'], ['archive', 'Archive']].map(([id, name]) => <button className={!selectedLabel && mailbox === id ? 'active' : ''} onClick={() => { promoteScheduled(); setMailbox(id); setSelectedLabel(null); setSelectedEmail(null) }} key={id}>▱ {name}{id === 'inbox' && <b>{unreadCount}</b>}</button>)}</nav><div className="email-label-head"><span>Labels</span><button onClick={() => document.getElementById('new-email-label')?.focus()} aria-label="Add label">＋</button></div><div className="email-labels">{labels.map((label) => <button className={selectedLabel === label ? 'active' : ''} onClick={() => { setSelectedLabel(label); setSelectedEmail(null) }} key={label}>● {label}<span onClick={(event) => { event.stopPropagation(); deleteLabel(label) }}>×</span></button>)}</div><form className="email-new-label" onSubmit={addLabel}><input id="new-email-label" value={newLabel} onChange={(event) => setNewLabel(event.target.value)} placeholder="New label" /><button aria-label="Save label">+</button></form></aside>
      <section className="email-main"><div className="email-main-head"><div><span className="eyebrow">Gmail practice desk</span><h3>{selectedLabel || `${mailbox[0].toUpperCase()}${mailbox.slice(1)}`}</h3></div><span>{visibleEmails.length} messages</span></div><div className="email-toolbar"><button onClick={() => setEmails((items) => items.map((email) => visibleEmails.some((item) => item.id === email.id) ? { ...email, unread: false } : email))}>Mark read</button><button onClick={() => visibleEmails.forEach((email) => archiveEmail(email.id))}>Archive view</button></div>{activeEmail ? <article className="email-detail"><button className="text-button" onClick={() => setSelectedEmail(null)}>← Back to messages</button><div className="email-detail-head"><div><strong>{activeEmail.from}</strong><h4>{activeEmail.subject}</h4><span>{activeEmail.scheduledAt ? `Scheduled for ${new Date(activeEmail.scheduledAt).toLocaleString()}` : 'Message details'}</span></div><button className="email-archive" onClick={() => { archiveEmail(activeEmail.id); setSelectedEmail(null) }}>Archive</button></div><p>{displayContent(activeEmail)}</p></article> : <div className="email-list">{visibleEmails.map((email) => <article className={`email-row ${email.unread ? 'is-unread' : ''}`} key={email.id} onClick={() => openEmail(email)}><button className="email-check" onClick={(event) => { event.stopPropagation(); toggleRead(email.id) }} aria-label={`Mark ${email.subject} ${email.unread ? 'read' : 'unread'}`}>{email.unread ? '' : '✓'}</button><div className="email-copy"><strong>{email.from}</strong><h4>{email.subject}</h4><p>{email.preview}</p><div className="email-row-labels">{email.labels.map((label) => <span key={label}>{label}</span>)}</div></div>      <select value={email.labels[0] || ''} onClick={(event) => event.stopPropagation()} onChange={(event) => assignLabel(email.id, event.target.value)} aria-label={`Label ${email.subject}`}><option value="">＋ Label</option>{labels.map((label) => <option value={label} key={label}>{label}</option>)}</select><button className="email-archive" onClick={(event) => { event.stopPropagation(); archiveEmail(email.id) }} aria-label={`Archive ${email.subject}`}>⌑</button></article>)}</div>}</section>
    </div>
    {composeOpen && <div className="compose-backdrop"><form className="compose-window" onSubmit={(event) => sendCompose(event)}><div className="compose-head"><strong>New message</strong><button type="button" onClick={() => setComposeOpen(false)} aria-label="Close compose">×</button></div><label>To<input required value={compose.to} onChange={(event) => setCompose((current) => ({ ...current, to: event.target.value }))} placeholder="name@example.com" /></label><label>Subject<input value={compose.subject} onChange={(event) => setCompose((current) => ({ ...current, subject: event.target.value }))} placeholder="Subject" /></label><label>Message<textarea value={compose.content} onChange={(event) => setCompose((current) => ({ ...current, content: event.target.value }))} placeholder="Write your email..." /></label><label>Send date and time<input type="datetime-local" value={compose.scheduledAt} onChange={(event) => setCompose((current) => ({ ...current, scheduledAt: event.target.value }))} /></label><div className="compose-actions"><button type="button" className="text-button" onClick={(event) => sendCompose(event, true)}>Save draft</button><button className="studio-button">Send / schedule</button></div></form></div>}
  </div>
}

function CalendarStation() {
  const [today] = useState(() => new Date())
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [events, setEvents] = useState([
    { id: 1, date: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-05`, time: '09:00', title: 'Daily planning', color: 'lime', notes: 'Set priorities and plan the day.' },
    { id: 2, date: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-12`, time: '11:30', title: 'Portfolio review', color: 'blue', notes: 'Review progress and make improvements.' },
    { id: 3, date: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-20`, time: '14:00', title: 'Focus block', color: 'coral', notes: 'Protected time for deep work.' },
  ])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventForm, setEventForm] = useState({ date: '', time: '09:00', title: '', notes: '', color: 'lime' })
  const [formOpen, setFormOpen] = useState(false)
  const monthStart = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1)
  const firstDay = monthStart.getDay()
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate()
  const cells = Array.from({ length: Math.ceil((firstDay + daysInMonth) / 7) * 7 }, (_, index) => {
    const day = index - firstDay + 1
    return day > 0 && day <= daysInMonth ? day : null
  })
  const dateKey = (day) => `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const openNewEvent = (day = 1) => {
    setSelectedEvent(null)
    setEventForm({ date: dateKey(day), time: '09:00', title: '', notes: '', color: 'lime' })
    setFormOpen(true)
  }
  const saveEvent = (event) => {
    event.preventDefault()
    if (!eventForm.title.trim()) return
    setEvents((items) => eventForm.id ? items.map((item) => item.id === eventForm.id ? { ...eventForm, title: eventForm.title.trim() } : item) : [...items, { ...eventForm, id: Date.now(), title: eventForm.title.trim() }])
    setFormOpen(false)
  }
  const removeEvent = (id) => {
    setEvents((items) => items.filter((item) => item.id !== id))
    setSelectedEvent(null)
  }
  const monthName = viewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  return <div className="calendar-station">
    <div className="calendar-intro"><strong>Try calendar management like how Emkim does it.</strong><span>Emkim plans schedules, protects focus time, and keeps meetings and deadlines organized.</span><small>Software / tool: <b>Google Calendar</b></small></div>
    <div className="station-panel calendar-panel">
    <div className="calendar-top"><div><span className="eyebrow">Google Calendar practice</span><h3>{monthName}</h3></div><div className="calendar-actions"><button className="text-button" onClick={() => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))}>Today</button><button className="calendar-nav" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} aria-label="Previous month">‹</button><button className="calendar-nav" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} aria-label="Next month">›</button><button className="studio-button" onClick={() => openNewEvent(1)}>+ Create</button></div></div>
    <div className="calendar-weekdays">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day}</span>)}</div>
    <div className="calendar-grid">{cells.map((day, index) => { const key = day ? dateKey(day) : `empty-${index}`; const dayEvents = day ? events.filter((item) => item.date === key) : []; return <button className={`calendar-day ${day ? '' : 'is-empty'} ${day && key === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}` ? 'is-today' : ''}`} onClick={() => day && openNewEvent(day)} disabled={!day} key={key}><time>{day || ''}</time>{dayEvents.map((item) => <span className={`calendar-chip ${item.color}`} onClick={(event) => { event.stopPropagation(); setSelectedEvent(item) }} key={item.id}>{item.time} {item.title}</span>)}</button> })}</div>
    {selectedEvent && <div className="calendar-detail"><div><span className="eyebrow">{selectedEvent.date} · {selectedEvent.time}</span><h4>{selectedEvent.title}</h4><p>{selectedEvent.notes || 'No notes added.'}</p></div><div><button className="text-button" onClick={() => { setEventForm(selectedEvent); setSelectedEvent(null); setFormOpen(true) }}>Edit</button><button className="text-button" onClick={() => removeEvent(selectedEvent.id)}>Delete</button></div></div>}
    {formOpen && <div className="calendar-form-wrap"><form className="calendar-form" onSubmit={saveEvent}><div className="compose-head"><strong>{eventForm.id ? 'Edit event' : 'Create event'}</strong><button type="button" onClick={() => setFormOpen(false)}>×</button></div><label>Event title<input autoFocus required value={eventForm.title} onChange={(event) => setEventForm((current) => ({ ...current, title: event.target.value }))} placeholder="Add a title" /></label><div className="calendar-form-row"><label>Date<input type="date" value={eventForm.date} onChange={(event) => setEventForm((current) => ({ ...current, date: event.target.value }))} /></label><label>Time<input type="time" value={eventForm.time} onChange={(event) => setEventForm((current) => ({ ...current, time: event.target.value }))} /></label></div><label>Notes<textarea value={eventForm.notes} onChange={(event) => setEventForm((current) => ({ ...current, notes: event.target.value }))} placeholder="Add notes or details" /></label><label>Color<select value={eventForm.color} onChange={(event) => setEventForm((current) => ({ ...current, color: event.target.value }))}><option value="lime">Lime</option><option value="blue">Blue</option><option value="coral">Coral</option><option value="yellow">Yellow</option></select></label><button className="studio-button">Save event</button></form></div>}
    </div>
  </div>
}

const workflowTemplates = {
  morning: [
    { id: 1, type: 'start', label: 'Start the day', x: 13, y: 50 },
    { id: 2, type: 'task', label: 'Review priorities', x: 36, y: 50 },
    { id: 3, type: 'decision', label: 'Is it urgent?', condition: 'Does this need attention today?', x: 59, y: 50 },
    { id: 4, type: 'task', label: 'Plan the next step', x: 82, y: 32 },
    { id: 5, type: 'end', label: 'Ready to work', x: 82, y: 68 },
  ],
  email: [
    { id: 1, type: 'start', label: 'New message', x: 13, y: 50 },
    { id: 2, type: 'task', label: 'Read and understand', x: 38, y: 50 },
    { id: 3, type: 'decision', label: 'Needs a reply?', condition: 'Will someone need an answer?', x: 63, y: 50 },
    { id: 4, type: 'task', label: 'Write a clear reply', x: 84, y: 32 },
    { id: 5, type: 'end', label: 'Archive or follow up', x: 84, y: 68 },
  ],
  project: [
    { id: 1, type: 'start', label: 'New task', x: 13, y: 50 },
    { id: 2, type: 'task', label: 'Gather details', x: 37, y: 50 },
    { id: 3, type: 'task', label: 'Do the work', x: 61, y: 50 },
    { id: 4, type: 'end', label: 'Review and deliver', x: 85, y: 50 },
  ],
}

const workflowEdges = {
  morning: [
    { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4, branch: 'yes' }, { from: 3, to: 5, branch: 'no' },
  ],
  email: [
    { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4, branch: 'yes' }, { from: 3, to: 5, branch: 'no' },
  ],
  project: [{ from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }],
}

const workflowShapeLabels = {
  start: 'Start / end',
  task: 'Task',
  decision: 'Decision',
  end: 'Finish',
}

function WorkflowStation() {
  const [template, setTemplate] = useState('morning')
  const [nodes, setNodes] = useState(() => workflowTemplates.morning.map((node) => ({ ...node })))
  const [edges, setEdges] = useState(() => workflowEdges.morning.map((edge) => ({ ...edge })))
  const [selectedNode, setSelectedNode] = useState(null)
  const [running, setRunning] = useState(false)
  const [activeNode, setActiveNode] = useState(null)
  const [awaitingDecision, setAwaitingDecision] = useState(false)
  const [connectingFrom, setConnectingFrom] = useState(null)
  const [draggingNode, setDraggingNode] = useState(null)
  const [nextLabel, setNextLabel] = useState('')
  const [zoom, setZoom] = useState(1)
  const nextNodeId = useRef(100)

  const resetSimulation = () => {
    setRunning(false)
    setActiveNode(null)
    setAwaitingDecision(false)
  }

  useEffect(() => {
    if (!running || activeNode === null || awaitingDecision) return undefined
    const current = nodes.find((node) => node.id === activeNode)
    if (!current || current.type === 'end') return undefined
    const timer = setTimeout(() => {
      const nextEdge = edges.find((edge) => edge.from === activeNode && !edge.branch)
      if (current.type === 'decision') {
        setRunning(false)
        setAwaitingDecision(true)
      } else if (nextEdge) {
        setActiveNode(nextEdge.to)
        if (nodes.find((node) => node.id === nextEdge.to)?.type === 'end') setRunning(false)
      } else {
        setRunning(false)
      }
    }, 800)
    return () => clearTimeout(timer)
  }, [activeNode, awaitingDecision, edges, nodes, running])

  const loadTemplate = (event) => {
    const nextTemplate = event.target.value
    setTemplate(nextTemplate)
    setNodes(workflowTemplates[nextTemplate].map((node) => ({ ...node })))
    setEdges(workflowEdges[nextTemplate].map((edge) => ({ ...edge })))
    setSelectedNode(null)
    resetSimulation()
  }

  const addNode = (type) => {
    const id = nextNodeId.current++
    const label = type === 'decision' ? 'New decision' : type === 'task' ? 'New task' : type === 'start' ? 'Start' : 'Finish'
    setNodes((items) => [...items, { id, type, label, x: 50, y: Math.min(88, 25 + items.length * 12) }])
    if (nodes.length) setEdges((items) => [...items, { from: nodes[nodes.length - 1].id, to: id }])
    setSelectedNode(id)
    resetSimulation()
  }

  const updateNode = (id, changes) => {
    setNodes((items) => items.map((node) => node.id === id ? { ...node, ...changes } : node))
  }

  const updatePosition = (event, id) => {
    const canvas = event.currentTarget.closest('.flowchart-canvas').getBoundingClientRect()
    const x = Math.max(5, Math.min(95, ((event.clientX - canvas.left) / canvas.width) * 100))
    const y = Math.max(8, Math.min(92, ((event.clientY - canvas.top) / canvas.height) * 100))
    updateNode(id, { x, y })
  }

  const startDragging = (event, id) => {
    if (event.target.tagName === 'INPUT' || event.target.closest('.flow-handle')) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setDraggingNode(id)
  }

  const finishDragging = () => setDraggingNode(null)

  const startConnection = (event, id) => {
    event.stopPropagation()
    setConnectingFrom(id)
  }

  const finishConnection = (event, id) => {
    event.stopPropagation()
    if (connectingFrom !== null && connectingFrom !== id) {
      setEdges((items) => items.some((edge) => edge.from === connectingFrom && edge.to === id)
        ? items
        : [...items, { from: connectingFrom, to: id }])
      resetSimulation()
    }
    setConnectingFrom(null)
  }

  const deleteSelected = () => {
    if (selectedNode === null) return
    setNodes((items) => items.filter((node) => node.id !== selectedNode))
    setEdges((items) => items.filter((edge) => edge.from !== selectedNode && edge.to !== selectedNode))
    setSelectedNode(null)
    resetSimulation()
  }

  const addStep = (event) => {
    event.preventDefault()
    if (!nextLabel.trim()) return
    const id = nextNodeId.current++
    setNodes((items) => [...items, { id, type: 'task', label: nextLabel.trim(), x: 50, y: Math.min(88, 25 + items.length * 12) }])
    if (nodes.length) setEdges((items) => [...items, { from: nodes[nodes.length - 1].id, to: id }])
    setSelectedNode(id)
    resetSimulation()
    setNextLabel('')
  }

  const beginSimulation = () => {
    const start = nodes.find((node) => node.type === 'start') || nodes[0]
    if (start) {
      setActiveNode(start.id)
      setAwaitingDecision(false)
      setRunning(true)
    }
  }

  const chooseDecision = (answer) => {
    if (activeNode === null) return
    const nextEdge = edges.find((edge) => edge.from === activeNode && edge.branch === answer)
    setAwaitingDecision(false)
    if (nextEdge) {
      setActiveNode(nextEdge.to)
      setRunning(nodes.find((node) => node.id === nextEdge.to)?.type !== 'end')
    } else {
      setRunning(false)
    }
  }

  const stepSimulation = () => {
    setRunning(false)
    if (activeNode === null) return beginSimulation()
    const current = nodes.find((node) => node.id === activeNode)
    if (current?.type === 'decision') return setAwaitingDecision(true)
    const nextEdge = edges.find((edge) => edge.from === activeNode && !edge.branch)
    if (nextEdge) setActiveNode(nextEdge.to)
  }

  const selected = nodes.find((node) => node.id === selectedNode)
  const active = nodes.find((node) => node.id === activeNode)
  return <div className="workflow-station"><div className="tool-intro"><strong>Turn ideas into clear next steps.</strong><span>Map decisions and connect a process from start to finish.</span><small>Software / tool: <b>draw.io or Roboflow</b></small></div><div className="station-panel workflow-panel">
    <div className="flowchart-head">
      <div><strong>Build a thoughtful process.</strong><p>Map the steps, spot decisions, and practise keeping work moving.</p></div>
      <select value={template} onChange={loadTemplate} aria-label="Workflow template">
        <option value="morning">Daily planning template</option>
        <option value="email">Email triage template</option>
        <option value="project">Project handoff template</option>
      </select>
    </div>
    <div className="flowchart-actions">
      <button className="studio-button" onClick={beginSimulation} disabled={!nodes.length}>▶ Run flow</button>
      <button className="studio-button" onClick={stepSimulation} disabled={!nodes.length || active?.type === 'end'}>Next step</button>
      <button className="studio-button" onClick={() => setRunning(false)} disabled={!running}>Pause</button>
      <button className="studio-button" onClick={resetSimulation}>Reset</button>
    </div>
    <div className="flowchart-toolbar">
      <label>Zoom <input type="range" min="0.75" max="1.25" step="0.05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} /></label>
      <span>{Math.round(zoom * 100)}%</span>
      <button onClick={() => setZoom(1)} aria-label="Reset zoom">↺</button>
    </div>
    <div className="flowchart-tools">
      {Object.entries(workflowShapeLabels).map(([type, label]) => <button className="flow-shape-button" onClick={() => addNode(type)} key={type}>＋ {label}</button>)}
      <button className="flow-shape-button" onClick={deleteSelected} disabled={selectedNode === null}>Delete selected</button>
    </div>
    <div className="flowchart-canvas" aria-label="Workflow canvas">
      <div className="flowchart-zoom" style={{ transform: `scale(${zoom})` }}>
        <svg className="flowchart-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs><marker id="flow-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#073b42" /></marker></defs>
          {edges.map((edge) => {
            const from = nodes.find((node) => node.id === edge.from)
            const to = nodes.find((node) => node.id === edge.to)
            if (!from || !to) return null
            return <g key={`${edge.from}-${edge.to}-${edge.branch || 'next'}`}><line className="flow-edge" x1={from.x} y1={from.y} x2={to.x} y2={to.y} /><text className="flow-edge-label" x={(from.x + to.x) / 2} y={(from.y + to.y) / 2}>{edge.branch || ''}</text></g>
          })}
        </svg>
        {nodes.map((node) => <div
          className={`flow-node flow-node-${node.type} ${selectedNode === node.id ? 'is-connecting' : ''} ${activeNode === node.id ? 'is-sim-active' : ''}`}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          onPointerDown={(event) => startDragging(event, node.id)}
          onPointerMove={(event) => draggingNode === node.id && updatePosition(event, node.id)}
          onPointerUp={finishDragging}
          onClick={() => setSelectedNode(node.id)}
          role="group"
          key={node.id}
        >
          <span aria-hidden="true">{node.type === 'decision' ? '◇' : node.type === 'start' ? '→' : node.type === 'end' ? '✓' : '✦'}</span>
          <input value={node.type === 'decision' ? node.condition || node.label : node.label} onChange={(event) => updateNode(node.id, node.type === 'decision' ? { condition: event.target.value, label: event.target.value } : { label: event.target.value })} onClick={(event) => event.stopPropagation()} aria-label={`${node.type} condition`} />
          <button className="flow-handle flow-handle-left" onPointerDown={(event) => startConnection(event, node.id)} onPointerUp={(event) => finishConnection(event, node.id)} aria-label={`Connect to ${node.label}`} />
          <button className="flow-handle flow-handle-right" onPointerDown={(event) => startConnection(event, node.id)} onPointerUp={(event) => finishConnection(event, node.id)} aria-label={`Connect from ${node.label}`} />
        </div>)}
      </div>
    </div>
    <p className="flowchart-tip">Drag a step to move it. Drag from one handle to another to connect steps. Decisions ask their condition while the flow runs.</p>
    <form className="add-step" onSubmit={addStep}>
      <input value={nextLabel} onChange={(event) => setNextLabel(event.target.value)} placeholder="Add a custom task" aria-label="Custom task name" />
      <button className="studio-button">Add task</button>
    </form>
    {awaitingDecision && active && <div className="flow-decision-prompt"><span className="eyebrow">Decision point</span><strong>{active.condition || active.label}</strong><div><button className="studio-button" onClick={() => chooseDecision('yes')}>Yes</button><button className="studio-button" onClick={() => chooseDecision('no')}>No</button></div></div>}
    {selected && <div className="flow-inspector"><span className="eyebrow">Selected step</span><strong>{selected.label}</strong><small>{workflowShapeLabels[selected.type]} · Step {nodes.indexOf(selected) + 1} of {nodes.length}</small></div>}
  </div></div>
}

const posterThemes = {
  original: { accent: '#a3e635', secondary: '#0284c7', coral: '#f97316', teal: '#14b8a6' },
  pastel: { accent: '#fef08a', secondary: '#bae6fd', coral: '#fbcfe8', teal: '#99f6e4' },
  sunset: { accent: '#fb7185', secondary: '#f97316', coral: '#facc15', teal: '#8b5cf6' },
  earthy: { accent: '#65a30d', secondary: '#0d9488', coral: '#92400e', teal: '#f59e0b' },
}

function PosterSticker({ type }) {
  if (type === 'pencil') return <svg viewBox="0 0 120 50" aria-hidden="true"><path d="M5 17 84 4l27 18-27 18L5 27Z" fill="#fffaf0" stroke="#fffaf0" strokeWidth="8" strokeLinejoin="round" /><path d="M5 14 82 4v32L5 24Z" fill="#f4d45d" stroke="#073b42" strokeWidth="2" /><path d="m5 14 16-2v12L5 24Z" fill="#f27662" stroke="#073b42" strokeWidth="2" /><path d="m82 4 25 18-25 14Z" fill="#f7f0d9" stroke="#073b42" strokeWidth="2" /><path d="m98 16 9 6-9 6Z" fill="#073b42" /></svg>
  if (type === 'star') return <svg viewBox="0 0 100 100" aria-hidden="true"><path d="m50 5 13 27 30 6-21 22 4 30-26-14-26 14 4-30L7 38l30-6Z" fill="#fffaf0" stroke="#fffaf0" strokeWidth="9" strokeLinejoin="round" /><path d="m50 5 13 27 30 6-21 22 4 30-26-14-26 14 4-30L7 38l30-6Z" fill="var(--poster-secondary)" stroke="#073b42" strokeWidth="2" /><path d="m50 19 7 18 19 4-14 14 3 18-15-9-15 9 3-18-14-14 19-4Z" fill="none" stroke="#8ed8df" strokeWidth="2" /></svg>
  if (type === 'bulb') return <svg viewBox="0 0 100 130" aria-hidden="true"><path d="m25 75-8-12C2 38 21 8 50 8s48 30 33 55l-8 12H25Z" fill="#fffaf0" stroke="#fffaf0" strokeWidth="10" /><path d="m25 75-8-12C2 38 21 8 50 8s48 30 33 55l-8 12H25Z" fill="#f4d45d" stroke="#073b42" strokeWidth="3" /><path d="M34 75h32v16H34Z" fill="#aab9b8" stroke="#073b42" strokeWidth="3" /><path d="M39 91h22l-5 12H44Z" fill="#073b42" /><path d="m41 48 5-19 4 14 5-14 4 19" fill="none" stroke="#073b42" strokeWidth="3" strokeLinecap="round" /><path d="M20 20 10 10m70 10 10-10M50 8V0" stroke="#f27662" strokeWidth="4" strokeLinecap="round" /></svg>
  if (type === 'notebook') return <svg viewBox="0 0 150 180" aria-hidden="true"><rect x="12" y="8" width="126" height="160" rx="10" fill="#fffaf0" stroke="#fffaf0" strokeWidth="10" /><rect x="12" y="8" width="126" height="160" rx="10" fill="#fff" stroke="#073b42" strokeWidth="3" /><circle cx="35" cy="35" r="10" fill="#f4d45d" stroke="#073b42" strokeWidth="2" /><path d="m28 87 27-39 24 39Z" fill="#66c7c0" stroke="#073b42" strokeWidth="3" /><path d="m60 87 27-31 31 31Z" fill="#2d73c9" stroke="#073b42" strokeWidth="3" /><path d="M37 112h76M37 127h65M37 142h75" stroke="#073b42" strokeWidth="3" strokeLinecap="round" /><path d="M17 25h-8m8 25h-8m8 25h-8m8 25h-8m8 25h-8" stroke="#073b42" strokeWidth="3" /></svg>
  return <svg viewBox="0 0 100 130" aria-hidden="true"><path d="M50 75V28m0 47C35 57 17 57 14 39c18-4 30 4 36 25m0 11c15-18 33-18 36-36-18-4-30 4-36 25M50 75v40H24m26-40v40h26" fill="none" stroke="#fffaf0" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" /><path d="M50 75V28m0 47C35 57 17 57 14 39c18-4 30 4 36 25m0 11c15-18 33-18 36-36-18-4-30 4-36 25M50 75v40H24m26-40v40h26" fill="none" stroke="var(--poster-secondary)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /><path d="M20 113h60l-5 14H25Z" fill="#f27662" stroke="#073b42" strokeWidth="3" /></svg>
}

function DesignStation() {
  const [title, setTitle] = useState('My Skills')
  const [subtitle, setSubtitle] = useState('Design · Problem Solving · Creativity')
  const [font, setFont] = useState('serif')
  const [textColor, setTextColor] = useState('#073b42')
  const [theme, setTheme] = useState('original')
  const [skills, setSkills] = useState(['Design', 'Problem Solving', 'Creativity', 'Teamwork'])
  const [newSkill, setNewSkill] = useState('')
  const [visible, setVisible] = useState({ pencil: true, star: true, bulb: true, notebook: true, plant: true, tape: true })
  const [positions, setPositions] = useState({ pencil: { x: 9, y: 10 }, star: { x: 76, y: 16 }, bulb: { x: 8, y: 68 }, notebook: { x: 68, y: 70 }, plant: { x: 43, y: 77 } })
  const colors = posterThemes[theme]
  const updatePosition = (key, event) => {
    const canvas = event.currentTarget.parentElement.getBoundingClientRect()
    const x = Math.max(2, Math.min(88, ((event.clientX - canvas.left) / canvas.width) * 100 - 6))
    const y = Math.max(2, Math.min(88, ((event.clientY - canvas.top) / canvas.height) * 100 - 6))
    setPositions((current) => ({ ...current, [key]: { x, y } }))
  }
  const addSkill = (event) => {
    event.preventDefault()
    if (newSkill.trim()) {
      setSkills((current) => [...current, newSkill.trim()])
      setNewSkill('')
    }
  }
  const exportPoster = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="700" viewBox="0 0 500 700"><rect width="500" height="700" fill="${colors.accent}"/><circle cx="250" cy="390" r="260" fill="#f9f6ee"/><text x="250" y="330" text-anchor="middle" font-family="Georgia" font-size="54" font-weight="bold" fill="${textColor}">${title.replace(/[<&>"]/g, '')}</text><text x="250" y="380" text-anchor="middle" font-family="Arial" font-size="16" fill="${textColor}">${subtitle.replace(/[<&>"]/g, '')}</text><text x="250" y="650" text-anchor="middle" font-family="Arial" font-size="18" fill="${textColor}">✦ Poster Studio ✦</text></svg>`
    const link = document.createElement('a')
    link.download = 'my-skills-poster.svg'
    link.href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
    link.click()
    URL.revokeObjectURL(link.href)
  }
  const toggle = (key) => setVisible((current) => ({ ...current, [key]: !current[key] }))
  const draggable = (key) => visible[key] && <button className={`poster-element poster-${key}`} style={{ left: `${positions[key].x}%`, top: `${positions[key].y}%` }} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); event.currentTarget.onpointermove = (moveEvent) => updatePosition(key, moveEvent) }} onPointerUp={(event) => { event.currentTarget.onpointermove = null }} aria-label={`Drag ${key}`}><PosterSticker type={key} /></button>
  return <div className="poster-station"><div className="tool-intro"><strong>Make a visual that feels like you.</strong><span>Design a simple poster while practising layout, hierarchy, and creative detail.</span><small>Software / tool: <b>Canva</b></small></div><div className="poster-editor">
    <aside className="poster-sidebar">
      <div className="poster-sidebar-head"><strong>✣ Poster Studio</strong><button className="studio-button" onClick={exportPoster}>Export</button></div>
      <div className="poster-controls">
        <section><h3>✦ Heading & text</h3><label>Main heading<input value={title} onChange={(event) => setTitle(event.target.value)} /></label><div className="poster-control-grid"><label>Font style<select value={font} onChange={(event) => setFont(event.target.value)}><option value="serif">Classic Serif</option><option value="hand">Handwritten</option><option value="sans">Bold Sans</option></select></label><label>Text color<input className="color-input" type="color" value={textColor} onChange={(event) => setTextColor(event.target.value)} /></label></div><label>Skill badges<input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} /></label></section>
        <section><h3>◈ Theme presets</h3><div className="poster-themes">{Object.keys(posterThemes).map((name) => <button className={theme === name ? 'selected' : ''} onClick={() => setTheme(name)} key={name}><i style={{ background: posterThemes[name].accent }} /><i style={{ background: posterThemes[name].secondary }} /><span>{name}</span></button>)}</div></section>
        <section><h3>⌘ Toggle elements</h3><div className="poster-toggles">{[['pencil', 'Pencil doodle'], ['star', 'Star sticker'], ['bulb', 'Idea lightbulb'], ['notebook', 'Art notebook'], ['plant', 'Potted plant'], ['tape', 'Washi tape']].map(([key, label]) => <button className={visible[key] ? 'checked' : ''} onClick={() => toggle(key)} key={key}><span>{visible[key] ? '✓' : ''}</span>{label}</button>)}</div></section>
        <section><h3>＋ Custom skill tags</h3><form className="poster-skill-form" onSubmit={addSkill}><input value={newSkill} onChange={(event) => setNewSkill(event.target.value)} placeholder="Add a skill" /><button className="studio-button">Add</button></form><div className="poster-skill-list">{skills.map((skill, index) => <button onClick={() => setSkills((current) => current.filter((_, skillIndex) => skillIndex !== index))} key={`${skill}-${index}`}>{skill} ×</button>)}</div></section>
        <p className="poster-tip">Click and drag the stickers on the poster. Click a skill tag to remove it.</p>
      </div>
    </aside>
    <div className="poster-stage"><div className="poster-canvas" style={{ '--poster-accent': colors.accent, '--poster-secondary': colors.secondary, '--poster-coral': colors.coral, '--poster-teal': colors.teal, color: textColor }} onPointerMove={(event) => event.currentTarget.releasePointerCapture?.(event.pointerId)}>{visible.tape && <div className="poster-tape" />}{draggable('pencil')}{draggable('star')}{draggable('bulb')}{draggable('notebook')}{draggable('plant')}<div className={`poster-copy poster-font-${font}`}><span>MY LITTLE SCRAPBOOK</span><h3>{title}</h3><div>{subtitle.split('·').map((item) => <b key={item}>{item.trim()}</b>)}</div></div><div className="poster-skills">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div><div className="poster-footer">✦ keep learning ✦</div></div></div>
  </div></div>
}

function AnnotationStation() {
  const [selectedId, setSelectedId] = useState(1)
  const [selectedLabel, setSelectedLabel] = useState('notebook')
  const [drawing, setDrawing] = useState(null)
  const drawingRef = useRef(null)
  const [annotations, setAnnotations] = useState([
    { id: 1, image: '/annotation/notebook-01.jpg', name: 'notebook-01.jpg', boxes: [] },
    { id: 2, image: '/annotation/notebook-02.jpg', name: 'notebook-02.jpg', boxes: [] },
    { id: 3, image: '/annotation/notebook-03.jpg', name: 'notebook-03.jpg', boxes: [] },
  ])
  const selected = annotations.find((item) => item.id === selectedId)
  const getPoint = (event, element) => {
    const bounds = element.getBoundingClientRect()
    return {
      x: Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100)),
      y: Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100)),
    }
  }
  const startDrawing = (event) => {
    if (event.target.closest('.annotation-box')) return
    const point = getPoint(event, event.currentTarget)
    const nextDrawing = { start: point, current: point }
    drawingRef.current = nextDrawing
    setDrawing(nextDrawing)
  }
  const continueDrawing = (event) => {
    if (!drawingRef.current) return
    const nextDrawing = { ...drawingRef.current, current: getPoint(event, event.currentTarget) }
    drawingRef.current = nextDrawing
    setDrawing(nextDrawing)
  }
  const finishDrawing = (event) => {
    const currentDrawing = drawingRef.current
    if (!currentDrawing) return
    const end = getPoint(event, event.currentTarget)
    const x = Math.min(currentDrawing.start.x, end.x)
    const y = Math.min(currentDrawing.start.y, end.y)
    const width = Math.abs(currentDrawing.start.x - end.x)
    const height = Math.abs(currentDrawing.start.y - end.y)
    if (width >= 2 && height >= 2) {
      setAnnotations((items) => items.map((item) => item.id === selectedId ? { ...item, boxes: [...item.boxes, { id: `${selectedId}-${Date.now()}`, label: selectedLabel, x, y, width, height }] } : item))
    }
    drawingRef.current = null
    setDrawing(null)
  }
  const addBox = () => {
    setAnnotations((items) => items.map((item) => item.id === selectedId ? { ...item, boxes: [...item.boxes, { id: `${selectedId}-${Date.now()}`, label: selectedLabel, x: 8 + item.boxes.length * 8, y: 12 + item.boxes.length * 7, width: 30, height: 28 }] } : item))
  }
  return <div className="annotation-station">
    <div className="tool-intro"><strong>Label the picture, not just the page.</strong><span>Practise reviewing a small notebook image dataset, drawing bounding boxes, and assigning the same class across every sample.</span><small>Software / tool: <b>Roboflow or Label Studio</b></small></div>
    <div className="annotation-app">
      <aside className="annotation-dataset"><span className="eyebrow">Image dataset</span><strong>{annotations.length} images · {annotations.reduce((total, item) => total + item.boxes.length, 0)} labels</strong>{annotations.map((item) => <button className={selectedId === item.id ? 'active' : ''} onClick={() => setSelectedId(item.id)} key={item.id}><img src={item.image} alt="" /><span>{item.name}<small>{item.boxes.length} boxes</small></span></button>)}</aside>
      <section className="annotation-canvas-wrap"><div className="annotation-canvas-head"><div><span className="eyebrow">Bounding box annotation</span><h3>{selected?.name}</h3></div><button className="studio-button" onClick={addBox}>＋ Add box</button></div>{selected && <div className="annotation-image" onMouseDown={startDrawing} onMouseMove={continueDrawing} onMouseUp={finishDrawing}>{<img src={selected.image} alt={`Annotate ${selected.name}`} />}{selected.boxes.map((box) => <button className={`annotation-box annotation-box-${box.label}`} style={{ left: `${box.x}%`, top: `${box.y}%`, width: `${box.width}%`, height: `${box.height}%` }} onMouseDown={(event) => event.stopPropagation()} onClick={() => setSelectedLabel(box.label)} key={box.id}><span>{box.label}</span></button>)}{drawing && <div className="annotation-box annotation-box-draft" style={{ left: `${Math.min(drawing.start.x, drawing.current.x)}%`, top: `${Math.min(drawing.start.y, drawing.current.y)}%`, width: `${Math.abs(drawing.start.x - drawing.current.x)}%`, height: `${Math.abs(drawing.start.y - drawing.current.y)}%` }} />}</div>}<div className="annotation-labels"><span>Class label</span><button className={selectedLabel === 'notebook' ? 'active' : ''} onClick={() => setSelectedLabel('notebook')}>notebook</button></div><p className="annotation-tip">This image is ready for annotation. Select notebook, then click and drag directly over the notebook to draw a box.</p></section>
    </div>
  </div>
}

function FilesStation() {
  const [files, setFiles] = useState(initialFiles)
  const [folder, setFolder] = useState('All files')
  const [folders, setFolders] = useState(['Documents', 'Design', 'Images', 'Archives', 'Documents/Applications', 'Design/Brand assets'])
  const [expandedFolders, setExpandedFolders] = useState([])
  const [query, setQuery] = useState('')
  const [newFolder, setNewFolder] = useState('')
  const moveFile = (id, destination) => setFiles((items) => items.map((file) => file.id === id ? { ...file, folder: destination } : file))
  const folderParent = (name) => name.includes('/') ? name.slice(0, name.lastIndexOf('/')) : 'All files'
  const folderName = (name) => name.includes('/') ? name.slice(name.lastIndexOf('/') + 1) : name
  const childFolders = folder === 'All files' ? [] : folders.filter((item) => folderParent(item) === folder)
  const visibleFiles = files.filter((file) => {
    const inFolder = folder === 'All files' || file.folder === folder
    return inFolder && (!query.trim() || file.name.toLowerCase().includes(query.trim().toLowerCase()))
  })
  const createFolder = (event) => {
    event.preventDefault()
    const name = newFolder.trim()
    const path = folder === 'All files' ? name : `${folder}/${name}`
    if (name && !folders.includes(path) && !name.includes('/')) {
      setFolders((items) => [...items, path])
      setFolder(path)
    }
    setNewFolder('')
  }
  const renameFile = (file) => {
    const name = window.prompt('Rename file', file.name)
    if (name?.trim()) setFiles((items) => items.map((item) => item.id === file.id ? { ...item, name: name.trim() } : item))
  }
  const deleteFile = (id) => setFiles((items) => items.filter((file) => file.id !== id))
  const handleDrop = (event, destination) => {
    event.preventDefault()
    const id = Number(event.dataTransfer.getData('text/file-id'))
    if (id) moveFile(id, destination)
  }
  const renderFolderTree = (parent, depth = 0) => folders.filter((item) => folderParent(item) === parent).map((item) => {
    const isExpanded = expandedFolders.includes(item)
    const toggleFolder = () => {
      setFolder(item)
      setExpandedFolders((current) => isExpanded ? current.filter((name) => name !== item) : [...current, item])
    }
    return <div className="folder-tree-item" key={item}><button className={folder === item ? 'active' : ''} style={{ paddingLeft: `${12 + depth * 16}px` }} onClick={toggleFolder} onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, item)}>📁 {folderName(item)}<small>{files.filter((file) => file.folder === item).length}</small></button>{isExpanded && renderFolderTree(item, depth + 1)}</div>
  })
  return <div className="files-station"><div className="tool-intro"><strong>Keep every file within reach.</strong><span>Practise naming, sorting, searching, and moving files into the right place.</span><small>Software / tool: <b>Google Drive, Dropbox or OneDrive</b></small></div><div className="station-panel files-panel"><aside className="folder-list"><div className="folder-list-title">Folders</div><button className={folder === 'All files' ? 'active' : ''} onClick={() => setFolder('All files')}>📁 All files <small>{files.length}</small></button>{renderFolderTree('All files')}<form className="new-folder-form" onSubmit={createFolder}><input value={newFolder} onChange={(event) => setNewFolder(event.target.value)} placeholder="New folder" aria-label="New folder name" /><button aria-label="Create folder">+</button></form></aside><div className="file-list"><div className="file-explorer-toolbar"><div className="file-breadcrumb"><button onClick={() => setFolder('All files')}>This PC</button>{folder !== 'All files' && <><span>›</span><strong>{folder.replaceAll('/', ' › ')}</strong></>}</div><label className="file-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search files" aria-label="Search files" /></label></div><div className="file-actions"><form className="new-folder-toolbar" onSubmit={createFolder}><span>📁</span><input value={newFolder} onChange={(event) => setNewFolder(event.target.value)} placeholder={`New folder in ${folderName(folder)}`} aria-label="Folder name" /><button className="studio-button">New folder</button></form></div><div className="file-list-head"><span>{folderName(folder)}</span><span>{childFolders.length + visibleFiles.length} items · Drag files onto a folder to move</span></div>{childFolders.map((child) => <button className="file-folder-row" onClick={() => setFolder(child)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, child)} key={child}>📁 <strong>{folderName(child)}</strong><span>{files.filter((file) => file.folder === child).length} files</span></button>)}{visibleFiles.map((file) => <div className="file-row" draggable="true" onDragStart={(event) => event.dataTransfer.setData('text/file-id', String(file.id))} key={file.id}><span className="file-icon">{file.type}</span><strong>{file.name}</strong><select value={file.folder} onChange={(event) => moveFile(file.id, event.target.value)} aria-label={`Move ${file.name}`}>{folders.map((item) => <option key={item}>{item}</option>)}</select><div className="file-actions-buttons"><button onClick={() => renameFile(file)}>Rename</button><button onClick={() => deleteFile(file.id)}>Delete</button></div></div>)}{!childFolders.length && !visibleFiles.length && <p className="empty-files">No files or folders found here.</p>}</div></div></div>
}

function OrdersStation() {
  const statuses = ['Order confirmation', 'To Pay', 'To Receive', 'Completed', 'Return/Refund', 'Cancelled']
  const baseProducts = [
    { id: 'desk', name: 'Desk organizer set', sku: 'DSK-2048', price: 24, stock: 38, listed: true },
    { id: 'planner', name: 'Weekly focus planner', sku: 'PLN-1102', price: 18, stock: 52, listed: true },
    { id: 'mug', name: 'Good day ceramic mug', sku: 'MUG-0821', price: 16, stock: 24, listed: true },
    { id: 'tote', name: 'Canvas carry tote', sku: 'TOT-3304', price: 29, stock: 19, listed: true },
    { id: 'stickers', name: 'Creative sticker pack', sku: 'STK-7017', price: 8, stock: 75, listed: true },
    { id: 'notebook', name: 'Ideas notebook', sku: 'NTE-4410', price: 14, stock: 31, listed: false },
  ]
  const orderSeed = [
    ['MK-2048', 'Jamie Cruz', 'desk', 2, 'To Receive'],
    ['MK-2047', 'Sofia Reyes', 'planner', 1, 'Order confirmation'],
    ['MK-2046', 'Liam Santos', 'mug', 2, 'To Pay'],
    ['MK-2045', 'Ari Garcia', 'tote', 1, 'Completed'],
    ['MK-2044', 'Nina Tan', 'stickers', 3, 'Return/Refund'],
    ['MK-2043', 'Marco Dela Cruz', 'notebook', 2, 'Cancelled'],
    ['MK-2042', 'Bea Lim', 'desk', 1, 'To Receive'],
    ['MK-2041', 'Carlo Flores', 'planner', 2, 'Completed'],
    ['MK-2040', 'Diana Ramos', 'mug', 1, 'Order confirmation'],
    ['MK-2039', 'Theo Uy', 'tote', 2, 'To Pay'],
    ['MK-2038', 'Mia Tan', 'stickers', 4, 'Completed'],
    ['MK-2037', 'Jessa Cruz', 'desk', 1, 'Return/Refund'],
    ['MK-2036', 'Paolo Garcia', 'planner', 1, 'To Receive'],
    ['MK-2035', 'Lia Santos', 'mug', 3, 'Cancelled'],
    ['MK-2034', 'Rafael Lim', 'tote', 1, 'Completed'],
    ['MK-2033', 'Ana Flores', 'notebook', 1, 'To Pay'],
    ['MK-2032', 'Celine Yu', 'stickers', 2, 'Order confirmation'],
    ['MK-2031', 'Mara Reyes', 'desk', 2, 'Completed'],
    ['MK-2030', 'Ken Dizon', 'planner', 3, 'Return/Refund'],
    ['MK-2029', 'Ivy Chua', 'mug', 1, 'To Receive'],
  ]
  const [orders, setOrders] = useState(() => orderSeed.map(([id, customer, product, quantity, status], index) => ({
    id, customer, product, quantity, status, payment: status === 'To Pay' || status === 'Order confirmation' ? 'Pending' : 'Paid',
    date: `Oct ${18 - (index % 9)}, 2026`, returnRequested: status === 'Return/Refund',
  })))
  const [products, setProducts] = useState(() => baseProducts.map((product) => {
    const committed = orderSeed.reduce((total, [, , productId, quantity, status]) => total + (productId === product.id && !['Order confirmation', 'Cancelled', 'Return/Refund'].includes(status) ? quantity : 0), 0)
    return { ...product, stock: product.stock - committed }
  }))
  const [filter, setFilter] = useState('All orders')
  const [query, setQuery] = useState('')
  const [orderPage, setOrderPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState('MK-2048')
  const productById = (id) => products.find((product) => product.id === id)
  const visibleOrders = orders.filter((order) => {
    const matchesFilter = filter === 'All orders' || (filter === 'Returns' ? order.status === 'Return/Refund' : order.status === filter)
    const search = query.trim().toLowerCase()
    return matchesFilter && (!search || `${order.id} ${order.customer} ${productById(order.product)?.name}`.toLowerCase().includes(search))
  })
  const ordersPerPage = 5
  const totalOrderPages = Math.max(1, Math.ceil(visibleOrders.length / ordersPerPage))
  const currentOrderPage = Math.min(orderPage, totalOrderPages)
  const paginatedOrders = visibleOrders.slice((currentOrderPage - 1) * ordersPerPage, currentOrderPage * ordersPerPage)
  const selected = visibleOrders.find((order) => order.id === selectedOrder) || visibleOrders[0]
  const total = selected ? selected.quantity * productById(selected.product).price : 0
  const updateStock = (productId, change) => setProducts((items) => items.map((product) => product.id === productId ? { ...product, stock: Math.max(0, product.stock + change) } : product))
  const setOrderStatus = (order, nextStatus) => {
    if (order.status === nextStatus) return
    if (order.status === 'Order confirmation' && nextStatus === 'To Pay') updateStock(order.product, -order.quantity)
    if (order.status === 'To Pay' && nextStatus === 'Cancelled') updateStock(order.product, order.quantity)
    if (order.status === 'Return/Refund' && nextStatus === 'Completed') updateStock(order.product, order.quantity)
    setOrders((items) => items.map((item) => item.id === order.id ? { ...item, status: nextStatus, payment: nextStatus === 'To Pay' ? 'Pending' : item.payment, returnRequested: false } : item))
  }
  const adjustStock = (id, amount) => updateStock(id, amount)
  const toggleListed = (id) => setProducts((items) => items.map((product) => product.id === id ? { ...product, listed: !product.listed } : product))
  const statusAction = selected && selected.status === 'Order confirmation' ? ['To Pay', 'Confirm order'] : selected?.status === 'To Pay' ? ['To Receive', 'Mark as paid'] : selected?.status === 'Return/Refund' ? ['Completed', 'Accept return/refund'] : null
  return <div className="ecommerce-station">
    <div className="ecommerce-intro"><div><strong>Practice running a small online shop.</strong><span>Manage your catalog, process orders, and keep every stock movement accurate.</span></div><small>Software / tool: <b>Shopify admin</b></small></div>
    <section className="inventory-section"><div className="ecommerce-section-head"><div><span className="eyebrow">Catalog</span><h3>Product inventory</h3></div><span>{products.filter((product) => product.listed).length} listed products</span></div><div className="inventory-table-wrap"><table className="commerce-table inventory-table"><thead><tr><th>Product</th><th>SKU</th><th>Price</th><th>Available stock</th><th>Visibility</th><th>Action</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><strong>{product.name}</strong></td><td>{product.sku}</td><td>${product.price.toFixed(2)}</td><td><div className="stock-control"><button onClick={() => adjustStock(product.id, -1)} disabled={product.stock === 0} aria-label={`Decrease ${product.name} stock`}>−</button><b>{product.stock}</b><button onClick={() => adjustStock(product.id, 1)} aria-label={`Increase ${product.name} stock`}>+</button></div></td><td><span className={`listing-pill ${product.listed ? 'is-listed' : ''}`}>{product.listed ? 'Listed' : 'Unlisted'}</span></td><td><button className="table-action" onClick={() => toggleListed(product.id)}>{product.listed ? 'Unlist' : 'List product'}</button></td></tr>)}</tbody></table></div></section>
    <section className="orders-section"><div className="ecommerce-section-head"><div><span className="eyebrow">Orders</span><h3>Order management</h3></div><span>{visibleOrders.length} showing</span></div><div className="ecommerce-summary">{[['All orders', orders.length], ['To Pay', orders.filter((order) => order.status === 'To Pay').length], ['To Receive', orders.filter((order) => order.status === 'To Receive').length], ['Completed', orders.filter((order) => order.status === 'Completed').length], ['Returns', orders.filter((order) => order.status === 'Return/Refund').length]].map(([label, count]) => <button className={filter === label ? 'active' : ''} onClick={() => { setFilter(label); setOrderPage(1) }} key={label}><strong>{count}</strong><span>{label}</span></button>)}</div><div className="order-tools"><label className="order-search"><span>⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); setOrderPage(1) }} placeholder="Search order or customer" aria-label="Search orders" /></label><select value={filter} onChange={(event) => { setFilter(event.target.value); setOrderPage(1) }} aria-label="Filter orders"><option>All orders</option>{statuses.map((status) => <option key={status}>{status}</option>)}<option>Returns</option></select></div><div className="orders-table-wrap"><table className="commerce-table orders-table"><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>    <tbody>{paginatedOrders.map((order) =>  <tr className={selected?.id === order.id ? 'selected-order' : ''} onClick={() => setSelectedOrder(order.id)} key={order.id}><td><strong>#{order.id}</strong></td><td>{order.customer}</td><td>{order.date}</td><td>{productById(order.product).name}<small>Qty {order.quantity}</small></td><td>${(order.quantity * productById(order.product).price).toFixed(2)}</td><td><select className={`order-status-select status-${order.status.toLowerCase().replace(/[/ ]/g, '-')}`} value={order.status} onClick={(event) => event.stopPropagation()} onChange={(event) => { event.stopPropagation(); setOrderStatus(order, event.target.value) }} aria-label={`Update status for order ${order.id}`}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div><div className="order-pagination"><span>Showing {visibleOrders.length === 0 ? 0 : (currentOrderPage - 1) * ordersPerPage + 1}–{Math.min(currentOrderPage * ordersPerPage, visibleOrders.length)} of {visibleOrders.length} orders</span><div><button onClick={() => setOrderPage((page) => Math.max(1, page - 1))} disabled={currentOrderPage === 1} aria-label="Previous order page">←</button><strong>Page {currentOrderPage} of {totalOrderPages}</strong><button onClick={() => setOrderPage((page) => Math.min(totalOrderPages, page + 1))} disabled={currentOrderPage === totalOrderPages} aria-label="Next order page">→</button></div></div>{selected && <article className="order-detail"><div className="order-detail-head"><div><span className="eyebrow">Order #{selected.id}</span><h4>{selected.customer}</h4><small>{selected.date} · {selected.payment} payment</small></div><span className={`status-pill status-${selected.status.toLowerCase().replace(/[/ ]/g, '-')}`}>{selected.status}</span></div><table className="commerce-table order-items"><thead><tr><th>Item</th><th>Qty</th><th>Unit price</th><th>Total</th></tr></thead><tbody><tr><td><strong>{productById(selected.product).name}</strong><small>{productById(selected.product).sku}</small></td><td>{selected.quantity}</td><td>${productById(selected.product).price.toFixed(2)}</td><td>${total.toFixed(2)}</td></tr></tbody></table><div className="order-total"><span>Order total</span><strong>${total.toFixed(2)}</strong></div>{selected.status === 'Return/Refund' && <div className="return-request"><strong>Return/refund requested</strong><span>Review the item and approve or decline the customer request.</span><button className="table-action" onClick={() => setOrderStatus(selected, 'To Receive')}>Decline request</button></div>}<div className="order-actions">{statusAction && <button className="studio-button" onClick={() => setOrderStatus(selected, statusAction[0])}>{statusAction[1]}</button>}{selected.status === 'Order confirmation' || selected.status === 'To Pay' ? <button className="danger-action" onClick={() => setOrderStatus(selected, 'Cancelled')}>Cancel order</button> : null}</div></article>}</section>
  </div>
}

function SkillStudio() {
  const [active, setActive] = useState(() => {
    const requestedStation = new URLSearchParams(window.location.search).get('station')
    return stations.some(([id]) => id === requestedStation) ? requestedStation : 'typing'
  })
  const station = useMemo(() => stations.find(([id]) => id === active), [active])
  const renderStation = () => ({ typing: <TypingStation />, email: <EmailStation />, calendar: <CalendarStation />, design: <DesignStation />, workflow: <WorkflowStation />, files: <FilesStation />, orders: <OrdersStation />, annotation: <AnnotationStation /> }[active])
  return <div className="site-shell studio-page"><StudioHeader /><main><section className="studio-hero"><p className="eyebrow">Practice makes progress</p><h1>Welcome to my<br /><em>Skill Studio.</em></h1><p>Here are simulations of the things I can do and have taught myself.<br />Explore each station to see these skills in action.</p></section><section className="studio-workspace"><nav className="station-nav" aria-label="Skill simulations">{stations.map(([id, title, description], index) => <button className={active === id ? 'active' : ''} onClick={() => setActive(id)} key={id}><span>0{index + 1}</span><strong>{title}</strong><small>{description}</small></button>)}</nav><div className="station-content"><div className="station-heading"><span className="section-label"><span>0{stations.findIndex(([id]) => id === active) + 1}</span><span>Interactive simulation</span></span><h2>{station[1]}</h2></div>{renderStation()}<StationReport active={active} /></div></section></main><footer><span>© {currentYear} Maria Kimberly Labi-Labi</span><span>Made with curiosity <span className="accent">♥</span></span></footer></div>
}

export default SkillStudio
