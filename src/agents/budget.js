


const COST_ESTIMATES = {
    food: {
        low: { perMeal: 80, mealsPerDay: 3 },
        medium: { perMeal: 200, mealsPerDay: 3 },
        high: { perMeal: 500, mealsPerDay: 3 }
    },
    transport: {
        low: { perDay: 200 },   
        medium: { perDay: 600 },   
        high: { perDay: 1500 }   
    },
    accommodation: {
        low: { perNight: 500 },   
        medium: { perNight: 1500 },  
        high: { perNight: 4000 }   
    }
};


function estimateBudget({ places = [], days = 1, budgetLevel = 'medium', people = 2 }) {
    const level = budgetLevel.toLowerCase();
    const costs = {
        low: COST_ESTIMATES.food.low,
        medium: COST_ESTIMATES.food.medium,
        high: COST_ESTIMATES.food.high
    };
    const foodCost = costs[level] || costs.medium;
    const transportCost = COST_ESTIMATES.transport[level] || COST_ESTIMATES.transport.medium;
    const accomCost = COST_ESTIMATES.accommodation[level] || COST_ESTIMATES.accommodation.medium;

    
    const entryFees = places.reduce((sum, p) => {
        const fee = parseFloat(p.entry_fee) || 0;
        return sum + (fee * people);
    }, 0);

    
    const totalFood = foodCost.perMeal * foodCost.mealsPerDay * days * people;
    const totalTransport = transportCost.perDay * days;
    const nights = Math.max(0, days - 1);
    const totalAccommodation = accomCost.perNight * nights;

    const total = entryFees + totalFood + totalTransport + totalAccommodation;

    return {
        entry_fees: Math.round(entryFees),
        food: Math.round(totalFood),
        transport: Math.round(totalTransport),
        accommodation: Math.round(totalAccommodation),
        total: Math.round(total),
        per_person: Math.round(total / people),
        currency: 'INR',
        budget_level: level,
        days,
        people,
        breakdown_note: getBudgetNote(level)
    };
}


function getBudgetNote(level) {
    switch (level) {
        case 'low':
            return 'Budget option: Dharamshala stays, local buses, street food & temple prasadam';
        case 'high':
            return 'Premium option: Good hotels, private cab, restaurant dining';
        default:
            return 'Moderate option: Mid-range hotel, auto-rickshaws, mix of street food & restaurants';
    }
}

module.exports = { estimateBudget, COST_ESTIMATES };
