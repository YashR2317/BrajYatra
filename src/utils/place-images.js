const PLACE_IMAGES = {
    
    'mathura_001': '/assets/images/krishna_janmabhoomi.png',   
    'mathura_002': '/assets/images/krishna_janmabhoomi.png',   
    'mathura_003': '/assets/images/vishram_ghat.png',           

    'vrindavan_001': '/assets/images/banke_bihari.png',         
    'vrindavan_002': '/assets/images/prem_mandir.png',          
    'vrindavan_003': '/assets/images/banke_bihari.png',         

    'agra_001': '/assets/images/taj_mahal.png',                 
    'agra_002': '/assets/images/taj_mahal.png',                 

    'govardhan_001': '/assets/images/govardhan_hill.png',       
    'govardhan_002': '/assets/images/govardhan_hill.png',       

    'barsana_001': '/assets/images/radha_rani_temple.png',      
    'barsana_002': '/assets/images/radha_rani_temple.png',      

    'gokul_001': '/assets/images/nand_bhavan.png',              
    'gokul_002': '/assets/images/nand_bhavan.png',              
};

const CATEGORY_IMAGES = {
    'temple': '/assets/images/krishna_janmabhoomi.png',
    'ghat': '/assets/images/vishram_ghat.png',
    'monument': '/assets/images/taj_mahal.png',
    'market': '/assets/images/banke_bihari.png',
    'nature': '/assets/images/govardhan_hill.png',
    'heritage': '/assets/images/taj_mahal.png',
    'museum': '/assets/images/taj_mahal.png',
    'park': '/assets/images/govardhan_hill.png',
    'religious': '/assets/images/prem_mandir.png',
};

const CITY_IMAGES = {
    'Mathura': '/assets/images/krishna_janmabhoomi.png',
    'Vrindavan': '/assets/images/banke_bihari.png',
    'Agra': '/assets/images/taj_mahal.png',
    'Govardhan': '/assets/images/govardhan_hill.png',
    'Barsana': '/assets/images/radha_rani_temple.png',
    'Gokul': '/assets/images/nand_bhavan.png',
};

function getPlaceImage(place) {
    if (!place) return '/assets/images/krishna_janmabhoomi.png';

    if (place.id && PLACE_IMAGES[place.id]) {
        return PLACE_IMAGES[place.id];
    }

    if (place.city && CITY_IMAGES[place.city]) {
        return CITY_IMAGES[place.city];
    }

    if (place.category && CATEGORY_IMAGES[place.category.toLowerCase()]) {
        return CATEGORY_IMAGES[place.category.toLowerCase()];
    }

    return '/assets/images/krishna_janmabhoomi.png';
}

function getCityImage(city) {
    return CITY_IMAGES[city] || '/assets/images/krishna_janmabhoomi.png';
}

function enrichWithImage(place) {
    return { ...place, image_url: getPlaceImage(place) };
}

module.exports = { getPlaceImage, getCityImage, enrichWithImage, CITY_IMAGES };
