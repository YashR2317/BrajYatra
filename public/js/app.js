/**
 * BrajYatra — AI Tirth Companion
 * Frontend Chat Application with i18n, Questionnaire, Itinerary Editing, Google Maps Links
 */

(function () {
    // ==================== i18n Translations ====================
    const TRANSLATIONS = {
        en: {
            logo_sub: 'Hare Krishna · AI Tirth Companion',
            new_chat: 'New Chat',
            quick_actions: '🪷 Quick Actions',
            plan_yatra: 'Plan Yatra (Questionnaire)',
            darshan_guide: 'Temple Darshan Guide',
            weather: 'Weather',
            krishna_leela: 'Krishna Leela & History',
            prasadam: 'Prasadam & Food',
            parikrama: 'Braj Parikrama',
            connecting: 'Connecting...',
            welcome_title: 'BRAJYATRA.AI',
            welcome_tagline: 'Where Travel meets Tradition',
            welcome_desc: 'Your AI-powered Tirth Companion for the sacred Braj Dham — walk the land where Shri Krishna performed His divine leelas.',
            card_plan: 'Plan Your Yatra',
            card_plan_desc: 'Custom itinerary with preferences',
            card_darshan: 'Temple Darshan',
            card_darshan_desc: 'Sacred temples & divine darshan',
            card_festivals: 'Festivals & Events',
            card_festivals_desc: 'Sacred festivals & celebrations',
            card_parikrama: 'Parikrama Guide',
            card_parikrama_desc: 'Sacred circumambulation routes',
            input_placeholder: 'Ask about Braj Dham, plan a Yatra...',
            input_hint: 'BrajYatra · Plan Yatra · Darshan Guide · Weather · Krishna Leelas',
            modal_title: 'Plan Your Sacred Yatra',
            modal_desc: 'Tell us your preferences for a personalized itinerary',
            q1_title: '🙏 Yatra Type',
            q1_desc: 'What kind of journey calls to your soul?',
            q1_opt1: 'Tirth Yatra',
            q1_opt1_desc: 'Sacred pilgrimage & temple darshan',
            q1_opt2: 'Cultural Tour',
            q1_opt2_desc: 'Culture, heritage & monuments',
            q1_opt3: 'Complete Braj Yatra',
            q1_opt3_desc: 'Complete tour — temples, heritage & nature',
            q1_opt4: 'Custom Mix',
            q1_opt4_desc: "I'll pick my own interests",
            q2_title: '📅 Yatra Duration',
            q2_desc: 'How many days for your sacred journey?',
            q3_title: '📍 Sacred Destinations',
            q3_desc: 'Select the holy cities you wish to visit',
            q4_title: '🪷 Your Interests',
            q4_desc: 'What experiences are you seeking? (Select multiple)',
            int_temple: '🛕 Temple Darshan',
            int_ghat: '🌊 Ghat & Holy Bath',
            int_food: '🍛 Prasadam & Food',
            int_heritage: '🏛️ Heritage & Monuments',
            int_market: '🛍️ Bazaar & Shopping',
            int_nature: '🌿 Nature & Parikrama',
            int_aarti: '🪔 Aarti & Kirtan',
            int_festival: '🎉 Festivals & Events',
            q5_title: '🚶 Pace & Group',
            q5_pace: 'Your preferred pace:',
            pace_relaxed: '🧘 Relaxed',
            pace_relaxed_desc: 'Fewer places, more time at each',
            pace_moderate: '⚖️ Moderate',
            pace_moderate_desc: 'Balanced pace',
            pace_intensive: '🏃 Intensive',
            pace_intensive_desc: 'Cover maximum places',
            q5_group: 'Travelling as:',
            grp_solo: '🧑 Solo',
            grp_couple: '💑 Couple',
            grp_family: '👨‍👩‍👧 Family',
            grp_group: '👥 Group',
            btn_back: '← Back',
            btn_next: 'Next →',
            btn_submit: '🙏 Plan My Yatra',
            error_msg: "I'm having trouble connecting. Please try again. 🙏",
            edit_itinerary: '✏️ Edit',
            done_editing: '✅ Done',
            add_place: '+ Add Place',
            view_day_route: '📍 View Day Route on Maps',
            view_full_route: '📍 View Full Route on Google Maps →',
            view_city_route: '📍 View {city} Route on Maps',
            online_status: 'Online',
            server_offline: 'Server Offline',
            llm_offline: 'LLM Offline',
            q6_title: '📍 Starting Point & Time',
            q6_desc: 'Where are you starting from and when do you arrive?',
            q6_from_label: 'Starting from (city, station, or airport):',
            q6_from_placeholder: 'e.g. Delhi, Agra Cantt Station, Mathura Junction',
            q6_first_city: 'Which city do you want to visit first?',
            q6_time_label: 'Arrival / Start time:',
            time_morning: '🌅 Early Morning (5-7 AM)',
            time_forenoon: '☀️ Forenoon (8-10 AM)',
            time_afternoon: '🌤️ Afternoon (12-2 PM)',
            time_evening: '🌇 Evening (4-6 PM)',
            query_darshan: 'Recommend the best temples for darshan in Vrindavan',
            query_weather: "What's the weather like in Mathura today?",
            query_krishna: "Tell me about the significance of Braj Dham and Lord Krishna's leelas",
            query_prasadam: 'Recommend must-try prasadam and local food in Mathura and Vrindavan',
            query_parikrama: 'Plan a complete Braj 84 Kos Parikrama covering all sacred places',
            query_plan: 'Plan Your Yatra',
            query_festivals: 'Tell me about upcoming festivals and events in Braj Dham'
        },
        hi: {
            logo_sub: 'हरे कृष्ण · AI तीर्थ साथी',
            new_chat: 'नई वार्ता',
            quick_actions: '🪷 त्वरित विकल्प',
            plan_yatra: 'यात्रा योजना (प्रश्नावली)',
            darshan_guide: 'मंदिर दर्शन गाइड',
            weather: 'मौसम',
            krishna_leela: 'कृष्ण लीला एवं इतिहास',
            prasadam: 'प्रसादम एवं भोजन',
            parikrama: 'ब्रज परिक्रमा',
            connecting: 'कनेक्ट हो रहा है...',
            welcome_title: 'BRAJYATRA.AI',
            welcome_tagline: 'जहाँ यात्रा परंपरा से मिलती है',
            welcome_desc: 'पवित्र ब्रज धाम के लिए आपका AI तीर्थ साथी — उस भूमि पर चलें जहाँ श्री कृष्ण ने अपनी दिव्य लीलाएँ कीं।',
            card_plan: 'अपनी यात्रा की योजना बनाएं',
            card_plan_desc: 'अपनी पसंद के अनुसार यात्रा कार्यक्रम',
            card_darshan: 'मंदिर दर्शन',
            card_darshan_desc: 'पवित्र मंदिर एवं दिव्य दर्शन',
            card_festivals: 'उत्सव एवं पर्व',
            card_festivals_desc: 'पवित्र त्यौहार एवं उत्सव',
            card_parikrama: 'परिक्रमा गाइड',
            card_parikrama_desc: 'पवित्र परिक्रमा मार्ग',
            input_placeholder: 'ब्रज धाम के बारे में पूछें, यात्रा की योजना बनाएं...',
            input_hint: 'ब्रजयात्रा · यात्रा योजना · दर्शन गाइड · मौसम · कृष्ण लीला',
            modal_title: 'अपनी पवित्र यात्रा की योजना बनाएं',
            modal_desc: 'व्यक्तिगत यात्रा कार्यक्रम के लिए अपनी प्राथमिकताएँ बताएं',
            q1_title: '🙏 यात्रा प्रकार',
            q1_desc: 'आपकी आत्मा किस प्रकार की यात्रा चाहती है?',
            q1_opt1: 'तीर्थ यात्रा',
            q1_opt1_desc: 'पवित्र तीर्थयात्रा एवं मंदिर दर्शन',
            q1_opt2: 'सांस्कृतिक दर्शन',
            q1_opt2_desc: 'संस्कृति, विरासत एवं स्मारक',
            q1_opt3: 'पूर्ण ब्रज यात्रा',
            q1_opt3_desc: 'संपूर्ण दौरा — मंदिर, विरासत एवं प्रकृति',
            q1_opt4: 'कस्टम मिक्स',
            q1_opt4_desc: 'मैं अपनी रुचियाँ चुनूँगा',
            q2_title: '📅 यात्रा अवधि',
            q2_desc: 'आपकी पवित्र यात्रा कितने दिनों की?',
            q3_title: '📍 पवित्र गंतव्य',
            q3_desc: 'उन पवित्र शहरों का चयन करें जिनकी आप यात्रा करना चाहते हैं',
            q4_title: '🪷 आपकी रुचियाँ',
            q4_desc: 'आप किन अनुभवों की तलाश में हैं? (एक से अधिक चुनें)',
            int_temple: '🛕 मंदिर दर्शन',
            int_ghat: '🌊 घाट एवं स्नान',
            int_food: '🍛 प्रसादम एवं भोजन',
            int_heritage: '🏛️ विरासत एवं स्मारक',
            int_market: '🛍️ बाज़ार एवं खरीदारी',
            int_nature: '🌿 प्रकृति एवं परिक्रमा',
            int_aarti: '🪔 आरती एवं कीर्तन',
            int_festival: '🎉 उत्सव एवं त्यौहार',
            q5_title: '🚶 गति एवं समूह',
            q5_pace: 'आपकी पसंदीदा गति:',
            pace_relaxed: '🧘 सहज',
            pace_relaxed_desc: 'कम स्थान, प्रत्येक पर अधिक समय',
            pace_moderate: '⚖️ मध्यम',
            pace_moderate_desc: 'संतुलित गति',
            pace_intensive: '🏃 उत्साही',
            pace_intensive_desc: 'अधिकतम स्थानों पर जाएं',
            q5_group: 'यात्रा किसके साथ:',
            grp_solo: '🧑 अकेले',
            grp_couple: '💑 जोड़ा',
            grp_family: '👨‍👩‍👧 परिवार',
            grp_group: '👥 समूह',
            btn_back: '← पीछे',
            btn_next: 'आगे →',
            btn_submit: '🙏 मेरी यात्रा की योजना बनाएं',
            error_msg: 'कृपया पुनः प्रयास करें 🙏 कनेक्ट करने में समस्या हो रही है।',
            edit_itinerary: '✏️ संपादित करें',
            done_editing: '✅ पूर्ण',
            add_place: '+ स्थान जोड़ें',
            view_day_route: '📍 दिन का मार्ग मानचित्र पर देखें',
            view_full_route: '📍 पूरा मार्ग Google Maps पर देखें →',
            view_city_route: '📍 {city} का मार्ग मानचित्र पर देखें',
            online_status: 'ऑनलाइन',
            server_offline: 'सर्वर ऑफ़लाइन',
            llm_offline: 'LLM ऑफ़लाइन',
            q6_title: '📍 प्रारंभ स्थान एवं समय',
            q6_desc: 'आप कहाँ से आ रहे हैं और कब पहुँचेंगे?',
            q6_from_label: 'प्रारंभ स्थान (शहर, स्टेशन, या हवाई अड्डा):',
            q6_from_placeholder: 'जैसे दिल्ली, आगरा कैंट स्टेशन, मथुरा जंक्शन',
            q6_first_city: 'पहले कौन सा शहर देखना चाहेंगे?',
            q6_time_label: 'आगमन / प्रारंभ समय:',
            time_morning: '🌅 सुबह जल्दी (5-7 AM)',
            time_forenoon: '☀️ सुबह (8-10 AM)',
            time_afternoon: '🌤️ दोपहर (12-2 PM)',
            time_evening: '🌇 शाम (4-6 PM)',
            query_darshan: 'वृन्दावन में दर्शन के लिए सर्वश्रेष्ठ मंदिरों की सिफारिश करें',
            query_weather: 'आज मथुरा में मौसम कैसा है?',
            query_krishna: 'ब्रज धाम और भगवान श्री कृष्ण की लीलाओं के बारे में बताएं',
            query_prasadam: 'मथुरा और वृन्दावन में जरूर खाने वाले प्रसादम और स्थानीय भोजन की सिफारिश करें',
            query_parikrama: 'सभी पवित्र स्थलों को कवर करते हुए पूर्ण ब्रज 84 कोस परिक्रमा की योजना बनाएं',
            query_plan: 'अपनी यात्रा की योजना बनाएं',
            query_festivals: 'ब्रज धाम में आने वाले त्यौहारों और उत्सवों के बारे में बताएं'
        }
    };

    // ==================== State ====================
    let sessionId = localStorage.getItem('brajyatra_session') || null;
    let currentLanguage = localStorage.getItem('brajyatra_lang') || 'en';
    let isLoading = false;
    let currentStep = 1;
    const totalSteps = 6;
    let currentItinerary = null;
    let editMode = false;

    const prefs = {
        yatraType: '',
        days: 3,
        cities: [],
        interests: [],
        pace: 'moderate',
        group: 'family',
        startLocation: '',
        firstCity: '',
        startTime: 'forenoon'
    };

    const CITY_IMAGES = {
        'Mathura': '/assets/images/krishna_janmabhoomi.png',
        'Vrindavan': '/assets/images/banke_bihari.png',
        'Agra': '/assets/images/taj_mahal.png',
        'Govardhan': '/assets/images/govardhan_hill.png',
        'Barsana': '/assets/images/radha_rani_temple.png',
        'Gokul': '/assets/images/nand_bhavan.png'
    };

    const PLACE_IMAGES = {
        'krishna_janmabhoomi': '/assets/images/krishna_janmabhoomi.png',
        'janmabhoomi': '/assets/images/krishna_janmabhoomi.png',
        'janmasthan': '/assets/images/krishna_janmabhoomi.png',
        'dwarkadhish': '/assets/images/krishna_janmabhoomi.png',
        'banke bihari': '/assets/images/banke_bihari.png',
        'prem mandir': '/assets/images/prem_mandir.png',
        'iskcon': '/assets/images/prem_mandir.png',
        'taj mahal': '/assets/images/taj_mahal.png',
        'agra fort': '/assets/images/taj_mahal.png',
        'govardhan': '/assets/images/govardhan_hill.png',
        'parikrama': '/assets/images/govardhan_hill.png',
        'manasi ganga': '/assets/images/govardhan_hill.png',
        'radha rani': '/assets/images/radha_rani_temple.png',
        'barsana': '/assets/images/radha_rani_temple.png',
        'nand bhavan': '/assets/images/nand_bhavan.png',
        'raman reti': '/assets/images/nand_bhavan.png',
        'gokul': '/assets/images/nand_bhavan.png',
        'vishram ghat': '/assets/images/vishram_ghat.png',
        'yamuna': '/assets/images/vishram_ghat.png',
    };

    const CATEGORY_IMAGES = {
        'temple': '/assets/images/krishna_janmabhoomi.png',
        'ghat': '/assets/images/vishram_ghat.png',
        'monument': '/assets/images/taj_mahal.png',
        'market': '/assets/images/banke_bihari.png',
        'nature': '/assets/images/govardhan_hill.png',
        'heritage': '/assets/images/taj_mahal.png',
        'religious': '/assets/images/prem_mandir.png',
    };

    // ==================== DOM ====================
    const messagesContainer = document.getElementById('messages-container');
    const welcomeScreen = document.getElementById('welcome-screen');
    const messageInput = document.getElementById('message-input');
    const btnSend = document.getElementById('btn-send');
    const btnNewChat = document.getElementById('btn-new-chat');
    const btnMenu = document.getElementById('btn-menu');
    const sidebar = document.getElementById('sidebar');
    const llmStatus = document.getElementById('llm-status');

    const modal = document.getElementById('questionnaire-modal');
    const modalClose = document.getElementById('modal-close');
    const btnBack = document.getElementById('q-back');
    const btnNext = document.getElementById('q-next');
    const btnSubmit = document.getElementById('q-submit');

    // ==================== i18n ====================
    function t(key) {
        return (TRANSLATIONS[currentLanguage] && TRANSLATIONS[currentLanguage][key]) || TRANSLATIONS.en[key] || key;
    }

    function setLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('brajyatra_lang', lang);

        // Update toggle buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update all data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = t(key);
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = t(key);
        });

        // Update welcome desc with HTML formatting
        const descEl = document.querySelector('[data-i18n="welcome_desc"]');
        if (descEl) {
            if (lang === 'en') {
                descEl.innerHTML = 'Your AI-powered <em>Tirth Companion</em> for the sacred <strong>Braj Dham</strong> — walk the land where <strong>Shri Krishna</strong> performed His divine leelas.';
            } else {
                descEl.innerHTML = 'पवित्र <strong>ब्रज धाम</strong> के लिए आपका AI <em>तीर्थ साथी</em> — उस भूमि पर चलें जहाँ <strong>श्री कृष्ण</strong> ने अपनी दिव्य लीलाएँ कीं।';
            }
        }
    }

    // ==================== Theme ====================
    function initTheme() {
        const saved = localStorage.getItem('brajyatra_theme') || 'light';
        applyTheme(saved);
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('brajyatra_theme', theme);
        // Update meta theme-color
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.content = theme === 'dark' ? '#0d1421' : '#fef9ef';
        // Update toggle button
        const btn = document.getElementById('theme-toggle-btn');
        if (btn) {
            const icon = btn.querySelector('.theme-icon');
            const label = btn.querySelector('.theme-label');
            if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
            if (label) label.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
        }
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
    }

    // ==================== Init ====================
    function init() {
        initTheme();
        bindEvents();
        setLanguage(currentLanguage);
        checkHealth();
        loadCities();
        autoResizeTextarea();
    }

    function bindEvents() {
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

        const collapseBtn = document.getElementById('sidebar-collapse-btn');
        if (collapseBtn) {
            collapseBtn.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                localStorage.setItem('brajyatra_sidebar', sidebar.classList.contains('collapsed') ? 'collapsed' : 'expanded');
            });
            if (localStorage.getItem('brajyatra_sidebar') === 'collapsed') {
                sidebar.classList.add('collapsed');
            }
        }

        btnSend.addEventListener('click', handleSend);
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
        });
        messageInput.addEventListener('input', () => {
            btnSend.disabled = messageInput.value.trim().length === 0;
            autoResizeTextarea();
        });

        btnNewChat.addEventListener('click', startNewChat);

        // Language toggle
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
        });

        // Quick action & welcome card clicks
        document.querySelectorAll('.quick-btn, .welcome-card').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const queryKey = btn.dataset.queryKey;
                if (action === 'questionnaire') {
                    openQuestionnaire();
                } else if (queryKey) {
                    messageInput.value = t(queryKey);
                    handleSend();
                } else if (action) {
                    messageInput.value = action;
                    handleSend();
                }
            });
        });

        if (btnMenu) btnMenu.addEventListener('click', toggleSidebar);

        modalClose.addEventListener('click', closeQuestionnaire);
        btnBack.addEventListener('click', prevStep);
        btnNext.addEventListener('click', nextStep);
        btnSubmit.addEventListener('click', submitQuestionnaire);

        bindQuestionnaireEvents();
    }

    function autoResizeTextarea() {
        messageInput.style.height = 'auto';
        messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
    }

    // ==================== City Loading ====================
    async function loadCities() {
        try {
            const res = await fetch('/api/cities');
            const cities = await res.json();
            renderWelcomeCities(cities);
            renderQuestionnaireCities(cities);
        } catch (e) {
            const fallback = Object.keys(CITY_IMAGES).map(name => ({
                name, image: CITY_IMAGES[name], count: 20
            }));
            renderWelcomeCities(fallback);
            renderQuestionnaireCities(fallback);
        }
    }

    function renderWelcomeCities(cities) {
        const container = document.getElementById('welcome-cities');
        if (!container) return;
        container.innerHTML = cities.map(c => `
            <div class="city-card">
                <img src="${c.image}" alt="${c.name}" loading="lazy">
                <div class="city-name">${c.name}</div>
            </div>
        `).join('');
    }

    function renderQuestionnaireCities(cities) {
        const container = document.getElementById('q-cities');
        if (!container) return;
        container.innerHTML = cities.map(c => `
            <div class="q-city" data-value="${c.name}">
                <img src="${c.image}" alt="${c.name}" loading="lazy">
                <div class="q-city-label">${c.name}<span class="q-city-count">${c.count} places</span></div>
            </div>
        `).join('');

        container.querySelectorAll('.q-city').forEach(el => {
            el.addEventListener('click', () => {
                el.classList.toggle('selected');
                updatePrefs();
            });
        });
    }

    // ==================== Health Check ====================
    async function checkHealth() {
        try {
            const res = await fetch('/api/health');
            const data = await res.json();
            const dot = llmStatus.querySelector('.status-dot');
            const text = llmStatus.querySelector('.status-text');
            if (data.llm && data.llm.available) {
                dot.className = 'status-dot online';
                text.textContent = `${t('online_status')} · ${data.places} tirth sthals`;
            } else {
                dot.className = 'status-dot offline';
                text.textContent = t('llm_offline');
            }
        } catch {
            const dot = llmStatus.querySelector('.status-dot');
            const text = llmStatus.querySelector('.status-text');
            dot.className = 'status-dot offline';
            text.textContent = t('server_offline');
        }
    }

    // ==================== Questionnaire ====================
    function openQuestionnaire() {
        currentStep = 1;
        resetQuestionnaire();
        modal.classList.add('active');
        showStep(1);
        closeSidebar();
    }

    function closeQuestionnaire() { modal.classList.remove('active'); }

    function resetQuestionnaire() {
        prefs.yatraType = '';
        prefs.days = 3;
        prefs.cities = [];
        prefs.interests = [];
        prefs.pace = 'moderate';
        prefs.group = 'family';
        prefs.startLocation = '';
        prefs.firstCity = '';
        prefs.startTime = 'forenoon';
        document.querySelectorAll('.q-option.selected, .q-city.selected, .q-chip.selected, .q-chip-sm.selected').forEach(el => el.classList.remove('selected'));
        document.querySelectorAll('.q-day-btn').forEach(el => el.classList.toggle('active', el.dataset.value === '3'));
        document.querySelectorAll('.q-option-sm').forEach(el => {
            el.classList.remove('active', 'selected');
            if (el.dataset.value === 'moderate') el.classList.add('active');
        });
        document.querySelectorAll('.q-time-options .q-chip-sm').forEach(el => {
            el.classList.remove('active', 'selected');
            if (el.dataset.value === 'forenoon') el.classList.add('active');
        });
        const startInput = document.getElementById('q-start-location');
        if (startInput) startInput.value = '';
    }

    function showStep(step) {
        currentStep = step;
        for (let i = 1; i <= totalSteps; i++) {
            const el = document.getElementById(`q-step-${i}`);
            if (el) el.classList.toggle('hidden', i !== step);
        }
        document.querySelectorAll('.step-dot').forEach(dot => {
            const s = parseInt(dot.dataset.step);
            dot.classList.remove('active', 'done');
            if (s === step) dot.classList.add('active');
            else if (s < step) dot.classList.add('done');
        });
        btnBack.classList.toggle('hidden', step === 1);
        btnNext.classList.toggle('hidden', step === totalSteps);
        btnSubmit.classList.toggle('hidden', step !== totalSteps);

        // When entering step 6, populate first city options from selected cities
        if (step === 6) {
            populateFirstCityOptions();
        }
    }

    function nextStep() { if (currentStep < totalSteps) showStep(currentStep + 1); }
    function prevStep() { if (currentStep > 1) showStep(currentStep - 1); }

    function bindQuestionnaireEvents() {
        document.querySelectorAll('#q-step-1 .q-option').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#q-step-1 .q-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                prefs.yatraType = btn.dataset.value;
            });
        });
        document.querySelectorAll('.q-day-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.q-day-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                prefs.days = parseInt(btn.dataset.value);
            });
        });
        document.querySelectorAll('#q-step-4 .q-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('selected');
                updatePrefs();
            });
        });
        document.querySelectorAll('.q-pace .q-option-sm').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.q-pace .q-option-sm').forEach(b => b.classList.remove('active', 'selected'));
                btn.classList.add('active');
                prefs.pace = btn.dataset.value;
            });
        });
        document.querySelectorAll('.q-group .q-chip-sm').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.q-group .q-chip-sm').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                prefs.group = btn.dataset.value;
            });
        });

        // Step 6: Start time selection
        document.querySelectorAll('.q-time-options .q-chip-sm').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.q-time-options .q-chip-sm').forEach(b => b.classList.remove('active', 'selected'));
                btn.classList.add('active');
                prefs.startTime = btn.dataset.value;
            });
        });
    }

    function populateFirstCityOptions() {
        const container = document.getElementById('q-first-city');
        if (!container) return;
        const selectedCities = prefs.cities.length > 0 ? prefs.cities : Object.keys(CITY_IMAGES);
        container.innerHTML = selectedCities.map(city => `
            <button class="q-chip-sm${prefs.firstCity === city ? ' selected' : ''}" data-value="${city}">${city}</button>
        `).join('');
        container.querySelectorAll('.q-chip-sm').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.q-chip-sm').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                prefs.firstCity = btn.dataset.value;
            });
        });
    }

    function updatePrefs() {
        prefs.cities = Array.from(document.querySelectorAll('.q-city.selected')).map(el => el.dataset.value);
        prefs.interests = Array.from(document.querySelectorAll('#q-step-4 .q-chip.selected')).map(el => el.dataset.value);
    }

    function submitQuestionnaire() {
        updatePrefs();
        // Capture step 6 fields
        const startInput = document.getElementById('q-start-location');
        if (startInput) prefs.startLocation = startInput.value.trim();

        closeQuestionnaire();

        const yatraNames = {
            'pilgrimage': 'Tirth Yatra (pilgrimage focused)',
            'cultural': 'Cultural Heritage Tour',
            'complete': 'Complete Braj Yatra (full tour)',
            'mixed': 'custom mix'
        };
        const paceNames = {
            'relaxed': 'relaxed',
            'moderate': 'moderate',
            'intensive': 'intensive (cover maximum)'
        };
        const timeNames = {
            'morning': 'early morning (5-7 AM)',
            'forenoon': 'forenoon (8-10 AM)',
            'afternoon': 'afternoon (12-2 PM)',
            'evening': 'evening (4-6 PM)'
        };
        const cities = prefs.cities.length > 0 ? prefs.cities.join(', ') : 'Mathura, Vrindavan';
        const interests = prefs.interests.length > 0 ? prefs.interests.join(', ') : 'temples, heritage, food';
        const yatraType = yatraNames[prefs.yatraType] || 'spiritual journey';

        let cityOrder = '';

        let startInfo = '';

        const startTimeStr = timeNames[prefs.startTime] || 'forenoon';

        let msg;
        if (currentLanguage === 'hi') {
            if (prefs.firstCity) cityOrder = ` यात्रा ${prefs.firstCity} से शुरू करें।`;
            if (prefs.startLocation) startInfo = ` मैं ${prefs.startLocation} से यात्रा कर रहा/रही हूँ।`;
            msg = `${cities} को कवर करते हुए ${prefs.days}-दिन की ${yatraType} यात्रा की योजना बनाएं। मेरी रुचियाँ: ${interests}। गति: ${paceNames[prefs.pace] || 'मध्यम'}। यात्रा समूह: ${prefs.group || 'परिवार'}।${startInfo}${cityOrder} मैं ${startTimeStr} में पहुँचूँगा/शुरू करूँगा। प्रत्येक शहर के लिए अलग Google Maps मार्ग बनाएं। दर्शन के लिए सर्वश्रेष्ठ मंदिर, स्थानीय प्रसादम की सिफारिशें, और व्यावहारिक सुझाव शामिल करें।`;
        } else {
            if (prefs.firstCity) cityOrder = ` Start the itinerary from ${prefs.firstCity} first.`;
            if (prefs.startLocation) startInfo = ` I am travelling from ${prefs.startLocation}.`;
            msg = `Plan a ${prefs.days}-day ${yatraType} itinerary covering ${cities}. My interests include: ${interests}. Pace: ${paceNames[prefs.pace] || 'moderate'}. Travelling as: ${prefs.group || 'family'}.${startInfo}${cityOrder} I will arrive/start in the ${startTimeStr}. Generate separate Google Maps routes for each city. Include the best temples for darshan, local prasadam recommendations, and practical tips.`;
        }

        messageInput.value = msg;
        handleSend();
    }

    // ==================== Chat Flow ====================
    async function handleSend() {
        const text = messageInput.value.trim();
        if (!text || isLoading) return;

        if (welcomeScreen) welcomeScreen.style.display = 'none';
        appendMessage('user', text);
        messageInput.value = '';
        messageInput.style.height = 'auto';
        btnSend.disabled = true;

        const typingEl = showTyping();
        isLoading = true;

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, sessionId, language: currentLanguage })
            });
            const data = await res.json();

            if (data.sessionId) {
                sessionId = data.sessionId;
                localStorage.setItem('brajyatra_session', sessionId);
            }

            removeTyping(typingEl);

            switch (data.type) {
                case 'itinerary':
                    renderItinerary(data.itinerary);
                    break;
                case 'recommend':
                    renderRecommendations(data.recommendations, data.summary);
                    break;
                default:
                    appendMessage('assistant', data.text);
            }
        } catch (error) {
            removeTyping(typingEl);
            appendMessage('assistant', t('error_msg'));
        }

        isLoading = false;
        scrollToBottom();
        closeSidebar();
    }

    // ==================== Google Maps Helpers ====================
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

    function buildPlaceMapUrl(placeName, city) {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName + ', ' + (city || '') + ', India')}`;
    }

    function buildDayRouteUrl(dayData) {
        const stops = (dayData.slots || [])
            .filter(s => isActualPlace(s))
            .map(s => `${s.place}, ${dayData.city || ''}, India`);
        if (stops.length < 2) {
            return stops.length === 1
                ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stops[0])}`
                : null;
        }
        const origin = encodeURIComponent(stops[0]);
        const destination = encodeURIComponent(stops[stops.length - 1]);
        const waypoints = stops.slice(1, -1).map(s => encodeURIComponent(s)).join('|');
        let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
        if (waypoints) url += `&waypoints=${waypoints}`;
        return url;
    }

    // ==================== Image Helpers ====================
    function getPlaceImage(placeName, city, category) {
        if (!placeName) return CITY_IMAGES[city] || '/assets/images/krishna_janmabhoomi.png';
        const lower = placeName.toLowerCase();
        for (const [key, url] of Object.entries(PLACE_IMAGES)) {
            if (lower.includes(key)) return url;
        }
        if (city && CITY_IMAGES[city]) return CITY_IMAGES[city];
        if (category && CATEGORY_IMAGES[category.toLowerCase()]) return CATEGORY_IMAGES[category.toLowerCase()];
        return '/assets/images/krishna_janmabhoomi.png';
    }

    // ==================== Message Rendering ====================
    function appendMessage(role, text) {
        const div = document.createElement('div');
        div.className = `message ${role}`;
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = role === 'user' ? '🙏' : 'ॐ';

        const content = document.createElement('div');
        content.className = 'message-content';
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = role === 'assistant' ? renderMarkdown(text) : escapeHtml(text);

        content.appendChild(bubble);
        div.appendChild(avatar);
        div.appendChild(content);
        messagesContainer.appendChild(div);
        scrollToBottom();
    }

    // ==================== Itinerary Rendering ====================
    function renderItinerary(itinerary) {
        if (!itinerary) return appendMessage('assistant', 'Could not generate itinerary. Please try again.');

        currentItinerary = JSON.parse(JSON.stringify(itinerary)); // deep clone for editing

        const card = document.createElement('div');
        card.className = 'itinerary-card';
        card.id = 'itinerary-card-' + Date.now();

        // Header with edit toggle
        const header = document.createElement('div');
        header.className = 'itinerary-header';
        header.innerHTML = `
            <div class="itinerary-header-top">
                <h2>🛕 ${escapeHtml(itinerary.title || 'Your Sacred Yatra')}</h2>
                <button class="edit-toggle-btn" id="edit-toggle-${card.id}">${t('edit_itinerary')}</button>
            </div>
            <p>${escapeHtml(itinerary.summary || '')}</p>
            <div class="itinerary-meta">
                ${itinerary.days ? `<span class="meta-badge">📅 ${itinerary.days.length} Day${itinerary.days.length > 1 ? 's' : ''}</span>` : ''}
                ${itinerary.best_season ? `<span class="meta-badge">🌸 ${escapeHtml(itinerary.best_season)}</span>` : ''}
                ${itinerary.total_estimated_hours ? `<span class="meta-badge">⏱️ ~${Math.round(itinerary.total_estimated_hours)}h total</span>` : ''}
            </div>
        `;
        card.appendChild(header);

        // Live Weather Banner
        const weather = itinerary.live_weather;
        if (weather) {
            const weatherDiv = document.createElement('div');
            weatherDiv.className = 'weather-banner';
            const weatherEmoji = weather.is_rainy ? '🌧️' : weather.is_hot ? '☀️' : weather.is_cold ? '🥶' : '🌤️';
            weatherDiv.innerHTML = `
                <span class="weather-icon">${weatherEmoji}</span>
                <div class="weather-info">
                    <span class="weather-temp">${weather.temp}°C</span>
                    <span class="weather-desc"> · ${escapeHtml(weather.description)} in ${escapeHtml(weather.city)}</span>
                </div>
                <div class="weather-details">
                    <span class="weather-detail">💧 ${weather.humidity}%</span>
                    <span class="weather-detail">💨 ${weather.wind_speed} m/s</span>
                    <span class="weather-detail">🌡️ Feels ${weather.feels_like}°C</span>
                </div>
                ${itinerary.weather_notes ? `<div class="weather-warning">⚠️ ${escapeHtml(itinerary.weather_notes)}</div>` : ''}
            `;
            card.appendChild(weatherDiv);
        }

        // Full Route button
        if (itinerary.google_maps_url) {
            const routeLink = document.createElement('a');
            routeLink.className = 'route-btn';
            routeLink.href = itinerary.google_maps_url;
            routeLink.target = '_blank';
            routeLink.rel = 'noopener';
            routeLink.innerHTML = t('view_full_route');
            card.appendChild(routeLink);
        }

        // Day data
        const days = itinerary.days || [];

        // Per-City Route Buttons Section
        const cityGroups = groupDaysByCity(days);
        if (Object.keys(cityGroups).length > 1) {
            const cityRoutesDiv = document.createElement('div');
            cityRoutesDiv.className = 'city-routes-section';
            for (const [city, cityDays] of Object.entries(cityGroups)) {
                const allStops = [];
                for (const day of cityDays) {
                    for (const slot of (day.slots || [])) {
                        if (isActualPlace(slot)) allStops.push(`${slot.place}, ${city}, India`);
                    }
                }
                if (allStops.length < 1) continue;
                let url;
                if (allStops.length === 1) {
                    url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(allStops[0])}`;
                } else {
                    const origin = encodeURIComponent(allStops[0]);
                    const destination = encodeURIComponent(allStops[allStops.length - 1]);
                    const waypoints = allStops.slice(1, -1).map(s => encodeURIComponent(s)).join('|');
                    url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
                    if (waypoints) url += `&waypoints=${waypoints}`;
                }
                const cityBtn = document.createElement('a');
                cityBtn.className = 'city-route-btn';
                cityBtn.href = url;
                cityBtn.target = '_blank';
                cityBtn.rel = 'noopener';
                cityBtn.innerHTML = `📍 ${escapeHtml(city)} Route on Maps`;
                cityRoutesDiv.appendChild(cityBtn);
            }
            card.appendChild(cityRoutesDiv);
        }

        // Day Tabs & Content
        try {
            if (days.length > 0) {
                const tabs = document.createElement('div');
                tabs.className = 'day-tabs';
                days.forEach((day, i) => {
                    const tab = document.createElement('button');
                    tab.className = `day-tab${i === 0 ? ' active' : ''}`;
                    tab.textContent = `Day ${day.day || i + 1}`;
                    tab.dataset.day = i;
                    tab.addEventListener('click', () => switchDay(card, i));
                    tabs.appendChild(tab);
                });
                card.appendChild(tabs);

                days.forEach((day, i) => {
                    const content = document.createElement('div');
                    content.className = `day-content${i > 0 ? ' hidden' : ''}`;
                    content.dataset.day = i;

                    if (day.overview) {
                        const overview = document.createElement('p');
                        overview.className = 'day-overview';
                        overview.textContent = day.overview;
                        content.appendChild(overview);
                    }

                    // Per-day route button
                    const dayRouteUrl = day.google_maps_url || buildDayRouteUrl(day);
                    if (dayRouteUrl) {
                        const dayRouteLink = document.createElement('a');
                        dayRouteLink.className = 'day-route-btn';
                        dayRouteLink.href = dayRouteUrl;
                        dayRouteLink.target = '_blank';
                        dayRouteLink.rel = 'noopener';
                        dayRouteLink.innerHTML = t('view_day_route');
                        dayRouteLink.dataset.dayIndex = i;
                        content.appendChild(dayRouteLink);
                    }

                    // Slots
                    const slotsContainer = document.createElement('div');
                    slotsContainer.className = 'slots-container';
                    slotsContainer.dataset.dayIndex = i;
                    (day.slots || []).forEach((slot, slotIdx) => {
                        try {
                            slotsContainer.appendChild(createSlotElement(slot, day.city, slotIdx, i));
                        } catch (slotErr) {
                            console.error('[BrajYatra] Error rendering slot:', slotIdx, slot, slotErr);
                        }
                    });
                    content.appendChild(slotsContainer);

                    // Add Place button (hidden until edit mode)
                    const addBtn = document.createElement('button');
                    addBtn.className = 'add-place-btn edit-only';
                    addBtn.textContent = t('add_place');
                    addBtn.dataset.dayIndex = i;
                    addBtn.addEventListener('click', () => showAddPlaceForm(addBtn, i, card));
                    content.appendChild(addBtn);

                    card.appendChild(content);
                });
            }
        } catch (dayErr) {
            console.error('[BrajYatra] Error rendering days:', dayErr);
        }

        // Tips
        const tips = itinerary.tips || [];
        if (tips.length > 0) {
            const tipsSection = document.createElement('div');
            tipsSection.className = 'itinerary-tips';
            tipsSection.innerHTML = `
                <h3>🪔 Yatra Tips</h3>
                <ul>${tips.map(tip => `<li>${escapeHtml(tip)}</li>`).join('')}</ul>
            `;
            card.appendChild(tipsSection);
        }

        // Budget Estimate
        const budget = itinerary.budget;
        if (budget && budget.total > 0) {
            const budgetSection = document.createElement('div');
            budgetSection.className = 'budget-section';

            const levelLabels = { low: '💰 Budget', medium: '💸 Moderate', high: '💎 Premium' };
            const levelLabel = levelLabels[budget.budget_level] || '💸 Moderate';
            const total = budget.total;
            const parts = [
                { label: 'Entry Fees', value: budget.entry_fees, color: '#e67e22', icon: '🎫' },
                { label: 'Food', value: budget.food, color: '#27ae60', icon: '🍛' },
                { label: 'Transport', value: budget.transport, color: '#3498db', icon: '🚗' },
                { label: 'Accommodation', value: budget.accommodation, color: '#9b59b6', icon: '🏨' }
            ].filter(p => p.value > 0);

            const barSegments = parts.map(p =>
                `<div class="budget-bar-segment" style="width:${(p.value / total * 100).toFixed(1)}%;background:${p.color}" title="${p.label}: ₹${p.value.toLocaleString('en-IN')}"></div>`
            ).join('');

            const breakdownRows = parts.map(p =>
                `<div class="budget-row">
                    <span class="budget-row-label"><span style="color:${p.color}">${p.icon}</span> ${p.label}</span>
                    <span class="budget-row-value">₹${p.value.toLocaleString('en-IN')}</span>
                </div>`
            ).join('');

            budgetSection.innerHTML = `
                <h3>💰 Estimated Budget</h3>
                <div class="budget-header-info">
                    <span class="budget-level-badge">${levelLabel}</span>
                    <span class="budget-people">${budget.people || 2} people · ${budget.days} day${budget.days > 1 ? 's' : ''}</span>
                </div>
                <div class="budget-total">
                    <span class="budget-total-label">Total Estimated Cost</span>
                    <span class="budget-total-value">₹${total.toLocaleString('en-IN')}</span>
                    <span class="budget-per-person">₹${(budget.per_person || 0).toLocaleString('en-IN')} per person</span>
                </div>
                <div class="budget-bar">${barSegments}</div>
                <div class="budget-breakdown">${breakdownRows}</div>
                ${budget.breakdown_note ? `<p class="budget-note">💡 ${escapeHtml(budget.breakdown_note)}</p>` : ''}
            `;
            card.appendChild(budgetSection);
        }

        // Alternate Indoor Recommendations
        const alternates = itinerary.alternate_indoor || [];
        if (alternates.length > 0) {
            const altSection = document.createElement('div');
            altSection.className = 'alternates-section';
            altSection.innerHTML = `
                <h3>🌧️ Indoor Alternatives (if weather turns bad)</h3>
                <ul>${alternates.map(a => `<li>${escapeHtml(a)}</li>`).join('')}</ul>
            `;
            card.appendChild(altSection);
        }

        messagesContainer.appendChild(card);

        // Bind edit toggle
        const editBtn = card.querySelector('.edit-toggle-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => toggleEditMode(card));
        }

        // Ensure scroll to bottom after itinerary renders fully
        scrollToBottom();
        setTimeout(scrollToBottom, 100);
        setTimeout(scrollToBottom, 500);
    }

    // Helper: group days by city for per-city routes
    function groupDaysByCity(days) {
        const groups = {};
        for (const day of (days || [])) {
            const city = day.city || 'Unknown';
            if (!groups[city]) groups[city] = [];
            groups[city].push(day);
        }
        return groups;
    }

    function createSlotElement(slot, city, slotIdx, dayIdx) {
        const slotEl = document.createElement('div');
        const isMeal = isMealSlot(slot);
        if (isMeal) slot.is_meal = true;

        const isPlace = isActualPlace(slot);
        const isTravel = !isPlace && !isMeal;

        let slotClass = 'time-slot';
        if (isMeal) slotClass += ' meal-slot';
        if (isTravel) slotClass += ' travel-slot';

        slotEl.className = slotClass;
        slotEl.dataset.slotIndex = slotIdx;
        slotEl.dataset.dayIndex = dayIdx;

        const mapUrl = isPlace ? (slot.google_maps_url || buildPlaceMapUrl(slot.place, city)) : '';

        const travelIcon = isTravel ? '🚗 ' : '';

        slotEl.innerHTML = `
        <div class="slot-time">
            ${escapeHtml(slot.time || '')}
            <span class="slot-period">${escapeHtml(slot.period || '')}</span>
        </div>
        <div class="slot-info">
            <div class="slot-name">
                ${mapUrl
                ? `<a href="${mapUrl}" target="_blank" rel="noopener" class="place-map-link" title="View on Google Maps">📍 ${escapeHtml(slot.place || '')}</a>`
                : `${travelIcon}${escapeHtml(slot.place || '')}`}
            </div>
            <div class="slot-desc">${escapeHtml(slot.description || '')}</div>
            ${slot.duration_mins ? `<span class="rec-badge" style="margin-top:6px;display:inline-block">⏱️ ${slot.duration_mins} min</span>` : ''}
            ${slot.tip ? `<span class="slot-tip">💡 ${escapeHtml(slot.tip)}</span>` : ''}
        </div>
        <button class="slot-remove-btn edit-only" title="Remove this place" data-slot="${slotIdx}" data-day="${dayIdx}">✕</button>
    `;

        const removeBtn = slotEl.querySelector('.slot-remove-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeSlot(dayIdx, slotIdx, slotEl.closest('.itinerary-card'));
            });
        }

        return slotEl;
    }

    function switchDay(card, dayIndex) {
        card.querySelectorAll('.day-tab').forEach((tab, i) => tab.classList.toggle('active', i === dayIndex));
        card.querySelectorAll('.day-content').forEach((content, i) => content.classList.toggle('hidden', i !== dayIndex));
    }

    // ==================== Itinerary Editing ====================
    function toggleEditMode(card) {
        editMode = !editMode;
        card.classList.toggle('edit-mode', editMode);
        const btn = card.querySelector('.edit-toggle-btn');
        if (btn) btn.textContent = editMode ? t('done_editing') : t('edit_itinerary');
    }

    function removeSlot(dayIdx, slotIdx, card) {
        if (!currentItinerary || !currentItinerary.days[dayIdx]) return;
        const removedSlot = currentItinerary.days[dayIdx].slots[slotIdx];
        const removedCity = currentItinerary.days[dayIdx].city;
        currentItinerary.days[dayIdx].slots.splice(slotIdx, 1);
        rerenderDaySlots(card, dayIdx);

        // Show replacement suggestions if the removed slot was a real place
        if (removedSlot && isActualPlace(removedSlot)) {
            showReplacementSuggestions(dayIdx, slotIdx, removedSlot, removedCity, card);
        }
    }

    // ==================== Replacement Suggestions ====================
    function getItineraryPlaceIds() {
        if (!currentItinerary) return [];
        const ids = [];
        for (const day of (currentItinerary.days || [])) {
            for (const slot of (day.slots || [])) {
                if (slot.place_id) ids.push(slot.place_id);
            }
        }
        return ids;
    }

    async function showReplacementSuggestions(dayIdx, insertIdx, removedSlot, city, card) {
        // Find the slots container for this day
        const container = card.querySelector(`.slots-container[data-day-index="${dayIdx}"]`);
        if (!container) return;

        // Remove any existing panel
        const existing = container.parentElement.querySelector('.replacement-panel');
        if (existing) existing.remove();

        // Create panel
        const panel = document.createElement('div');
        panel.className = 'replacement-panel';
        panel.innerHTML = `
            <div class="replacement-panel-header">
                <h4>✨ Replace "${escapeHtml(removedSlot.place || '')}" with:</h4>
                <button class="replacement-panel-close">✕</button>
            </div>
            <div class="replacement-loading">
                <div class="spinner"></div>
                <span>Finding similar places in ${escapeHtml(city || 'this city')}...</span>
            </div>
        `;
        container.after(panel);

        // Bind close
        panel.querySelector('.replacement-panel-close').addEventListener('click', () => panel.remove());

        // Fetch suggestions
        try {
            const excludeIds = getItineraryPlaceIds().join(',');
            const category = removedSlot.category || '';
            const url = `/api/places/suggest?city=${encodeURIComponent(city || '')}&exclude=${encodeURIComponent(excludeIds)}&category=${encodeURIComponent(category)}`;
            const res = await fetch(url);
            const data = await res.json();

            const loading = panel.querySelector('.replacement-loading');
            if (loading) loading.remove();

            if (!data.suggestions || data.suggestions.length === 0) {
                panel.innerHTML += '<p class="replacement-empty">No alternative places found for this city.</p>';
                return;
            }

            const cardsDiv = document.createElement('div');
            cardsDiv.className = 'suggestion-cards';

            data.suggestions.forEach(place => {
                const sCard = document.createElement('div');
                sCard.className = 'suggestion-card';
                sCard.innerHTML = `
                    <div class="suggestion-card-info">
                        <div class="suggestion-card-name">📍 ${escapeHtml(place.name || '')}</div>
                        <div class="suggestion-card-meta">
                            <span>${escapeHtml(place.category || '')}</span>
                            ${place.estimated_visit_duration ? `<span>⏱️ ${place.estimated_visit_duration} min</span>` : ''}
                            ${place.crowd_level ? `<span>👥 ${escapeHtml(place.crowd_level)}</span>` : ''}
                        </div>
                    </div>
                    <button class="suggestion-add-btn">+ Add</button>
                `;

                // Bind add button
                sCard.querySelector('.suggestion-add-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const day = currentItinerary.days[dayIdx];
                    if (!day) return;

                    const newSlot = {
                        time: removedSlot.time || 'TBD',
                        period: removedSlot.period || 'custom',
                        place: place.name,
                        place_id: place.id,
                        duration_mins: place.estimated_visit_duration || 60,
                        description: place.description || `Visit ${place.name} in ${city}.`,
                        tip: place.highlight ? '⭐ Must-visit highlight!' : `Crowd: ${place.crowd_level || 'moderate'}`,
                        google_maps_url: buildPlaceMapUrl(place.name, city)
                    };

                    // Insert at the same position
                    day.slots.splice(insertIdx, 0, newSlot);
                    rerenderDaySlots(card, dayIdx);
                    panel.remove();
                });

                cardsDiv.appendChild(sCard);
            });

            panel.appendChild(cardsDiv);
        } catch (err) {
            console.error('[BrajYatra] Error fetching suggestions:', err);
            const loading = panel.querySelector('.replacement-loading');
            if (loading) loading.innerHTML = '<p class="replacement-empty">Could not load suggestions. Try again later.</p>';
        }
    }

    function rerenderDaySlots(card, dayIdx) {
        const day = currentItinerary.days[dayIdx];
        if (!day) return;
        const container = card.querySelector(`.slots-container[data-day-index="${dayIdx}"]`);
        if (!container) return;
        container.innerHTML = '';
        (day.slots || []).forEach((slot, slotIdx) => {
            container.appendChild(createSlotElement(slot, day.city, slotIdx, dayIdx));
        });

        // Update day route link
        const routeLink = card.querySelector(`.day-route-btn[data-day-index="${dayIdx}"]`);
        if (routeLink) {
            const newUrl = buildDayRouteUrl(day);
            if (newUrl) {
                routeLink.href = newUrl;
            }
        }
    }

    function showAddPlaceForm(addBtn, dayIdx, card) {
        // Remove existing form if any
        const existingForm = addBtn.parentElement.querySelector('.add-place-form');
        if (existingForm) { existingForm.remove(); return; }

        const form = document.createElement('div');
        form.className = 'add-place-form';
        form.innerHTML = `
            <input type="text" class="add-place-input" placeholder="Place name (e.g. Prem Mandir)" />
            <input type="text" class="add-place-time" placeholder="Time (e.g. 16:00–17:00)" />
            <button class="add-place-confirm">Add →</button>
            <button class="add-place-cancel">Cancel</button>
        `;

        addBtn.parentElement.insertBefore(form, addBtn.nextSibling);

        form.querySelector('.add-place-confirm').addEventListener('click', () => {
            const placeName = form.querySelector('.add-place-input').value.trim();
            const time = form.querySelector('.add-place-time').value.trim() || 'TBD';
            if (!placeName) return;

            const day = currentItinerary.days[dayIdx];
            if (!day) return;

            const newSlot = {
                time: time,
                period: 'custom',
                place: placeName,
                duration_mins: 60,
                description: `Visit ${placeName}`,
                google_maps_url: buildPlaceMapUrl(placeName, day.city)
            };

            day.slots.push(newSlot);
            rerenderDaySlots(card, dayIdx);
            form.remove();
        });

        form.querySelector('.add-place-cancel').addEventListener('click', () => form.remove());
    }

    // ==================== Recommendation Rendering ====================
    function renderRecommendations(recommendations, summary) {
        if (!recommendations || recommendations.length === 0) {
            return appendMessage('assistant', summary || 'Could not find recommendations. Try asking differently!');
        }
        if (summary) appendMessage('assistant', summary);

        const grid = document.createElement('div');
        grid.className = 'recommendations-grid';

        recommendations.forEach(rec => {
            const card = document.createElement('div');
            card.className = 'rec-card';
            const imgUrl = getPlaceImage(rec.name, rec.city, rec.category);
            const mapUrl = buildPlaceMapUrl(rec.name, rec.city);
            card.innerHTML = `
                <img class="rec-card-img" src="${imgUrl}" alt="${escapeHtml(rec.name || '')}" loading="lazy" onerror="this.style.display='none'">
                <div class="rec-card-body">
                    <div class="rec-card-header">
                        <h4><a href="${mapUrl}" target="_blank" rel="noopener" class="place-map-link" title="View on Google Maps">📍 ${escapeHtml(rec.name || '')}</a></h4>
                        <span class="rec-category">${escapeHtml(rec.category || '')}</span>
                    </div>
                    <p class="rec-city">📍 ${escapeHtml(rec.city || '')}</p>
                    <p class="rec-why">${escapeHtml(rec.why || '')}</p>
                    <div class="rec-meta">
                        ${rec.best_time ? `<span class="rec-badge">🕐 ${escapeHtml(rec.best_time)}</span>` : ''}
                        ${rec.duration ? `<span class="rec-badge">⏱️ ${escapeHtml(rec.duration)}</span>` : ''}
                        ${rec.crowd_level ? `<span class="rec-badge">👥 ${escapeHtml(rec.crowd_level)}</span>` : ''}
                    </div>
                    ${rec.insider_tip ? `<p class="slot-tip" style="margin-top:10px">💡 ${escapeHtml(rec.insider_tip)}</p>` : ''}
                    <a href="${mapUrl}" target="_blank" rel="noopener" class="rec-map-btn">📍 View on Google Maps</a>
                </div>
            `;
            grid.appendChild(card);
        });

        messagesContainer.appendChild(grid);
        scrollToBottom();
    }

    // ==================== Typing Indicator ====================
    function showTyping() {
        const div = document.createElement('div');
        div.className = 'typing-indicator';
        div.innerHTML = `
            <div class="message-avatar" style="background: var(--gradient-saffron); font-family: var(--font-deva);">ॐ</div>
            <div class="typing-dots"><span></span><span></span><span></span></div>
        `;
        messagesContainer.appendChild(div);
        scrollToBottom();
        return div;
    }

    function removeTyping(el) { if (el && el.parentNode) el.parentNode.removeChild(el); }

    // ==================== Helpers ====================
    function scrollToBottom() {
        requestAnimationFrame(() => { messagesContainer.scrollTop = messagesContainer.scrollHeight; });
    }

    function startNewChat() {
        sessionId = null;
        localStorage.removeItem('brajyatra_session');
        currentItinerary = null;
        editMode = false;
        messagesContainer.innerHTML = '';
        if (welcomeScreen) {
            messagesContainer.appendChild(welcomeScreen);
            welcomeScreen.style.display = '';
        } else { location.reload(); }
        closeSidebar();
    }

    function renderMarkdown(text) {
        if (!text) return '';
        let html = escapeHtml(text);
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/(?<!\*)\*(?!\*)(.+?)\*(?!\*)/g, '<em>$1</em>');
        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
        html = html.replace(/^[-•] (.+)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
        html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
        html = html.replace(/^---$/gm, '<hr>');
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        html = html.replace(/\n\n/g, '</p><p>');
        html = html.replace(/\n/g, '<br>');
        html = '<p>' + html + '</p>';
        html = html.replace(/<p><h([1-3])>/g, '<h$1>');
        html = html.replace(/<\/h([1-3])><\/p>/g, '</h$1>');
        html = html.replace(/<p><ul>/g, '<ul>');
        html = html.replace(/<\/ul><\/p>/g, '</ul>');
        html = html.replace(/<p><hr><\/p>/g, '<hr>');
        html = html.replace(/<p><\/p>/g, '');
        return html;
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    }

    function toggleSidebar() {
        sidebar.classList.toggle('open');
        let overlay = document.querySelector('.sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.addEventListener('click', closeSidebar);
            document.body.appendChild(overlay);
        }
        overlay.classList.toggle('active', sidebar.classList.contains('open'));
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) overlay.classList.remove('active');
    }

    init();
})();
