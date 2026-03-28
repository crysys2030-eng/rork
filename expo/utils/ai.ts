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
  const url = new URL("/agent/chat", baseUrl).toString();

  try {
    console.log("Gerando texto com AI...", { url, messageCount: messages.length });
    
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

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body reader available");
    }

    const decoder = new TextDecoder();
    let fullText = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("0:")) {
          try {
            const jsonStr = line.substring(2);
            const parsed = JSON.parse(jsonStr);
            
            if (parsed.type === "text-delta" && parsed.textDelta) {
              fullText += parsed.textDelta;
            }
          } catch (e) {
            console.warn("Failed to parse line:", line, e);
          }
        }
      }
    }

    console.log("Texto gerado com sucesso:", fullText.substring(0, 100));
    return fullText;
  } catch (error) {
    console.error("Error generating text:", error);
    throw error;
  }
}
