import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from "react-native";
import { Stack } from "expo-router";
import { Users, Search, Plus, Phone, Mail, MapPin, X } from "lucide-react-native";
import React, { useState } from "react";

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  level: "supporter" | "volunteer" | "donor" | "leader";
};

export default function ContactsScreen() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "João Silva",
      email: "joao.silva@email.com",
      phone: "+351 912 345 678",
      location: "Lisboa",
      level: "volunteer",
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria.santos@email.com",
      phone: "+351 913 456 789",
      location: "Porto",
      level: "donor",
    },
    {
      id: "3",
      name: "Pedro Costa",
      email: "pedro.costa@email.com",
      phone: "+351 914 567 890",
      location: "Coimbra",
      level: "leader",
    },
    {
      id: "4",
      name: "Ana Rodrigues",
      email: "ana.rodrigues@email.com",
      phone: "+351 915 678 901",
      location: "Braga",
      level: "supporter",
    },
  ]);

  const [newContact, setNewContact] = useState<{
    name: string;
    email: string;
    phone: string;
    location: string;
    level: "supporter" | "volunteer" | "donor" | "leader";
  }>({
    name: "",
    email: "",
    phone: "",
    location: "",
    level: "supporter",
  });

  const addContact = () => {
    if (!newContact.name || !newContact.email || !newContact.phone) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const contact: Contact = {
      id: Date.now().toString(),
      ...newContact,
    };

    setContacts([...contacts, contact]);
    setShowAddModal(false);
    setNewContact({
      name: "",
      email: "",
      phone: "",
      location: "",
      level: "supporter",
    });
    Alert.alert("Sucesso", "Contato adicionado com sucesso!");
  };


  const filters = [
    { id: "all", label: "Todos" },
    { id: "supporter", label: "Apoiadores" },
    { id: "volunteer", label: "Voluntários" },
    { id: "donor", label: "Doadores" },
    { id: "leader", label: "Líderes" },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "leader":
        return "#dc2626";
      case "donor":
        return "#8b5cf6";
      case "volunteer":
        return "#2563eb";
      case "supporter":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "leader":
        return "Líder";
      case "donor":
        return "Doador";
      case "volunteer":
        return "Voluntário";
      case "supporter":
        return "Apoiador";
      default:
        return "Outro";
    }
  };

  const filteredContacts = selectedFilter === "all" 
    ? contacts 
    : contacts.filter(c => c.level === selectedFilter);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Contatos" }} />
      
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Procurar contatos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>
        
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Plus size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              selectedFilter === filter.id && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === filter.id && styles.filterChipTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {filteredContacts.map((contact) => (
          <View key={contact.id} style={styles.contactCard}>
            <View style={[styles.contactAvatar, { backgroundColor: getLevelColor(contact.level) + "20" }]}>
              <Users size={24} color={getLevelColor(contact.level)} />
            </View>
            
            <View style={styles.contactContent}>
              <View style={styles.contactHeader}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <View style={[styles.levelBadge, { backgroundColor: getLevelColor(contact.level) + "20" }]}>
                  <Text style={[styles.levelText, { color: getLevelColor(contact.level) }]}>
                    {getLevelLabel(contact.level)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.contactDetails}>
                <View style={styles.contactDetailRow}>
                  <Mail size={14} color="#6b7280" />
                  <Text style={styles.contactDetailText}>{contact.email}</Text>
                </View>
                
                <View style={styles.contactDetailRow}>
                  <Phone size={14} color="#6b7280" />
                  <Text style={styles.contactDetailText}>{contact.phone}</Text>
                </View>
                
                <View style={styles.contactDetailRow}>
                  <MapPin size={14} color="#6b7280" />
                  <Text style={styles.contactDetailText}>{contact.location}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
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
              <Text style={styles.modalTitle}>Novo Contato</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Nome *</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                value={newContact.name}
                onChangeText={(text) => setNewContact({ ...newContact, name: text })}
                placeholderTextColor="#9ca3af"
              />

              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="email@exemplo.com"
                value={newContact.email}
                onChangeText={(text) => setNewContact({ ...newContact, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9ca3af"
              />

              <Text style={styles.inputLabel}>Telefone *</Text>
              <TextInput
                style={styles.input}
                placeholder="+351 912 345 678"
                value={newContact.phone}
                onChangeText={(text) => setNewContact({ ...newContact, phone: text })}
                keyboardType="phone-pad"
                placeholderTextColor="#9ca3af"
              />

              <Text style={styles.inputLabel}>Localização</Text>
              <TextInput
                style={styles.input}
                placeholder="Cidade"
                value={newContact.location}
                onChangeText={(text) => setNewContact({ ...newContact, location: text })}
                placeholderTextColor="#9ca3af"
              />

              <Text style={styles.inputLabel}>Nível</Text>
              <View style={styles.levelButtons}>
                {[
                  { value: "supporter" as const, label: "Apoiador" },
                  { value: "volunteer" as const, label: "Voluntário" },
                  { value: "donor" as const, label: "Doador" },
                  { value: "leader" as const, label: "Líder" },
                ].map((level) => (
                  <TouchableOpacity
                    key={level.value}
                    style={[
                      styles.levelButton,
                      newContact.level === level.value && styles.levelButtonActive,
                    ]}
                    onPress={() => setNewContact({ ...newContact, level: level.value })}
                  >
                    <Text
                      style={[
                        styles.levelButtonText,
                        newContact.level === level.value && styles.levelButtonTextActive,
                      ]}
                    >
                      {level.label}
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
              <TouchableOpacity style={styles.saveButton} onPress={addContact}>
                <Text style={styles.saveButtonText}>Adicionar</Text>
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
  filtersContainer: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  filtersContent: {
    padding: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: "#2563eb",
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#6b7280",
  },
  filterChipTextActive: {
    color: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  contactCard: {
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
  contactAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  contactName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#111827",
    flex: 1,
  },

  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  levelText: {
    fontSize: 11,
    fontWeight: "600" as const,
  },
  contactDetails: {
    gap: 6,
  },
  contactDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contactDetailText: {
    fontSize: 13,
    color: "#6b7280",
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
  levelButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  levelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  levelButtonActive: {
    backgroundColor: "#eff6ff",
    borderColor: "#2563eb",
  },
  levelButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#6b7280",
  },
  levelButtonTextActive: {
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
