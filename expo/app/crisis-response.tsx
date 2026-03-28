import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  Alert,
  Modal 
} from "react-native";
import { Stack } from "expo-router";
import { AlertTriangle, MessageCircle, Newspaper, Send, Copy, Save, X, Trash2, Shield } from "lucide-react-native";
import React, { useState } from "react";
import { generateText } from "@/utils/ai";
import * as Clipboard from "expo-clipboard";

type ResponseMode = "crisis" | "interview" | "news" | "talking-points";

type SavedResponse = {
  id: string;
  mode: ResponseMode;
  situation: string;
  response: string;
  date: string;
};

export default function CrisisResponseScreen() {
  const [selectedMode, setSelectedMode] = useState<ResponseMode>("crisis");
  const [situation, setSituation] = useState<string>("");
  const [generatedResponse, setGeneratedResponse] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [savedResponses, setSavedResponses] = useState<SavedResponse[]>([]);
  const [showSavedModal, setShowSavedModal] = useState<boolean>(false);

  const modes = [
    { 
      id: "crisis" as ResponseMode, 
      label: "Gestão de Crise", 
      icon: AlertTriangle,
      color: "#dc2626" 
    },
    { 
      id: "interview" as ResponseMode, 
      label: "Treino de Entrevista", 
      icon: MessageCircle,
      color: "#2563eb" 
    },
    { 
      id: "news" as ResponseMode, 
      label: "Resposta a Notícia", 
      icon: Newspaper,
      color: "#8b5cf6" 
    },
    { 
      id: "talking-points" as ResponseMode, 
      label: "Talking Points", 
      icon: Shield,
      color: "#10b981" 
    },
  ];

  const getPromptPlaceholder = () => {
    switch (selectedMode) {
      case "crisis":
        return "Descreva a situação de crise que precisa gerir...";
      case "interview":
        return "Descreva as perguntas ou tópicos da entrevista...";
      case "news":
        return "Cole o texto da notícia ou descreva o acontecimento...";
      case "talking-points":
        return "Descreva o tema para o qual precisa de pontos-chave...";
      default:
        return "Descreva a situação...";
    }
  };

  const generateResponse = async () => {
    if (!situation.trim()) {
      Alert.alert("Atenção", "Por favor, descreva a situação primeiro.");
      return;
    }
    
    setIsGenerating(true);
    try {
      console.log("Gerando resposta estratégica para:", selectedMode, situation);
      
      const systemPrompt = getSystemPromptForMode(selectedMode);
      const response = await generateText({
        messages: [
          { 
            role: "user", 
            content: `${systemPrompt}\n\nSituação: ${situation}` 
          }
        ]
      });
      
      console.log("Resposta gerada com sucesso");
      setGeneratedResponse(response);
    } catch (error) {
      console.error("Erro ao gerar resposta:", error);
      Alert.alert("Erro", "Não foi possível gerar a resposta. Por favor, tente novamente.");
      setGeneratedResponse("");
    } finally {
      setIsGenerating(false);
    }
  };

  const getSystemPromptForMode = (mode: ResponseMode): string => {
    switch (mode) {
      case "crisis":
        return `Você é um consultor especializado em gestão de crises políticas. 
Analise a situação de crise descrita e forneça:
1. Avaliação inicial da gravidade (Alto/Médio/Baixo risco)
2. Estratégia de comunicação imediata (primeiras 24h)
3. Mensagem-chave para transmitir ao público
4. Ações concretas a tomar
5. Respostas sugeridas para perguntas difíceis
6. O que evitar dizer/fazer

Seja profissional, estratégico e forneça conselhos práticos e imediatos em português de Portugal. A resposta deve ser clara, organizada e direta.`;

      case "interview":
        return `Você é um treinador de comunicação política experiente.
Com base nos tópicos da entrevista fornecidos:
1. Identifique as perguntas mais desafiadoras
2. Forneça 3-5 respostas modelo bem estruturadas
3. Dê dicas de linguagem corporal e tom
4. Sugira formas de redirecionar perguntas difíceis
5. Inclua argumentos convincentes e dados de suporte

As respostas devem ser naturais, convincentes e profissionais em português de Portugal. Foque em clareza e impacto.`;

      case "news":
        return `Você é um estrategista de comunicação política.
Analise a notícia fornecida e crie:
1. Resumo objetivo do que está a ser noticiado
2. Análise do impacto potencial (positivo/negativo/neutro)
3. Declaração oficial sugerida (200-300 palavras)
4. Pontos-chave para reforçar nas redes sociais
5. FAQ - perguntas prováveis e respostas sugeridas
6. Estratégia de follow-up

Seja equilibrado, transparente e estratégico. Use português de Portugal formal e profissional.`;

      case "talking-points":
        return `Você é um especialista em comunicação política estratégica.
Crie talking points eficazes sobre o tema fornecido:
1. 5-7 pontos-chave bem estruturados e memoráveis
2. Estatísticas ou factos de apoio para cada ponto
3. Frases de impacto e citações prontas a usar
4. Respostas a contra-argumentos comuns
5. Call-to-action claro

Os talking points devem ser concisos, impactantes e fáceis de comunicar em português de Portugal. Foque em mensagens que ressoem com o público.`;

      default:
        return "Forneça uma resposta estratégica e profissional em português de Portugal.";
    }
  };

  const saveResponse = () => {
    if (!generatedResponse) return;
    
    const newSavedResponse: SavedResponse = {
      id: Date.now().toString(),
      mode: selectedMode,
      situation: situation,
      response: generatedResponse,
      date: new Date().toISOString(),
    };
    
    setSavedResponses([newSavedResponse, ...savedResponses]);
    Alert.alert("Sucesso", "Resposta guardada com sucesso!");
  };

  const deleteResponse = (id: string) => {
    Alert.alert(
      "Eliminar Resposta",
      "Tem certeza que deseja eliminar esta resposta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            setSavedResponses(savedResponses.filter((r) => r.id !== id));
            Alert.alert("Sucesso", "Resposta eliminada com sucesso!");
          },
        },
      ]
    );
  };

  const loadResponse = (saved: SavedResponse) => {
    setSelectedMode(saved.mode);
    setSituation(saved.situation);
    setGeneratedResponse(saved.response);
    setShowSavedModal(false);
  };

  const copyToClipboard = async () => {
    if (!generatedResponse) return;
    
    try {
      await Clipboard.setStringAsync(generatedResponse);
      Alert.alert("Sucesso", "Resposta copiada para a área de transferência!");
    } catch (error) {
      console.error("Erro ao copiar:", error);
      Alert.alert("Erro", "Não foi possível copiar a resposta.");
    }
  };

  const getModeColor = (modeId: ResponseMode) => {
    const mode = modes.find(m => m.id === modeId);
    return mode?.color || "#6b7280";
  };

  const getModeLabel = (modeId: ResponseMode) => {
    const mode = modes.find(m => m.id === modeId);
    return mode?.label || "";
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: "Gestão de Crises",
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => setShowSavedModal(true)}
              style={styles.headerButton}
            >
              <Text style={styles.headerButtonText}>
                Guardadas ({savedResponses.length})
              </Text>
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Resposta Rápida e Estratégica</Text>
          <Text style={styles.headerSubtitle}>
            Gestão de crises, treino de entrevistas e respostas a notícias em tempo real
          </Text>
        </View>

        <View style={styles.modesGrid}>
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.modeCard,
                  selectedMode === mode.id && styles.modeCardActive,
                  { borderColor: selectedMode === mode.id ? mode.color : "#e5e7eb" }
                ]}
                onPress={() => setSelectedMode(mode.id)}
              >
                <View style={[styles.modeIcon, { backgroundColor: mode.color + "15" }]}>
                  <Icon size={20} color={mode.color} />
                </View>
                <Text
                  style={[
                    styles.modeLabel,
                    selectedMode === mode.id && { color: mode.color }
                  ]}
                >
                  {mode.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Descreva a Situação</Text>
          <TextInput
            style={styles.textArea}
            placeholder={getPromptPlaceholder()}
            placeholderTextColor="#9ca3af"
            value={situation}
            onChangeText={setSituation}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          
          <TouchableOpacity 
            style={[
              styles.generateButton,
              { backgroundColor: getModeColor(selectedMode) },
              isGenerating && styles.generateButtonDisabled
            ]}
            onPress={generateResponse}
            disabled={isGenerating || !situation.trim()}
          >
            {isGenerating ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Send size={20} color="#ffffff" />
                <Text style={styles.generateButtonText}>Gerar Resposta Estratégica</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {generatedResponse && (
          <View style={styles.resultSection}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Resposta Estratégica</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton} onPress={saveResponse}>
                  <Save size={16} color="#10b981" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={copyToClipboard}>
                  <Copy size={16} color="#2563eb" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={[styles.resultContent, { borderLeftColor: getModeColor(selectedMode) }]}>
              <Text style={styles.resultText}>{generatedResponse}</Text>
            </View>
          </View>
        )}

        <View style={styles.tipCard}>
          <AlertTriangle size={20} color="#f59e0b" />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Importante</Text>
            <Text style={styles.tipText}>
              Estas sugestões são geradas por IA e devem ser revistas e adaptadas por 
              profissionais antes de serem utilizadas em situações reais.
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showSavedModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSavedModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Respostas Guardadas</Text>
              <TouchableOpacity onPress={() => setShowSavedModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {savedResponses.length === 0 ? (
                <View style={styles.emptyState}>
                  <AlertTriangle size={48} color="#d1d5db" />
                  <Text style={styles.emptyStateText}>Nenhuma resposta guardada</Text>
                </View>
              ) : (
                savedResponses.map((saved) => (
                  <View key={saved.id} style={styles.savedCard}>
                    <TouchableOpacity 
                      style={styles.savedCardContent}
                      onPress={() => loadResponse(saved)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.savedCardHeader}>
                        <View style={[
                          styles.savedModeBadge, 
                          { backgroundColor: getModeColor(saved.mode) + "20" }
                        ]}>
                          <Text style={[
                            styles.savedModeText, 
                            { color: getModeColor(saved.mode) }
                          ]}>
                            {getModeLabel(saved.mode)}
                          </Text>
                        </View>
                        <Text style={styles.savedCardDate}>
                          {new Date(saved.date).toLocaleDateString("pt-PT", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </View>
                      <Text style={styles.savedCardSituation} numberOfLines={2}>
                        {saved.situation}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteResponse(saved.id)}
                    >
                      <Trash2 size={16} color="#dc2626" />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  headerButton: {
    marginRight: 16,
  },
  headerButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#2563eb",
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
    lineHeight: 20,
  },
  modesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  modeCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    alignItems: "center",
    gap: 8,
  },
  modeCardActive: {
    backgroundColor: "#f8fafc",
  },
  modeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  modeLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#6b7280",
    textAlign: "center",
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
    minHeight: 150,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 16,
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
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
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  resultContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderLeftWidth: 4,
  },
  resultText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#374151",
  },
  tipCard: {
    flexDirection: "row",
    backgroundColor: "#fef3c7",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  tipContent: {
    flex: 1,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#111827",
  },
  modalBody: {
    padding: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 16,
  },
  savedCard: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
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
  savedModeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  savedModeText: {
    fontSize: 11,
    fontWeight: "600" as const,
  },
  savedCardDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  savedCardSituation: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
});
