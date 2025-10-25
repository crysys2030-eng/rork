import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch } from "react-native";
import { Stack } from "expo-router";
import { 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  Info,
  ChevronRight,
  Mail,
  LucideIcon
} from "lucide-react-native";
import React, { useState } from "react";

type SettingItemButton = {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
};

type SettingItemSwitch = {
  icon: LucideIcon;
  label: string;
  type: "switch";
  value: boolean;
  onValueChange: (value: boolean) => void;
};

type SettingItem = SettingItemButton | SettingItemSwitch;

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState<boolean>(true);
  const [emailAlerts, setEmailAlerts] = useState<boolean>(false);

  const settingsSections: { title: string; items: SettingItem[] }[] = [
    {
      title: "Conta",
      items: [
        {
          icon: User,
          label: "Perfil",
          onPress: () => console.log("Profile pressed"),
        },
        {
          icon: Mail,
          label: "Email e Notificações",
          onPress: () => console.log("Email pressed"),
        },
      ],
    },
    {
      title: "Preferências",
      items: [
        {
          icon: Bell,
          label: "Notificações Push",
          type: "switch" as const,
          value: notifications,
          onValueChange: setNotifications,
        },
        {
          icon: Mail,
          label: "Alertas por Email",
          type: "switch" as const,
          value: emailAlerts,
          onValueChange: setEmailAlerts,
        },
      ],
    },
    {
      title: "Suporte",
      items: [
        {
          icon: HelpCircle,
          label: "Ajuda e FAQ",
          onPress: () => console.log("Help pressed"),
        },
        {
          icon: Shield,
          label: "Privacidade e Segurança",
          onPress: () => console.log("Privacy pressed"),
        },
        {
          icon: Info,
          label: "Sobre",
          onPress: () => console.log("About pressed"),
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Definições" }} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.profileAvatar}>
              <User size={32} color="#2563eb" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Campanha 2024</Text>
              <Text style={styles.profileEmail}>campanha@exemplo.com</Text>
            </View>
          </View>
        </View>

        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <TouchableOpacity
                    key={itemIndex}
                    style={[
                      styles.settingItem,
                      itemIndex === section.items.length - 1 && styles.settingItemLast,
                    ]}
                    onPress={"type" in item && item.type === "switch" ? undefined : "onPress" in item ? item.onPress : undefined}
                    disabled={"type" in item && item.type === "switch"}
                  >
                    <View style={styles.settingItemLeft}>
                      <View style={styles.settingIconContainer}>
                        <Icon size={20} color="#2563eb" />
                      </View>
                      <Text style={styles.settingItemLabel}>{item.label}</Text>
                    </View>
                    
                    {"type" in item && item.type === "switch" ? (
                      <Switch
                        value={item.value}
                        onValueChange={item.onValueChange}
                        trackColor={{ false: "#d1d5db", true: "#93c5fd" }}
                        thumbColor={item.value ? "#2563eb" : "#f3f4f6"}
                      />
                    ) : (
                      <ChevronRight size={20} color="#9ca3af" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.version}>Versão 1.0.0</Text>
          <Text style={styles.copyright}>{"\u00A9"} 2024 Gestão de Campanha. Todos os direitos reservados.</Text>
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
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#111827",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#6b7280",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#6b7280",
    textTransform: "uppercase",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingItemLabel: {
    fontSize: 16,
    color: "#111827",
    flex: 1,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  version: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 4,
  },
  copyright: {
    fontSize: 11,
    color: "#9ca3af",
    textAlign: "center",
  },
});
