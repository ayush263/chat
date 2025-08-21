// utils/openai.js
const OpenAI = require('openai');

if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    "OPENAI_API_KEY is missing. Set it in your environment (Render: Dashboard → Environment → Add Variable)."
  );
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = openai;