// Romantic Anniversary Date Ideas for San Francisco Bay Area
// Research-based options that avoid alcohol/vineyard activities

export const ROMANTIC_ANNIVERSARY_OPTIONS = [
  // Scenic & Adventure Experiences
  "Golden Gate Bridge bike ride to Sausalito with ferry return",
  "Sunrise hot air balloon ride over Napa Valley",
  "Sunset kayaking tour under the Golden Gate Bridge",
  "Point Bonita Lighthouse sunset hike with suspension bridge",
  "Whale watching cruise around San Francisco Bay",
  "Private airplane sunset tour over the bay",
  
  // Cultural & Creative Experiences
  "Foreign Cinema: dinner while watching movies under the stars",
  "Couples pottery class with 'Ghost' movie vibes",
  "Private dance lesson: salsa, swing, or ballroom",
  "California Academy of Sciences NightLife with planetarium",
  "Candlelight classical concert at St. Ignatius Church",
  "Private chef five-star dinner experience at home",
  
  // Unique & Quirky Activities
  "Church of 8 Wheels: adults-only roller disco in converted church",
  "Mission Bowling Club: upscale bowling with craft dining",
  "Berber: Moroccan supper club with live cirque performances",
  "Alcatraz night tour: explore the infamous prison after dark",
  
  // Romantic Restaurants
  "Waterbar dinner with Bay Bridge views (popular proposal spot)",
  "Atelier Crenn: Michelin-starred 'poetic culinaria' tasting menu",
  "Quince: opulent Michelin-starred Italian with plush interiors",
  "Boulevard: classic American cuisine near Bay Bridge",
  "Verjus: French bistro with glossy maroon ceiling & candlelight",
  "L'Ardoise: Parisian-style bistro with dark leather booths",
  
  // Scenic & Garden Spots
  "Japanese Tea Garden: tranquil paths, koi ponds, traditional architecture",
  "San Francisco Botanical Garden: 55 acres in Golden Gate Park",
  "Crissy Field picnic with Golden Gate Bridge views",
  "Lands End Trail: coastal hike with ocean views & Sutro Baths ruins",
  "Alamo Square: Painted Ladies views for romantic picnics",
  "Battery Park: former masonry fort with Golden Gate & downtown views"
];

export const ENVELOPE_COLORS = [
  "coral", "mint", "sky", "sage", "warm-yellow", "blush"
];

// Helper function to get a random selection of options
export function getRandomOptions(count: number): Array<{prizeText: string, color: string}> {
  const shuffled = [...ROMANTIC_ANNIVERSARY_OPTIONS].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  
  return selected.map((prizeText, index) => ({
    prizeText,
    color: ENVELOPE_COLORS[index % ENVELOPE_COLORS.length]
  }));
}