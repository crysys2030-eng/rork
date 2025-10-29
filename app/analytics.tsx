import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity 
} from "react-native";
import { Stack } from "expo-router";
import { BarChart3, TrendingUp, Users, Calendar, Target } from "lucide-react-native";
import React, { useState } from "react";

type TimePeriod = "week" | "month" | "year";

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("month");

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
          <Text style={styles.insightsTitle}>Insights Principais</Text>
          
          <View style={styles.insightItem}>
            <View style={[styles.insightBullet, { backgroundColor: "#10b981" }]} />
            <Text style={styles.insightText}>
              O engajamento aumentou 18% nas últimas duas semanas
            </Text>
          </View>

          <View style={styles.insightItem}>
            <View style={[styles.insightBullet, { backgroundColor: "#f59e0b" }]} />
            <Text style={styles.insightText}>
              Eventos aos fins de semana têm 35% mais participação
            </Text>
          </View>

          <View style={styles.insightItem}>
            <View style={[styles.insightBullet, { backgroundColor: "#2563eb" }]} />
            <Text style={styles.insightText}>
              Posts sobre educação geram 2x mais interações
            </Text>
          </View>

          <View style={styles.insightItem}>
            <View style={[styles.insightBullet, { backgroundColor: "#8b5cf6" }]} />
            <Text style={styles.insightText}>
              O melhor horário para publicar é entre 18h e 20h
            </Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Recomendação</Text>
          <Text style={styles.tipText}>
            Continue focando em conteúdo sobre educação e programe mais eventos para 
            fins de semana para maximizar o engajamento com a sua base eleitoral.
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
});
