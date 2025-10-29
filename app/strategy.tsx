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
import { Lightbulb, Target, Users, Calendar, TrendingUp, DollarSign } from "lucide-react-native";
import React, { useState } from "react";
import { generateText } from "@rork/toolkit-sdk";

type Strategy = {
  objective: string;
  targetAudience: string;
  channels: string[];
  timeline: string;
  budget: string;
  keyActions: string[];
  metrics: string[];
};

export default function StrategyScreen() {
  const [campaignName, setCampaignName] = useState<string>("");
  const [campaignGoals, setCampaignGoals] = useState<string>("");
  const [targetGroup, setTargetGroup] = useState<string>("");
  const [budgetRange, setBudgetRange] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [strategy, setStrategy] = useState<Strategy | null>(null);

  const generateStrategy = async () => {
    if (!campaignName.trim() || !campaignGoals.trim()) {
      Alert.alert("Erro", "Por favor, preencha pelo menos o nome e objetivos da campanha.");
      return;
    }
    
    setIsGenerating(true);
    try {
      console.log("Gerando estratégia com AI...");
      
      const analysis = await generateText({
        messages: [
          { 
            role: "user", 
            content: `Você é um estrategista político experiente. Crie uma estratégia de campanha detalhada e profissional para:

Nome da Campanha: ${campaignName}
Objetivos: ${campaignGoals}
Público-Alvo: ${targetGroup || "Não especificado"}
Orçamento: ${budgetRange || "Não especificado"}

Retorne APENAS um JSON válido (sem markdown) com esta estrutura:
{
  "objective": "objetivo principal claro e mensurável",
  "targetAudience": "descrição detalhada do público-alvo",
  "channels": ["canal 1", "canal 2", "canal 3", "canal 4"],
  "timeline": "cronograma sugerido",
  "budget": "distribuição orçamental sugerida",
  "keyActions": ["ação 1", "ação 2", "ação 3", "ação 4"],
  "metrics": ["métrica 1", "métrica 2", "métrica 3"]
}

A estratégia deve ser específica, acionável e adaptada ao contexto político português.` 
          }
        ]
      });
      
      console.log("Estratégia recebida:", analysis.substring(0, 200));
      
      const cleanJson = analysis.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsedStrategy: Strategy = JSON.parse(cleanJson);
      
      console.log("Estratégia gerada com sucesso");
      setStrategy(parsedStrategy);
    } catch (error) {
      console.error("Erro ao gerar estratégia:", error);
      Alert.alert("Erro", "Não foi possível gerar a estratégia. Por favor, tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Criador de Estratégias" }} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Lightbulb size={40} color="#dc2626" />
          <Text style={styles.headerTitle}>Criador de Estratégias</Text>
          <Text style={styles.headerSubtitle}>
            Planeje estratégias personalizadas baseadas em IA
          </Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Nome da Campanha *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Campanha Autárquicas 2025"
            placeholderTextColor="#9ca3af"
            value={campaignName}
            onChangeText={setCampaignName}
          />

          <Text style={styles.inputLabel}>Objetivos da Campanha *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ex: Aumentar notoriedade, engajar jovens eleitores..."
            placeholderTextColor="#9ca3af"
            value={campaignGoals}
            onChangeText={setCampaignGoals}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <Text style={styles.inputLabel}>Público-Alvo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Residentes de Lisboa, 25-45 anos"
            placeholderTextColor="#9ca3af"
            value={targetGroup}
            onChangeText={setTargetGroup}
          />

          <Text style={styles.inputLabel}>Orçamento Disponível</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 50.000€"
            placeholderTextColor="#9ca3af"
            value={budgetRange}
            onChangeText={setBudgetRange}
          />
          
          <TouchableOpacity 
            style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
            onPress={generateStrategy}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Lightbulb size={20} color="#ffffff" />
                <Text style={styles.generateButtonText}>Gerar Estratégia</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {strategy && (
          <View style={styles.strategySection}>
            <Text style={styles.strategyTitle}>Estratégia Gerada</Text>
            
            <View style={styles.strategyCard}>
              <View style={styles.strategyHeader}>
                <Target size={20} color="#dc2626" />
                <Text style={styles.strategyCardTitle}>Objetivo Principal</Text>
              </View>
              <Text style={styles.strategyText}>{strategy.objective}</Text>
            </View>

            <View style={styles.strategyCard}>
              <View style={styles.strategyHeader}>
                <Users size={20} color="#8b5cf6" />
                <Text style={styles.strategyCardTitle}>Público-Alvo</Text>
              </View>
              <Text style={styles.strategyText}>{strategy.targetAudience}</Text>
            </View>

            <View style={styles.strategyCard}>
              <View style={styles.strategyHeader}>
                <TrendingUp size={20} color="#10b981" />
                <Text style={styles.strategyCardTitle}>Canais de Comunicação</Text>
              </View>
              {strategy.channels.map((channel, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.listBullet} />
                  <Text style={styles.listText}>{channel}</Text>
                </View>
              ))}
            </View>

            <View style={styles.strategyCard}>
              <View style={styles.strategyHeader}>
                <Calendar size={20} color="#f59e0b" />
                <Text style={styles.strategyCardTitle}>Cronograma</Text>
              </View>
              <Text style={styles.strategyText}>{strategy.timeline}</Text>
            </View>

            <View style={styles.strategyCard}>
              <View style={styles.strategyHeader}>
                <DollarSign size={20} color="#2563eb" />
                <Text style={styles.strategyCardTitle}>Distribuição Orçamental</Text>
              </View>
              <Text style={styles.strategyText}>{strategy.budget}</Text>
            </View>

            <View style={styles.strategyCard}>
              <View style={styles.strategyHeader}>
                <Lightbulb size={20} color="#f59e0b" />
                <Text style={styles.strategyCardTitle}>Ações-Chave</Text>
              </View>
              {strategy.keyActions.map((action, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listNumber}>{index + 1}.</Text>
                  <Text style={styles.listText}>{action}</Text>
                </View>
              ))}
            </View>

            <View style={styles.strategyCard}>
              <View style={styles.strategyHeader}>
                <TrendingUp size={20} color="#10b981" />
                <Text style={styles.strategyCardTitle}>Métricas de Sucesso</Text>
              </View>
              {strategy.metrics.map((metric, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.listBullet} />
                  <Text style={styles.listText}>{metric}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Dica</Text>
          <Text style={styles.tipText}>
            Quanto mais detalhes fornecer sobre os objetivos e contexto da campanha, 
            mais personalizada e eficaz será a estratégia gerada.
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
    minHeight: 80,
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#dc2626",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  strategySection: {
    marginBottom: 24,
  },
  strategyTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#111827",
    marginBottom: 16,
  },
  strategyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  strategyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  strategyCardTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#111827",
  },
  strategyText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
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
    backgroundColor: "#dc2626",
    marginTop: 8,
    marginRight: 12,
  },
  listNumber: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#dc2626",
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
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#dc2626",
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#991b1b",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#7f1d1d",
  },
});
