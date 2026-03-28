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
import { MessageSquare, TrendingUp, TrendingDown, Minus } from "lucide-react-native";
import React, { useState } from "react";
import { generateText } from "@/utils/ai";

type SentimentResult = {
  overall: "positive" | "negative" | "neutral";
  score: number;
  insights: string[];
};

export default function SentimentScreen() {
  const [text, setText] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<SentimentResult | null>(null);

  const analyzeSentiment = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    try {
      console.log("Analisando sentimento com AI...");
      
      const analysis = await generateText({
        messages: [
          { 
            role: "user", 
            content: `Você é um especialista em análise de sentimento político. Analise o seguinte texto e retorne APENAS um JSON válido com esta estrutura exata:
{
  "overall": "positive" ou "negative" ou "neutral",
  "score": número de 0 a 100,
  "insights": ["insight 1", "insight 2", "insight 3"]
}

Texto para analisar: ${text}

RETORNE APENAS O JSON, SEM TEXTO ADICIONAL.` 
          }
        ]
      });
      
      console.log("Análise recebida:", analysis);
      
      let parsedResult: SentimentResult;
      try {
        const cleanJson = analysis.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsedResult = JSON.parse(cleanJson);
      } catch (parseError) {
        console.error("Erro ao fazer parse do JSON:", parseError);
        throw new Error("Formato de resposta inválido");
      }
      
      if (parsedResult.insights.length < 3) {
        parsedResult.insights = [
          ...parsedResult.insights,
          "Análise baseada em contexto político",
          "Recomenda-se monitorização contínua"
        ].slice(0, 4);
      }
      
      console.log("Análise processada com sucesso");
      setResult(parsedResult);
    } catch (error) {
      console.error("Erro ao analisar sentimento:", error);
      Alert.alert("Erro", "Não foi possível analisar o sentimento. Por favor, tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentIcon = () => {
    if (!result) return null;
    
    switch (result.overall) {
      case "positive":
        return <TrendingUp size={32} color="#10b981" />;
      case "negative":
        return <TrendingDown size={32} color="#dc2626" />;
      default:
        return <Minus size={32} color="#f59e0b" />;
    }
  };

  const getSentimentColor = () => {
    if (!result) return "#6b7280";
    
    switch (result.overall) {
      case "positive":
        return "#10b981";
      case "negative":
        return "#dc2626";
      default:
        return "#f59e0b";
    }
  };

  const getSentimentLabel = () => {
    if (!result) return "";
    
    switch (result.overall) {
      case "positive":
        return "Positivo";
      case "negative":
        return "Negativo";
      default:
        return "Neutro";
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Análise de Sentimento" }} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <MessageSquare size={40} color="#10b981" />
          <Text style={styles.headerTitle}>Análise de Sentimento</Text>
          <Text style={styles.headerSubtitle}>
            Analise o sentimento de textos, comentários ou feedback dos eleitores
          </Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Cole o texto para análise</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Ex: Comentários de redes sociais, feedback de eleitores, etc..."
            placeholderTextColor="#9ca3af"
            value={text}
            onChangeText={setText}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          
          <TouchableOpacity 
            style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]}
            onPress={analyzeSentiment}
            disabled={isAnalyzing || !text.trim()}
          >
            {isAnalyzing ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <MessageSquare size={20} color="#ffffff" />
                <Text style={styles.analyzeButtonText}>Analisar Sentimento</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {result && (
          <View style={styles.resultSection}>
            <View style={styles.scoreCard}>
              <View style={styles.scoreHeader}>
                {getSentimentIcon()}
                <View style={styles.scoreInfo}>
                  <Text style={styles.scoreLabel}>Sentimento Geral</Text>
                  <Text style={[styles.scoreValue, { color: getSentimentColor() }]}>
                    {getSentimentLabel()}
                  </Text>
                </View>
              </View>
              
              <View style={styles.scoreBarContainer}>
                <View style={styles.scoreBar}>
                  <View 
                    style={[
                      styles.scoreBarFill, 
                      { 
                        width: `${result.score}%`,
                        backgroundColor: getSentimentColor()
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.scorePercentage}>{result.score}%</Text>
              </View>
            </View>

            <View style={styles.insightsCard}>
              <Text style={styles.insightsTitle}>Insights</Text>
              {result.insights.map((insight, index) => (
                <View key={index} style={styles.insightItem}>
                  <View style={[styles.insightBullet, { backgroundColor: getSentimentColor() }]} />
                  <Text style={styles.insightText}>{insight}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Dica</Text>
          <Text style={styles.tipText}>
            Para melhores resultados, analise textos completos com contexto suficiente. 
            Comentários individuais ou posts de redes sociais funcionam muito bem.
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
    minHeight: 150,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 16,
  },
  analyzeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#10b981",
    borderRadius: 12,
    paddingVertical: 16,
  },
  analyzeButtonDisabled: {
    opacity: 0.6,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  resultSection: {
    marginBottom: 24,
  },
  scoreCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  scoreHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "700" as const,
  },
  scoreBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  scoreBar: {
    flex: 1,
    height: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 6,
    overflow: "hidden",
  },
  scoreBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  scorePercentage: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#374151",
    minWidth: 45,
  },
  insightsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#111827",
    marginBottom: 16,
  },
  insightItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  insightBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    marginRight: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
  },
  tipCard: {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#2563eb",
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#1e40af",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#1e3a8a",
  },
});
