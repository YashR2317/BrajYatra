

const llm = require('../llm/connector');
const db = require('../db/database');
const { CHAT_PROMPT, getLanguageInstruction } = require('../prompts/system-prompts');
const { sanitizeInput } = require('../utils/helpers');


async function chat(message, sessionId, language = 'en') {
    const sanitized = sanitizeInput(message);

    
    let history = [];
    if (sessionId) {
        try {
            history = db.getSessionHistory(sessionId, 10);
        } catch (e) {
            
            history = [];
        }
    }

    
    let enrichedPrompt = CHAT_PROMPT;
    const CITY_NAMES = ['mathura', 'vrindavan', 'agra', 'govardhan', 'barsana', 'gokul'];
    const mentionedCities = CITY_NAMES.filter(c => sanitized.toLowerCase().includes(c));

    if (mentionedCities.length > 0) {
        const contextPlaces = [];
        for (const city of mentionedCities) {
            const places = db.getHighlights(city.charAt(0).toUpperCase() + city.slice(1));
            contextPlaces.push(...places.slice(0, 5));
        }

        if (contextPlaces.length > 0) {
            enrichedPrompt += `\n\nRELEVANT PLACES DATA (use this to provide accurate information):\n`;
            for (const p of contextPlaces) {
                enrichedPrompt += `- ${p.name} (${p.category}, ${p.city}): ${p.description}. Visit: ${p.estimated_visit_duration} mins. Crowd: ${p.crowd_level}.\n`;
            }
        }
    }

    const result = await llm.generateResponse(enrichedPrompt + getLanguageInstruction(language), sanitized, history);

    if (!result.success) {
        return {
            success: false,
            text: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment! 🙏",
            source: 'error'
        };
    }

    
    if (sessionId) {
        try {
            db.saveMessage(sessionId, 'user', sanitized);
            db.saveMessage(sessionId, 'assistant', result.text);
        } catch (e) {
            
            console.warn('[Chat] Failed to save message:', e.message);
        }
    }

    return {
        success: true,
        text: result.text,
        source: result.source
    };
}

module.exports = { chat };
