interface EnhancedTaskResult {
    description: string;
    tags: string[];
    subtasks: string[];
}

interface FlashcardResult {
    question: string;
    answer: string;
}

// Get API key from environment or return null
const getApiKey = (): string | null => {
  return import.meta.env.VITE_GEMINI_API_KEY || null;
};

export const enhanceTaskDescription = async (title: string, currentDesc: string): Promise<EnhancedTaskResult> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("Gemini API Key not configured - using fallback");
    return {
      description: currentDesc || `Enhanced description for: ${title}`,
      tags: ['Engineering', 'Task'],
      subtasks: ['Review requirements', 'Implement solution', 'Test and validate']
    };
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Tu es un assistant ingénieur pédagogique pour l'école Sup Galilée.
      Tâche : "${title}".
      Desc : "${currentDesc}".
      
      1. Améliore la description (technique, précise) en français.
      2. Suggère 3 tags courts (ex: Math, Physique, Info).
      3. Génère 3-5 sous-tâches concrètes.
      
      Retourne UNIQUEMENT un JSON : { "description": string, "tags": string[], "subtasks": string[] }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    // Return fallback on any error
    return {
      description: currentDesc || `Description améliorée pour: ${title}`,
      tags: ['Ingénierie', 'Tâche'],
      subtasks: ['Analyser les exigences', 'Implémenter la solution', 'Tester et valider']
    };
  }
};

export const generateFlashcards = async (topic: string, count: number = 5): Promise<FlashcardResult[]> => {
    const apiKey = getApiKey();
    if (!apiKey) {
      console.warn("Gemini API Key not configured - using fallback flashcards");
      return getFallbackFlashcards(topic);
    }

    try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });
        
        const prompt = `
            Génère ${count} cartes de révision (Flashcards) niveau école d'ingénieur sur le sujet : "${topic}".
            Questions précises, Réponses concises mais techniques.
            Retourne UNIQUEMENT un JSON : [ { "question": "...", "answer": "..." }, ... ]
        `;

        // Use gemini-2.5-flash
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || '[]');
    } catch (error) {
        console.error("Gemini Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        // If rate limited (429), overloaded (503), or not found (404), use fallback
        if (errorMessage.includes('429') || errorMessage.includes('503') || errorMessage.includes('quota') || errorMessage.includes('404')) {
            console.warn("API issue - using fallback flashcards");
            return getFallbackFlashcards(topic);
        }
        throw error;
    }
};

// Fallback flashcards when API is unavailable
const getFallbackFlashcards = (topic: string): FlashcardResult[] => [
    { question: `Qu'est-ce que ${topic}?`, answer: `${topic} est un concept fondamental en ingénierie qui nécessite une compréhension approfondie.` },
    { question: `Quels sont les principes clés de ${topic}?`, answer: `Les principes clés incluent l'analyse, la modélisation et l'application pratique.` },
    { question: `Comment ${topic} est-il utilisé en pratique?`, answer: `${topic} s'applique dans la conception, l'optimisation et la résolution de problèmes d'ingénierie.` },
    { question: `Quelles sont les formules importantes pour ${topic}?`, answer: `Les formules varient selon le contexte - consultez votre cours pour les équations spécifiques.` },
    { question: `Quels sont les défis courants avec ${topic}?`, answer: `Les défis incluent la complexité des calculs, les conditions aux limites et les approximations.` },
];

export const generateDiagramCode = async (description: string): Promise<string> => {
    const apiKey = getApiKey();
    if (!apiKey) {
      return `graph TD
    A[Start] --> B[${description}]
    B --> C[End]`;
    }

    try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });
        
        const prompt = `
            Generate a Mermaid.js diagram code for the following task/concept:
            "${description}"
            
            Return ONLY the Mermaid code, no explanation. Use graph TD or flowchart format.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || '';
    } catch (error) {
        console.error("Gemini Error:", error);
        // Return fallback diagram on error
        return `graph TD
    A[Start] --> B[${description}]
    B --> C[End]`;
    }
};
