'use client'

import { useState } from 'react'

const ROLE_TYPES = [
  { value: 'founding_pmm',  label: 'Founding PMM' },
  { value: 'pmm',           label: 'Product Marketing Manager' },
  { value: 'ae',            label: 'Account Executive' },
  { value: 'enterprise_ae', label: 'Enterprise AE' },
  { value: 'sdr',           label: 'SDR / BDR' },
  { value: 'se',            label: 'Solutions Engineer / SA' },
  { value: 'vp_sales',      label: 'VP Sales / CRO' },
  { value: 'pm',            label: 'Product Manager' },
  { value: 'engineer',      label: 'Engineer' },
  { value: 'ml_engineer',   label: 'ML / AI Engineer' },
]

const ROLE_CONFIGS = {
  founding_pmm:  { credLabel: 'PMM Credentials',         builtLabel: "What They've Built" },
  pmm:           { credLabel: 'PMM Credentials',         builtLabel: "What They've Built" },
  ae:            { credLabel: 'Sales Credentials',       builtLabel: 'Deals & Achievements' },
  enterprise_ae: { credLabel: 'Sales Credentials',       builtLabel: 'Deals & Achievements' },
  sdr:           { credLabel: 'SDR Credentials',         builtLabel: 'Pipeline & Wins' },
  se:            { credLabel: 'Technical Credentials',   builtLabel: 'Implementations Built' },
  vp_sales:      { credLabel: 'Leadership Credentials',  builtLabel: 'Teams & Revenue Built' },
  pm:            { credLabel: 'Product Credentials',     builtLabel: 'Products Shipped' },
  engineer:      { credLabel: 'Engineering Credentials', builtLabel: 'Systems Built' },
  ml_engineer:   { credLabel: 'ML/AI Credentials',       builtLabel: 'Models & Systems Built' },
}

const VectorLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,2 98,26 98,74 50,98 2,74 2,26" fill="#1AE642"/>
    <polygon points="50,18 84,36 84,64 50,82 16,64 16,36" fill="#0C1410"/>
    <polygon points="50,32 72,44 72,56 50,68 28,56 28,44" fill="#1AE642"/>
  </svg>
)

