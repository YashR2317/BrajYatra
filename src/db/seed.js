

const path = require('path');
const fs = require('fs');
const { getDB, getPlacesCount } = require('./database');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');

const CITY_FILES = {
    'Mathura': 'MATHURA.json',
    'Vrindavan': 'VRINDAVAN.json',
    'Agra': 'AGRA.json',
    'Govardhan': 'GOVARDHAN.json',
    'Barsana': 'BARSANA.json',
    'Gokul': 'GOKUL.json'
};

function seed() {
    const db = getDB();
    const existing = getPlacesCount();

    if (existing > 0) {
        console.log(`[Seed] Database already has ${existing} places. Skipping seed.`);
        return existing;
    }

    console.log('[Seed] Starting database seed...');

    const insert = db.prepare(`
        INSERT OR IGNORE INTO places
        (id, city, name, category, address, lat, lng, description,
         opening_hours, entry_fee, highlight, popularity_rank, tags,
         estimated_visit_duration, crowd_level, best_time_to_visit,
         nearby_places, google_maps_link, images, source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((places) => {
        for (const p of places) {
            insert.run(
                p.id,
                p.city,
                p.name,
                p.category,
                p.address || '',
                p.coordinates?.lat || null,
                p.coordinates?.lng || null,
                p.description || '',
                p.opening_hours || 'Varies',
                p.entry_fee || null,
                p.highlight ? 1 : 0,
                p.popularity_rank || 999,
                JSON.stringify(p.tags || []),
                p.estimated_visit_duration || 45,
                p.crowd_level || 'medium',
                p.best_time_to_visit || '',
                JSON.stringify(p.nearby_places || []),
                p.google_maps_link || '',
                JSON.stringify(p.images || []),
                p.source || ''
            );
        }
    });

    let totalInserted = 0;

    for (const [city, filename] of Object.entries(CITY_FILES)) {
        const filePath = path.join(DATA_DIR, filename);

        if (!fs.existsSync(filePath)) {
            console.warn(`[Seed] File not found: ${filename}, skipping ${city}`);
            continue;
        }

        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);

        
        const placeKey = Object.keys(data).find(k => k.endsWith('_places'));
        if (!placeKey) {
            console.warn(`[Seed] No places key found in ${filename}`);
            continue;
        }

        const places = data[placeKey].map(p => ({ ...p, city }));
        insertMany(places);
        totalInserted += places.length;
        console.log(`[Seed] ${city}: ${places.length} places inserted`);
    }

    
    db.exec("INSERT INTO places_fts(places_fts) VALUES('rebuild')");

    console.log(`[Seed] ✅ Total: ${totalInserted} places seeded`);
    return totalInserted;
}


if (require.main === module) {
    const count = seed();
    console.log(`Seeding complete. ${count} places in database.`);
    process.exit(0);
}

module.exports = { seed };
