

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { seed } = require('./db/seed');
const { getPlacesCount } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));


const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


async function start() {
    console.log('╔══════════════════════════════════════════╗');
    console.log('║     🙏 BrajYatra AI Multi-Agent System    ║');
    console.log('╚══════════════════════════════════════════╝');

    
    const count = getPlacesCount();
    if (count === 0) {
        console.log('[Init] Seeding database...');
        seed();
    } else {
        console.log(`[Init] Database has ${count} places`);
    }

    app.listen(PORT, () => {
        console.log(`[Server] Running on http://localhost:${PORT}`);
        console.log(`[Server] LLM Mode: ${process.env.LLM_MODE || 'gemini'}`);
        console.log(`[Server] Ready to plan your Braj Yatra! 🛕`);
    });
}

start().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
