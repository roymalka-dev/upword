// pages/api/chat.ts
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

 const openai = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
 });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Extracting text from request body
  const { text, scale } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Text parameter is required" });
  }
    
  const pormpt = `and rephrase the following text to a ${scale} of 10 formality level : ${text}`;

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [{ role: "user", content: pormpt }],
      stream: true,
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      fullResponse += chunk.choices[0]?.delta?.content || "";
    }

    res.status(200).json({ response: fullResponse });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ message: "Error processing your request", error });
  }
}
