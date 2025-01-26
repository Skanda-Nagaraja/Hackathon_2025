// src/app/api/generate-advice/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!, // Ensure this exists in .env.local
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { categories } = body;

        if (!categories || !Array.isArray(categories) || categories.length !== 2) {
            return NextResponse.json(
                { error: 'Please provide exactly two categories.' },
                { status: 400 }
            );
        }

        const [category1, category2] = categories;

        // Construct the prompt
        const prompt = `
Based on the following two categories where a user has the lowest scores:

1. ${category1.name} (${category1.value} points)
2. ${category2.name} (${category2.value} points)

Provide meaningful, thorough, actionable, yet concise educational advice on how the user can improve in these categories beyond just playing the game more. Focus on specific strategies, resources, or habits that can aid in their improvement, LIMIT TO 150 words - specific sctionable insights.
        `;

        // Call OpenAI's API
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini', 
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 300, 
            temperature: 0.7, 
        });

        const completion = response.choices[0]?.message?.content;

        if (!completion) {
            throw new Error('No response from OpenAI.');
        }

        // Return the advice
        return NextResponse.json({ advice: completion });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate advice.' },
            { status: 500 }
        );
    }
}
