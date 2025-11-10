import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

/**
 * Analyze election data and provide insights
 */
export async function analyzeElection(electionData: {
  title: string;
  description: string;
  candidates: string[];
  totalVotes: number;
  votes: Record<string, number>;
  voterTurnout?: number;
}) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      // Return mock insights if no API key
      return {
        insights: [
          `Total participation: ${electionData.totalVotes} votes`,
          `Top candidate: ${Object.entries(electionData.votes).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}`,
          'This election shows active community engagement.',
        ],
        sentiment: 'positive',
        recommendations: ['Consider extending voting period for higher participation'],
      };
    }

    const prompt = `Analyze this election data and provide insights:
Title: ${electionData.title}
Description: ${electionData.description}
Candidates: ${electionData.candidates.join(', ')}
Total Votes: ${electionData.totalVotes}
Vote Distribution: ${JSON.stringify(electionData.votes)}

Provide:
1. Key insights (3-4 bullet points)
2. Overall sentiment (positive/neutral/negative)
3. Recommendations for future elections

Format as JSON with keys: insights (array), sentiment (string), recommendations (array)`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error('AI analysis error:', error);
    return {
      insights: ['Analysis unavailable'],
      sentiment: 'neutral',
      recommendations: [],
    };
  }
}

/**
 * Generate election description suggestions
 */
export async function generateElectionDescription(
  title: string,
  type: string
): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return `This is a ${type} election for ${title}. Vote securely and transparently on the blockchain.`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Generate a brief, professional election description for: "${title}" (Type: ${type}). Keep it under 200 words.`,
        },
      ],
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('AI generation error:', error);
    return `This is a ${type} election for ${title}. Vote securely and transparently on the blockchain.`;
  }
}

/**
 * Predict voter turnout based on historical data
 */
export async function predictTurnout(historicalData: {
  pastElections: number;
  averageTurnout: number;
}): Promise<number> {
  // Simple prediction - can be enhanced with ML
  return Math.round(historicalData.averageTurnout * (1 + Math.random() * 0.2 - 0.1));
}

