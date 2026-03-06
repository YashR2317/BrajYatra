

const fetch = require('node-fetch');
const llm = require('../llm/connector');
const db = require('../db/database');
const { ITINERARY_PROMPT, getLanguageInstruction } = require('../prompts/system-prompts');
const { formatPlaceForLLM, filterByInterests } = require('../utils/helpers');
const { optimizeRoute, getCityCentroid } = require('../utils/geo');
const { rankPlaces } = require('./scoring');
const { enforceDiversity } = require('./diversity');
const { estimateBudget } = require('./budget');
require('dotenv').config();

const OWM_KEY = process.env.OPENWEATHER_API_KEY;
const MAX_LLM_RETRIES = 3;


async function plan(params) {
    const {
        cities = [], days = 1, interests = [], pace = 'moderate',
        language = 'en', group_type = 'family', budget_level = 'medium'
    } = params;

    let targetCities = cities.length > 0 ? cities : ['Mathura', 'Vrindavan'];

    
    let allPlaces = db.getPlacesByMultipleCities(targetCities);
    if (allPlaces.length === 0) {
        for (const city of targetCities) {
            allPlaces.push(...db.getPlacesByCity(city));
        }
    }

    
    if (interests.length > 0) {
        const filtered = filterByInterests(allPlaces, interests);
        const highlights = allPlaces.filter(p => p.highlight);
        const combined = [...new Map([...filtered, ...highlights].map(p => [p.id, p])).values()];
        if (combined.length >= 8) allPlaces = combined;
    }

    
    const primaryCity = targetCities[0];
    const weather = await fetchWeather(primaryCity);

    
    const intent = { interests, cities: targetCities, group_type, budget_level, pace };
    allPlaces = rankPlaces(allPlaces, intent, weather);
    console.log(`[Itinerary] Scored ${allPlaces.length} places (top: ${allPlaces.slice(0, 3).map(p => `${p.name}(${p.score})`).join(', ')})`);

    
    const placesPerDay = pace === 'relaxed' ? 4 : pace === 'intensive' ? 7 : 5;
    const totalNeeded = Math.min(allPlaces.length, days * placesPerDay);
    const minPerCity = targetCities.length > 0 ? Math.max(3, days * 2) : 0;

    const diversified = enforceDiversity(allPlaces, {
        maxPerCategory: 4,
        cities: targetCities,
        minPerCity,
        totalNeeded,
        surfaceHiddenGems: true
    });
    console.log(`[Itinerary] Diversified: ${diversified.length} places`);

    
    const placesByCity = {};
    for (const p of diversified) {
        if (!placesByCity[p.city]) placesByCity[p.city] = [];
        placesByCity[p.city].push(p);
    }
    for (const city of Object.keys(placesByCity)) {
        const centroid = getCityCentroid(city);
        if (centroid) {
            placesByCity[city] = optimizeRoute(placesByCity[city], centroid.lat, centroid.lng);
        }
    }

    
    const selectedPlaces = [];
    for (const city of targetCities) {
        if (placesByCity[city]) selectedPlaces.push(...placesByCity[city]);
    }

    
    const formattedPlaces = selectedPlaces.map(formatPlaceForLLM);

    const userPrompt = JSON.stringify({
        request: {
            cities: targetCities,
            days,
            interests,
            pace,
            group_type,
            budget_level,
            total_places_available: formattedPlaces.length
        },
        current_weather: weather,
        available_places: formattedPlaces
    });

    
    const langInstruction = getLanguageInstruction(language);
    let result = null;
    for (let attempt = 1; attempt <= MAX_LLM_RETRIES; attempt++) {
        result = await llm.generateJSON(ITINERARY_PROMPT + langInstruction, userPrompt);
        if (result.success && result.data && result.data.days && Array.isArray(result.data.days)) {
            console.log(`[Itinerary] LLM success on attempt ${attempt}`);
            break;
        }
        console.warn(`[Itinerary] LLM attempt ${attempt}/${MAX_LLM_RETRIES} failed or returned invalid structure`);
        if (attempt === MAX_LLM_RETRIES) {
            console.warn('[Itinerary] All LLM retries exhausted, using fallback');
        }
    }

    if (!result || !result.success || !result.data?.days) {
        return generateFallbackItinerary(placesByCity, targetCities, days, weather, budget_level);
    }

    
    const itinerary = result.data;
    itinerary.google_maps_url = buildGoogleMapsRoute(itinerary);
    addPerDayRoutes(itinerary);
    addPlaceMapLinks(itinerary);
    itinerary.live_weather = weather;
    if (!itinerary.weather_notes && weather) {
        itinerary.weather_notes = `Current: ${weather.temp}°C, ${weather.description} in ${weather.city}. ${weather.temp > 35 ? 'Very hot — stay hydrated, prefer early morning visits.' : weather.temp < 15 ? 'Cool weather — carry a jacket for evening aarti.' : 'Pleasant weather for sightseeing!'}`;
    }
    if (!itinerary.alternate_indoor || itinerary.alternate_indoor.length === 0) {
        itinerary.alternate_indoor = getIndoorAlternatives(targetCities);
    }

    
    itinerary.budget = estimateBudget({
        places: selectedPlaces,
        days,
        budgetLevel: budget_level
    });

    return { success: true, itinerary, source: result.source, cities: targetCities };
}


