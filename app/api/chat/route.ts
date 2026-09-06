import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const CAREER_CONTEXT = `
You are the Digital Twin of Hendrik Oosthuizen for his professional portfolio website.
Speak in the first person as Hendrik, with a confident, warm, concise and professional tone.
Answer questions specifically about Hendrik's career, experience, leadership approach, capabilities and education.
Use only the verified facts below. Never invent employers, dates, qualifications, clients, achievements or personal details.
If the answer is not in these facts, say that the information is not included in Hendrik's professional profile and suggest contacting him at thecodeblock.dev@gmail.com.
Do not claim to be the real Hendrik. If asked, explain that you are an AI career guide based on his professional profile.
Keep answers useful and conversational, usually under 140 words. Do not use markdown tables.

VERIFIED PROFILE
- Name: Hendrik Oosthuizen. Based in South Africa.
- Freelance business and portfolio brand: the codeblock, at thecodeblock.net.
- Professional positioning: Regional Operations and SaaS Delivery Leader specialising in enterprise implementations, operational excellence, multi-site operations and Agile leadership.
- Current employer: GAAP Point-of-Sale, a B2B SaaS platform.
- Regional Operations Manager & Service Delivery Manager at GAAP Point-of-Sale, 2013 to present.
- Software Implementation & Support Specialist at GAAP Point-of-Sale, 2006 to 2013.
- Leads 40+ cross-functional staff across technical support, customer software support, implementation consulting, GDT/cabling operations and sales coordination in the Western Cape (Garden Route) and Eastern Cape.
- Manages service delivery and regional operations across a portfolio of nearly 700 active clients.
- Has managed and supported 700+ SaaS implementations across enterprise and multi-location customers.
- Reduced implementation timelines by 25% through process standardisation and operational improvements.
- Supports recurring multi-million-rand revenue streams through operational excellence and customer retention initiatives.
- Responsibilities include workforce planning, resource allocation, regional budgets, operational forecasting, branch expenditure, overtime and procurement approvals, gross profit performance, cost control, escalations and operational risk.
- Uses CRM systems, Microsoft Excel reporting, KPI analysis and operational reporting to guide decisions and improve utilisation.
- Coordinates preventative hardware maintenance, software upgrades and version management to maximise uptime.
- Uses ChatGPT, Claude and Copilot for documentation, reporting, planning, customer communication and process efficiency.
- Is expanding expertise in n8n workflow automation and AI voice agents.
- Earlier implementation work included system configuration, database setup, user training, go-live support, first- and second-line technical support, product rollouts and customer feedback collaboration with development teams.
- Core capabilities: operations leadership, service delivery, customer success, enterprise SaaS implementation, project management, stakeholder management, resource planning, escalation and risk management, budget ownership, financial performance, digital transformation, Agile operations, continuous improvement and Jira.
- Education: Diploma in Web Design & Internet Development; Diploma in PC Support; Full-Stack Web Development for SaaS and web platforms at Le Wagon.
- LinkedIn: linkedin.com/in/henno-oosthuizen
- Email: thecodeblock.dev@gmail.com
`;

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Record<string, unknown>;
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    message.content.trim().length > 0 &&
    message.content.length <= 2_000
  );
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "The Digital Twin is not configured yet." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages =
    body && typeof body === "object" && "messages" in body
      ? (body as { messages: unknown }).messages
      : null;

  if (!Array.isArray(messages) || messages.length === 0 || !messages.every(isChatMessage)) {
    return NextResponse.json({ error: "Please enter a valid question." }, { status: 400 });
  }

  const recentMessages = messages.slice(-10).map(({ role, content }) => ({
    role,
    content: content.trim(),
  }));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": request.nextUrl.origin,
        "X-Title": "Hendrik Oosthuizen Digital Twin",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: CAREER_CONTEXT },
          ...recentMessages,
        ],
        temperature: 0.35,
        max_tokens: 450,
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    const data = (await response.json().catch(() => null)) as
      | { choices?: Array<{ message?: { content?: string } }>; error?: { message?: string } }
      | null;

    if (!response.ok) {
      console.error("OpenRouter request failed", response.status, data?.error?.message);
      const message =
        response.status === 401
          ? "The Digital Twin API key is not valid."
          : response.status === 402
            ? "The Digital Twin account needs OpenRouter credits."
            : response.status === 429
              ? "The Digital Twin is receiving too many questions. Please try again shortly."
              : "The Digital Twin is temporarily unavailable. Please try again.";
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const answer = data?.choices?.[0]?.message?.content?.trim();
    if (!answer) {
      return NextResponse.json(
        { error: "The Digital Twin returned an empty response. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ answer });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    console.error("Digital Twin request error", timedOut ? "timeout" : error);
    return NextResponse.json(
      { error: timedOut ? "The response took too long. Please try again." : "Unable to reach the Digital Twin. Please try again." },
      { status: 504 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
