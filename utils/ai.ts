type TextPart = { type: "text"; text: string };
type ImagePart = { type: "image"; image: string };
type UserMessage = { role: "user"; content: string | (TextPart | ImagePart)[] };
type AssistantMessage = { role: "assistant"; content: string | TextPart[] };

export async function generateText(
  params: string | { messages: (UserMessage | AssistantMessage)[] }
): Promise<string> {
  const messages = typeof params === "string"
    ? [{ role: "user" as const, content: params }]
    : params.messages;

  const baseUrl = process.env.EXPO_PUBLIC_TOOLKIT_URL || "https://toolkit.rork.com";
  const url = new URL("/llm/generate", baseUrl).toString();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error("AI API Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url
      });
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.text || "";
  } catch (error) {
    console.error("Error generating text:", error);
    throw error;
  }
}
