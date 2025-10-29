import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert, Linking } from "react-native";
import { Stack } from "expo-router";
import { 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  Info,
  ChevronRight,
  Mail,
  LucideIcon,
  Palette,
  Globe,
  LogOut,
  Trash2
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
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const handleNotificationToggle = (value: boolean) => {
    setNotifications(value);
    console.log("Notificações Push:", value ? "Ativadas" : "Desativadas");
  };

  const handleEmailAlertsToggle = (value: boolean) => {
    setEmailAlerts(value);
    console.log("Alertas por Email:", value ? "Ativados" : "Desativados");
  };

  const handleDarkModeToggle = (value: boolean) => {
    setDarkMode(value);
    console.log("Modo Escuro:", value ? "Ativado" : "Desativado");
  };

  const handleProfilePress = () => {
    Alert.alert(
      "Perfil",
      "Visualizar e editar informações do perfil",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Ver Perfil", onPress: () => console.log("Abrindo perfil...") }
      ]
    );
  };

  const handleEmailPress = () => {
    Alert.alert(
      "Email e Notificações",
      "Configurar preferências de email e notificações",
      [
        { text: "OK" }
      ]
    );
  };

  const handleHelpPress = () => {
    Alert.alert(
      "Ajuda e FAQ",
      "Precisa de ajuda? Visite nossa central de suporte.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Visitar Suporte", 
          onPress: () => {
            Linking.openURL("https://support.exemplo.com").catch(() => {
              Alert.alert("Erro", "Não foi possível abrir o link");
            });
          }
        }
      ]
    );
  };

  const handlePrivacyPress = () => {
    Alert.alert(
      "Privacidade e Segurança",
      "Gerencie suas configurações de privacidade e segurança",
      [
        { text: "OK" }
      ]
    );
  };

  const handleAboutPress = () => {
    Alert.alert(
      "Sobre",
      "Gestão de Campanha\nVersão 1.0.0\n\nDesenvolvido para otimizar suas campanhas políticas.",
      [
        { text: "OK" }
      ]
    );
  };

  const handleLanguagePress = () => {
    Alert.alert(
      "Idioma",
      "Escolha o idioma da aplicação",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Português", onPress: () => console.log("Português selecionado") },
        { text: "English", onPress: () => console.log("English selecionado") }
      ]
    );
  };

  const handleClearCachePress = () => {
    Alert.alert(
      "Limpar Cache",
      "Tem certeza que deseja limpar o cache da aplicação? Isso pode melhorar o desempenho.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Limpar", 
          style: "destructive",
          onPress: () => {
            console.log("Cache limpo com sucesso");
            Alert.alert("Sucesso", "Cache limpo com sucesso!");
          }
        }
      ]
    );
  };

  const handleLogoutPress = () => {
    Alert.alert(
      "Terminar Sessão",
      "Tem certeza que deseja sair da aplicação?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive",
          onPress: () => console.log("Utilizador desconectado")
        }
      ]
    );
  };

  const settingsSections: { title: string; items: SettingItem[] }[] = [
    {
      title: "Conta",
      items: [
        {
          icon: User,
          label: "Perfil",
          onPress: handleProfilePress,
        },
        {
          icon: Mail,
          label: "Email e Notificações",
          onPress: handleEmailPress,
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
          onValueChange: handleNotificationToggle,
        },
        {
          icon: Mail,
          label: "Alertas por Email",
          type: "switch" as const,
          value: emailAlerts,
          onValueChange: handleEmailAlertsToggle,
        },
        {
          icon: Palette,
          label: "Modo Escuro",
          type: "switch" as const,
          value: darkMode,
          onValueChange: handleDarkModeToggle,
        },
        {
          icon: Globe,
          label: "Idioma",
          onPress: handleLanguagePress,
        },
      ],
    },
    {
      title: "Suporte",
      items: [
        {
          icon: HelpCircle,
          label: "Ajuda e FAQ",
          onPress: handleHelpPress,
        },
        {
          icon: Shield,
          label: "Privacidade e Segurança",
          onPress: handlePrivacyPress,
        },
        {
          icon: Info,
          label: "Sobre",
          onPress: handleAboutPress,
        },
      ],
    },
    {
      title: "Avançado",
      items: [
        {
          icon: Trash2,
          label: "Limpar Cache",
          onPress: handleClearCachePress,
        },
        {
          icon: LogOut,
          label: "Terminar Sessão",
          onPress: handleLogoutPress,
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
          <Text style={styles.copyright}>© 2024 Gestão de Campanha</Text>
          <Text style={styles.copyright}>Todos os direitos reservados</Text>
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
