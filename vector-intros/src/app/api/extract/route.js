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
    const { transcript, clientName, roleName, roleType, linkedinUrl } = await req.json();

    if (!transcript || !clientName || !roleName) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const roleConfig = ROLE_CONFIGS[roleType] || ROLE_CONFIGS.founding_pmm;

    const systemPrompt = `You are an expert recruiter at Vector Search Inc., a precision hiring firm for AI and infrastructure companies.

Extract structured data from this call transcript to populate a candidate introduction for ${clientName} - ${roleName}.

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
    { "heading": "4-6 word headline", "detail": "One tight sentence" },
    { "heading": "4-6 word headline", "detail": "One tight sentence" },
    { "heading": "4-6 word headline", "detail": "One tight sentence" },
    { "heading": "Compensation & Notice Period", "detail": "notice and comp" }
  ],
  "currentSituation": {
    "mainParagraph": "2-3 sentences on situation and motivation. Specific to the transcript.",
    "bullets": [
      { "label": "What they look for", "text": "criteria from transcript" },
      { "label": "What drew them to ${clientName}", "text": "what resonated" }
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
    { "headline": "Company - Title", "detail": "2-3 sentences. Specific outcomes and numbers." }
  ],
  "vectorsView": [
    "Why strong for this role. Specific to transcript.",
    "Standout story or example from the call.",
    "One nuanced observation for the client - framed positively."
  ]
}

Rules: short hyphens only (no em/en dashes), tight punchy language, write like a sharp recruiter.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Transcript:\n\n${transcript}${linkedinUrl ? `\n\nLinkedIn: ${linkedinUrl}` : ""}`,
        },
      ],
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
