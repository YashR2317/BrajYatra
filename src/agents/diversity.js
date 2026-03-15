function enforceDiversity(rankedPlaces, options = {}) {
    const {
        maxPerCategory = 4,
        cities = [],
        minPerCity = 4,
        totalNeeded = 20,
        surfaceHiddenGems = true
    } = options;

    const categoryCounts = {};
    const cityCounts = {};
    const selected = [];
    const selectedIds = new Set();

    const CITY_CATEGORY_MINIMUMS = {
        'agra': { 'monument': 2 }
    };

    if (cities.length > 0) {
        for (const city of cities) {
            const cityLower = city.toLowerCase();
            const cityPlaces = rankedPlaces.filter(p =>
                (p.city || '').toLowerCase() === cityLower && !selectedIds.has(p.id)
            );

            const minimums = CITY_CATEGORY_MINIMUMS[cityLower] || {};
            const minimumCounts = {};
            for (const place of cityPlaces) {
                const cat = normCategory(place.category);
                if (minimums[cat] && (minimumCounts[cat] || 0) < minimums[cat] && !selectedIds.has(place.id)) {
                    if (['restaurant', 'food stall', 'food', 'sweet shop', 'cafe'].includes(cat)) continue;
                    selected.push(place);
                    selectedIds.add(place.id);
                    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
                    cityCounts[cityLower] = (cityCounts[cityLower] || 0) + 1;
                    minimumCounts[cat] = (minimumCounts[cat] || 0) + 1;
                }
            }

            let added = Object.values(minimumCounts).reduce((s, v) => s + v, 0);
            for (const place of cityPlaces) {
                if (added >= minPerCity) break;
                if (selectedIds.has(place.id)) continue;
                const cat = normCategory(place.category);
                if (['restaurant', 'food stall', 'food', 'sweet shop', 'cafe'].includes(cat)) continue;

                selected.push(place);
                selectedIds.add(place.id);
                categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
                cityCounts[cityLower] = (cityCounts[cityLower] || 0) + 1;
                added++;
            }
        }
    }

    for (const place of rankedPlaces) {
        if (selected.length >= totalNeeded) break;
        if (selectedIds.has(place.id)) continue;

        const cat = normCategory(place.category);
        const cityLower = (place.city || '').toLowerCase();

        if ((categoryCounts[cat] || 0) >= maxPerCategory) continue;

        selected.push(place);
        selectedIds.add(place.id);
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        cityCounts[cityLower] = (cityCounts[cityLower] || 0) + 1;
    }

    if (surfaceHiddenGems && selected.length < totalNeeded) {
        const hiddenGems = rankedPlaces.filter(p =>
            !selectedIds.has(p.id) &&
            (p.popularity_rank || 999) > 15 &&
            !p.highlight
        );

        const gemSlots = Math.max(1, Math.floor(totalNeeded * 0.2));
        let gemsAdded = 0;
        for (const gem of hiddenGems) {
            if (gemsAdded >= gemSlots || selected.length >= totalNeeded) break;
            const cat = normCategory(gem.category);
            if ((categoryCounts[cat] || 0) < maxPerCategory + 1) {
                selected.push(gem);
                selectedIds.add(gem.id);
                categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
                gemsAdded++;
            }
        }
    }

    return selected;
}

function getCategoryStats(places) {
    const stats = {};
    for (const p of places) {
        const cat = normCategory(p.category);
        stats[cat] = (stats[cat] || 0) + 1;
    }
    return stats;
}

function getCityStats(places) {
    const stats = {};
    for (const p of places) {
        const city = p.city || 'Unknown';
        stats[city] = (stats[city] || 0) + 1;
    }
    return stats;
}

function normCategory(cat) {
    return (cat || 'Other').toLowerCase().trim();
}

module.exports = { enforceDiversity, getCategoryStats, getCityStats };
