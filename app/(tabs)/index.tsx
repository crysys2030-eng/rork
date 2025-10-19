import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import { TrendingUp, Users, Calendar, Target } from "lucide-react-native";
import React from "react";

export default function DashboardScreen() {
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
            <TouchableOpacity style={styles.actionButton}>
              <Users size={20} color="#2563eb" />
              <Text style={styles.actionButtonText}>Novo Contato</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Calendar size={20} color="#2563eb" />
              <Text style={styles.actionButtonText}>Criar Evento</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Target size={20} color="#2563eb" />
              <Text style={styles.actionButtonText}>Nova Campanha</Text>
            </TouchableOpacity>
          </View>
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
});
