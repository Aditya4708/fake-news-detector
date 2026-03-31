import axios from "axios";

// Define the 4 specialized analyzer nodes
const NODE_CONFIGS = [
    {
        name: "Sentiment Analyzer",
        icon: "⚡",
        color: "#eab308",
        systemPrompt: `You are a Sentiment Analysis Node in a distributed fake news detection system.
Your SOLE job is to analyze the EMOTIONAL MANIPULATION in the given text.

Look for:
- Fear-baiting and panic-inducing language
- Outrage triggers and inflammatory rhetoric
- Emotional manipulation tactics
- Clickbait emotional hooks
- Sensationalism vs measured reporting

You must respond ONLY in this exact JSON format (no markdown, no extra text):
{"verdict":"REAL","confidence":75,"explanation":"Brief 1-2 sentence explanation"}

verdict must be exactly one of: "REAL", "FAKE", or "UNCERTAIN"
confidence must be a number from 0 to 100
explanation must be a brief string`
    },
    {
        name: "Source Credibility",
        icon: "🔎",
        color: "#22d3ee",
        systemPrompt: `You are a Source Credibility Node in a distributed fake news detection system.
Your SOLE job is to analyze the SOURCE RELIABILITY signals in the given text.

Look for:
- Presence or absence of citations and references
- Attribution to named, verifiable sources
- Use of anonymous or vague sources ("experts say", "studies show")
- Whether claims are attributed or presented as fact
- Professional journalistic standards vs blog/opinion style

You must respond ONLY in this exact JSON format (no markdown, no extra text):
{"verdict":"REAL","confidence":75,"explanation":"Brief 1-2 sentence explanation"}

verdict must be exactly one of: "REAL", "FAKE", or "UNCERTAIN"
confidence must be a number from 0 to 100
explanation must be a brief string`
    },
    {
        name: "Fact Pattern",
        icon: "⚖️",
        color: "#a78bfa",
        systemPrompt: `You are a Fact Pattern Analysis Node in a distributed fake news detection system.
Your SOLE job is to analyze LOGICAL CONSISTENCY and FACTUAL PATTERNS in the given text.

Look for:
- Internal contradictions within the text
- Unsupported or extraordinary claims
- Logical fallacies and reasoning errors
- Statistical misrepresentations
- Claims that contradict well-established facts
- Cherry-picked data or missing context

You must respond ONLY in this exact JSON format (no markdown, no extra text):
{"verdict":"REAL","confidence":75,"explanation":"Brief 1-2 sentence explanation"}

verdict must be exactly one of: "REAL", "FAKE", or "UNCERTAIN"
confidence must be a number from 0 to 100
explanation must be a brief string`
    },
    {
        name: "Bias Detector",
        icon: "🧠",
        color: "#f472b6",
        systemPrompt: `You are a Bias Detection Node in a distributed fake news detection system.
Your SOLE job is to analyze PROPAGANDA and BIAS in the given text.

Look for:
- Loaded or emotionally charged language
- One-sided framing without opposing viewpoints
- Propaganda techniques (bandwagon, appeal to authority, etc.)
- Political or ideological bias
- Omission of key context to push a narrative
- False equivalence or false dichotomy

You must respond ONLY in this exact JSON format (no markdown, no extra text):
{"verdict":"REAL","confidence":75,"explanation":"Brief 1-2 sentence explanation"}

verdict must be exactly one of: "REAL", "FAKE", or "UNCERTAIN"
confidence must be a number from 0 to 100
explanation must be a brief string`
    },
];

/**
 * Call a single AI analyzer node via OpenRouter
 */
async function callNode(nodeIndex, articleText) {
    const node = NODE_CONFIGS[nodeIndex];
    const startTime = Date.now();
    const timeoutMs = Number(process.env.OPENROUTER_NODE_TIMEOUT_MS) || 60000;
    const maxRetries = Number(process.env.OPENROUTER_NODE_RETRIES) || 1;

    const makeRequest = async () => {
        return axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-001",
                messages: [
                    { role: "system", content: node.systemPrompt },
                    { role: "user", content: `Analyze this article for fake news:\n\n${articleText}` },
                ],
                temperature: 0.3,
                max_tokens: 300,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
                    "X-Title": "TruthNet Fake News Detector",
                },
                timeout: timeoutMs,
            }
        );
    };

    let attempt = 0;
    let response;

    try {
        while (attempt <= maxRetries) {
            try {
                response = await makeRequest();
                break;
            } catch (error) {
                attempt += 1;
                if (attempt > maxRetries) {
                    console.error(`Node "${node.name}" failed after ${attempt} attempts:`, error.message);
                    return {
                        nodeName: node.name,
                        nodeIcon: node.icon,
                        nodeColor: node.color,
                        verdict: "UNCERTAIN",
                        confidence: 10,
                        explanation: `Node failed after ${attempt} attempts: ${error.message}`,
                        responseTime: Date.now() - startTime,
                        status: "error",
                    };
                }
                console.warn(`Node "${node.name}" attempt ${attempt} failed: ${error.message}, retrying...`);
            }
        }

        if (!response || !response.data || !response.data.choices || !response.data.choices[0]) {
            throw new Error("Invalid response from OpenRouter");
        }

        const raw = response.data.choices[0].message.content.trim();

        // Parse the JSON response — handle markdown code blocks if present
        let cleaned = raw;
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
        }

        let parsed = null;
        try {
            parsed = JSON.parse(cleaned);
        } catch (error) {
            throw new Error(`Failed to parse node response JSON: ${error.message} - raw response: ${raw}`);
        }

        // Validate the response
        const validVerdicts = ["REAL", "FAKE", "UNCERTAIN"];
        if (!validVerdicts.includes(parsed.verdict)) {
            parsed.verdict = "UNCERTAIN";
        }
        parsed.confidence = Math.max(0, Math.min(100, Number(parsed.confidence) || 50));

        return {
            nodeName: node.name,
            nodeIcon: node.icon,
            nodeColor: node.color,
            verdict: parsed.verdict,
            confidence: parsed.confidence,
            explanation: parsed.explanation || "No explanation provided.",
            responseTime: Date.now() - startTime,
            status: "success",
        };
    } catch (error) {
        console.error(`Node "${node.name}" failed:`, error.message);
        return {
            nodeName: node.name,
            nodeIcon: node.icon,
            nodeColor: node.color,
            verdict: "UNCERTAIN",
            confidence: 0,
            explanation: `Node failed: ${error.message}`,
            responseTime: Date.now() - startTime,
            status: "error",
        };
    }
}

/**
 * Fire all 4 nodes in parallel (distributed execution)
 */
async function analyzeArticle(articleText) {
    const nodePromises = NODE_CONFIGS.map((_, index) => callNode(index, articleText));
    const results = await Promise.allSettled(nodePromises);

    return results.map((result) => {
        if (result.status === "fulfilled") return result.value;
        return {
            nodeName: "Unknown",
            verdict: "UNCERTAIN",
            confidence: 0,
            explanation: "Node failed unexpectedly.",
            responseTime: 0,
            status: "error",
        };
    });
}

export { NODE_CONFIGS, callNode, analyzeArticle };
