import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY);

/**
 * Get multiple destination recommendations from Gemini
 * @param {Object} preferences - User preferences for recommendations
 * @returns {Promise<Array>} - Array of destination recommendations
 */
export const getDestinationRecommendations = async (preferences = {}) => {
  try {
    // Create a default prompt if no preferences are provided
    const { interests = [], budget = 'medium', season = 'summer', tripDuration = '7 days' } = preferences;
    
    // Build the prompt for Gemini
    const prompt = `Act as an AI travel assistant. Recommend 5 travel destinations based on the following preferences:
      - Interests: ${interests.length > 0 ? interests.join(', ') : 'general tourism'}
      - Budget: ${budget}
      - Season: ${season}
      - Trip Duration: ${tripDuration}
      
      Provide a structured response in JSON format with an array of 5 destinations:
      [
        {
          "id": "unique_id_1",
          "destination": "Name of the destination",
          "country": "Country name",
          "description": "A brief 2-3 sentence description of the destination",
          "imageUrl": "A URL to a high-quality image of the destination",
          "budget": {
            "currency": "USD",
            "averageDailyExpense": "Amount per day",
            "totalEstimate": "Total estimated cost"
          },
          "bestTimeToVisit": "Best months or season to visit",
          "recommendedDuration": "Recommended number of days",
          "tripPlan": [
            {"day": 1, "activities": ["Morning activity", "Afternoon activity", "Evening activity"]},
            {"day": 2, "activities": ["Morning activity", "Afternoon activity", "Evening activity"]}
          ],
          "mustSeeAttractions": ["Attraction 1", "Attraction 2", "Attraction 3"],
          "localTips": ["Tip 1", "Tip 2"]
        }
      ]
      
      IMPORTANT: Make sure each destination has a UNIQUE ID (like unique_id_1, unique_id_2, etc). Do not use simple numbers like 1, 2, 3 as IDs. Make sure the response is valid JSON and includes realistic information for all 5 destinations.`;

    // Generate content using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\[[\s\S]*\]/);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;
    
    // Parse the JSON
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error getting destination recommendations:', error);
    
    // Return fallback recommendations if Gemini fails
    return [
      {
        id: "paris_france_" + Date.now() + "_1",
        destination: "Paris",
        country: "France",
        description: "The City of Light offers iconic landmarks, world-class cuisine, and romantic ambiance. Perfect for art lovers and history enthusiasts.",
        imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
        budget: {
          currency: "USD",
          averageDailyExpense: "$150-$250",
          totalEstimate: "$1,050-$1,750 for 7 days"
        },
        bestTimeToVisit: "April to June or September to October",
        recommendedDuration: "5-7 days",
        tripPlan: [
          {day: 1, activities: ["Eiffel Tower", "Seine River Cruise", "Dinner in Montmartre"]},
          {day: 2, activities: ["Louvre Museum", "Tuileries Garden", "Champs-Élysées shopping"]}
        ],
        mustSeeAttractions: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral"],
        localTips: ["Buy a Paris Museum Pass for better value", "Use the Metro for transportation"]
      },
      {
        id: "tokyo_japan_" + Date.now() + "_2",
        destination: "Tokyo",
        country: "Japan",
        description: "A vibrant metropolis blending ultramodern and traditional, from neon-lit skyscrapers to historic temples. Experience unique culture, technology, and cuisine.",
        imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1974&auto=format&fit=crop",
        budget: {
          currency: "USD",
          averageDailyExpense: "$100-$200",
          totalEstimate: "$700-$1,400 for 7 days"
        },
        bestTimeToVisit: "March to May or September to November",
        recommendedDuration: "7-10 days",
        tripPlan: [
          {day: 1, activities: ["Senso-ji Temple", "Tokyo Skytree", "Akihabara district"]},
          {day: 2, activities: ["Meiji Shrine", "Harajuku", "Shibuya Crossing"]}
        ],
        mustSeeAttractions: ["Tokyo Tower", "Imperial Palace", "Shinjuku Gyoen National Garden"],
        localTips: ["Get a Suica or Pasmo card for public transport", "Try conveyor belt sushi restaurants for affordable meals"]
      }
    ];
  }
};

/**
 * Search for attractions near a specific location using Gemini
 * @param {string} location - The location to search for attractions
 * @returns {Promise<Array>} - Array of attractions near the location
 */
export const searchNearbyAttractions = async (location) => {
  try {
    // Build the prompt for Gemini
    const prompt = `Act as a travel guide. I'm looking for attractions near ${location}. 
    Provide a structured response in JSON format with an array of 5 attractions:
    [
      {
        "id": "1",
        "name": "Attraction name",
        "location": "${location}",
        "description": "A brief description of the attraction",
        "imageUrl": "A URL to a high-quality image of the attraction (use unsplash.com)",
        "category": "Type of attraction (e.g., Historical, Natural, Cultural)",
        "rating": "Rating out of 5",
        "tips": "A useful tip for visitors"
      }
    ]
    
    Make sure the response is valid JSON and includes realistic information for all 5 attractions.`;

    // Generate content using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\[[\s\S]*\]/);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;
    
    // Parse the JSON
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error searching nearby attractions:', error);
    
    // Return fallback attractions if Gemini fails
    return [
      {
        id: "1",
        name: "Popular Attraction",
        location: location,
        description: "A popular attraction in this area.",
        imageUrl: "https://images.unsplash.com/photo-1558383817-c254bdbb8d95?q=80&w=1974&auto=format&fit=crop",
        category: "Tourist Spot",
        rating: "4.5",
        tips: "Visit early in the morning to avoid crowds."
      }
    ];
  }
};