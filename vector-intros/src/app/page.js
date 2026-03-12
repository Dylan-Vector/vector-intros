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
          <VectorLogo height={28} />
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
