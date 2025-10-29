import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Target, 
  X, 
  MessageSquare,
  Lightbulb,
  BarChart3,
  BookOpen,
  Sparkles,
  MessageCircle
} from "lucide-react-native";
import React, { useState } from "react";

export default function DashboardScreen() {
  const router = useRouter();
  const [showCampaignModal, setShowCampaignModal] = useState<boolean>(false);
  const [campaignName, setCampaignName] = useState<string>("");

  const handleNewContact = () => {
    router.push("/(tabs)/contacts");
  };

  const handleNewEvent = () => {
    router.push("/(tabs)/agenda");
  };

  const handleNewCampaign = () => {
    setShowCampaignModal(true);
  };

  const handleSentimentAnalysis = () => {
    router.push("/sentiment");
  };

  const handleSloganGenerator = () => {
    router.push("/(tabs)/content");
  };

  const handleDebateAssistant = () => {
    router.push("/debate");
  };

  const handleDataAnalysis = () => {
    router.push("/analytics");
  };

  const handleStrategyCreator = () => {
    router.push("/strategy");
  };

  const handleSocialMonitor = () => {
    router.push("/social-monitor");
  };

  const createCampaign = () => {
    if (!campaignName.trim()) {
      Alert.alert("Erro", "Por favor, insira um nome para a campanha.");
      return;
    }

    Alert.alert("Sucesso", `Campanha "${campaignName}" criada com sucesso!`);
    setShowCampaignModal(false);
    setCampaignName("");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Dashboard" }} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gestão de Campanha</Text>
          <Text style={styles.headerSubtitle}>Visão geral das suas atividades</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Users size={24} color="#2563eb" />
            </View>
            <Text style={styles.statValue}>1.247</Text>
            <Text style={styles.statLabel}>Contatos</Text>
            <View style={styles.statChange}>
              <TrendingUp size={14} color="#10b981" />
              <Text style={styles.statChangeText}>+12%</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Calendar size={24} color="#8b5cf6" />
            </View>
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>Eventos</Text>
            <View style={styles.statChange}>
              <TrendingUp size={14} color="#10b981" />
              <Text style={styles.statChangeText}>+3</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximos Eventos</Text>
          <View style={styles.eventCard}>
            <View style={styles.eventDate}>
              <Text style={styles.eventDateDay}>15</Text>
              <Text style={styles.eventDateMonth}>DEZ</Text>
            </View>
            <View style={styles.eventDetails}>
              <Text style={styles.eventTitle}>Comício Municipal</Text>
              <Text style={styles.eventLocation}>Praça Central - 18:00</Text>
            </View>
          </View>

          <View style={styles.eventCard}>
            <View style={styles.eventDate}>
              <Text style={styles.eventDateDay}>18</Text>
              <Text style={styles.eventDateMonth}>DEZ</Text>
            </View>
            <View style={styles.eventDetails}>
              <Text style={styles.eventTitle}>Reunião com Apoiadores</Text>
              <Text style={styles.eventLocation}>Sede Local - 16:00</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton} onPress={handleNewContact}>
              <Users size={20} color="#2563eb" />
              <Text style={styles.actionButtonText}>Novo Contato</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleNewEvent}>
              <Calendar size={20} color="#2563eb" />
              <Text style={styles.actionButtonText}>Criar Evento</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleNewCampaign}>
              <Target size={20} color="#2563eb" />
              <Text style={styles.actionButtonText}>Nova Campanha</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ferramentas com IA</Text>
          <View style={styles.toolsGrid}>
            <TouchableOpacity style={styles.toolCard} onPress={handleSloganGenerator}>
              <View style={[styles.toolIcon, { backgroundColor: "#eff6ff" }]}>
                <Sparkles size={24} color="#2563eb" />
              </View>
              <Text style={styles.toolTitle}>Gerador de Conteúdo</Text>
              <Text style={styles.toolDescription}>Crie discursos e posts</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolCard} onPress={handleSentimentAnalysis}>
              <View style={[styles.toolIcon, { backgroundColor: "#f0fdf4" }]}>
                <MessageSquare size={24} color="#10b981" />
              </View>
              <Text style={styles.toolTitle}>Análise de Sentimento</Text>
              <Text style={styles.toolDescription}>Sentimento dos eleitores</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolCard} onPress={handleDebateAssistant}>
              <View style={[styles.toolIcon, { backgroundColor: "#fef3c7" }]}>
                <MessageCircle size={24} color="#f59e0b" />
              </View>
              <Text style={styles.toolTitle}>Assistente de Debate</Text>
              <Text style={styles.toolDescription}>Prepare argumentos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolCard} onPress={handleDataAnalysis}>
              <View style={[styles.toolIcon, { backgroundColor: "#f3e8ff" }]}>
                <BarChart3 size={24} color="#8b5cf6" />
              </View>
              <Text style={styles.toolTitle}>Análise de Dados</Text>
              <Text style={styles.toolDescription}>Métricas e insights</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolCard} onPress={handleStrategyCreator}>
              <View style={[styles.toolIcon, { backgroundColor: "#fee2e2" }]}>
                <Lightbulb size={24} color="#dc2626" />
              </View>
              <Text style={styles.toolTitle}>Criador de Estratégias</Text>
              <Text style={styles.toolDescription}>Planeje campanhas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolCard} onPress={handleSocialMonitor}>
              <View style={[styles.toolIcon, { backgroundColor: "#dbeafe" }]}>
                <BookOpen size={24} color="#1d4ed8" />
              </View>
              <Text style={styles.toolTitle}>Monitor de Redes</Text>
              <Text style={styles.toolDescription}>Acompanhe tendências</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showCampaignModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCampaignModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Campanha</Text>
              <TouchableOpacity onPress={() => setShowCampaignModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Nome da Campanha</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Campanha Autárquicas 2025"
                value={campaignName}
                onChangeText={setCampaignName}
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCampaignModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={createCampaign}>
                <Text style={styles.saveButtonText}>Criar</Text>
              </TouchableOpacity>
            </View>
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
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#111827",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 8,
  },
  statChange: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statChangeText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#10b981",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#111827",
    marginBottom: 12,
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  eventDate: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  eventDateDay: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#2563eb",
  },
  eventDateMonth: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#2563eb",
  },
  eventDetails: {
    flex: 1,
    justifyContent: "center",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#111827",
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: "#6b7280",
  },
  actionsGrid: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  actionButton: {
    flex: 1,
    minWidth: 100,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#2563eb",
    textAlign: "center",
  },
  toolsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  toolCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  toolTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#111827",
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
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
  inputLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#6b7280",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
});
