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

const LOGO_B64 = "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"

const VectorLogo = ({ height = 28 }) => (
  <img src={`data:image/png;base64,${LOGO_B64}`} style={{ height, width: 'auto' }} alt="Vector" />
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
          <VectorLogo height={22} />
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
                <VectorLogo height={30} />
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
