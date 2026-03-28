import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  Alert 
} from "react-native";
import { Stack } from "expo-router";
import { MessageCircle, Lightbulb, AlertCircle } from "lucide-react-native";
import React, { useState } from "react";
import { generateText } from "@/utils/ai";

type DebatePoint = {
  argument: string;
  counterArgument: string;
  keyPoints: string[];
};

export default function DebateScreen() {
  const [topic, setTopic] = useState<string>("");
  const [isPreparing, setIsPreparing] = useState<boolean>(false);
  const [debatePoints, setDebatePoints] = useState<DebatePoint[]>([]);

  const prepareDebate = async () => {
    if (!topic.trim()) return;
    
    setIsPreparing(true);
    try {
      console.log("Preparando debate com AI para:", topic);
      
      const analysis = await generateText({
        messages: [
          { 
            role: "user", 
            content: `Você é um consultor especializado em preparação de debates políticos. Prepare 3 pontos de debate para o seguinte tema: "${topic}"

Retorne APENAS um JSON válido (sem markdown) com esta estrutura:
[
  {
    "argument": "argumento principal",
    "counterArgument": "como responder a críticas",
    "keyPoints": ["ponto 1", "ponto 2", "ponto 3"]
  },
  ... (mais 2 objetos)
]

Os argumentos devem ser em português de Portugal, profissionais, persuasivos e baseados em factos. Cada ponto-chave deve ser acionável e específico.` 
          }
        ]
      });
      
      console.log("Análise recebida:", analysis.substring(0, 200));
      
      let parsedPoints: DebatePoint[];
      try {
        const cleanJson = analysis.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsedPoints = JSON.parse(cleanJson);
        
        if (!Array.isArray(parsedPoints) || parsedPoints.length === 0) {
          throw new Error("Formato inválido");
        }
        
        parsedPoints = parsedPoints.map(point => ({
          ...point,
          keyPoints: point.keyPoints.slice(0, 3)
        }));
        
      } catch (parseError) {
        console.error("Erro ao fazer parse do JSON:", parseError);
        throw new Error("Formato de resposta inválido");
      }
      
      console.log("Debate preparado com sucesso");
      setDebatePoints(parsedPoints);
    } catch (error) {
      console.error("Erro ao preparar debate:", error);
      Alert.alert("Erro", "Não foi possível preparar o debate. Por favor, tente novamente.");
    } finally {
      setIsPreparing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Assistente de Debate" }} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <MessageCircle size={40} color="#f59e0b" />
          <Text style={styles.headerTitle}>Assistente de Debate</Text>
          <Text style={styles.headerSubtitle}>
            Prepare argumentos, respostas e pontos-chave para debates políticos
          </Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Tema do Debate</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Ex: Política de saúde pública, reforma educacional, segurança..."
            placeholderTextColor="#9ca3af"
            value={topic}
            onChangeText={setTopic}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          
          <TouchableOpacity 
            style={[styles.prepareButton, isPreparing && styles.prepareButtonDisabled]}
            onPress={prepareDebate}
            disabled={isPreparing || !topic.trim()}
          >
            {isPreparing ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Lightbulb size={20} color="#ffffff" />
                <Text style={styles.prepareButtonText}>Preparar Debate</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {debatePoints.length > 0 && (
          <View style={styles.pointsSection}>
            <Text style={styles.pointsTitle}>Pontos de Debate</Text>
            
            {debatePoints.map((point, index) => (
              <View key={index} style={styles.pointCard}>
                <View style={styles.pointHeader}>
                  <View style={styles.pointNumber}>
                    <Text style={styles.pointNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.pointArgument}>{point.argument}</Text>
                </View>

                <View style={styles.counterSection}>
                  <View style={styles.counterHeader}>
                    <AlertCircle size={16} color="#dc2626" />
                    <Text style={styles.counterTitle}>Contra-argumento</Text>
                  </View>
                  <Text style={styles.counterText}>{point.counterArgument}</Text>
                </View>

                <View style={styles.keyPointsSection}>
                  <Text style={styles.keyPointsTitle}>Pontos-Chave</Text>
                  {point.keyPoints.map((keyPoint, idx) => (
                    <View key={idx} style={styles.keyPointItem}>
                      <View style={styles.keyPointBullet} />
                      <Text style={styles.keyPointText}>{keyPoint}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Dicas para o Debate</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>1.</Text>
            <Text style={styles.tipText}>Mantenha a calma e respire fundo antes de responder</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>2.</Text>
            <Text style={styles.tipText}>Escute atentamente os argumentos do oponente</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>3.</Text>
            <Text style={styles.tipText}>Use dados concretos e evite generalizações</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>4.</Text>
            <Text style={styles.tipText}>Mantenha contato visual com a audiência</Text>
          </View>
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
    alignItems: "center",
    marginBottom: 32,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#111827",
    marginTop: 12,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
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
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 16,
  },
  prepareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#f59e0b",
    borderRadius: 12,
    paddingVertical: 16,
  },
  prepareButtonDisabled: {
    opacity: 0.6,
  },
  prepareButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  pointsSection: {
    marginBottom: 24,
  },
  pointsTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#111827",
    marginBottom: 16,
  },
  pointCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  pointHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },
  pointNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fef3c7",
    alignItems: "center",
    justifyContent: "center",
  },
  pointNumberText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#f59e0b",
  },
  pointArgument: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#111827",
    lineHeight: 24,
  },
  counterSection: {
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  counterHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  counterTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#dc2626",
  },
  counterText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#7f1d1d",
  },
  keyPointsSection: {
    marginTop: 4,
  },
  keyPointsTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#374151",
    marginBottom: 12,
  },
  keyPointItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  keyPointBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#f59e0b",
    marginTop: 7,
    marginRight: 12,
  },
  keyPointText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#4b5563",
  },
  tipsCard: {
    backgroundColor: "#fef3c7",
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#92400e",
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  tipNumber: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#92400e",
    marginRight: 8,
    minWidth: 20,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#78350f",
  },
});
