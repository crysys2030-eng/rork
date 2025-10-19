import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Stack } from "expo-router";
import { Calendar, MapPin, Clock, Plus, Search } from "lucide-react-native";
import React, { useState } from "react";

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "rally" | "meeting" | "canvassing" | "other";
};

export default function AgendaScreen() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const events: Event[] = [
    {
      id: "1",
      title: "Comício Municipal",
      date: "2024-12-15",
      time: "18:00",
      location: "Praça Central",
      type: "rally",
    },
    {
      id: "2",
      title: "Reunião com Apoiadores",
      date: "2024-12-18",
      time: "16:00",
      location: "Sede Local",
      type: "meeting",
    },
    {
      id: "3",
      title: "Porta a Porta - Bairro Norte",
      date: "2024-12-20",
      time: "10:00",
      location: "Bairro Norte",
      type: "canvassing",
    },
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case "rally":
        return "#2563eb";
      case "meeting":
        return "#8b5cf6";
      case "canvassing":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "rally":
        return "Comício";
      case "meeting":
        return "Reunião";
      case "canvassing":
        return "Porta a Porta";
      default:
        return "Outro";
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Agenda" }} />
      
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Procurar eventos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>
        
        <TouchableOpacity style={styles.addButton}>
          <Plus size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {events.map((event) => (
          <TouchableOpacity key={event.id} style={styles.eventCard}>
            <View style={[styles.eventIndicator, { backgroundColor: getEventColor(event.type) }]} />
            
            <View style={styles.eventContent}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={[styles.eventTypeBadge, { backgroundColor: getEventColor(event.type) + "20" }]}>
                  <Text style={[styles.eventTypeText, { color: getEventColor(event.type) }]}>
                    {getEventTypeLabel(event.type)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.eventDetails}>
                <View style={styles.eventDetailRow}>
                  <Calendar size={16} color="#6b7280" />
                  <Text style={styles.eventDetailText}>
                    {new Date(event.date).toLocaleDateString("pt-PT", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                </View>
                
                <View style={styles.eventDetailRow}>
                  <Clock size={16} color="#6b7280" />
                  <Text style={styles.eventDetailText}>{event.time}</Text>
                </View>
                
                <View style={styles.eventDetailRow}>
                  <MapPin size={16} color="#6b7280" />
                  <Text style={styles.eventDetailText}>{event.location}</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  eventIndicator: {
    width: 4,
  },
  eventContent: {
    flex: 1,
    padding: 16,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#111827",
    flex: 1,
  },
  eventTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  eventTypeText: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
  eventDetails: {
    gap: 8,
  },
  eventDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  eventDetailText: {
    fontSize: 14,
    color: "#6b7280",
  },
});
