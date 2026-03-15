const llm = require('../llm/connector');
const db = require('../db/database');
const { ORCHESTRATOR_PROMPT } = require('../prompts/system-prompts');
const { sanitizeInput, filterByInterests, filterByAccessibility, filterByBudget } = require('../utils/helpers');
const { rankPlaces } = require('./scoring');
const { enforceDiversity } = require('./diversity');

async function classify(userMessage) {
    const sanitized = sanitizeInput(userMessage);

    const result = await llm.generateJSON(
        ORCHESTRATOR_PROMPT,
        sanitized
    );

    if (!result.success) {
        return fallbackClassify(sanitized);
    }

    const data = result.data;
    return {
        intent: data.intent || 'chat',
        cities: data.cities || [],
        days: data.days || 1,
        interests: data.interests || [],
        pace: data.pace || 'moderate',
        group_type: data.group_type || 'family',
        budget_level: data.budget_level || 'medium',
        accessibility: data.accessibility || 'normal',
        specific_requirements: data.specific_requirements || '',
        query: data.query || sanitized,
        source: result.source
    };
}

function fallbackClassify(message) {
    const lower = message.toLowerCase();
    const CITY_NAMES = ['mathura', 'vrindavan', 'agra', 'govardhan', 'barsana', 'gokul'];

    let intent = 'chat';
    if (/\b(itinerary|plan|schedule|day\s*\d|trip|tour)\b/i.test(lower)) {
        intent = 'itinerary';
    } else if (/\b(recommend|suggest|best|top|where\s+to|should\s+i\s+visit|must\s+see)\b/i.test(lower)) {
        intent = 'recommend';
    } else if (/\b(weather|temperature|rain|climate|forecast|hot|cold)\b/i.test(lower)) {
        intent = 'weather';
    }

    const cities = CITY_NAMES.filter(c => lower.includes(c));
    const dayMatch = lower.match(/(\d+)\s*day/);
    const days = dayMatch ? parseInt(dayMatch[1]) : 1;

    const interests = [];
    if (/temple|spiritual|pilgrim|darshan|aarti/i.test(lower)) interests.push('pilgrimage');
    if (/heritage|histor|monument|fort|palace/i.test(lower)) interests.push('heritage');
    if (/nature|park|garden|walk/i.test(lower)) interests.push('nature');
    if (/food|eat|restaurant|sweet|cuisine/i.test(lower)) interests.push('food');

    let group_type = 'family';
    if (/\b(solo|alone|myself)\b/i.test(lower)) group_type = 'solo';
    else if (/\b(couple|partner|romantic|honeymoon)\b/i.test(lower)) group_type = 'couple';
    else if (/\b(elder|senior|old|aged|grandpa|grandma|elderly)\b/i.test(lower)) group_type = 'elderly';
    else if (/\b(group|friends|gang)\b/i.test(lower)) group_type = 'group';

    let budget_level = 'medium';
    if (/\b(cheap|budget|low.cost|affordable|free)\b/i.test(lower)) budget_level = 'low';
    else if (/\b(luxury|premium|expensive|high.end|5.star)\b/i.test(lower)) budget_level = 'high';

    return {
        intent,
        cities: cities.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
        days,
        interests,
        pace: 'moderate',
        group_type,
        budget_level,
        accessibility: group_type === 'elderly' ? 'limited' : 'normal',
        specific_requirements: '',
        query: message,
        source: 'fallback'
    };
}

function prepareCandidates(intent, weather = null) {
    const { cities, interests, days, group_type, budget_level } = intent;

    let candidates;
    if (cities && cities.length > 0) {
        candidates = db.getPlacesByMultipleCities(cities);
    } else {
        candidates = db.getAllPlaces();
    }

    console.log(`[Orchestrator] Candidates from DB: ${candidates.length}`);

    if (interests && interests.length > 0) {
        const filtered = filterByInterests(candidates, interests);
        if (filtered.length >= 8) {
            candidates = filtered;
        }
    }

    candidates = filterByAccessibility(candidates, group_type);

    candidates = filterByBudget(candidates, budget_level);

    console.log(`[Orchestrator] After filters: ${candidates.length}`);

    candidates = rankPlaces(candidates, intent, weather);

    console.log(`[Orchestrator] Top 3 scored: ${candidates.slice(0, 3).map(p => `${p.name}(${p.score})`).join(', ')}`);

    const maxPerDay = 7;
    const totalNeeded = Math.min(candidates.length, (days || 1) * maxPerDay);
    const minPerCity = cities.length > 0 ? Math.max(4, (days || 1) * 2) : 0;

    candidates = enforceDiversity(candidates, {
        maxPerCategory: 4,
        cities: cities || [],
        minPerCity,
        totalNeeded,
        surfaceHiddenGems: true
    });

    console.log(`[Orchestrator] After diversity: ${candidates.length} places`);

    return candidates;
}

module.exports = { classify, prepareCandidates };
