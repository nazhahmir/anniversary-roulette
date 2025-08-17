// Romantic Anniversary Date Ideas for San Francisco Bay Area
// Research-based options that avoid alcohol/vineyard activities

export const ROMANTIC_ANNIVERSARY_OPTIONS = [
  // Weekend Getaways & Hotels
  "Weekend getaway to Sausalito waterfront hotel",
  "Romantic stay at Cavallo Point Lodge with Golden Gate views",
  "Napa Valley luxury spa resort weekend",
  "Carmel-by-the-Sea cottage retreat with ocean views",
  "Half Moon Bay Ritz-Carlton oceanfront escape",
  
  // Scenic & Adventure Experiences
  "Golden Gate Bridge bike ride to Sausalito with ferry return",
  "Sunrise hot air balloon ride over Napa Valley",
  "Sunset kayaking tour under the Golden Gate Bridge",
  "Point Bonita Lighthouse sunset hike with suspension bridge",
  "Whale watching cruise around San Francisco Bay",
  "Private airplane sunset tour over the bay",
  
  // Fine Dining Experiences
  "Atelier Crenn: Michelin-starred 'poetic culinaria' tasting menu",
  "Quince: opulent Michelin-starred Italian with plush interiors",
  "Boulevard: classic American cuisine with Bay Bridge views",
  "Waterbar dinner overlooking the bay (popular proposal spot)",
  "Verjus: intimate French bistro with candlelit ambiance",
  "Private chef five-star dinner experience at home",
  
  // Cultural & Creative Experiences
  "Foreign Cinema: dinner while watching movies under the stars",
  "Couples pottery class with romantic 'Ghost' movie vibes",
  "Private dance lesson: salsa, swing, or ballroom",
  "California Academy of Sciences NightLife with planetarium shows",
  "Candlelight classical concert at St. Ignatius Church",
  "Sonoma County olive oil tasting and farm tour",
  
  // Unique Activities
  "Church of 8 Wheels: adults-only roller disco in converted church",
  "Mission Bowling Club: upscale bowling with gourmet dining",
  "Alcatraz night tour: explore the infamous prison after dark",
  "Couples massage at luxury spa in Union Square",
  "Horse-drawn carriage ride through Golden Gate Park",
  
  // Scenic Spots & Gardens
  "Japanese Tea Garden: tranquil paths, koi ponds, traditional architecture",
  "Crissy Field sunset picnic with Golden Gate Bridge views",
  "Lands End Trail: coastal hike with ocean views & Sutro Baths ruins",
  "Alamo Square: Painted Ladies views for romantic picnics"
];

export const ENVELOPE_COLORS = [
  "coral", "mint", "sky", "sage", "warm-yellow", "blush"
];

// Helper function to get colors in a specific order to avoid adjacent same colors
export function getOrderedColors(count: number): string[] {
  const colors = [...ENVELOPE_COLORS];
  const result: string[] = [];
  
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }
  
  return result;
}

// Helper function to get a random selection of options
export function getRandomOptions(count: number): Array<{prizeText: string, color: string}> {
  const shuffled = [...ROMANTIC_ANNIVERSARY_OPTIONS].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  const orderedColors = getOrderedColors(count);
  
  return selected.map((prizeText, index) => ({
    prizeText,
    color: orderedColors[index]
  }));
}