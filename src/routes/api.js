

const express = require('express');
const router = express.Router();
const orchestrator = require('../agents/orchestrator');
const itineraryAgent = require('../agents/itinerary');
const recommender = require('../agents/recommender');
const chatAgent = require('../agents/chat');
const weatherAgent = require('../agents/weather');
const db = require('../db/database');
const llm = require('../llm/connector');
const { generateId, sanitizeInput } = require('../utils/helpers');
const { enrichWithImage, getCityImage, CITY_IMAGES } = require('../utils/place-images');



router.post('/chat', async (req, res) => {
    try {
        const { message, sessionId, language } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });
        const userLang = language || 'en';

        const sanitized = sanitizeInput(message);
        let sid = sessionId;

        
        if (!sid) {
            sid = generateId();
            try { db.createSession(sid); } catch (e) {  }
        }

        
        const routing = await orchestrator.classify(sanitized);
        let response;

        switch (routing.intent) {
            case 'itinerary':
                response = await itineraryAgent.plan({
                    cities: routing.cities,
                    days: routing.days,
                    interests: routing.interests,
                    pace: routing.pace,
                    group_type: routing.group_type || 'family',
                    budget_level: routing.budget_level || 'medium',
                    language: userLang
                });
                
                try {
                    db.saveMessage(sid, 'user', sanitized, { intent: 'itinerary' });
                    db.saveMessage(sid, 'assistant', JSON.stringify(response.itinerary), { type: 'itinerary' });
                } catch (e) { }

                return res.json({
                    sessionId: sid,
                    type: 'itinerary',
                    intent: routing,
                    itinerary: response.itinerary,
                    source: response.source
                });

            case 'recommend':
                response = await recommender.recommend({
                    query: routing.query,
                    cities: routing.cities,
                    interests: routing.interests,
                    group_type: routing.group_type || 'family',
                    budget_level: routing.budget_level || 'medium',
                    language: userLang
                });
                try {
                    db.saveMessage(sid, 'user', sanitized, { intent: 'recommend' });
                    db.saveMessage(sid, 'assistant', JSON.stringify(response), { type: 'recommend' });
                } catch (e) { }

                return res.json({
                    sessionId: sid,
                    type: 'recommend',
                    intent: routing,
                    recommendations: response.recommendations || [],
                    summary: response.summary || '',
                    source: response.source
                });

            case 'weather':
                const city = routing.cities[0] || 'Mathura';
                response = await weatherAgent.getWeather(city);
                try {
                    db.saveMessage(sid, 'user', sanitized, { intent: 'weather' });
                    db.saveMessage(sid, 'assistant', response.text, { type: 'weather' });
                } catch (e) { }

                return res.json({
                    sessionId: sid,
                    type: 'weather',
                    intent: routing,
                    text: response.text,
                    data: response.data || null,
                    source: response.source
                });

            default: 
                response = await chatAgent.chat(sanitized, sid, userLang);
                return res.json({
                    sessionId: sid,
                    type: 'chat',
                    intent: routing,
                    text: response.text,
                    source: response.source
                });
        }
    } catch (error) {
        console.error('[API /chat] Error:', error);
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
});



router.post('/itinerary', async (req, res) => {
    try {
        const { cities, days, interests, pace } = req.body;
        const result = await itineraryAgent.plan({
            cities: cities || [],
            days: days || 1,
            interests: interests || [],
            pace: pace || 'moderate'
        });
        res.json(result);
    } catch (error) {
        console.error('[API /itinerary] Error:', error);
        res.status(500).json({ error: 'Failed to generate itinerary' });
    }
});



router.get('/places/suggest', (req, res) => {
    try {
        const { city, exclude, category } = req.query;
        if (!city) return res.json({ suggestions: [] });

        
        let places = db.getPlacesByCity(city);

        
        if (exclude) {
            const excludeSet = new Set(exclude.split(',').map(id => id.trim()));
            places = places.filter(p => !excludeSet.has(p.id));
        }

        
        const { rankPlaces } = require('../agents/scoring');
        const interests = category ? [category.toLowerCase()] : [];
        const scored = rankPlaces(places, { interests, cities: [city] });

        
        const suggestions = scored.slice(0, 5).map(p => ({
            id: p.id,
            name: p.name,
            city: p.city,
            category: p.category,
            description: p.description,
            estimated_visit_duration: p.estimated_visit_duration,
            crowd_level: p.crowd_level,
            highlight: !!p.highlight,
            score: p.score,
            image: p.image_url || null
        }));

        res.json({ suggestions });
    } catch (error) {
        console.error('[API /places/suggest] Error:', error);
        res.json({ suggestions: [] });
    }
});



router.get('/places', (req, res) => {
    try {
        const { city, category, q } = req.query;
        let places;

        if (q) {
            places = db.searchPlaces(q);
        } else if (city && category) {
            places = db.getPlacesByCategory(city, category);
        } else if (city) {
            places = db.getPlacesByCity(city);
        } else {
            places = db.getAllPlaces();
        }
        return res.json(places.map(enrichWithImage));
    } catch (error) {
        console.error('[API /places] Error:', error);
        res.status(500).json({ error: 'Failed to fetch places' });
    }
});

router.get('/places/:id', (req, res) => {
    try {
        const place = db.getPlaceById(req.params.id);
        if (!place) return res.status(404).json({ error: 'Place not found' });
        res.json(enrichWithImage(place));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch place' });
    }
});



router.get('/cities', (req, res) => {
    try {
        const cities = db.getCities().map(city => ({
            name: city,
            image: getCityImage(city),
            count: db.getPlacesByCity(city).length
        }));
        res.json(cities);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cities' });
    }
});



router.get('/weather/:city', async (req, res) => {
    try {
        const result = await weatherAgent.getWeather(req.params.city);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather' });
    }
});



router.post('/session', (req, res) => {
    try {
        const id = generateId();
        db.createSession(id);
        res.json({ sessionId: id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create session' });
    }
});

router.get('/session/:id/history', (req, res) => {
    try {
        const history = db.getSessionHistory(req.params.id);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});



router.get('/health', async (req, res) => {
    const llmHealth = await llm.healthCheck();
    res.json({
        status: 'ok',
        places: db.getPlacesCount(),
        cities: db.getCities(),
        llm: llmHealth
    });
});

module.exports = router;
