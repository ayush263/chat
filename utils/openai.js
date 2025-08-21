// utils/openai.js
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // set this in your .env file
});

async function chatWithAI(message) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("OpenAI error:", err);
    throw err;
  }
}

module.exports = { chatWithAI };