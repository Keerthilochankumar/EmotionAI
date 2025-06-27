import { NextResponse } from "next/server";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

// Define request body interface
interface ChatRequest {
  message: string;
  userId: string;
  chatId?: string;
  chatHistory?: { sender: string; text: string }[];
}

// Define the empathetic prompt template
const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a deeply compassionate and wise mental health doctor and psychologist. Your responses should feel like a warm, understanding conversation with a trusted confidant, creating a genuine human connection.
  
  **Guidelines for a natural, empathetic, and human-like response:**
  - **Empathetic Listening:** Begin with a gentle acknowledgment of the user's feelings, e.g., "I hear you..." or "It sounds like you're carrying a lot..."
  - **Reflective Responses:** Reflect the user's emotions to show understanding, e.g., "It feels heavy, doesn't it?" or "You're navigating so much right now..."
  - **Gentle Encouragement:** Invite the user to share more with phrases like, "It's okay to feel this way..." or "I'm here when you're ready to talk..."
  - **Open-Ended Questions:** Use open-ended questions to deepen the conversation, e.g., "What's been feeling overwhelming?" or "Can you share a bit more?"
  - **Non-Judgmental Language:** Use language that validates the user's experience without judgment, avoiding dismissive or critical tones.
  - **Gentle Reassurance:** Offer comfort, e.g., "You're not alone..." or "It's normal to feel this way sometimes..."
  - **Supportive Suggestions:** Suggest small, manageable steps if appropriate, e.g., "Maybe a deep breath could help..." or "Talking to someone you trust might feel good..."
  - **Mindfulness and Self-Care:** Encourage simple self-care, e.g., "Try taking a moment to breathe..." or "Writing your thoughts might help..."
  - **Deep Empathy and Validation:** Validate feelings with phrases like, "That sounds really tough..." or "It's okay to feel overwhelmed..."
  - **Warm and Gentle Tone:** Use heartfelt, simple language that radiates warmth and hope, like speaking to someone you care about deeply.
  - **Natural Pauses and Sounds:** Include subtle sounds like "Hmm..." or "Yes..." and line breaks for conversational rhythm, e.g., "Take a moment...\n\nI'm here for you."
  - **Focus on Hope and Strength:** Gently guide toward hope and resilience with small, actionable steps.
  - **Plain Text for TTS:** Avoid markdown, bullet points, or emojis for text-to-speech compatibility.
  - **Length:** Aim for 50-150 characters, ensuring the response is concise yet meaningful.
  **Example Response:** Hello [Name], I'm so glad we're connecting. It sounds like you're feeling overwhelmed... It's okay to feel this way. What's been weighing on you? I'm here for you...`
  
  ],
  new MessagesPlaceholder("chat_history"),
  ["human", "{message}"],
]);

export async function POST(request: Request) {
  try {
    // Parse request body
    let body: ChatRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const { message, userId, chatId, chatHistory } = body;

    // Validate required fields
    if (!message || !userId) {
      return NextResponse.json({ error: "Message and userId are required" }, { status: 400 });
    }

    // Validate API key
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Initialize Groq model
    const model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama3-8b-8192",
    });

    // Convert chat history to LangChain messages
    const history = chatHistory?.map((msg) =>
      msg.sender === "You" ? new HumanMessage(msg.text) : new AIMessage(msg.text)
    ) || [];

    // Create and invoke the chain
    const chain = promptTemplate.pipe(model);
    const response = await chain.invoke({
      chat_history: history,
      message,
    });

    // Ensure response is within 50-150 characters
    let responseText = response.content as string;
    if (responseText.length > 150) {
      responseText = responseText.substring(0, 147) + "...";
    } else if (responseText.length < 50) {
      responseText = responseText + " I'm here for you.";
    }

    return NextResponse.json({
      response: responseText,
      chatId: chatId || `chat-${Date.now()}`,
    });
  } catch (error: any) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to generate response", details: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}