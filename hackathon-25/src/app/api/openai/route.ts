import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!, // Make sure this exists in .env
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { prompt } = body;

        if (!prompt) {
            return NextResponse.json(
                { error: 'No prompt provided.' },
                { status: 400 }
            );
        }

        // Call OpenAI's API
        const response = await openai.chat.completions.create({
            model: 'gpt-4', // Adjust to your OpenAI model
            messages: [{ role: 'user', content: prompt }],
        });

        const completion = response.choices[0]?.message?.content;

        // Return the JSON response from OpenAI
        return NextResponse.json({ result: completion });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Failed to process the request.' },
            { status: 500 }
        );
    }
}