async function fetchWeather(city) {
    const coords = getCityCentroid(city);
    if (!coords || !OWM_KEY) return null;

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lng}&appid=${OWM_KEY}&units=metric`;
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();
        return {
            city,
            temp: Math.round(data.main.temp),
            feels_like: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            description: data.weather?.[0]?.description || 'N/A',
            icon: data.weather?.[0]?.icon || '',
            wind_speed: data.wind?.speed || 0,
            is_rainy: ['rain', 'drizzle', 'thunderstorm'].some(w => (data.weather?.[0]?.main || '').toLowerCase().includes(w)),
            is_hot: data.main.temp > 35,
            is_cold: data.main.temp < 15
        };
    } catch (e) {
        console.warn('[Itinerary] Weather fetch failed:', e.message);
        return null;
    }
}


function isActualPlace(slot) {
    if (!slot || !slot.place) return false;
    if (slot.is_meal) return false;
    const lower = slot.place.toLowerCase();
    
    const skipPatterns = [
        'travel to', 'travel from', 'transit', 'drive to', 'walk to', 'commute',
        'rest', 'leisure', 'break', 'check-in', 'check in', 'checkout', 'check out',
        'lunch', 'breakfast', 'dinner', 'snack', 'prasadam break', 'food break',
        '🍛'
    ];
    return !skipPatterns.some(pattern => lower.includes(pattern));
}


function isMealSlot(slot) {
    if (!slot || !slot.place) return false;
    if (slot.is_meal) return true;
    const lower = slot.place.toLowerCase();
    return lower.includes('lunch') || lower.includes('breakfast') || lower.includes('dinner') ||
        lower.includes('prasadam break') || lower.includes('food break') || lower.includes('🍛');
}


function buildGoogleMapsRoute(itinerary) {
    if (!itinerary.days || itinerary.days.length === 0) return null;

    
    const allStops = [];
    for (const day of itinerary.days) {
        for (const slot of (day.slots || [])) {
            if (!isActualPlace(slot)) continue;
            const city = day.city || '';
            allStops.push(`${slot.place}, ${city}, India`);
        }
    }

    if (allStops.length < 2) return null;

    const origin = encodeURIComponent(allStops[0]);
    const destination = encodeURIComponent(allStops[allStops.length - 1]);
    const waypoints = allStops.slice(1, -1).map(s => encodeURIComponent(s)).join('|');

    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    if (waypoints) {
        url += `&waypoints=${waypoints}`;
    }
    return url;
}


function addPerDayRoutes(itinerary) {
    if (!itinerary.days) return;
    for (const day of itinerary.days) {
        const stops = (day.slots || [])
            .filter(s => isActualPlace(s))
            .map(s => `${s.place}, ${day.city || ''}, India`);

        if (stops.length < 2) {
            day.google_maps_url = stops.length === 1
                ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stops[0])}`
                : null;
            continue;
        }

        const origin = encodeURIComponent(stops[0]);
        const destination = encodeURIComponent(stops[stops.length - 1]);
        const waypoints = stops.slice(1, -1).map(s => encodeURIComponent(s)).join('|');
        let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
        if (waypoints) url += `&waypoints=${waypoints}`;
        day.google_maps_url = url;
    }
}


