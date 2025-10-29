import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity 
} from "react-native";
import { Stack } from "expo-router";
import { BarChart3, TrendingUp, Users, Calendar, Target, Sparkles } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import { generateText } from "@rork/toolkit-sdk";

type TimePeriod = "week" | "month" | "year";

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("month");
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState<boolean>(false);

  const periods: { id: TimePeriod; label: string }[] = [
    { id: "week", label: "Semana" },
    { id: "month", label: "Mês" },
    { id: "year", label: "Ano" },
  ];

  const metrics = [
    {
      icon: Users,
      label: "Novos Contatos",
      value: "247",
      change: "+18%",
      color: "#2563eb",
      bgColor: "#eff6ff",
    },
    {
      icon: Calendar,
      label: "Eventos Realizados",
      value: "12",
      change: "+3",
      color: "#8b5cf6",
      bgColor: "#f3e8ff",
    },
    {
      icon: Target,
      label: "Taxa de Engajamento",
      value: "68%",
      change: "+12%",
      color: "#10b981",
      bgColor: "#f0fdf4",
    },
  ];

  const chartData = [
    { label: "Seg", value: 65 },
    { label: "Ter", value: 78 },
    { label: "Qua", value: 52 },
    { label: "Qui", value: 88 },
    { label: "Sex", value: 75 },
    { label: "Sáb", value: 95 },
    { label: "Dom", value: 82 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  const generateAIInsights = async () => {
    setIsGeneratingInsights(true);
    try {
      console.log("Gerando insights com AI...");
      
      const dataContext = `
Métricas da campanha:
- Novos Contatos: 247 (+18%)
- Eventos Realizados: 12 (+3)
- Taxa de Engajamento: 68% (+12%)

Atividade da semana:
Segunda: 65, Terça: 78, Quarta: 52, Quinta: 88, Sexta: 75, Sábado: 95, Domingo: 82

Período selecionado: ${selectedPeriod === 'week' ? 'Semana' : selectedPeriod === 'month' ? 'Mês' : 'Ano'}
`;
      
      const analysis = await generateText({
        messages: [
          { 
            role: "user", 
            content: `Você é um analista de dados político experiente. Analise os seguintes dados e retorne APENAS um JSON válido (sem markdown) com insights acionáveis:
{
  "insights": ["insight 1", "insight 2", "insight 3", "insight 4"]
}

Dados:${dataContext}

Cada insight deve ser:
- Específico e baseado nos dados
- Acionável (incluir recomendações)
- Em português de Portugal
- Focado em estratégias de campanha política
- Entre 15-25 palavras` 
          }
        ]
      });
      
      const cleanJson = analysis.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsedInsights = JSON.parse(cleanJson);
      
      setAiInsights(parsedInsights.insights || []);
      console.log("Insights gerados com sucesso");
    } catch (error) {
      console.error("Erro ao gerar insights:", error);
      setAiInsights([
        "Erro ao gerar insights. Os dados são promissores e mostram crescimento constante.",
        "Continue monitorando as métricas principais para identificar tendências.",
      ]);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  useEffect(() => {
    generateAIInsights();
  }, [selectedPeriod]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Análise de Dados" }} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <BarChart3 size={40} color="#8b5cf6" />
          <Text style={styles.headerTitle}>Análise de Dados</Text>
          <Text style={styles.headerSubtitle}>
            Visualize métricas e insights da sua campanha
          </Text>
        </View>

        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodButton,
                selectedPeriod === period.id && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period.id && styles.periodButtonTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.metricsGrid}>
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <View key={index} style={styles.metricCard}>
                <View style={[styles.metricIcon, { backgroundColor: metric.bgColor }]}>
                  <Icon size={20} color={metric.color} />
                </View>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <View style={styles.metricChange}>
                  <TrendingUp size={14} color="#10b981" />
                  <Text style={styles.metricChangeText}>{metric.change}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Atividade da Semana</Text>
            <Text style={styles.chartSubtitle}>Interações diárias</Text>
          </View>

          <View style={styles.chart}>
            {chartData.map((data, index) => {
              const heightPercentage = (data.value / maxValue) * 100;
              return (
                <View key={index} style={styles.chartBarContainer}>
                  <View style={styles.chartBarWrapper}>
                    <View 
                      style={[
                        styles.chartBar, 
                        { height: `${heightPercentage}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.chartLabel}>{data.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.insightsCard}>
          <View style={styles.insightsHeader}>
            <View style={styles.insightsHeaderLeft}>
              <Sparkles size={20} color="#8b5cf6" />
              <Text style={styles.insightsTitle}>Insights Gerados por IA</Text>
            </View>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={generateAIInsights}
              disabled={isGeneratingInsights}
            >
              <Text style={styles.refreshButtonText}>
                {isGeneratingInsights ? "Gerando..." : "Atualizar"}
              </Text>
            </TouchableOpacity>
          </View>
          
          {aiInsights.length > 0 ? (
            aiInsights.map((insight, index) => {
              const colors = ["#10b981", "#f59e0b", "#2563eb", "#8b5cf6"];
              return (
                <View key={index} style={styles.insightItem}>
                  <View style={[styles.insightBullet, { backgroundColor: colors[index % colors.length] }]} />
                  <Text style={styles.insightText}>{insight}</Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.loadingText}>A gerar insights...</Text>
          )}
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
    marginBottom: 24,
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
  periodSelector: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  periodButtonActive: {
    borderColor: "#8b5cf6",
    backgroundColor: "#f3e8ff",
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#6b7280",
  },
  periodButtonTextActive: {
    color: "#8b5cf6",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#111827",
    marginBottom: 8,
  },
  metricChange: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricChangeText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#10b981",
  },
  chartCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  chartHeader: {
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#111827",
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 13,
    color: "#6b7280",
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 180,
    gap: 8,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
  },
  chartBarWrapper: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 8,
  },
  chartBar: {
    width: "100%",
    backgroundColor: "#8b5cf6",
    borderRadius: 6,
    minHeight: 10,
  },
  chartLabel: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 4,
  },
  insightsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
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
    fontSize: 14,
    lineHeight: 22,
    color: "#374151",
  },
  tipCard: {
    backgroundColor: "#f3e8ff",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#8b5cf6",
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#5b21b6",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#6b21a8",
  },
  insightsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  insightsHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#f3e8ff",
    borderWidth: 1,
    borderColor: "#d8b4fe",
  },
  refreshButtonText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#8b5cf6",
  },
  loadingText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    paddingVertical: 20,
  },
});
