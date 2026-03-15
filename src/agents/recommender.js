const llm = require('../llm/connector');
const db = require('../db/database');
const { RECOMMENDER_PROMPT, getLanguageInstruction } = require('../prompts/system-prompts');
const { formatPlaceForLLM, filterByInterests } = require('../utils/helpers');
const { rankPlaces } = require('./scoring');
const { enforceDiversity } = require('./diversity');

async function recommend(params) {
    const {
        query = '', cities = [], interests = [], limit = 8,
        language = 'en', group_type = 'family', budget_level = 'medium'
    } = params;

    let candidates = [];

    if (query) {
        candidates = db.searchPlaces(query);
    }

    if (candidates.length < limit * 3) {
        const cityList = cities.length > 0 ? cities : db.getCities();
        for (const city of cityList) {
            const cityPlaces = db.getPlacesByCity(city);
            candidates.push(...cityPlaces);
        }
        candidates = [...new Map(candidates.map(p => [p.id, p])).values()];
    }

    if (interests.length > 0) {
        const filtered = filterByInterests(candidates, interests);
        if (filtered.length >= 3) candidates = filtered;
    }

    const intent = { interests, cities, group_type, budget_level };
    candidates = rankPlaces(candidates, intent);

    candidates = enforceDiversity(candidates, {
        maxPerCategory: 3,
        cities,
        minPerCity: cities.length > 0 ? 2 : 0,
        totalNeeded: Math.min(25, candidates.length),
        surfaceHiddenGems: true
    });

    console.log(`[Recommender] ${candidates.length} diversified candidates (top: ${candidates.slice(0, 3).map(p => p.name).join(', ')})`);

    const topCandidates = candidates.slice(0, Math.min(25, candidates.length));
    const formatted = topCandidates.map(formatPlaceForLLM);

    const userPrompt = JSON.stringify({
        user_query: query,
        preferences: { interests, cities, group_type, budget_level },
        available_places: formatted
    });

    const result = await llm.generateJSON(RECOMMENDER_PROMPT + getLanguageInstruction(language), userPrompt);

    if (!result.success) {
        
        return {
            success: true,
            recommendations: topCandidates.slice(0, limit).map(p => ({
                place_id: p.id,
                name: p.name,
                city: p.city,
                category: p.category,
                why: p.highlight
                    ? `⭐ Must-visit highlight in ${p.city} — ranked by relevance & diversity`
                    : `Recommended ${p.category} in ${p.city} (score: ${p.score || 'N/A'})`,
                best_time: p.best_time_to_visit || 'Morning',
                duration: `${p.estimated_visit_duration} mins`,
                crowd_level: p.crowd_level,
                insider_tip: p.highlight ? '⭐ Must-visit highlight!' : 'Worth a visit'
            })),
            summary: `Top ${limit} places ranked by relevance, diversity, and preferences`,
            source: 'fallback'
        };
    }

    return {
        success: true,
        ...result.data,
        source: result.source
    };
}

module.exports = { recommend };
