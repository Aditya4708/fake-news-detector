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

CRITICAL RULE: AI-generated fake news often mixes 40-60% real facts with synthetic manipulation. If you detect ANY unjustified sensationalism, rage-baiting, or calculated emotional manipulation mixed with facts, you MUST rate it as FAKE.

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

CRITICAL RULE: AI-generated fake news convincingly mimics journalistic tone. Do not be fooled by perfect grammar. If the text relies heavily on vague, unnamed "experts" for its core claims while blending in real facts, you MUST rate it as FAKE due to deceptive sourcing.

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

CRITICAL RULE: Information pollution often combines ~50% factual background with fabricated core claims. If you identify ANY fabricated, deeply misleading, or unverified narrative claims, you MUST rate the entire article as FAKE. Do NOT vote "REAL" just because a portion of the text is historically or scientifically accurate.

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

CRITICAL RULE: Advanced AI generators write in a detached, "neutral" voice to disguise propaganda and false equivalence. If you observe subtle narrative manipulation, strategic omission of context, or biased framing mixed with factual prose, you MUST rate it as FAKE to flag it as deceptive content.

You must respond ONLY in this exact JSON format (no markdown, no extra text):
{"verdict":"REAL","confidence":75,"explanation":"Brief 1-2 sentence explanation"}

verdict must be exactly one of: "REAL", "FAKE", or "UNCERTAIN"
confidence must be a number from 0 to 100
explanation must be a brief string`
    },
];

function fallbackNodeAnalysis(nodeIndex, articleText, errorMessage = "") {
    const node = NODE_CONFIGS[nodeIndex];
    const text = (articleText || "").toLowerCase();

    const suspiciousPatterns = [
        /you won't believe/i,
        /shocking/i,
        /breaking/i,
        /urgent/i,
        /must see/i,
        /secret/i,
        /bombshell/i,
        /scandal/i,
        /outrage/i,
        /panic/i,
        /censored/i,
        /banned/i,
        /explosive/i,
        /dramatic/i,
        /proof/i,
        /reveal/i,
        /conspiracy/i,
        /experts say/i,
        /anonymous/i,
        /share now/i,
        /breakthrough/i,
        /future versions/i,
        /allow users to/i,
        /experimental device/i,
        /could redefine/i,
        /replay human dreams/i,
        /watch their dreams/i,
        /dream recording/i,
    ];

    const crediblePatterns = [
        /according to/i,
        /official records/i,
        /published study/i,
        /report/i,
        /research/i,
        /documented/i,
        /evidence/i,
        /data/i,
        /confirmed/i,
        /verified/i,
        /independent/i,
        /study/i,
        /journal/i,
        /statistics/i,
        /analysis/i,
        /source/i,
    ];

    const suspiciousScore = suspiciousPatterns.filter((pattern) => pattern.test(text)).length;
    const credibleScore = crediblePatterns.filter((pattern) => pattern.test(text)).length;
    const hasExtraordinaryClaim = /(breakthrough|experimental device|future versions|could redefine|allow users to|reconstruct visual patterns|record and replay|watch their dreams)/i.test(text);
    const hasSpecificSource = /(according to|official records|published study|confirmed by|verified by|independent researchers|journal|study says)/i.test(text);
    const hasHypeLanguage = /(announced|surprising claim|redefine|high definition|digital content|new technology)/i.test(text);

    let verdict = "UNCERTAIN";
    let confidence = 55;
    let explanation = "Used a local fallback classifier because the provider was unavailable.";

    if (hasExtraordinaryClaim && !hasSpecificSource && (suspiciousScore + (hasHypeLanguage ? 1 : 0)) >= 3) {
        verdict = "FAKE";
        confidence = 78;
        explanation = "The article makes extraordinary claims with hype language and weak sourcing, so it was treated as FAKE.";
    } else if (suspiciousScore >= 2 && suspiciousScore >= credibleScore) {
        verdict = "FAKE";
        confidence = 72;
        explanation = "The text contains several sensational or unsupported cues, so it was flagged as FAKE.";
    } else if (credibleScore >= 2 && credibleScore > suspiciousScore) {
        verdict = "REAL";
        confidence = 70;
        explanation = "The text includes evidence-oriented language and source signals, so it was treated as REAL.";
    } else if (suspiciousScore >= 1) {
        verdict = "FAKE";
        confidence = 64;
        explanation = "The text contains strong manipulation cues, so it was treated as FAKE.";
    } else if (credibleScore >= 1) {
        verdict = "REAL";
        confidence = 62;
        explanation = "The text includes helpful attribution and evidence cues, so it was treated as REAL.";
    }

    if (errorMessage) {
        explanation = `${explanation} ${errorMessage}`;
    }

    return {
        nodeName: node.name,
        nodeIcon: node.icon,
        nodeColor: node.color,
        verdict,
        confidence,
        explanation,
        responseTime: null,
        status: "success",
        isFallback: true,
    };
}

/**
 * Call a single AI analyzer node via OpenRouter
 */
async function callNode(nodeIndex, articleText) {
    const node = NODE_CONFIGS[nodeIndex];
    const startTime = Date.now();
    const timeoutMs = Number(process.env.OPENROUTER_NODE_TIMEOUT_MS) || 60000;
    const maxRetries = Number(process.env.OPENROUTER_NODE_RETRIES) || 1;

    if (!process.env.OPENROUTER_API_KEY || !String(process.env.OPENROUTER_API_KEY).trim()) {
        return fallbackNodeAnalysis(nodeIndex, articleText, "OpenRouter API key is missing.");
    }

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
                    return fallbackNodeAnalysis(nodeIndex, articleText, `Node failed after ${attempt} attempts: ${error.message}`);
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
            return fallbackNodeAnalysis(nodeIndex, articleText, `Failed to parse node response JSON: ${error.message}`);
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
        return fallbackNodeAnalysis(nodeIndex, articleText, `Node failed: ${error.message}`);
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

export { NODE_CONFIGS, callNode, analyzeArticle, fallbackNodeAnalysis };
