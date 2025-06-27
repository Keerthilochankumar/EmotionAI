import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const model = "playai-tts";
const voice = "Aaliyah-PlayAI";
const responseFormat = "wav";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Generate unique filename
    const speechFilePath = path.resolve(`speech-${Date.now()}.wav`);

    // HTTP request to Groq TTS endpoint
    const response = await fetch("https://api.groq.com/openai/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        voice: voice,
        input: text,
        response_format: responseFormat,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    // Write the audio to a file
    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.promises.writeFile(speechFilePath, buffer);
    console.log(`Audio file written to ${speechFilePath}`);

    // Return the audio file
    const audioBuffer = await fs.promises.readFile(speechFilePath);
    // Clean up file to avoid accumulation
    await fs.promises.unlink(speechFilePath).catch(() => {});
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Disposition": "attachment; filename=speech.wav",
      },
    });
  } catch (error) {
    console.error("Error in TTS API:", error);
    return NextResponse.json(
      { error: "Failed to generate audio", details: error.message },
      { status: 500 }
    );
  }
}