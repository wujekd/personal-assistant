import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { openAI } from "./secrets.js";

// OpenAI API
const openai = new OpenAI({
  apiKey: openAI()
});

const speechFile = path.resolve("static/speech.mp3");

export async function generateSpeech(text) {
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy", // Choose from available voices
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);

    console.log("Speech saved as speech.mp3");
  } catch (error) {
    console.error("Error generating speech:", error);
  }
}