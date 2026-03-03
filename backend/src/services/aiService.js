import Groq from 'groq-sdk';

let _groq;
const getGroq = () => {
    if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    return _groq;
};

const MODEL = 'llama-3.3-70b-versatile';

const extractJSON = (text) => {
    try {
        const startIdx = Math.min(
            text.indexOf('{') === -1 ? Infinity : text.indexOf('{'),
            text.indexOf('[') === -1 ? Infinity : text.indexOf('[')
        );
        const endIdx = Math.max(
            text.lastIndexOf('}') === -1 ? -1 : text.lastIndexOf('}'),
            text.lastIndexOf(']') === -1 ? -1 : text.lastIndexOf(']')
        );

        if (startIdx !== Infinity && endIdx !== -1 && startIdx < endIdx) {
            const jsonStr = text.substring(startIdx, endIdx + 1);
            return JSON.parse(jsonStr);
        }
        return JSON.parse(text);
    } catch (e) {
        console.error('Failed to parse AI JSON. Raw Response:', text);
        throw new Error('AI response was not valid JSON');
    }
};

const callGroq = async (systemPrompt, userMessage) => {
    console.log('--- CALLING GROQ ---');
    const response = await getGroq().chat.completions.create({
        model: MODEL,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 512,
    });
    return response.choices[0]?.message?.content || '';
};

export const generateSummary = async (title, content) => {
    if (!content || content.trim().length === 0) return 'No content to summarize.';

    const systemPrompt = `You are an assistant that creates concise, factual summaries of personal knowledge notes.
Your goal is to compress information without adding interpretation, opinion, or new facts.`;

    const userMessage = `Summarize the following knowledge note.

Rules:
- Use only the provided content as the source of truth.
- Do NOT add new information or assumptions.
- Do NOT mention that this is a summary.
- Keep the summary between 2 and 4 sentences.
- Use clear, neutral language suitable for a technical dashboard.
- If the content is unclear or too short, summarize only what is explicitly stated.

Title (context only, do not summarize the title):
${title || 'No Title'}

Content:
${content}

Return only the summary text.`;

    try {
        const response = await getGroq().chat.completions.create({
            model: MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage },
            ],
            temperature: 0,
            max_tokens: 512,
        });

        const summary = response.choices[0]?.message?.content || '';
        return summary.trim().replace(/^"|"$/g, '');
    } catch (error) {
        console.error('Groq Summary Error:', error);
        return content.substring(0, 150) + '...';
    }
};

export const generateTags = async (title, content) => {
    if (!content || content.trim().length === 0) return ['note'];

    try {
        const response = await getGroq().chat.completions.create({
            model: MODEL,
            messages: [
                {
                    role: 'system',
                    content: 'Analyze the provided knowledge note and return a JSON object with a "tags" key containing an array of 2-5 lowercase, single-word tags. Example: {"tags": ["javascript", "ai"]}'
                },
                {
                    role: 'user',
                    content: `Title (Context): ${title || 'No Title'}\nContent (Source of Truth): ${content}`
                }
            ],
            response_format: { type: 'json_object' },
            temperature: 0,
            max_tokens: 256,
        });

        const result = response.choices[0]?.message?.content || '';
        const data = extractJSON(result);
        const tags = data.tags || data;

        if (Array.isArray(tags)) {
            return tags.slice(0, 5).map(t => String(t).toLowerCase().trim());
        }
        return ['insight'];
    } catch (error) {
        console.error('Groq Tags Error:', error);
        return ['insight'];
    }
};

export const analyzeSource = async (title, content) => {
    if (!content || content.trim().length === 0) {
        return {
            summary: 'No content to analyze.',
            keyInsights: [],
            relatedConcepts: [],
        };
    }

    try {
        const response = await getGroq().chat.completions.create({
            model: MODEL,
            messages: [
                {
                    role: 'system',
                    content: `Conduct a deep analysis of the provided text. 
Use the Title as context but treat the Content as the primary source of truth.

Return a JSON object with:
- "summary": A 2-3 sentence factual overview.
- "keyInsights": An array of 3 core takeaways (strings).
- "relatedConcepts": An array of 3-5 lowercase topic tags.

Return ONLY valid JSON.`
                },
                {
                    role: 'user',
                    content: `Title (Context): ${title || 'No Title'}\nContent (Source of Truth): ${content}`
                },
            ],
            response_format: { type: 'json_object' },
            temperature: 0,
            max_tokens: 1024,
        });

        const result = response.choices[0]?.message?.content || '';
        const analysis = extractJSON(result);
        return {
            summary: analysis.summary || 'Analysis complete.',
            keyInsights: analysis.keyInsights || [],
            relatedConcepts: analysis.relatedConcepts || [],
        };
    } catch (error) {
        console.error('Groq Analysis Error:', error);
        return {
            summary: await generateSummary(title, content),
            keyInsights: ['Unable to generate deep insights at this moment.'],
            relatedConcepts: await generateTags(`${title} ${content}`),
        };
    }
};

export const queryKnowledge = async (query, sources) => {
    if (!sources || sources.length === 0) {
        return "I couldn't find any specific notes in your Second Brain that match that query.";
    }

    const context = sources
        .map(s => `Title: ${s.title}\nContent: ${s.content || s.summary || 'No content'}`)
        .join('\n\n---\n\n');

    const systemPrompt = `You are an expert at knowledge retrieval.
Use ONLY the provided context to answer the user's question about their Second Brain.
If the context doesn't contain the answer, say you don't have enough information.
Keep the answer concise, factual, and based directly on the provided notes.`;

    const userMessage = `Context Knowledge:\n${context}\n\nQuestion: ${query}`;

    try {
        const response = await getGroq().chat.completions.create({
            model: MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage },
            ],
            temperature: 0.2,
            max_tokens: 1024,
        });

        const answer = response.choices[0]?.message?.content || '';
        return answer.trim();
    } catch (error) {
        console.error('Groq Query Error:', error);
        return 'An error occurred while generating an answer.';
    }
};
