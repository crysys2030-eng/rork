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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const words = text.toLowerCase();
      let score = 50;
      
      const positiveWords = ["ótimo", "excelente", "bom", "melhor", "apoio", "concordo", "gosto", "parabéns"];
      const negativeWords = ["ruim", "péssimo", "contra", "discordo", "não gosto", "problema", "erro"];
      
      positiveWords.forEach(word => {
        if (words.includes(word)) score += 10;
      });
      
      negativeWords.forEach(word => {
        if (words.includes(word)) score -= 10;
      });
      
      score = Math.max(0, Math.min(100, score));
      
      let overall: "positive" | "negative" | "neutral" = "neutral";
      if (score > 60) overall = "positive";
      else if (score < 40) overall = "negative";
      
      const insights: string[] = [];
      if (overall === "positive") {
        insights.push("O sentimento geral é positivo");
        insights.push("Boa recepção do público");
        insights.push("Continue com esta abordagem");
      } else if (overall === "negative") {
        insights.push("O sentimento geral é negativo");
        insights.push("Considere ajustar a mensagem");
        insights.push("Responda às preocupações levantadas");
      } else {
        insights.push("O sentimento é neutro");
        insights.push("Pode precisar de uma mensagem mais clara");
        insights.push("Tente ser mais específico");
      }
      
      setResult({ overall, score, insights });
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      Alert.alert("Erro", "Não foi possível analisar o sentimento.");
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
