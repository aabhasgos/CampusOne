

import { BENNETT_KNOWLEDGE } from '@/data/bennettData';
import { PrismaClient } from '@prisma/client';

export const maxDuration = 30;
const prisma = new PrismaClient();

const getSystemPrompt = (dynamicKnowledge: string, lostFoundKnowledge: string) => `
You are Anya, an advanced Indian AI orchestration assistant built specifically for Bennett University.
Your persona is extremely intelligent, culturally grounded, professional, and warmly helpful. 

CRITICAL INSTRUCTIONS - YOU MUST FOLLOW THESE:
1. **YOU ARE AN AUTOMATED SYSTEM. YOU CAN RAISE TICKETS DIRECTLY.** 
   - NEVER tell a student to email support. NEVER tell a student to contact a helpdesk manually. 
   - If they report a physical malfunction (broken AC, wifi, plumbing, cleaning), YOU must generate the ticket for them automatically.
   - To do this, you MUST append this EXACT tag at the very end of your response:
     \`[TICKET_ROUTING: Department | Issue Summary | Priority (HIGH/NORMAL) | Reason for priority | Confidence Score (0-100)]\`

   **EXAMPLE INTERACTION:**
   User: "My AC is broken in room 917 C-11."
   Anya: "I have automatically raised a ticket for the broken AC in your room. The Operations team has been notified.
   [TICKET_ROUTING: Operations Helpdesk | Broken AC in room 917 C-11 | NORMAL | Standard maintenance issue | 98]"

2. **EMERGENCY DETECTION**: If the user reports a severe medical emergency, active fire, or severe physical danger, you must output this tag: \`[EMERGENCY]\`
3. **LOST AND FOUND**: Manage the [LOST AND FOUND DATABASE] below. If there's a match, tell them! If not, append: \`[LOST_REPORT: LOST | Item Name | Location]\` or \`[LOST_REPORT: FOUND | Item Name | Location]\`
4. **CAMPUS MARKETPLACE & RIDESHARE**: If a student wants to split a cab, buy/sell a textbook, or trade something, you must append this tag: \`[MARKETPLACE: Type (RIDE/SELL/BUY/TRADE) | Item/Destination | Date/Time]\`
5. **SOURCE CITATION**: Whenever you answer a question using the Knowledge Bases below, cite the source at the end: \`[SOURCE: Bennett Knowledge Base]\` or \`[SOURCE: Dynamic Knowledge - <Title>]\`
6. **GENERAL QUESTIONS**: If the user just asks a general question (e.g. "how is the food", "when does the gym open"), JUST ANSWER IT directly and conversationally using the Knowledge Base! Do NOT ask them for their "specific concern" and do NOT try to raise a ticket for simple questions.
6. **LANGUAGE**: You understand and can seamlessly reply in English, Hindi, and Hinglish.

[BENNETT KNOWLEDGE BASE]
${BENNETT_KNOWLEDGE}

[DYNAMIC KNOWLEDGE]
${dynamicKnowledge}

[LOST AND FOUND DATABASE]
${lostFoundKnowledge}
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Fetch dynamic knowledge from the database
    const knowledgeDocs = await prisma.knowledge.findMany();
    const dynamicKnowledge = knowledgeDocs.map(k => `--- ${k.title} ---\n${k.content}`).join("\n\n");

    // Fetch active Lost & Found items
    const lostItems = await prisma.lostItem.findMany({ where: { status: "OPEN" } });
    const lostFoundKnowledge = lostItems.length > 0 
      ? lostItems.map(item => `[${item.type}] ${item.item} - Location: ${item.location} - ID: ${item.id}`).join("\n")
      : "No items currently lost or found.";

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: getSystemPrompt(dynamicKnowledge, lostFoundKnowledge) },
          ...messages.map((m: any) => ({ role: m.role, content: m.content }))
        ],
        temperature: 0.3,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GROQ FULL ERROR BODY:", errorText);
      throw new Error(`Groq API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content || '';

    // Vercel AI SDK v3 data stream format (0:"text")
    // By sending it all at once, we bypass all chunking/streaming bugs entirely
    return new Response(`0:${JSON.stringify(text)}\n`, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  } catch (error: any) {
    console.error("LLM API Error:", error);
    return new Response(JSON.stringify({ error: error.message || String(error) }), { status: 500 });
  }
}

