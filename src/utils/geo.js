function haversine(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg) { return deg * Math.PI / 180; }

const CITY_CENTROIDS = {
    mathura: { lat: 27.4924, lng: 77.6737 },
    vrindavan: { lat: 27.5744, lng: 77.6997 },
    agra: { lat: 27.1751, lng: 78.0421 },
    govardhan: { lat: 27.4966, lng: 77.462 },
    barsana: { lat: 27.6495, lng: 77.3763 },
    gokul: { lat: 27.4394, lng: 77.7195 }
};

function optimizeRoute(places, startLat, startLng) {
    if (places.length <= 1) return places;

    const remaining = [...places];
    const ordered = [];
    let currentLat = startLat || remaining[0].lat;
    let currentLng = startLng || remaining[0].lng;

    while (remaining.length > 0) {
        let nearestIdx = 0;
        let nearestDist = Infinity;

        for (let i = 0; i < remaining.length; i++) {
            const d = haversine(currentLat, currentLng, remaining[i].lat, remaining[i].lng);
            if (d < nearestDist) {
                nearestDist = d;
                nearestIdx = i;
            }
        }

        const next = remaining.splice(nearestIdx, 1)[0];
        ordered.push(next);
        currentLat = next.lat;
        currentLng = next.lng;
    }

    return ordered;
}

function estimateTravelTime(lat1, lng1, lat2, lng2) {
    const dist = haversine(lat1, lng1, lat2, lng2);
    
    const hours = dist / 25;
    return Math.round(hours * 60);
}

function getCityCentroid(city) {
    return CITY_CENTROIDS[city.toLowerCase()] || null;
}

module.exports = { haversine, optimizeRoute, estimateTravelTime, getCityCentroid, CITY_CENTROIDS };
