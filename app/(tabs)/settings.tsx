import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert, Linking, TextInput, Modal } from "react-native";
import { Stack, useRouter } from "expo-router";
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
  Trash2,
  X,
  Save
} from "lucide-react-native";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const { user, logout } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<boolean>(true);
  const [emailAlerts, setEmailAlerts] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("pt");
  const [profileModalVisible, setProfileModalVisible] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>("");
  const [editEmail, setEditEmail] = useState<string>("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedNotifications = await AsyncStorage.getItem("settings_notifications");
      const savedEmailAlerts = await AsyncStorage.getItem("settings_email_alerts");
      const savedDarkMode = await AsyncStorage.getItem("settings_dark_mode");
      const savedLanguage = await AsyncStorage.getItem("settings_language");
      
      if (savedNotifications !== null) setNotifications(JSON.parse(savedNotifications));
      if (savedEmailAlerts !== null) setEmailAlerts(JSON.parse(savedEmailAlerts));
      if (savedDarkMode !== null) setDarkMode(JSON.parse(savedDarkMode));
      if (savedLanguage !== null) setLanguage(savedLanguage);
      
      console.log("Settings carregadas com sucesso");
    } catch (error) {
      console.error("Erro ao carregar settings:", error);
    }
  };

  const handleNotificationToggle = async (value: boolean) => {
    setNotifications(value);
    await AsyncStorage.setItem("settings_notifications", JSON.stringify(value));
    Alert.alert(
      "Sucesso",
      `Notificações Push ${value ? "ativadas" : "desativadas"} com sucesso!`
    );
    console.log("Notificações Push:", value ? "Ativadas" : "Desativadas");
  };

  const handleEmailAlertsToggle = async (value: boolean) => {
    setEmailAlerts(value);
    await AsyncStorage.setItem("settings_email_alerts", JSON.stringify(value));
    Alert.alert(
      "Sucesso",
      `Alertas por Email ${value ? "ativados" : "desativados"} com sucesso!`
    );
    console.log("Alertas por Email:", value ? "Ativados" : "Desativados");
  };

  const handleDarkModeToggle = async (value: boolean) => {
    setDarkMode(value);
    await AsyncStorage.setItem("settings_dark_mode", JSON.stringify(value));
    Alert.alert(
      "Modo Escuro",
      value 
        ? "Modo escuro ativado! Reinicie a app para ver as mudanças."
        : "Modo claro ativado! Reinicie a app para ver as mudanças."
    );
    console.log("Modo Escuro:", value ? "Ativado" : "Desativado");
  };

  const handleProfilePress = () => {
    setEditName(user?.name || "");
    setEditEmail(user?.email || "");
    setProfileModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    try {
      const updatedUser = {
        ...user,
        name: editName,
        email: editEmail,
      };
      await AsyncStorage.setItem("current_user", JSON.stringify(updatedUser));
      setProfileModalVisible(false);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      console.log("Perfil atualizado:", updatedUser);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      Alert.alert("Erro", "Não foi possível salvar o perfil");
    }
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
        { 
          text: "Português", 
          onPress: async () => {
            setLanguage("pt");
            await AsyncStorage.setItem("settings_language", "pt");
            Alert.alert("Sucesso", "Idioma alterado para Português");
            console.log("Português selecionado");
          }
        },
        { 
          text: "English", 
          onPress: async () => {
            setLanguage("en");
            await AsyncStorage.setItem("settings_language", "en");
            Alert.alert("Success", "Language changed to English");
            console.log("English selecionado");
          }
        }
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
          onPress: async () => {
            try {
              const keys = await AsyncStorage.getAllKeys();
              const cacheKeys = keys.filter(key => 
                key.startsWith("cache_") || 
                key.startsWith("temp_")
              );
              
              if (cacheKeys.length > 0) {
                await AsyncStorage.multiRemove(cacheKeys);
                console.log(`${cacheKeys.length} itens de cache removidos`);
              }
              
              Alert.alert("Sucesso", "Cache limpo com sucesso!");
            } catch (error) {
              console.error("Erro ao limpar cache:", error);
              Alert.alert("Erro", "Não foi possível limpar o cache");
            }
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
          onPress: async () => {
            await logout();
            router.replace('/login');
          }
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
      
      <Modal
        visible={profileModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome</Text>
                <TextInput
                  style={styles.input}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Digite seu nome"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="Digite seu email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Save size={20} color="#ffffff" />
                <Text style={styles.saveButtonText}>Guardar Alterações</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.profileAvatar}>
              <User size={32} color="#2563eb" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || "Campanha 2024"}</Text>
              <Text style={styles.profileEmail}>{user?.email || "campanha@exemplo.com"}</Text>
              <View style={styles.badgeContainer}>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>
                    {user?.role === 'admin' ? 'Administrador' : user?.role === 'user' ? 'Utilizador' : 'Convidado'}
                  </Text>
                </View>
                <View style={styles.languageBadge}>
                  <Globe size={12} color="#059669" />
                  <Text style={styles.languageText}>{language.toUpperCase()}</Text>
                </View>
              </View>
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
                    onPress={"type" in item && item.type === "switch" ? undefined : ("onPress" in item ? item.onPress : undefined)}
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
  roleBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#2563eb",
  },
  badgeContainer: {
    marginTop: 8,
    flexDirection: "row",
    gap: 8,
  },
  languageBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d1fae5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  languageText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: "#059669",
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
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#111827",
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#111827",
  },
  saveButton: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600" as const,
  },
});