export default function Home() {
  const [step, setStep] = useState('input')
  const [clientName, setClientName] = useState('')
  const [roleName, setRoleName] = useState('')
  const [roleType, setRoleType] = useState('founding_pmm')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [transcript, setTranscript] = useState('')
  const [extracted, setExtracted] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const canGenerate = transcript.trim().length > 100 && clientName.trim() && roleName.trim()
  const roleConfig = ROLE_CONFIGS[roleType]

  async function handleGenerate() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, clientName, roleName, roleType, linkedinUrl }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }
      setExtracted(data)
      setStep('preview')
    } catch (err) {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  const s = {
    label: {
      display: 'block', fontSize: 11, fontWeight: 600,
      color: '#4A6B52', letterSpacing: '0.06em',
      marginBottom: 6, textTransform: 'uppercase',
    },
    input: {
      width: '100%', background: '#0F1A11',
      border: '1px solid #1A2B1E', borderRadius: 4,
      color: '#E8F0E9', padding: '10px 12px',
      fontSize: 13, outline: 'none',
    },
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <style>{`
        @media print {
          @page { margin: 0.4cm; size: A4; }
          body { background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
          .no-print { display: none !important; }
          #print-area { box-shadow: none !important; border-radius: 0 !important; width: 100% !important; max-width: 100% !important; margin: 0 !important; }
          .doc-header { background: #0C1410 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .name-block { background: #0C1410 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .section-primary-header { background: #1A2B1E !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .section-secondary-header { background: #F0F4F1 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .row-odd { background: #F6F8F6 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .vectors-view-header { background: #1AE642 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .green-rule { background: #1AE642 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      {/* App Header */}
      <div className="no-print" style={{ borderBottom: '1px solid #1A2B1E', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0C1410' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <VectorLogo size={22} />
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.08em' }}>VECTOR</span>
          <span style={{ color: '#2A4030', margin: '0 6px' }}>|</span>
          <span style={{ fontSize: 11, color: '#4A6B52', letterSpacing: '0.1em' }}>CANDIDATE INTRO GENERATOR</span>
        </div>
        {step === 'preview' && (
          <button onClick={() => { setStep('input'); setExtracted(null); setError('') }}
            style={{ background: 'transparent', border: '1px solid #2A4030', color: '#4A9B5A', padding: '5px 12px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>
            NEW CANDIDATE
          </button>
        )}
      </div>

      {/* Input Form */}
      {step === 'input' && (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '36px 28px' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 6px' }}>New Candidate Introduction</h1>
          <p style={{ fontSize: 13, color: '#4A6B52', margin: '0 0 28px' }}>
            Fill in the details and paste the call transcript. The AI will extract everything and generate the branded one-pager.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={s.label}>Client Name</label>
              <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g. Delve" style={s.input} />
            </div>
            <div>
              <label style={s.label}>Role Title</label>
              <input value={roleName} onChange={e => setRoleName(e.target.value)} placeholder="e.g. Founding PMM" style={s.input} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={s.label}>Role Type</label>
              <select value={roleType} onChange={e => setRoleType(e.target.value)} style={{ ...s.input, cursor: 'pointer' }}>
                {ROLE_TYPES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label style={s.label}>LinkedIn URL <span style={{ color: '#2A4030', textTransform: 'none', fontWeight: 400 }}>(optional)</span></label>
              <input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." style={s.input} />
            </div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={s.label}>Call Transcript</label>
            <textarea
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              placeholder="Paste the full call transcript here..."
              rows={16}
              style={{ ...s.input, resize: 'vertical', fontFamily: 'monospace', fontSize: 12, lineHeight: 1.6 }}
            />
            {transcript.length > 0 && (
              <div style={{ fontSize: 11, color: '#2A4030', marginTop: 4 }}>
                {transcript.split(' ').length.toLocaleString()} words
              </div>
            )}
          </div>

          {error && (
            <div style={{ background: '#1A0A0A', border: '1px solid #4A1A1A', color: '#E05050', padding: '10px 14px', borderRadius: 4, fontSize: 12, marginBottom: 14 }}>
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!canGenerate || loading}
            style={{
              background: canGenerate && !loading ? '#1AE642' : '#0F3A1A',
              color: canGenerate && !loading ? '#0A0F0B' : '#1A4A24',
              border: 'none', padding: '12px 28px', fontSize: 12, fontWeight: 700,
              letterSpacing: '0.08em', borderRadius: 4,
              cursor: canGenerate && !loading ? 'pointer' : 'not-allowed',
            }}
          >
            {loading ? 'Generating...' : 'GENERATE INTRO'}
          </button>
        </div>
      )}

      {/* Preview */}
      {step === 'preview' && extracted && (
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px' }}>
          <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 13, color: '#4A6B52' }}>Preview — {clientName} — {roleName}</div>
              <div style={{ fontSize: 11, color: '#2A4030', marginTop: 2 }}>Cmd+P (Mac) or Ctrl+P (Windows) → Save as PDF</div>
            </div>
            <button onClick={() => window.print()}
              style={{ background: '#1AE642', color: '#0A0F0B', border: 'none', padding: '9px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', borderRadius: 4, cursor: 'pointer' }}>
              DOWNLOAD PDF
            </button>
          </div>

          <div id="print-area" style={{ background: 'white', boxShadow: '0 8px 40px rgba(0,0,0,0.5)', borderRadius: 3, overflow: 'hidden', fontFamily: "Arial, 'Segoe UI', sans-serif" }}>

            {/* Document Header */}
            <div className="doc-header" style={{ background: '#0C1410', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <VectorLogo size={30} />
                <span style={{ color: 'white', fontWeight: 700, fontSize: 14, letterSpacing: '0.12em' }}>VECTOR</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#1AE642', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em' }}>{clientName.toUpperCase()} — {roleName.toUpperCase()}</div>
                <div style={{ color: '#4A6B52', fontSize: 8.5, marginTop: 2, letterSpacing: '0.04em' }}>Candidate Introduction</div>
              </div>
            </div>
            <div className="green-rule" style={{ height: 3, background: '#1AE642' }} />

            {/* Name Block */}
            <div className="name-block" style={{ background: '#0C1410', padding: '20px 20px 18px' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 6 }}>{extracted.candidate.name}</div>
              <div style={{ fontSize: 11, color: '#1AE642', marginBottom: 4 }}>{extracted.candidate.currentRole} — {extracted.candidate.currentCompany}</div>
              {extracted.candidate.formerCompanies?.length > 0 && (
                <div style={{ fontSize: 9.5, color: '#6A8A72', marginBottom: 3 }}>Former {extracted.candidate.formerCompanies.join(' — ')}</div>
              )}
              <div style={{ fontSize: 9.5, color: '#6A8A72', marginBottom: extracted.candidate.linkedinUrl ? 5 : 0 }}>{extracted.candidate.location}</div>
              {extracted.candidate.linkedinUrl && (
                <a href={extracted.candidate.linkedinUrl} target="_blank" rel="noreferrer"
                  style={{ fontSize: 9.5, color: '#1AE642', textDecoration: 'none' }}>
                  {extracted.candidate.linkedinUrl.replace('https://', '')}
                </a>
              )}
            </div>

            {/* Snapshot */}
            <Section title="Snapshot" primary>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                {extracted.snapshot.map((item, i) => (
                  <div key={i} className={i % 4 < 2 ? 'row-odd' : ''} style={{ padding: '10px 14px', background: i % 4 < 2 ? '#F6F8F6' : 'white', borderBottom: '1px solid #E4EBE5', borderRight: i % 2 === 0 ? '1px solid #E4EBE5' : 'none' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#1A1A1A', marginBottom: 3 }}>{item.heading}</div>
                    <div style={{ fontSize: 9, color: '#4A6060', lineHeight: 1.5 }}>{item.detail}</div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Current Situation */}
            <Section title="Current Situation & Motivation" primary>
              <div className="row-odd" style={{ padding: '10px 14px', background: '#F6F8F6', fontSize: 9, lineHeight: 1.7, color: '#1A1A1A' }}>{extracted.currentSituation.mainParagraph}</div>
              {extracted.currentSituation.bullets.map((b, i) => (
                <div key={i} className={i % 2 !== 0 ? 'row-odd' : ''} style={{ padding: '8px 14px', background: i % 2 !== 0 ? '#F6F8F6' : 'white', fontSize: 9, lineHeight: 1.6, color: '#1A1A1A' }}>
                  <strong>{b.label}:</strong> {b.text}
                </div>
              ))}
            </Section>

            {/* Credentials */}
            <Section title={roleConfig.credLabel}>
              {extracted.credentials.map((c, i) => (
                <div key={i} className={i % 2 === 0 ? 'row-odd' : ''} style={{ display: 'grid', gridTemplateColumns: '22% 78%', background: i % 2 === 0 ? '#F6F8F6' : 'white', padding: '6px 14px', borderBottom: '1px solid #E4EBE5' }}>
                  <div style={{ fontSize: 8, fontWeight: 700, color: '#0D9E2A', paddingRight: 8, paddingTop: 1 }}>{c.label}</div>
                  <div style={{ fontSize: 9, color: '#1A1A1A', lineHeight: 1.5 }}>{c.value}</div>
                </div>
              ))}
            </Section>

            {/* What They've Built */}
            <Section title={roleConfig.builtLabel} primary>
              {extracted.built.map((b, i) => (
                <div key={i} className={i % 2 === 0 ? 'row-odd' : ''} style={{ padding: '10px 14px', background: i % 2 === 0 ? '#F6F8F6' : 'white', borderBottom: '1px solid #E4EBE5', fontSize: 9, lineHeight: 1.7, color: '#1A1A1A' }}>
                  <strong>{b.headline}</strong><br /><br />{b.detail}
                </div>
              ))}
            </Section>

            {/* Vector's View */}
            <div style={{ marginTop: 10 }}>
              <div className="vectors-view-header" style={{ background: '#1AE642', padding: '7px 14px' }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: '#0A0F0B', letterSpacing: '0.1em' }}>VECTOR'S VIEW</span>
              </div>
              {extracted.vectorsView.map((para, i) => (
                <div key={i} className={i % 2 === 0 ? 'row-odd' : ''} style={{ padding: '10px 14px', background: i % 2 === 0 ? '#F6F8F6' : 'white', fontSize: 9, lineHeight: 1.7, color: '#1A1A1A', borderBottom: i < extracted.vectorsView.length - 1 ? '1px solid #E4EBE5' : 'none' }}>
                  {para}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="green-rule" style={{ height: 1, background: '#1AE642', marginTop: 10 }} />
            <div style={{ padding: '9px 14px', display: 'flex', justifyContent: 'space-between', fontSize: 8, color: '#8A9E8D' }}>
              <span style={{ fontWeight: 700 }}>Vector Search Inc.</span>
              <span>Prepared by Dylan Hoyle</span>
              <span>dylan@withvector.io — withvector.io</span>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

function Section({ title, primary, children }) {
  return (
    <div style={{ marginTop: 10 }}>
      <div className={primary ? 'section-primary-header' : 'section-secondary-header'} style={{ background: primary ? '#1A2B1E' : '#F0F4F1', padding: '7px 14px', borderBottom: primary ? '1.5px solid #1AE642' : '1px solid #E4EBE5' }}>
        <span style={{ fontSize: 8, fontWeight: 700, color: primary ? '#1AE642' : '#7A9180', letterSpacing: '0.08em' }}>{title.toUpperCase()}</span>
      </div>
      {children}
    </div>
  )
}
