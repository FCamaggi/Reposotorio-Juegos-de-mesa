import { GoogleGenAI } from "@google/genai";
import { AIInfoResponse, Expansion } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const fetchGameDetails = async (gameName: string): Promise<AIInfoResponse> => {
  const ai = getAIClient();
  
  // Updated to use Google Search for accuracy as requested.
  // We ask the model to ground its response in the search results.
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Busca en internet información precisa sobre el juego de mesa "${gameName}".
    
    Usa los resultados de búsqueda para rellenar el siguiente JSON. Prioriza la exactitud de los datos (número de jugadores, mecánicas oficiales, etc.).
    
    Devuelve un JSON con:
    - description: Resumen breve en español (máx 200 caracteres).
    - minPlayers, maxPlayers, minAge: Números precisos según BGG o editorial.
    - playtime: String (ej "30-60 min").
    - mechanics: Lista de strings (máx 4 importantes).
    - emoji: Un solo emoji que represente la temática del juego (ej 🏰, 🦠, 🚂).
    - officialExpansions: Lista de expansiones OFICIALES encontradas ({name, description}).

    Formato JSON estricto (no uses bloques de código markdown, solo el texto JSON plano si es posible):
    {
      "description": "...",
      "minPlayers": 1,
      "maxPlayers": 4,
      "playtime": "...",
      "minAge": 10,
      "mechanics": ["..."],
      "emoji": "🎲",
      "officialExpansions": [{"name": "...", "description": "..."}]
    }`,
    config: {
      tools: [{ googleSearch: {} }], // Re-enabled for accuracy
    }
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  // Clean the response text to handle potential markdown or intro text
  let cleanedText = response.text.trim();
  
  // Find the first '{' and the last '}' to extract the JSON object
  const startIndex = cleanedText.indexOf('{');
  const endIndex = cleanedText.lastIndexOf('}');

  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    cleanedText = cleanedText.substring(startIndex, endIndex + 1);
  }

  try {
    const data = JSON.parse(cleanedText) as AIInfoResponse;
    // Fallback emoji if missing
    if (!data.emoji) data.emoji = "🎲";
    
    return data;
  } catch (error) {
    console.error("Failed to parse AI JSON response:", response.text);
    throw new Error("Error al procesar la respuesta de la IA.");
  }
};

export const fetchExpansions = async (query: string): Promise<Expansion[]> => {
  const ai = getAIClient();
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Busca expansiones OFICIALES para el juego de mesa o búsqueda: "${query}".
    
    Usa Google Search para verificar que realmente existen.
    
    Instrucciones estrictas:
    1. Devuelve SOLAMENTE un array JSON de objetos.
    2. Solo incluye expansiones que estés 100% seguro que existen y son oficiales.
    3. Si no encuentras nada certero, devuelve array vacío [].
    
    Formato JSON esperado:
    [
      { "name": "Nombre Expansion", "description": "Breve descripción" }
    ]`,
    config: {
      tools: [{ googleSearch: {} }], // Re-enabled for accuracy
    }
  });

  if (!response.text) return [];

  let cleanedText = response.text.trim();
  const startIndex = cleanedText.indexOf('[');
  const endIndex = cleanedText.lastIndexOf(']');

  if (startIndex !== -1 && endIndex !== -1) {
    cleanedText = cleanedText.substring(startIndex, endIndex + 1);
  } else {
    // If no array found, assume empty or error
    return [];
  }

  try {
    const data = JSON.parse(cleanedText) as Expansion[];
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("Error parsing expansions", e);
    return [];
  }
};
