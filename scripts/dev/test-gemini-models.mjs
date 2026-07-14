const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log("Testing model names...");
  
  const modelsToTest = [
    "gemini-1.5-pro",
    "gemini-1.5-pro-latest",
    "gemini-1.5-pro-001",
    "gemini-1.5-pro-002",
    "gemini-1.5-flash",
    "models/gemini-1.5-pro",
    "models/gemini-1.5-pro-latest"
  ];

  for (const modelName of modelsToTest) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello");
      console.log(`✅ ${modelName} WORKED`);
    } catch (e) {
      console.log(`❌ ${modelName} FAILED: ${e.message.substring(0, 50)}`);
    }
  }
}
run();
