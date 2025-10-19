import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator 
} from "react-native";
import { Stack } from "expo-router";
import { Sparkles, FileText, Share2, Copy } from "lucide-react-native";
import React, { useState } from "react";
import { generateText } from "@rork/toolkit-sdk";

type ContentType = "speech" | "social" | "response" | "analysis";

export default function ContentScreen() {
  const [selectedType, setSelectedType] = useState<ContentType>("speech");
  const [prompt, setPrompt] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const contentTypes = [
    { id: "speech" as ContentType, label: "Discurso", icon: FileText },
    { id: "social" as ContentType, label: "Redes Sociais", icon: Share2 },
    { id: "response" as ContentType, label: "Resposta", icon: Copy },
  ];

  const getPromptPlaceholder = () => {
    switch (selectedType) {
      case "speech":
        return "Ex: Discurso para comício sobre educação e segurança...";
      case "social":
        return "Ex: Post sobre nova proposta de redução de impostos...";
      case "response":
        return "Ex: Como responder a críticas sobre política de saúde...";
      default:
        return "Descreva o conteúdo que precisa...";
    }
  };

  const generateContent = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const systemPrompt = getSystemPromptForType(selectedType);
      const result = await generateText({
        messages: [
          {
            role: "user",
            content: `${systemPrompt}\n\nSolicitação do utilizador: ${prompt}`,
          },
        ],
      });
      
      setGeneratedContent(result);
    } catch (error) {
      console.error("Error generating content:", error);
      setGeneratedContent("Erro ao gerar conteúdo. Por favor, tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getSystemPromptForType = (type: ContentType): string => {
    switch (type) {
      case "speech":
        return "Você é um assistente de redação política. Crie um discurso persuasivo e impactante, adequado para campanhas políticas. O discurso deve ter: saudação inicial, enquadramento do problema, apresentação de soluções e apelo à ação. Use linguagem clara e inspiradora.";
      case "social":
        return "Você é um especialista em comunicação para redes sociais. Crie uma publicação curta, impactante e otimizada para engajamento. Use linguagem direta e inclua sugestões de hashtags relevantes.";
      case "response":
        return "Você é um assessor de comunicação política. Forneça uma resposta estratégica, empática mas firme, que aborde as preocupações levantadas de forma construtiva e apresente as posições políticas de forma clara.";
      default:
        return "Você é um assistente de comunicação política. Ajude a criar conteúdo eficaz para campanhas políticas.";
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Criação de Conteúdo" }} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gerador de Conteúdo com IA</Text>
          <Text style={styles.headerSubtitle}>
            Crie discursos, posts e respostas personalizadas
          </Text>
        </View>

        <View style={styles.typesContainer}>
          {contentTypes.map((type) => {
            const Icon = type.icon;
            return (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeButton,
                  selectedType === type.id && styles.typeButtonActive,
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <Icon 
                  size={20} 
                  color={selectedType === type.id ? "#2563eb" : "#6b7280"} 
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    selectedType === type.id && styles.typeButtonTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Descreva o que precisa</Text>
          <TextInput
            style={styles.textArea}
            placeholder={getPromptPlaceholder()}
            placeholderTextColor="#9ca3af"
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          
          <TouchableOpacity 
            style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
            onPress={generateContent}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Sparkles size={20} color="#ffffff" />
                <Text style={styles.generateButtonText}>Gerar Conteúdo</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {generatedContent && (
          <View style={styles.resultSection}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Conteúdo Gerado</Text>
              <TouchableOpacity style={styles.copyButton}>
                <Copy size={16} color="#2563eb" />
                <Text style={styles.copyButtonText}>Copiar</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.resultContent}>
              <Text style={styles.resultText}>{generatedContent}</Text>
            </View>
          </View>
        )}

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Dica</Text>
          <Text style={styles.tipText}>
            Seja específico na sua solicitação. Inclua o tema principal, 
            o público-alvo e o tom desejado para obter melhores resultados.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  typesContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  typeButtonActive: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#6b7280",
  },
  typeButtonTextActive: {
    color: "#2563eb",
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#374151",
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#111827",
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 16,
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 16,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  resultSection: {
    marginBottom: 24,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#111827",
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#eff6ff",
  },
  copyButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#2563eb",
  },
  resultContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  resultText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#374151",
  },
  tipCard: {
    backgroundColor: "#fef3c7",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#92400e",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#78350f",
  },
});
