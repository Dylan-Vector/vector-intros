import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ROLE_CONFIGS = {
  founding_pmm:  { credLabel: "PMM Credentials",         personaLabel: "Personas Marketed To" },
  pmm:           { credLabel: "PMM Credentials",         personaLabel: "Personas Marketed To" },
  ae:            { credLabel: "Sales Credentials",       personaLabel: "Personas Sold To" },
  enterprise_ae: { credLabel: "Sales Credentials",       personaLabel: "Personas Sold To" },
  sdr:           { credLabel: "SDR Credentials",         personaLabel: "Personas Prospected" },
  se:            { credLabel: "Technical Credentials",   personaLabel: "Technical Personas" },
  vp_sales:      { credLabel: "Leadership Credentials",  personaLabel: "Stakeholders Managed" },
  pm:            { credLabel: "Product Credentials",     personaLabel: "Stakeholders Worked With" },
  engineer:      { credLabel: "Engineering Credentials", personaLabel: "Teams Worked With" },
  ml_engineer:   { credLabel: "ML/AI Credentials",       personaLabel: "Teams Worked With" },
};

export async function POST(req) {
  try {
    const { transcript, clientName, roleName, roleType, linkedinUrl, resumeB64 } = await req.json();

    if (!transcript || !clientName || !roleName) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const roleConfig = ROLE_CONFIGS[roleType] || ROLE_CONFIGS.founding_pmm;

    const systemPrompt = `You are an expert recruiter at Vector Search Inc., a precision hiring firm for AI and infrastructure companies.

Your job is to write a candidate introduction for ${clientName} - ${roleName} that feels like it was written by a sharp recruiter who just got off a call — not someone who read a resume.

${resumeB64 ? `SOURCE HIERARCHY:
1. TRANSCRIPT (primary) — extract specific quotes, stories, motivations, and personality signals directly from what the candidate said. Use their actual words where possible.
2. RESUME (secondary) — use only for factual accuracy: titles, dates, companies, education, metrics. Never let the resume override what the candidate said in the call.

` : ""}RULES FOR EACH SECTION:

snapshot: Each bullet must reflect something specific from the transcript — a story, a number, a moment. Never generic. The 4th bullet is always comp and notice.

currentSituation: This is the most important section. It must answer:
- Why are they REALLY leaving their current role? (not the polished version — the real one)
- What are they actively looking for? (specific, not "growth and impact")
- What specifically resonated about ${clientName}? (if they mentioned something concrete, use it)
Write this like a recruiter briefing a client on the phone. Direct, specific, no fluff.

built: Lead with outcomes and numbers. If the candidate told a story on the call, capture the story — not just the result. 2-3 sentences per role minimum.

vectorsView: Three observations a client couldn't get from reading the resume themselves:
1. Why this candidate is right for THIS role at THIS company
2. The standout story or moment from the call that demonstrates how they actually work
3. One honest nuanced observation — could be a watch-out framed constructively, or a green flag the resume doesn't show

Return ONLY raw JSON, no markdown, no code fences, nothing else:
{
  "candidate": {
    "name": "Full Name",
    "currentRole": "Job Title",
    "currentCompany": "Company",
    "location": "City, State",
    "linkedinUrl": null,
    "formerCompanies": ["Co1", "Co2"],
    "noticePeriod": "X weeks",
    "expectedComp": "comp range discussed"
  },
  "snapshot": [
    { "heading": "4-6 word headline", "detail": "One tight sentence with a specific detail from the transcript" },
    { "heading": "4-6 word headline", "detail": "One tight sentence with a specific detail from the transcript" },
    { "heading": "4-6 word headline", "detail": "One tight sentence with a specific detail from the transcript" },
    { "heading": "Compensation & Notice Period", "detail": "notice and comp" }
  ],
  "currentSituation": {
    "mainParagraph": "2-3 sentences. The real reason they are open, in plain language. Pull from their actual words.",
    "bullets": [
      { "label": "What they look for", "text": "specific criteria they named — not generic" },
      { "label": "What drew them to ${clientName}", "text": "what they actually said resonated" }
    ]
  },
  "credentials": [
    { "label": "Experience", "value": "X years in field" },
    { "label": "Company Stages", "value": "stages worked at" },
    { "label": "Verticals", "value": "industries covered" },
    { "label": "${roleConfig.personaLabel}", "value": "who they worked with" },
    { "label": "Education", "value": "degree if mentioned" }
  ],
  "built": [
    { "headline": "Company - Title", "detail": "2-3 sentences. Specific outcomes, numbers, and stories from the call." }
  ],
  "vectorsView": [
    "Why they are right for this specific role at ${clientName} — not generic strengths.",
    "The standout story or moment from the call that shows how they actually operate.",
    "One nuanced observation the resume does not show — framed constructively."
  ]
}

Style: short hyphens only (no em/en dashes), direct punchy language, write like a sharp recruiter briefing a client — not a CV parser.`;

    const userContent = resumeB64
      ? [
          {
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: resumeB64 },
          },
          {
            type: "text",
            text: `Transcript:\n\n${transcript}${linkedinUrl ? `\n\nLinkedIn: ${linkedinUrl}` : ""}`,
          },
        ]
      : `Transcript:\n\n${transcript}${linkedinUrl ? `\n\nLinkedIn: ${linkedinUrl}` : ""}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: "user", content: userContent }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());

    if (linkedinUrl && !parsed.candidate.linkedinUrl) {
      parsed.candidate.linkedinUrl = linkedinUrl;
    }

    return Response.json(parsed);
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
