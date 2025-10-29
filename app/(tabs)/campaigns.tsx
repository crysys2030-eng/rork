import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  Alert 
} from "react-native";
import { Stack } from "expo-router";
import { Target, Search, Plus, X, Calendar, Users, TrendingUp, Trash2 } from "lucide-react-native";
import React, { useState } from "react";

type Campaign = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "active" | "planned" | "completed";
  budget: string;
  targetAudience: string;
};

export default function CampaignsScreen() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "Campanha Autárquicas 2025",
      description: "Campanha principal para eleições autárquicas focada em educação e segurança",
      startDate: "2024-11-01",
      endDate: "2025-03-15",
      status: "active",
      budget: "50.000€",
      targetAudience: "Residentes de Lisboa",
    },
    {
      id: "2",
      name: "Campanha Digital Juventude",
      description: "Iniciativa digital para engajar jovens eleitores nas redes sociais",
      startDate: "2024-12-01",
      endDate: "2025-02-28",
      status: "active",
      budget: "15.000€",
      targetAudience: "Jovens 18-35 anos",
    },
    {
      id: "3",
      name: "Campanha Porta a Porta",
      description: "Contacto direto com eleitores em bairros prioritários",
      startDate: "2025-01-15",
      endDate: "2025-03-01",
      status: "planned",
      budget: "8.000€",
      targetAudience: "Famílias em zonas suburbanas",
    },
  ]);

  const [newCampaign, setNewCampaign] = useState<{
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: "active" | "planned" | "completed";
    budget: string;
    targetAudience: string;
  }>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "planned",
    budget: "",
    targetAudience: "",
  });

  const addCampaign = () => {
    if (!newCampaign.name || !newCampaign.startDate || !newCampaign.endDate) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const campaign: Campaign = {
      id: Date.now().toString(),
      ...newCampaign,
    };

    setCampaigns([...campaigns, campaign]);
    setShowAddModal(false);
    setNewCampaign({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "planned",
      budget: "",
      targetAudience: "",
    });
    Alert.alert("Sucesso", "Campanha criada com sucesso!");
  };

  const deleteCampaign = (id: string) => {
    Alert.alert(
      "Eliminar Campanha",
      "Tem certeza que deseja eliminar esta campanha?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            setCampaigns(campaigns.filter(c => c.id !== id));
            Alert.alert("Sucesso", "Campanha eliminada com sucesso!");
          },
        },
      ]
    );
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#10b981";
      case "planned":
        return "#f59e0b";
      case "completed":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativa";
      case "planned":
        return "Planeada";
      case "completed":
        return "Concluída";
      default:
        return "Outro";
    }
  };

  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Campanhas" }} />
      
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Procurar campanhas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>
        
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Plus size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {filteredCampaigns.map((campaign) => (
          <View key={campaign.id} style={styles.campaignCard}>
            <View style={styles.campaignHeader}>
              <View style={styles.campaignTitleRow}>
                <Target size={20} color="#2563eb" />
                <Text style={styles.campaignName}>{campaign.name}</Text>
              </View>
              <View style={styles.campaignHeaderRight}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(campaign.status) + "20" }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(campaign.status) }]}>
                    {getStatusLabel(campaign.status)}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => deleteCampaign(campaign.id)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Trash2 size={18} color="#dc2626" />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.campaignDescription}>{campaign.description}</Text>

            <View style={styles.campaignDetails}>
              <View style={styles.detailRow}>
                <Calendar size={16} color="#6b7280" />
                <Text style={styles.detailText}>
                  {new Date(campaign.startDate).toLocaleDateString("pt-PT")} - {new Date(campaign.endDate).toLocaleDateString("pt-PT")}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Users size={16} color="#6b7280" />
                <Text style={styles.detailText}>{campaign.targetAudience}</Text>
              </View>

              <View style={styles.detailRow}>
                <TrendingUp size={16} color="#6b7280" />
                <Text style={styles.detailText}>Orçamento: {campaign.budget}</Text>
              </View>
            </View>
          </View>
        ))}

        {filteredCampaigns.length === 0 && (
          <View style={styles.emptyState}>
            <Target size={48} color="#d1d5db" />
            <Text style={styles.emptyStateTitle}>Nenhuma campanha encontrada</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery ? "Tente ajustar a sua pesquisa" : "Comece criando a sua primeira campanha"}
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Campanha</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Nome da Campanha *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Campanha Autárquicas 2025"
                value={newCampaign.name}
                onChangeText={(text) => setNewCampaign({ ...newCampaign, name: text })}
                placeholderTextColor="#9ca3af"
              />

              <Text style={styles.inputLabel}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descreva os objetivos e estratégias da campanha"
                value={newCampaign.description}
                onChangeText={(text) => setNewCampaign({ ...newCampaign, description: text })}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                placeholderTextColor="#9ca3af"
              />

              <Text style={styles.inputLabel}>Data de Início *</Text>
              <TextInput
                style={styles.input}
                placeholder="AAAA-MM-DD"
                value={newCampaign.startDate}
                onChangeText={(text) => setNewCampaign({ ...newCampaign, startDate: text })}
                placeholderTextColor="#9ca3af"
              />

              <Text style={styles.inputLabel}>Data de Fim *</Text>
              <TextInput
                style={styles.input}
                placeholder="AAAA-MM-DD"
                value={newCampaign.endDate}
                onChangeText={(text) => setNewCampaign({ ...newCampaign, endDate: text })}
                placeholderTextColor="#9ca3af"
              />

              <Text style={styles.inputLabel}>Orçamento</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 50.000€"
                value={newCampaign.budget}
                onChangeText={(text) => setNewCampaign({ ...newCampaign, budget: text })}
                placeholderTextColor="#9ca3af"
              />

              <Text style={styles.inputLabel}>Público-Alvo</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Residentes de Lisboa"
                value={newCampaign.targetAudience}
                onChangeText={(text) => setNewCampaign({ ...newCampaign, targetAudience: text })}
                placeholderTextColor="#9ca3af"
              />

              <Text style={styles.inputLabel}>Estado</Text>
              <View style={styles.statusButtons}>
                {[
                  { value: "planned" as const, label: "Planeada" },
                  { value: "active" as const, label: "Ativa" },
                  { value: "completed" as const, label: "Concluída" },
                ].map((status) => (
                  <TouchableOpacity
                    key={status.value}
                    style={[
                      styles.statusButton,
                      newCampaign.status === status.value && styles.statusButtonActive,
                    ]}
                    onPress={() => setNewCampaign({ ...newCampaign, status: status.value })}
                  >
                    <Text
                      style={[
                        styles.statusButtonText,
                        newCampaign.status === status.value && styles.statusButtonTextActive,
                      ]}
                    >
                      {status.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addCampaign}>
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
  header: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  campaignCard: {
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
  campaignHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  campaignHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  campaignTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
  },
  campaignName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#111827",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600" as const,
  },
  campaignDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
    lineHeight: 20,
  },
  campaignDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: "#6b7280",
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
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
    maxHeight: "90%",
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
    marginTop: 12,
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
  textArea: {
    minHeight: 80,
  },
  statusButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  statusButtonActive: {
    backgroundColor: "#eff6ff",
    borderColor: "#2563eb",
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#6b7280",
  },
  statusButtonTextActive: {
    color: "#2563eb",
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
