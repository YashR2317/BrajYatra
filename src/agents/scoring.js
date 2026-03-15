const { parseTags } = require('../utils/helpers');

const INTEREST_CATEGORY_MAP = {
    pilgrimage: ['Temple', 'Shrine', 'Sacred Site', 'Religious Site', 'Ashram'],
    heritage: ['Heritage', 'Monument', 'Museum', 'Fort', 'Palace', 'Historical'],
    nature: ['Park', 'Garden', 'Lake', 'Ghat', 'Hill', 'Nature'],
    food: ['Restaurant', 'Food Stall', 'Sweet Shop', 'Cafe', 'Prasad'],
    market: ['Market', 'Bazaar', 'Shopping'],
    ghat: ['Ghat', 'River Bank'],
    aarti: ['Temple', 'Ghat', 'Sacred Site'],
    festival: ['Temple', 'Cultural Site', 'Heritage']
};

function scorePlace(place, intent, weather = null) {
    let score = 0;
    const interests = intent.interests || [];
    const groupType = intent.group_type || 'family';
    const budgetLevel = intent.budget_level || 'medium';

    const tags = parseTags(place.tags).map(t => t.toLowerCase());
    const category = (place.category || '').toLowerCase();

    for (const interest of interests) {
        const matchCats = (INTEREST_CATEGORY_MAP[interest.toLowerCase()] || []).map(c => c.toLowerCase());
        if (matchCats.includes(category)) score += 10;
        if (tags.some(t => matchCats.some(mc => t.includes(mc.toLowerCase())))) score += 5;
        if (tags.includes(interest.toLowerCase())) score += 8;
    }

    const cityLower = (place.city || '').toLowerCase();
    if (cityLower === 'agra') {
        if (['monument', 'heritage', 'fort', 'palace'].some(t => category.includes(t))) score += 8;
        if (['garden', 'park'].some(t => category.includes(t))) score += 3;
    }

    const rank = place.popularity_rank || 999;
    if (rank <= 3) score += 15;
    else if (rank <= 10) score += 10;
    else if (rank <= 25) score += 5;
    else score += 2;

    if (place.highlight) score += 8;

    const crowd = (place.crowd_level || 'medium').toLowerCase();
    if (crowd === 'high') score -= 3;
    if (crowd === 'very_high' || crowd === 'very high') score -= 6;

    if (groupType === 'family' || groupType === 'elderly') {
        const duration = place.estimated_visit_duration || 45;
        if (duration <= 60) score += 3;
        if (duration > 120) score -= 4;

        if (category.includes('museum') || category.includes('temple')) score += 2;
    }
    if (groupType === 'solo' || groupType === 'couple') {

        if (tags.includes('nature') || tags.includes('walk') || tags.includes('parikrama')) score += 3;
    }

    const entryFee = place.entry_fee || 0;
    if (budgetLevel === 'low' && entryFee > 200) score -= 5;
    if (budgetLevel === 'low' && entryFee === 0) score += 3;
    if (budgetLevel === 'high' && entryFee > 0) score += 1;

    if (weather) {
        const desc = (weather.description || '').toLowerCase();
        const temp = weather.temp || 25;
        const isOutdoor = ['ghat', 'park', 'garden', 'hill', 'nature', 'lake', 'market', 'bazaar']
            .some(t => category.includes(t) || tags.includes(t));

        if (isOutdoor) {
            if (desc.includes('rain') || desc.includes('thunder') || desc.includes('storm')) score -= 10;
            if (temp > 38) score -= 6;
            if (temp > 42) score -= 10;
            if (desc.includes('fog') || desc.includes('haze')) score -= 3;
        } else {

            if (desc.includes('rain') || temp > 38) score += 5;
        }
    }

    if (rank > 15 && !place.highlight) {

        score += 2;
    }

    return Math.max(0, score);
}

function rankPlaces(places, intent, weather = null) {
    const scored = places.map(p => ({
        ...p,
        score: scorePlace(p, intent, weather)
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored;
}

module.exports = { scorePlace, rankPlaces, INTEREST_CATEGORY_MAP };
