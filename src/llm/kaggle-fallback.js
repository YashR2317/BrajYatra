const fetch = require('node-fetch');
require('dotenv').config();

const TIMEOUT_MS = 15000;

function getEndpoint() {
    const url = process.env.KAGGLE_ENDPOINT_URL;
    if (!url) return null;
    return url.replace(/\/$/, '');
}

async function generateResponse(systemPrompt, userMessage, history = []) {
    const endpoint = getEndpoint();
    if (!endpoint) {
        return { success: false, error: 'KAGGLE_ENDPOINT_URL not configured', source: 'kaggle' };
    }

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

        const res = await fetch(`${endpoint}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_prompt: systemPrompt,
                message: userMessage,
                history: history
            }),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!res.ok) {
            return { success: false, error: `Kaggle endpoint returned ${res.status}`, source: 'kaggle' };
        }

        const data = await res.json();
        return { success: true, text: data.text || data.response, source: 'kaggle' };
    } catch (error) {
        return { success: false, error: error.message, source: 'kaggle' };
    }
}

async function generateJSON(systemPrompt, userMessage) {
    const result = await generateResponse(
        systemPrompt + '\n\nYou MUST respond with valid JSON only. No markdown, no explanation.',
        userMessage
    );

    if (!result.success) return { ...result, source: 'kaggle' };

    try {
        
        let jsonText = result.text;
        const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) jsonText = jsonMatch[1];

        const parsed = JSON.parse(jsonText.trim());
        return { success: true, data: parsed, raw: jsonText, source: 'kaggle' };
    } catch (e) {
        return { success: false, error: `JSON parse failed: ${e.message}`, raw: result.text, source: 'kaggle' };
    }
}

async function healthCheck() {
    const endpoint = getEndpoint();
    if (!endpoint) return false;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(`${endpoint}/health`, { signal: controller.signal });
        clearTimeout(timeout);
        return res.ok;
    } catch {
        return false;
    }
}

module.exports = { generateResponse, generateJSON, healthCheck };
