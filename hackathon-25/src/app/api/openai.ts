import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { prompt } = req.body;

    try {
        const response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                prompt,
                max_tokens: 200,
                temperature: 0.7,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            res.status(200).json({ result: data.choices[0].text });
        } else {
            res.status(500).json({ error: data.error });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong." });
    }
}