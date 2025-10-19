import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Stack } from "expo-router";
import { Users, Search, Plus, Phone, Mail, MapPin } from "lucide-react-native";
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

  const contacts: Contact[] = [
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
  ];

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
        
        <TouchableOpacity style={styles.addButton}>
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
          <TouchableOpacity key={contact.id} style={styles.contactCard}>
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
          </TouchableOpacity>
        ))}
      </ScrollView>
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
});
