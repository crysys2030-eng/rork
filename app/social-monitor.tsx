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
import { BookOpen, Hash, TrendingUp, MessageCircle, Heart, Share2 } from "lucide-react-native";
import React, { useState } from "react";
import { generateText } from "@rork/toolkit-sdk";

type SocialTrend = {
  hashtag: string;
  sentiment: "positive" | "negative" | "neutral";
  volume: number;
  engagement: string;
};

type MonitorReport = {
  overallSentiment: string;
  topHashtags: SocialTrend[];
  keyMentions: string[];
  recommendations: string[];
  threats: string[];
  opportunities: string[];
};

export default function SocialMonitorScreen() {
  const [campaignTopic, setCampaignTopic] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [report, setReport] = useState<MonitorReport | null>(null);

  const analyzeSocial = async () => {
    if (!campaignTopic.trim()) {
      Alert.alert("Erro", "Por favor, insira o tema da campanha.");
      return;
    }
    
    setIsAnalyzing(true);
    try {
      console.log("Analisando redes sociais com AI...");
      
      const analysis = await generateText({
        messages: [
          { 
            role: "user", 
            content: `Você é um especialista em monitorização de redes sociais políticas. Crie um relatório de monitorização para:

Tema da Campanha: ${campaignTopic}
Palavras-chave: ${keywords || "Não especificado"}

Retorne APENAS um JSON válido (sem markdown) com esta estrutura:
{
  "overallSentiment": "descrição do sentimento geral (50-70 palavras)",
  "topHashtags": [
    {"hashtag": "#exemplo1", "sentiment": "positive", "volume": 850, "engagement": "alto"},
    {"hashtag": "#exemplo2", "sentiment": "neutral", "volume": 420, "engagement": "médio"},
    {"hashtag": "#exemplo3", "sentiment": "negative", "volume": 180, "engagement": "baixo"}
  ],
  "keyMentions": ["menção 1", "menção 2", "menção 3"],
  "recommendations": ["recomendação 1", "recomendação 2", "recomendação 3"],
  "threats": ["ameaça 1", "ameaça 2"],
  "opportunities": ["oportunidade 1", "oportunidade 2", "oportunidade 3"]
}

O relatório deve ser realista, baseado no contexto político português e incluir dados simulados mas plausíveis.` 
          }
        ]
      });
      
      console.log("Análise recebida:", analysis.substring(0, 200));
      
      const cleanJson = analysis.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsedReport: MonitorReport = JSON.parse(cleanJson);
      
      console.log("Relatório gerado com sucesso");
      setReport(parsedReport);
    } catch (error) {
      console.error("Erro ao analisar redes sociais:", error);
      Alert.alert("Erro", "Não foi possível gerar o relatório. Por favor, tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "#10b981";
      case "negative":
        return "#dc2626";
      default:
        return "#f59e0b";
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Monitor de Redes Sociais" }} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <BookOpen size={40} color="#1d4ed8" />
          <Text style={styles.headerTitle}>Monitor de Redes Sociais</Text>
          <Text style={styles.headerSubtitle}>
            Acompanhe tendências e sentimento nas redes sociais
          </Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Tema da Campanha *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Educação, Saúde, Segurança..."
            placeholderTextColor="#9ca3af"
            value={campaignTopic}
            onChangeText={setCampaignTopic}
          />

          <Text style={styles.inputLabel}>Palavras-chave (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ex: reforma, investimento, proposta..."
            placeholderTextColor="#9ca3af"
            value={keywords}
            onChangeText={setKeywords}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />
          
          <TouchableOpacity 
            style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]}
            onPress={analyzeSocial}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <TrendingUp size={20} color="#ffffff" />
                <Text style={styles.analyzeButtonText}>Analisar Redes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {report && (
          <View style={styles.reportSection}>
            <Text style={styles.reportTitle}>Relatório de Monitorização</Text>
            
            <View style={styles.sentimentCard}>
              <View style={styles.cardHeader}>
                <MessageCircle size={20} color="#1d4ed8" />
                <Text style={styles.cardTitle}>Sentimento Geral</Text>
              </View>
              <Text style={styles.sentimentText}>{report.overallSentiment}</Text>
            </View>

            <View style={styles.hashtagsCard}>
              <View style={styles.cardHeader}>
                <Hash size={20} color="#8b5cf6" />
                <Text style={styles.cardTitle}>Hashtags em Destaque</Text>
              </View>
              {report.topHashtags.map((trend, index) => (
                <View key={index} style={styles.trendItem}>
                  <View style={styles.trendHeader}>
                    <Text style={styles.hashtagText}>{trend.hashtag}</Text>
                    <View style={[styles.sentimentBadge, { backgroundColor: getSentimentColor(trend.sentiment) + "20" }]}>
                      <Text style={[styles.sentimentBadgeText, { color: getSentimentColor(trend.sentiment) }]}>
                        {trend.sentiment === "positive" ? "Positivo" : trend.sentiment === "negative" ? "Negativo" : "Neutro"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.trendStats}>
                    <View style={styles.statItem}>
                      <TrendingUp size={14} color="#6b7280" />
                      <Text style={styles.statText}>{trend.volume} menções</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Heart size={14} color="#6b7280" />
                      <Text style={styles.statText}>Engajamento {trend.engagement}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.mentionsCard}>
              <View style={styles.cardHeader}>
                <Share2 size={20} color="#10b981" />
                <Text style={styles.cardTitle}>Menções Principais</Text>
              </View>
              {report.keyMentions.map((mention, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.listBullet} />
                  <Text style={styles.listText}>{mention}</Text>
                </View>
              ))}
            </View>

            <View style={styles.recommendationsCard}>
              <View style={styles.cardHeader}>
                <TrendingUp size={20} color="#2563eb" />
                <Text style={styles.cardTitle}>Recomendações</Text>
              </View>
              {report.recommendations.map((rec, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listNumber}>{index + 1}.</Text>
                  <Text style={styles.listText}>{rec}</Text>
                </View>
              ))}
            </View>

            <View style={styles.threatsCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>⚠️ Ameaças</Text>
              </View>
              {report.threats.map((threat, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={[styles.listBullet, { backgroundColor: "#dc2626" }]} />
                  <Text style={styles.listText}>{threat}</Text>
                </View>
              ))}
            </View>

            <View style={styles.opportunitiesCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>✨ Oportunidades</Text>
              </View>
              {report.opportunities.map((opp, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={[styles.listBullet, { backgroundColor: "#10b981" }]} />
                  <Text style={styles.listText}>{opp}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Nota</Text>
          <Text style={styles.tipText}>
            Este é um relatório simulado baseado em IA. Para dados reais de redes sociais, 
            integre com APIs oficiais do Twitter, Facebook ou Instagram.
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
    marginTop: 12,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  textArea: {
    minHeight: 60,
  },
  analyzeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#1d4ed8",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
  },
  analyzeButtonDisabled: {
    opacity: 0.6,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  reportSection: {
    marginBottom: 24,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#111827",
    marginBottom: 16,
  },
  sentimentCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  hashtagsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  mentionsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  recommendationsCard: {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  threatsCard: {
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  opportunitiesCard: {
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#111827",
  },
  sentimentText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
  },
  trendItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  trendHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  hashtagText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#8b5cf6",
  },
  sentimentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sentimentBadgeText: {
    fontSize: 11,
    fontWeight: "600" as const,
  },
  trendStats: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: "#6b7280",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  listBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1d4ed8",
    marginTop: 8,
    marginRight: 12,
  },
  listNumber: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#2563eb",
    marginRight: 8,
    minWidth: 20,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
  },
  tipCard: {
    backgroundColor: "#dbeafe",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#1d4ed8",
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#1e3a8a",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#1e40af",
  },
});
