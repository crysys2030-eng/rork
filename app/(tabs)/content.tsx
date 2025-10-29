import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  Alert,
  Platform 
} from "react-native";
import { Stack } from "expo-router";
import { Sparkles, FileText, Share2, Copy, Download, Trash2, Save } from "lucide-react-native";
import React, { useState } from "react";
import { generateText } from "@rork/toolkit-sdk";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";

type ContentType = "speech" | "social" | "response" | "analysis";

type SavedContent = {
  id: string;
  type: ContentType;
  prompt: string;
  content: string;
  date: string;
};

export default function ContentScreen() {
  const [selectedType, setSelectedType] = useState<ContentType>("speech");
  const [prompt, setPrompt] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [savedContents, setSavedContents] = useState<SavedContent[]>([]);

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

  const saveContent = () => {
    if (!generatedContent) return;
    
    const newSavedContent: SavedContent = {
      id: Date.now().toString(),
      type: selectedType,
      prompt: prompt,
      content: generatedContent,
      date: new Date().toISOString(),
    };
    
    setSavedContents([newSavedContent, ...savedContents]);
    Alert.alert("Sucesso", "Conteúdo guardado com sucesso!");
  };

  const deleteSavedContent = (id: string) => {
    Alert.alert(
      "Eliminar Conteúdo",
      "Tem certeza que deseja eliminar este conteúdo?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            setSavedContents(savedContents.filter(c => c.id !== id));
            Alert.alert("Sucesso", "Conteúdo eliminado com sucesso!");
          },
        },
      ]
    );
  };

  const loadContent = (saved: SavedContent) => {
    setSelectedType(saved.type);
    setPrompt(saved.prompt);
    setGeneratedContent(saved.content);
  };

  const copyToClipboard = async () => {
    if (!generatedContent) return;
    
    try {
      await Clipboard.setStringAsync(generatedContent);
      Alert.alert("Sucesso", "Conteúdo copiado para a área de transferência!");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      Alert.alert("Erro", "Não foi possível copiar o conteúdo.");
    }
  };

  const generatePDF = async () => {
    if (!generatedContent) return;
    
    try {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                padding: 40px;
                line-height: 1.6;
                color: #333;
              }
              h1 {
                color: #2563eb;
                margin-bottom: 20px;
                font-size: 24px;
              }
              .content {
                white-space: pre-wrap;
                font-size: 14px;
              }
              .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                font-size: 12px;
                color: #6b7280;
              }
            </style>
          </head>
          <body>
            <h1>${getContentTypeTitle()}</h1>
            <div class="content">${generatedContent.replace(/\n/g, '<br>')}</div>
            <div class="footer">
              Gerado em ${new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      
      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        link.href = uri;
        link.download = `conteudo-${Date.now()}.pdf`;
        link.click();
        Alert.alert("Sucesso", "PDF gerado com sucesso!");
      } else {
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert("PDF Gerado", `PDF salvo em: ${uri}`);
        }
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Erro", "Não foi possível gerar o PDF.");
    }
  };

  const getContentTypeTitle = () => {
    switch (selectedType) {
      case "speech":
        return "Discurso Político";
      case "social":
        return "Conteúdo para Redes Sociais";
      case "response":
        return "Resposta Estratégica";
      default:
        return "Conteúdo Gerado";
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
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton} onPress={saveContent}>
                  <Save size={16} color="#f59e0b" />
                  <Text style={[styles.actionButtonText, { color: "#f59e0b" }]}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={copyToClipboard}>
                  <Copy size={16} color="#2563eb" />
                  <Text style={styles.actionButtonText}>Copiar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={generatePDF}>
                  <Download size={16} color="#10b981" />
                  <Text style={[styles.actionButtonText, { color: "#10b981" }]}>PDF</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.resultContent}>
              <Text style={styles.resultText}>{generatedContent}</Text>
            </View>
          </View>
        )}

        {savedContents.length > 0 && (
          <View style={styles.savedSection}>
            <Text style={styles.savedTitle}>Conteúdos Guardados</Text>
            {savedContents.map((saved) => (
              <TouchableOpacity 
                key={saved.id} 
                style={styles.savedCard}
                onPress={() => loadContent(saved)}
              >
                <View style={styles.savedCardContent}>
                  <View style={styles.savedCardHeader}>
                    <Text style={styles.savedCardType}>{getContentTypeTitle()}</Text>
                    <Text style={styles.savedCardDate}>
                      {new Date(saved.date).toLocaleDateString("pt-PT", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                  <Text style={styles.savedCardPrompt} numberOfLines={2}>
                    {saved.prompt}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.savedDeleteButton}
                  onPress={(e) => {
                    if (e && e.stopPropagation) {
                      e.stopPropagation();
                    }
                    deleteSavedContent(saved.id);
                  }}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Trash2 size={18} color="#dc2626" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Dica</Text>
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
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  actionButtonText: {
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
  savedSection: {
    marginBottom: 24,
  },
  savedTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#111827",
    marginBottom: 16,
  },
  savedCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  savedCardContent: {
    flex: 1,
  },
  savedCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  savedCardType: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#2563eb",
  },
  savedCardDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  savedCardPrompt: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  savedDeleteButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
});
