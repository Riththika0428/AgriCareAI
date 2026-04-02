import Cerebras from "@cerebras/cerebras_cloud_sdk";
import dotenv from "dotenv";
dotenv.config();

const test = async () => {
  try {
    const cerebras = new Cerebras({
      apiKey: process.env.CEREBRAS_API_KEY
    });
    console.log("Calling Cerebras llama3.1-8b");
    const response = await cerebras.chat.completions.create({
      model: "llama3.1-8b",
      messages: [{ role: "user", content: "Say hello!" }]
    });
    console.log("Success:", response.choices[0].message.content);
  } catch(e) {
    console.error("Error:", e.message);
  }
};
test();