function addPlaceMapLinks(itinerary) {
    if (!itinerary.days) return;
    for (const day of itinerary.days) {
        for (const slot of (day.slots || [])) {
            
            if (isMealSlot(slot)) {
                slot.is_meal = true;
            }
            
            if (!isActualPlace(slot)) continue;
            slot.google_maps_url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(slot.place + ', ' + (day.city || '') + ', India')}`;
        }
    }
}


function getIndoorAlternatives(cities) {
    const indoor = {
        'Mathura': ['Mathura Museum (Buddhist sculptures)', 'Shri Krishna Janmabhoomi Temple (covered)', 'Government Museum Mathura'],
        'Vrindavan': ['ISKCON Temple (air-conditioned hall)', 'Prem Mandir (covered galleries)', 'Vrindavan Chandrodaya Mandir'],
        'Agra': ['Agra Fort (covered halls)', 'Itimad-ud-Daulah (Baby Taj)', 'Mehtab Bagh (shaded viewing)'],
        'Govardhan': ['Daan Ghati Temple (covered)', 'Jatipura Temple'],
        'Barsana': ['Shriji Temple (Radha Rani Temple, covered)', 'Rangeeli Mahal'],
        'Gokul': ['Nand Bhavan Temple (covered)', 'Raman Reti (shaded groves)']
    };
    const result = [];
    for (const city of cities) {
        if (indoor[city]) result.push(...indoor[city]);
    }
    return result.slice(0, 5);
}


function generateFallbackItinerary(placesByCity, cities, days, weather, budgetLevel = 'medium') {
    const itinerary = {
        title: `${days}-Day ${cities.join(' & ')} Sacred Yatra`,
        summary: `A curated ${days}-day pilgrimage through ${cities.join(' and ')} with temple darshan, prasadam breaks, and evening aarti.`,
        days: [],
        tips: [
            'Start each day early (6 AM) for peaceful darshan at temples',
            'Carry modest clothing — shoulders and knees should be covered in temples',
            'Remove shoes before entering all temples (carry a bag for them)',
            'Stay hydrated — carry a water bottle especially in summer',
            'Keep small cash for donations (chadhava) and prasadam',
            'Photography may be restricted inside some temples — check before clicking',
            'Try the famous Mathura ke pede and Vrindavan kheer'
        ],
        weather_notes: weather ? `Current: ${weather.temp}°C, ${weather.description}. ${weather.is_hot ? 'Very hot — visit outdoor sites early morning only.' : weather.is_rainy ? 'Rain expected — carry an umbrella and prefer covered sites.' : 'Good weather for sightseeing!'}` : null,
        alternate_indoor: getIndoorAlternatives(cities),
        total_estimated_hours: 0,
        best_season: 'October–March'
    };

    let dayNum = 1;
    const daysPerCity = Math.max(1, Math.floor(days / cities.length));

    for (const city of cities) {
        const places = placesByCity[city] || [];
        const placesPerDay = Math.ceil(places.length / daysPerCity);

        for (let d = 0; d < daysPerCity && dayNum <= days; d++) {
            const dayPlaces = places.slice(d * placesPerDay, (d + 1) * placesPerDay).slice(0, 5);
            const slots = [];

            
            const schedule = [
                { time: '06:00–07:30', period: 'morning' },
                { time: '08:00–09:30', period: 'morning' },
                { time: '10:00–11:30', period: 'morning' },
                { time: '12:30–13:30', period: 'afternoon', isMeal: true },
                { time: '14:00–15:30', period: 'afternoon' },
                { time: '16:00–17:30', period: 'evening' },
                { time: '18:00–19:30', period: 'evening' },
            ];

            const foodSpots = {
                'Mathura': 'Brijwasi Mithai Wale for famous Mathura ke pede, street chaat near Holi Gate',
                'Vrindavan': 'ISKCON MVT Dining Hall for sattvic prasadam and Govinda\'s Restaurant for thali',
                'Agra': 'Dasaprakash for South Indian, or try local kachori and petha from Panchhi Petha',
                'Govardhan': 'Temple langar at Daan Ghati Temple, or local dhaba for dal-chaawal',
                'Barsana': 'Temple langar at Radha Rani Temple, local dhaba for puri-sabji',
                'Gokul': 'Nand Bhavan temple prasadam, local dhaba for fresh lassi and kachori'
            };

            let placeIdx = 0;
            for (const sched of schedule) {
                if (sched.isMeal) {
                    slots.push({
                        time: sched.time,
                        period: sched.period,
                        place: '🍛 Lunch & Prasadam Break',
                        duration_mins: 60,
                        description: `Enjoy local prasadam and food. ${foodSpots[city] || 'Try the local temple langar or nearby dhaba.'}`,
                        tip: 'Temple langar is usually free — donate generously 🙏',
                        is_meal: true
                    });
                } else if (placeIdx < dayPlaces.length) {
                    const p = dayPlaces[placeIdx];
                    slots.push({
                        time: sched.time,
                        period: sched.period,
                        place: p.name,
                        place_id: p.id,
                        duration_mins: p.estimated_visit_duration || 60,
                        description: p.description || `Visit ${p.name} in ${city}.`,
                        tip: `Crowd level: ${p.crowd_level || 'moderate'}`
                    });
                    placeIdx++;
                }
            }

            itinerary.days.push({
                day: dayNum,
                city,
                theme: `Exploring ${city}`,
                overview: `Visit ${dayPlaces.length} sacred places in ${city} with a prasadam lunch break`,
                slots
            });

            itinerary.total_estimated_hours += dayPlaces.reduce((sum, p) => sum + (p.estimated_visit_duration || 60), 0) / 60 + 1; 
            dayNum++;
        }
    }

    itinerary.google_maps_url = buildGoogleMapsRoute(itinerary);
    addPerDayRoutes(itinerary);
    addPlaceMapLinks(itinerary);
    itinerary.live_weather = weather;

    
    const allFallbackPlaces = Object.values(placesByCity).flat();
    itinerary.budget = estimateBudget({
        places: allFallbackPlaces,
        days,
        budgetLevel
    });

    return { success: true, itinerary, source: 'fallback', cities };
}

module.exports = { plan };
